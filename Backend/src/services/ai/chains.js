import { models } from "./models.js";
import { agents } from "./agents.js";

export const MODEL_CHAIN = [
  {
    name: "openRouter",
    model: models.openRouter,
    agent: agents.openRouter,
  },
  {
    name: "gemini",
    model: models.gemini,
    agent: agents.gemini,
  },
];

export const TITLE_CHAIN = [
  {
    name: "cohere",
    model: models.cohere,
    agent: agents.cohere,
  },
  {
    name: "groq",
    model: models.groq,
    agent: agents.groq,
  },
];
