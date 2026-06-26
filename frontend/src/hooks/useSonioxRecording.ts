'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { transcribeAudioWithSoniox } from '@/lib/sonioxStt';

export function isMediaRecorderSupported(): boolean {
  return typeof window !== 'undefined'
    && typeof navigator !== 'undefined'
    && !!navigator.mediaDevices?.getUserMedia
    && typeof MediaRecorder !== 'undefined';
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
  onTranscript: (text: string) => void;
  onError?: (message: string) => void;
}

export function useSonioxRecording({
  language = 'fa',
  onTranscript,
  onError,
}: UseSonioxRecordingOptions) {
  const onTranscriptRef = useRef(onTranscript);
  const onErrorRef = useRef(onError);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeTypeRef = useRef('audio/webm');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  onTranscriptRef.current = onTranscript;
  onErrorRef.current = onError;

  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [lastTranscript, setLastTranscript] = useState('');

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopMediaTracks = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  }, []);

  const uploadRecording = useCallback(async (blob: Blob, filename: string) => {
    setIsTranscribing(true);
    try {
      const result = await transcribeAudioWithSoniox(blob, { language, filename });
      const text = (result.text || '').trim();
      setLastTranscript(text);
      if (text) {
        onTranscriptRef.current(text);
      } else {
        onErrorRef.current?.('متنی از ضبط استخراج نشد. دوباره تلاش کنید.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'خطا در تبدیل گفتار به متن';
      onErrorRef.current?.(message);
    } finally {
      setIsTranscribing(false);
    }
  }, [language]);

  const start = useCallback(async () => {
    if (isRecording || isTranscribing) return;
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

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        clearTimer();
        setRecordingSeconds(0);
        setIsRecording(false);
        stopMediaTracks();

        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || mimeTypeRef.current,
        });
        chunksRef.current = [];

        if (blob.size === 0) {
          onErrorRef.current?.('فایل صوتی خالی است.');
          return;
        }

        const ext = extensionForMime(blob.type || mimeTypeRef.current);
        void uploadRecording(blob, `recording.${ext}`);
      };

      recorder.start(1000);
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      stopMediaTracks();
      const message = error instanceof Error ? error.message : 'دسترسی به میکروفون ممکن نیست';
      onErrorRef.current?.(message);
    }
  }, [clearTimer, isRecording, isTranscribing, stopMediaTracks, uploadRecording]);

  const stop = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') return;
    recorder.stop();
    mediaRecorderRef.current = null;
  }, []);

  const resetSession = useCallback(() => {
    setLastTranscript('');
    setRecordingSeconds(0);
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      stopMediaTracks();
    };
  }, [clearTimer, stopMediaTracks]);

  return {
    isRecording,
    isTranscribing,
    recordingSeconds,
    lastTranscript,
    start,
    stop,
    resetSession,
    supported: isMediaRecorderSupported(),
  };
}
