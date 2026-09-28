import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  tool,
  createAgent,
} from "langchain";

import { MODEL_CHAIN, TITLE_CHAIN } from "./ai/chains.js";

import { runWithFallback, getStreamWithFallback } from "./ai/fallback.js";

import { convertMessages } from "./ai/messages.js";

import { getResponse, getStreamResponse, Title } from "./ai/prompt.js";

import { handleToolEvent, getStreamText } from "./ai/stream.js";

export async function generateResponse(messages) {
  const langchainMessages = [
    new SystemMessage(getResponse()),
    ...convertMessages(messages),
  ];

  const response = await runWithFallback(async ({ agent }) => {
    return await agent.invoke({
      messages: langchainMessages,
    });
  }, MODEL_CHAIN);

  const last = response.messages[response.messages.length - 1];
  return typeof last.content === "string"
    ? last.content
    : last.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("");
}

export async function streamResponse(messages, sendEvent) {
  const langchainMessages = [
    new SystemMessage(getStreamResponse()),
    ...convertMessages(messages),
  ];

  let fullResponse = "";

  // const agent = agents.gemini; // Use the first agent in the chain for streaming

  sendEvent({
    type: "status",
    status: "thinking",
    message: "Understanding your question...",
  });

  try {
    for await (const item of getStreamWithFallback(
      langchainMessages,
      MODEL_CHAIN,
    )) {
      // MODEL RESTART / FALLBACK

      if (item.type === "restart") {
        if (!item.isFirstAttempt) {
          // if previous model died mid-response -wipe  partial text is already rendered
          fullResponse = "";
          sendEvent({ type: "restart" });
          sendEvent({
            type: "status",
            status: "thinking",
            message: "Retrying  with different model...",
          });
        }

        continue;
      }

      const { usedModel, event } = item;

      handleToolEvent(event, sendEvent);

      //        // =========================================
      //   // TOOL START
      //   // =========================================

      //   if (event.event === "on_tool_start") {
      //     if (event.name === "searchInternet") {
      //       sendEvent({
      //         type: "status",
      //         status: "searching",
      //         message: "Searching the web...",
      //       });
      //     }
      //   }

      //   // =========================================
      //   // TOOL END
      //   // =========================================

      //   if (event.event === "on_tool_end") {
      //     if (event.name === "searchInternet") {
      //       sendEvent({
      //         type: "status",
      //         status: "researching",
      //         message: "Reviewing search results...",
      //       });
      //     }
      //   }
      // }

      if (event.event === "on_chat_model_stream") {
        const text = getStreamText(event, usedModel);

        if (!text) continue;

        fullResponse += text;

        sendEvent({
          type: "token",
          content: text,
        });
      }
    }

    sendEvent({
      type: "complete",
    });

    return fullResponse;
  } catch (error) {
    console.error("Streaming AI error:", error);

    sendEvent({
      type: "error",
      message: "Something went wrong while generating the response.",
    });

    throw error;
  }
}

export async function generateChatTitle(message) {
  const response = await runWithFallback(async ({ model }) => {
    return await model.invoke([
      new SystemMessage(Title),
      new HumanMessage(`First message: "${message}"`),
    ]);
  }, TITLE_CHAIN);

  return response.content;
}
