import { models , imageModels } from "./models.js";
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
  {
    name : "mistral" ,
    model : models.mistral ,
    agent : agents.mistral
  } ,
  {
    name : "cloudFlare" ,
    model: models.cloudFlare ,
    agent : agents.cloudFlare
  },
];

export const IMAGE_READ_CHAIN = [MODEL_CHAIN[1]]; // Gemini only; your other models are likely text-only

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

/* IMAGE */

export const IMAGE_CHAIN = [
  { name: "fluxSchnell", model: imageModels.fluxSchnell },
];
