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

interface UseSpeechRecognitionOptions {
  lang?: string;
  onFinal?: (text: string) => void;
  onError?: (message: string) => void;
}

export function useSpeechRecognition({
  lang = 'fa-IR',
  onFinal,
  onError,
}: UseSpeechRecognitionOptions = {}) {
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const keepListeningRef = useRef(false);
  const onFinalRef = useRef(onFinal);
  const onErrorRef = useRef(onError);

  onFinalRef.current = onFinal;
  onErrorRef.current = onError;

  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [sessionTranscript, setSessionTranscript] = useState('');

  const supported = isSpeechRecognitionSupported();

  const setupRecognition = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return null;

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalChunk = '';
      let interimChunk = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? '';
        if (result.isFinal) finalChunk += transcript;
        else interimChunk += transcript;
      }

      if (finalChunk.trim()) {
        const trimmed = finalChunk.trim();
        setSessionTranscript((prev) => (prev ? `${prev} ${trimmed}` : trimmed));
        onFinalRef.current?.(trimmed);
      }
      setInterimText(interimChunk.trim());
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const message =
        event.error === 'not-allowed'
          ? 'دسترسی به میکروفون رد شد — در تنظیمات مرورگر اجازه دهید.'
          : event.error === 'network'
            ? 'خطای شبکه — اتصال اینترنت را بررسی کنید.'
            : `خطا در تشخیص گفتار: ${event.error}`;

      onErrorRef.current?.(message);
      keepListeningRef.current = false;
      setIsListening(false);
      setInterimText('');
    };

    recognition.onend = () => {
      if (keepListeningRef.current) {
        try {
          recognition.start();
        } catch {
          keepListeningRef.current = false;
          setIsListening(false);
          setInterimText('');
        }
        return;
      }
      setIsListening(false);
      setInterimText('');
    };

    return recognition;
  }, [lang]);

  useEffect(() => {
    recognitionRef.current = setupRecognition();
    return () => {
      keepListeningRef.current = false;
      try {
        recognitionRef.current?.stop();
      } catch {
        /* already stopped */
      }
    };
  }, [setupRecognition]);

  const start = useCallback(() => {
    if (!supported) {
      onErrorRef.current?.('تشخیص گفتار در این مرورگر پشتیبانی نمی‌شود. از Chrome یا Edge استفاده کنید.');
      return;
    }

    const recognition = recognitionRef.current ?? setupRecognition();
    if (!recognition) return;
    recognitionRef.current = recognition;
    recognition.lang = lang;

    keepListeningRef.current = true;
    setInterimText('');

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      onErrorRef.current?.('ضبط از قبل فعال است یا مرورگر اجازه نداد.');
    }
  }, [lang, setupRecognition, supported]);

  const stop = useCallback(() => {
    keepListeningRef.current = false;
    setInterimText('');
    try {
      recognitionRef.current?.stop();
    } catch {
      /* already stopped */
    }
    setIsListening(false);
  }, []);

  const clearSessionTranscript = useCallback(() => {
    setSessionTranscript('');
    setInterimText('');
  }, []);

  const resetSession = useCallback(() => {
    keepListeningRef.current = false;
    setInterimText('');
    try {
      recognitionRef.current?.stop();
    } catch {
      /* already stopped */
    }
    setIsListening(false);
    setSessionTranscript('');
  }, []);

  return {
    supported,
    isListening,
    interimText,
    sessionTranscript,
    start,
    stop,
    clearSessionTranscript,
    resetSession,
  };
}
