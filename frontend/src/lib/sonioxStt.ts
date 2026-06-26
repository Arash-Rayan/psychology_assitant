export function getApiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000').replace(/\/$/, '');
}

export interface SonioxTranscribeResult {
  text: string;
  language: string;
  model: string;
  token_count: number;
}

export async function transcribeAudioWithSoniox(
  blob: Blob,
  options: { language?: string; filename?: string } = {},
): Promise<SonioxTranscribeResult> {
  const formData = new FormData();
  const filename = options.filename ?? 'recording.webm';
  formData.append('audio', blob, filename);
  if (options.language) {
    formData.append('language', options.language);
  }

  const response = await fetch(`${getApiBaseUrl()}/stt/transcribe`, {
    method: 'POST',
    body: formData,
  });

  const payload = (await response.json().catch(() => ({}))) as SonioxTranscribeResult & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(payload.error || `Transcription failed (${response.status})`);
  }

  return payload;
}
