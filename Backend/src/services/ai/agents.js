import {createAgent} from 'langchain';
import { models } from './models.js';
import { searchInternetTool } from './tools.js';





export const agents = {
  groq: createAgent({
    model: models.groq,
    tools: [searchInternetTool],
  }),
  gemini: createAgent({
    model: models.gemini,
    tools: [searchInternetTool],
  }),
  openRouter: createAgent({
    model: models.openRouter,
    tools: [searchInternetTool],
  }),
  cohere: createAgent({
    model: models.cohere,
    tools: [searchInternetTool],
  }),
  cloudFlare : createAgent({
    model : models.cloudFlare,
    tools: [searchInternetTool]
  }) ,
  mistral : createAgent({
    model : models.mistral ,
    tools: [searchInternetTool]
  })
};
