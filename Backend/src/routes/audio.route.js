import { Router } from "express";
import multer from "multer";
import { authUser } from "../middlewares/auth.middleware.js";
import { speechToText, textToSpeech } from "../controllers/audio.controller.js";
import { aiLimiter } from "../middlewares/auth-rate-limt.middleware.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

const audioRouter = Router();

audioRouter.post("/transcribe", authUser, aiLimiter, upload.single("audio"), speechToText);
audioRouter.post("/speech", authUser, aiLimiter , textToSpeech);

export default audioRouter;