import { transcribeAudio, synthesizeSpeech } from "../services/audio.service.js";

export async function speechToText(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Audio file is required" });
    }

    const text = await transcribeAudio(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
    );

    res.status(200).json({ text });
  } catch (error) {
    console.error("STT error:", error);
    res.status(500).json({ message: "Failed to transcribe audio" });
  }
}

export async function textToSpeech(req, res) {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    if (text.length > 300) {
      return res.status(400).json({ message: "Text too long (max 300 characters per request)" });
    }

    const { buffer, mimeType } = await synthesizeSpeech(text);

    res.setHeader("Content-Type", mimeType);
    res.send(buffer);
  } catch (error) {
    console.error("TTS error:", error);
    res.status(500).json({ message: "Failed to generate speech" });
  }
}