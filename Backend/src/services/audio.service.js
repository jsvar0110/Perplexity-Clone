// STT: Groq Whisper Large V3 Turbo      (key: GROQ_API_KEY)
// TTS: Gemini 2.5 Flash Preview TTS -> ElevenLabs eleven_flash_v2_5 (fallback)
import { runWithFallback } from "./ai/fallback.js";

const GROQ_AUDIO_KEY = process.env.GROQ_API_KEY;
const GROQ_STT_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

const GEMINI_TTS_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent";

const ELEVENLABS_TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech";
// const ELEVENLABS_DEFAULT_VOICE_ID = ""; // 

export async function transcribeAudio(buffer, filename = "audio.webm", mimetype = "audio/webm") {
  const form = new FormData();
  form.append("file", new Blob([buffer], { type: mimetype }), filename);
  form.append("model", "whisper-large-v3-turbo");

  const response = await fetch(GROQ_STT_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${GROQ_AUDIO_KEY}` },
    body: form,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq STT failed: ${response.status} ${errText}`);
  }

  const data = await response.json();
  return data.text;
}

// Gemini returns raw 16-bit PCM (24kHz, mono) with no container, so we
// have to prepend a WAV header ourselves before sending it to the browser.
function pcmToWav(pcmBuffer, { channels = 1, sampleRate = 24000, bitDepth = 16 } = {}) {
  const blockAlign = (channels * bitDepth) / 8;
  const byteRate = sampleRate * blockAlign;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcmBuffer.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // fmt chunk size
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitDepth, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcmBuffer.length, 40);

  return Buffer.concat([header, pcmBuffer]);
}

async function synthesizeWithGemini(text, voiceName = "Kore") {
  const response = await fetch(`${GEMINI_TTS_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName } },
        },
      },
    }),
  });

  if (!response.ok) {
    const err = new Error(`Gemini TTS failed: ${response.status} ${await response.text()}`);
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  const part = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
  if (!part?.data) throw new Error("Gemini TTS returned no audio");

  const pcmBuffer = Buffer.from(part.data, "base64");
  return { buffer: pcmToWav(pcmBuffer), mimeType: "audio/wav" };
}

async function synthesizeWithElevenLabs(text) {
  const voiceId = process.env.ELEVENLABS_VOICE_ID

  const response = await fetch(`${ELEVENLABS_TTS_URL}/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": process.env.EL_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_flash_v2_5",
    }),
  });

  if (!response.ok) {
    const err = new Error(`ElevenLabs TTS failed: ${response.status} ${await response.text()}`);
    err.status = response.status;
    throw err;
  }

  const arrayBuffer = await response.arrayBuffer();
  return { buffer: Buffer.from(arrayBuffer), mimeType: "audio/mpeg" };
}

// Tries Gemini first; on a retryable failure (quota/rate-limit/5xx — see
// isRetryableError in fallback.js) falls through to ElevenLabs. Each new
// call starts back at Gemini, so a later request "falls back to Gemini"
// again on its own once Gemini's quota has recovered.
const ttsChain = [
  { name: "gemini-2.5-flash-preview-tts", synth: (text, voiceName) => synthesizeWithGemini(text, voiceName) },
  { name: "eleven_flash_v2_5", synth: (text) => synthesizeWithElevenLabs(text) },
];

export async function synthesizeSpeech(text, voiceName = "Kore") {
  return runWithFallback((entry) => entry.synth(text, voiceName), ttsChain);
}