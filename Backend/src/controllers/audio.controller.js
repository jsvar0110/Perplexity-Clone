import { transcribeAudio, synthesizeSpeech } from "../services/audio.service.js";
import { consumeUsage, refundUsage } from "../services/usage.service.js"

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

  let charged = false ;

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    if (text.length > 300) {
      return res.status(400).json({ message: "Text too long (max 300 characters per request)" });
    }


    if (req.body.first) {
      const rem = await consumeUsage(req.user.id, "tts");
      if (!rem.allowed) {
        return res.status(429).json({ code: "LIMIT_REACHED", message: "Daily voice limit reached." });
      }
      charged = true;
    }


    const { buffer, mimeType } = await synthesizeSpeech(text);

    res.setHeader("Content-Type", mimeType);
    res.send(buffer);
    
  } catch (error) {

    if (charged) await refundUsage(req.user.id, "tts");
    
    console.error("TTS error:", error);
    res.status(500).json({ message: "Failed to generate speech" });

  }
}