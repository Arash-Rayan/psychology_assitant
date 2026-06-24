'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: { transcript: string };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

export interface SpeechDebugEvent {
  at: number;
  type: 'start' | 'end' | 'restart' | 'result' | 'error' | 'commit' | 'flush';
  detail: string;
}

/** Chrome cuts each segment around 10–15s; a short delay before restart helps */
const RESTART_DELAY_MS = 150;

const BENIGN_ERRORS = new Set(['no-speech', 'aborted']);
const FATAL_ERRORS = new Set(['not-allowed', 'service-not-allowed', 'audio-capture']);

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognitionCtor() !== null;
}

function isDebugEnabled(explicit?: boolean): boolean {
  if (explicit) return true;
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem('stt-debug') === '1';
  } catch {
    return false;
  }
}

/** Prefer the longer text when Chrome's final is a shorter "correction" of interim. */
function pickCommitText(bestSeen: string, latest: string): string {
  const best = bestSeen.trim();
  const latestTrimmed = latest.trim();
  if (!latestTrimmed) return best;
  if (!best) return latestTrimmed;
  if (latestTrimmed.length >= best.length) return latestTrimmed;
  if (best.startsWith(latestTrimmed)) return best;
  return latestTrimmed;
}

interface UseSpeechRecognitionOptions {
  lang?: string;
  onFinal?: (text: string) => void;
  onError?: (message: string) => void;
  /** Log STT lifecycle to console; also enabled via localStorage stt-debug=1 */
  debug?: boolean;
}

export function useSpeechRecognition({
  lang = 'fa-IR',
  onFinal,
  onError,
  debug = false,
}: UseSpeechRecognitionOptions = {}) {
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const keepListeningRef = useRef(false);
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const langRef = useRef(lang);
  const onFinalRef = useRef(onFinal);
  const onErrorRef = useRef(onError);
  const debugRef = useRef(debug);

  const committedResultIndexRef = useRef(0);
  const finalizedPhrasesRef = useRef<string[]>([]);
  const interimRef = useRef('');
  const perResultBestRef = useRef<Map<number, string>>(new Map());
  const segmentCountRef = useRef(0);
  const debugEventsRef = useRef<SpeechDebugEvent[]>([]);

  langRef.current = lang;
  onFinalRef.current = onFinal;
  onErrorRef.current = onError;
  debugRef.current = debug;

  const [isListening, setIsListening] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [sessionTranscript, setSessionTranscript] = useState('');
  const [segmentCount, setSegmentCount] = useState(0);

  const supported = isSpeechRecognitionSupported();

  const logDebug = useCallback((type: SpeechDebugEvent['type'], detail: string) => {
    if (!isDebugEnabled(debugRef.current)) return;

    const event: SpeechDebugEvent = { at: Date.now(), type, detail };
    debugEventsRef.current = [...debugEventsRef.current.slice(-49), event];
    console.info(`[STT ${type}]`, detail, event);
  }, []);

  const clearRestartTimeout = useCallback(() => {
    if (restartTimeoutRef.current !== null) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
  }, []);

  const syncSessionTranscript = useCallback(() => {
    setSessionTranscript(finalizedPhrasesRef.current.join(' '));
  }, []);

  /**
   * Merge extensions instead of duplicating when Chrome finalizes a prefix
   * then flush sends the longer interim on segment end.
   */
  const commitPhrase = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const last = finalizedPhrasesRef.current.at(-1) ?? '';

    if (last === trimmed) return;

    if (last && trimmed.startsWith(last)) {
      finalizedPhrasesRef.current[finalizedPhrasesRef.current.length - 1] = trimmed;
      const delta = trimmed.slice(last.length).trim();
      if (delta) {
        logDebug('commit', `extend: "${last}" → "${trimmed}" (+ "${delta}")`);
        onFinalRef.current?.(delta);
      } else {
        logDebug('commit', `extend (no delta): "${trimmed}"`);
      }
      syncSessionTranscript();
      return;
    }

    if (last && last.startsWith(trimmed)) {
      logDebug('commit', `skip shorter revision: "${trimmed}" (kept "${last}")`);
      return;
    }

    finalizedPhrasesRef.current.push(trimmed);
    logDebug('commit', `new phrase: "${trimmed}"`);
    onFinalRef.current?.(trimmed);
    syncSessionTranscript();
  }, [logDebug, syncSessionTranscript]);

  const flushInterimAsFinal = useCallback(() => {
    const pending = interimRef.current.trim();
    if (!pending) return;

    const lastCommitted = finalizedPhrasesRef.current.at(-1) ?? '';
    if (lastCommitted === pending) {
      interimRef.current = '';
      setInterimText('');
      return;
    }

    interimRef.current = '';
    setInterimText('');
    logDebug('flush', `interim on end: "${pending}"`);
    commitPhrase(pending);
  }, [commitPhrase, logDebug]);

  const scheduleRestartRef = useRef<() => void>(() => {});

  const scheduleRestart = useCallback(() => {
    if (!keepListeningRef.current) return;

    clearRestartTimeout();
    setIsReconnecting(true);
    logDebug('restart', `segment #${segmentCountRef.current} ended — restarting in ${RESTART_DELAY_MS}ms`);

    restartTimeoutRef.current = setTimeout(() => {
      restartTimeoutRef.current = null;
      if (!keepListeningRef.current) {
        setIsReconnecting(false);
        return;
      }

      const recognition = recognitionRef.current;
      if (!recognition) {
        setIsReconnecting(false);
        return;
      }

      committedResultIndexRef.current = 0;
      perResultBestRef.current.clear();

      try {
        recognition.start();
      } catch {
        const Ctor = getSpeechRecognitionCtor();
        if (!Ctor || !keepListeningRef.current) {
          keepListeningRef.current = false;
          setIsListening(false);
          setIsReconnecting(false);
          return;
        }

        const fresh = new Ctor();
        fresh.lang = langRef.current;
        fresh.continuous = true;
        fresh.interimResults = true;
        attachHandlers(fresh);
        recognitionRef.current = fresh;

        try {
          fresh.start();
        } catch {
          keepListeningRef.current = false;
          setIsListening(false);
          setIsReconnecting(false);
          onErrorRef.current?.('ضبط متوقف شد — دوباره دکمه ضبط را بزنید.');
        }
      }
    }, RESTART_DELAY_MS);
  }, [clearRestartTimeout, logDebug]);

  scheduleRestartRef.current = scheduleRestart;

  const attachHandlers = useCallback((recognition: SpeechRecognitionInstance) => {
    recognition.onstart = () => {
      segmentCountRef.current += 1;
      setSegmentCount(segmentCountRef.current);
      committedResultIndexRef.current = 0;
      perResultBestRef.current.clear();
      setIsListening(true);
      setIsReconnecting(false);
      logDebug('start', `segment #${segmentCountRef.current} started`);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimChunk = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = (result[0]?.transcript ?? '').trim();
        if (!transcript) continue;

        const prevBest = perResultBestRef.current.get(i) ?? '';
        const best = pickCommitText(prevBest, transcript);
        perResultBestRef.current.set(i, best);

        if (result.isFinal) {
          if (i >= committedResultIndexRef.current) {
            const toCommit = pickCommitText(best, transcript);
            logDebug(
              'result',
              `final[${i}]: latest="${transcript}" best="${best}" → commit="${toCommit}"`,
            );
            commitPhrase(toCommit);
            committedResultIndexRef.current = i + 1;
            perResultBestRef.current.delete(i);
          }
        } else {
          interimChunk += (interimChunk ? ' ' : '') + best;
        }
      }

      interimRef.current = interimChunk.trim();
      setInterimText(interimRef.current);
      if (interimRef.current) {
        logDebug('result', `interim: "${interimRef.current}"`);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const { error } = event;
      logDebug('error', error);

      if (BENIGN_ERRORS.has(error)) {
        if (error === 'no-speech') {
          logDebug('error', 'silence detected — Chrome will end segment and auto-restart');
        }
        return;
      }

      if (error === 'network') {
        onErrorRef.current?.('اتصال اینترنت ضعیف است — ضبط ادامه می‌یابد.');
        return;
      }

      if (FATAL_ERRORS.has(error)) {
        const message =
          error === 'not-allowed'
            ? 'دسترسی به میکروفون رد شد — در تنظیمات مرورگر اجازه دهید.'
            : error === 'audio-capture'
              ? 'میکروفون در دسترس نیست — دستگاه صوتی را بررسی کنید.'
              : `خطا در تشخیص گفتار: ${error}`;

        onErrorRef.current?.(message);
        keepListeningRef.current = false;
        clearRestartTimeout();
        setIsListening(false);
        setIsReconnecting(false);
        interimRef.current = '';
        setInterimText('');
      }
    };

    recognition.onend = () => {
      logDebug('end', keepListeningRef.current ? 'segment ended (will restart)' : 'stopped by user');

      if (!keepListeningRef.current) {
        flushInterimAsFinal();
        setIsListening(false);
        setIsReconnecting(false);
        interimRef.current = '';
        setInterimText('');
        return;
      }

      flushInterimAsFinal();
      scheduleRestartRef.current();
    };
  }, [clearRestartTimeout, commitPhrase, flushInterimAsFinal, logDebug]);

  const ensureRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = langRef.current;
      return recognitionRef.current;
    }

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return null;

    const recognition = new Ctor();
    recognition.lang = langRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    attachHandlers(recognition);
    recognitionRef.current = recognition;
    return recognition;
  }, [attachHandlers]);

  useEffect(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return undefined;

    const recognition = new Ctor();
    recognition.lang = langRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    attachHandlers(recognition);
    recognitionRef.current = recognition;

    return () => {
      keepListeningRef.current = false;
      clearRestartTimeout();
      try {
        recognition.stop();
      } catch {
        /* already stopped */
      }
      recognitionRef.current = null;
    };
    // Mount once — handlers read latest values via refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = useCallback(() => {
    if (!supported) {
      onErrorRef.current?.('تشخیص گفتار در این مرورگر پشتیبانی نمی‌شود. از Chrome یا Edge استفاده کنید.');
      return;
    }

    clearRestartTimeout();
    debugEventsRef.current = [];
    segmentCountRef.current = 0;
    setSegmentCount(0);

    const recognition = ensureRecognition();
    if (!recognition) return;

    keepListeningRef.current = true;
    committedResultIndexRef.current = 0;
    perResultBestRef.current.clear();
    interimRef.current = '';
    setInterimText('');
    setIsReconnecting(false);
    syncSessionTranscript();

    logDebug('start', 'user pressed record');

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      onErrorRef.current?.('ضبط از قبل فعال است یا مرورگر اجازه نداد.');
    }
  }, [clearRestartTimeout, ensureRecognition, logDebug, supported, syncSessionTranscript]);

  const stop = useCallback(() => {
    keepListeningRef.current = false;
    clearRestartTimeout();
    setIsReconnecting(false);
    try {
      recognitionRef.current?.stop();
    } catch {
      /* already stopped */
    }
    setIsListening(false);
  }, [clearRestartTimeout]);

  const clearSessionTranscript = useCallback(() => {
    finalizedPhrasesRef.current = [];
    interimRef.current = '';
    setInterimText('');
    setSessionTranscript('');
  }, []);

  const resetSession = useCallback(() => {
    keepListeningRef.current = false;
    clearRestartTimeout();
    setIsReconnecting(false);
    try {
      recognitionRef.current?.stop();
    } catch {
      /* already stopped */
    }
    finalizedPhrasesRef.current = [];
    committedResultIndexRef.current = 0;
    perResultBestRef.current.clear();
    interimRef.current = '';
    setInterimText('');
    setSessionTranscript('');
    setIsListening(false);
    segmentCountRef.current = 0;
    setSegmentCount(0);
    debugEventsRef.current = [];
  }, [clearRestartTimeout]);

  return {
    supported,
    isListening,
    isReconnecting,
    segmentCount,
    interimText,
    sessionTranscript,
    start,
    stop,
    clearSessionTranscript,
    resetSession,
    getDebugEvents: () => debugEventsRef.current,
  };
}
