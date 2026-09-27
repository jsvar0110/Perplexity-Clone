import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { ChatMistralAI } from "@langchain/mistralai";
import { ChatOpenRouter } from "@langchain/openrouter";
import { ChatGroq } from "@langchain/groq";
import { ChatCohere } from "@langchain/cohere";

export const models = {
  gemini: new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
  }),

  cohere: new ChatCohere({
   model: "command-a-03-2025",
    apiKey: process.env.COHERE_API_KEY,
  }),

  groq: new ChatGroq({
     model: "openai/gpt-oss-20b",
    apiKey: process.env.GROQ_API_KEY,
  }),

  openRouter: new ChatOpenRouter({
     model: "deepseek/deepseek-v4.1-flash",
    apiKey: process.env.OPENROUTER_API_KEY,
  }),
};
