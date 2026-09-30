import { Router } from "express";
import multer from "multer";
import { authUser } from "../middlewares/auth.middleware.js";
import { speechToText, textToSpeech } from "../controllers/audio.controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

const audioRouter = Router();

audioRouter.post("/transcribe", authUser, upload.single("audio"), speechToText);
audioRouter.post("/speech", authUser, textToSpeech);

export default audioRouter;