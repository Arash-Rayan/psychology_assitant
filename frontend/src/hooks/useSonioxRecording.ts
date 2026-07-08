'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { transcribeAudioWithSoniox } from '@/lib/sonioxStt';

export function isMediaRecorderSupported(): boolean {
  return typeof window !== 'undefined'
    && typeof navigator !== 'undefined'
    && !!navigator.mediaDevices?.getUserMedia
    && typeof MediaRecorder !== 'undefined';
}

export function isMediaRecorderPauseSupported(): boolean {
  return (
    typeof MediaRecorder !== 'undefined'
    && typeof MediaRecorder.prototype.pause === 'function'
    && typeof MediaRecorder.prototype.resume === 'function'
  );
}

function pickRecorderMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) {
    return undefined;
  }

  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ];

  return candidates.find((type) => MediaRecorder.isTypeSupported(type));
}

function extensionForMime(mimeType: string): string {
  if (mimeType.includes('mp4')) return 'm4a';
  if (mimeType.includes('ogg')) return 'ogg';
  return 'webm';
}

interface UseSonioxRecordingOptions {
  language?: string;
  /** Called when Soniox returns text — parent shows confirm UI before applying. */
  onTranscriptReady?: (text: string) => void;
  onError?: (message: string) => void;
}

export function useSonioxRecording({
  language = 'fa',
  onTranscriptReady,
  onError,
}: UseSonioxRecordingOptions) {
  const onTranscriptReadyRef = useRef(onTranscriptReady);
  const onErrorRef = useRef(onError);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeTypeRef = useRef('audio/webm');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRecordingRef = useRef(false);
  const isTranscribingRef = useRef(false);
  /** Skip upload when recorder is torn down by React strict-mode cleanup. */
  const shouldUploadOnStopRef = useRef(false);

  onTranscriptReadyRef.current = onTranscriptReady;
  onErrorRef.current = onError;

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [lastTranscript, setLastTranscript] = useState('');
  const [supported, setSupported] = useState(false);
  const [pauseSupported, setPauseSupported] = useState(false);
  const [recorderChecked, setRecorderChecked] = useState(false);

  useEffect(() => {
    setSupported(isMediaRecorderSupported());
    setPauseSupported(isMediaRecorderPauseSupported());
    setRecorderChecked(true);
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  }, [clearTimer]);

  const stopMediaTracks = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  }, []);

  const teardownRecorder = useCallback((upload: boolean) => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    shouldUploadOnStopRef.current = upload;

    if (recorder.state === 'inactive') {
      mediaRecorderRef.current = null;
      if (!upload) chunksRef.current = [];
      return;
    }

    try {
      if (recorder.state === 'recording' || recorder.state === 'paused') {
        recorder.requestData();
      }
      recorder.stop();
    } catch {
      mediaRecorderRef.current = null;
      isRecordingRef.current = false;
      setIsRecording(false);
      setIsPaused(false);
      clearTimer();
      stopMediaTracks();
      chunksRef.current = [];
    }
  }, [clearTimer, stopMediaTracks]);

  const uploadRecording = useCallback(async (blob: Blob, filename: string) => {
    isTranscribingRef.current = true;
    setIsTranscribing(true);
    try {
      const result = await transcribeAudioWithSoniox(blob, { language, filename });
      const text = (result.text || '').trim();
      setLastTranscript(text);
      if (text) {
        onTranscriptReadyRef.current?.(text);
      } else {
        onErrorRef.current?.('متنی از ضبط استخراج نشد. دوباره تلاش کنید.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'خطا در تبدیل گفتار به متن';
      onErrorRef.current?.(message);
    } finally {
      isTranscribingRef.current = false;
      setIsTranscribing(false);
    }
  }, [language]);

  const start = useCallback(async () => {
    if (isRecordingRef.current || isTranscribingRef.current) return;
    if (!isMediaRecorderSupported()) {
      onErrorRef.current?.('ضبط صدا در این مرورگر پشتیبانی نمی‌شود.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      chunksRef.current = [];

      const mimeType = pickRecorderMimeType();
      mimeTypeRef.current = mimeType ?? 'audio/webm';

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      shouldUploadOnStopRef.current = false;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        clearTimer();
        isRecordingRef.current = false;
        setIsRecording(false);
        setIsPaused(false);
        stopMediaTracks();
        mediaRecorderRef.current = null;

        const upload = shouldUploadOnStopRef.current;
        shouldUploadOnStopRef.current = false;

        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || mimeTypeRef.current,
        });
        chunksRef.current = [];

        if (!upload) return;

        if (blob.size === 0) {
          onErrorRef.current?.('فایل صوتی خالی است. کمی بیشتر صحبت کنید و دوباره توقف بزنید.');
          return;
        }

        const ext = extensionForMime(blob.type || mimeTypeRef.current);
        void uploadRecording(blob, `recording.${ext}`);
      };

      // No timeslice — one reliable blob on stop (avoids empty file if user stops < 1s)
      recorder.start();
      isRecordingRef.current = true;
      setIsRecording(true);
      setIsPaused(false);
      setRecordingSeconds(0);
      startTimer();
    } catch (error) {
      teardownRecorder(false);
      stopMediaTracks();
      const message = error instanceof Error ? error.message : 'دسترسی به میکروفون ممکن نیست';
      onErrorRef.current?.(message);
    }
  }, [clearTimer, startTimer, stopMediaTracks, teardownRecorder, uploadRecording]);

  const pause = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== 'recording') return;
    if (!isMediaRecorderPauseSupported()) {
      onErrorRef.current?.('مکث ضبط در این مرورگر پشتیبانی نمی‌شود.');
      return;
    }
    recorder.pause();
    setIsPaused(true);
    clearTimer();
  }, [clearTimer]);

  const resume = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== 'paused') return;
    recorder.resume();
    setIsPaused(false);
    startTimer();
  }, [startTimer]);

  const stop = useCallback(() => {
    if (!isRecordingRef.current) return;
    teardownRecorder(true);
  }, [teardownRecorder]);

  const cancel = useCallback(() => {
    if (isRecordingRef.current) {
      teardownRecorder(false);
    }
    isRecordingRef.current = false;
    setIsRecording(false);
    setIsPaused(false);
    clearTimer();
    setRecordingSeconds(0);
    chunksRef.current = [];
    stopMediaTracks();
  }, [clearTimer, stopMediaTracks, teardownRecorder]);

  const resetSession = useCallback(() => {
    setLastTranscript('');
    setRecordingSeconds(0);
    setIsPaused(false);
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
      if (isRecordingRef.current) {
        teardownRecorder(false);
      }
      stopMediaTracks();
    };
  }, [clearTimer, stopMediaTracks, teardownRecorder]);

  return {
    isRecording,
    isPaused,
    isTranscribing,
    recordingSeconds,
    lastTranscript,
    start,
    pause,
    resume,
    stop,
    cancel,
    resetSession,
    supported,
    pauseSupported,
    recorderChecked,
  };
}
