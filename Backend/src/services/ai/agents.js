import {createAgent} from 'langchain';
import { models } from './models.js';
import { searchInternetTool , generateImageTool } from './tools.js';




export const agents = {
  groq: createAgent({
    model: models.groq,
    tools: [searchInternetTool, generateImageTool],
  }),
  gemini: createAgent({
    model: models.gemini,
    tools: [searchInternetTool, generateImageTool],
  }),
  openRouter: createAgent({
    model: models.openRouter,
    tools: [searchInternetTool, generateImageTool],
  }),
  cohere: createAgent({
    model: models.cohere,
    tools: [searchInternetTool, generateImageTool],
  }),
  cloudFlare : createAgent({
    model : models.cloudFlare,
    tools: [searchInternetTool, generateImageTool],
  }) ,
  mistral : createAgent({
    model : models.mistral ,
    tools: [searchInternetTool ,generateImageTool]
  })
};
