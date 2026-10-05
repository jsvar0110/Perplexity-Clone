import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  tool,
  createAgent,
} from "langchain";

import { MODEL_CHAIN, TITLE_CHAIN, IMAGE_READ_CHAIN } from "./ai/chains.js";

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



function buildFileContent(file, question) {
  if (file.type === "image") {
    return [
      { type: "text", text: question },
      { type: "image_url", image_url: { url: `data:${file.mimetype};base64,${file.data}` } },
    ];
  }
  return `The user attached "${file.name}"${file.truncated ? " (truncated)" : ""}:\n--- FILE START ---\n${file.content}\n--- FILE END ---\n\n${question}`;
}


export async function streamResponse(messages, sendEvent, fileContent, userId) {

  const history = convertMessages(messages);

  if (fileContent) {
    const last = history.pop();
    history.push(new HumanMessage(buildFileContent(fileContent, last.content)))
  }

  const langchainMessages = [
    new SystemMessage(getStreamResponse()),
    ...history
  ];

  const chain = fileContent?.type === "image" ? IMAGE_READ_CHAIN : MODEL_CHAIN

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
      // MODEL_CHAIN,
      chain, userId
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


      if (event.event === "on_tool_end" && event.name === "generateImage") {
        const out = event.data?.output;
        const text = typeof out === "string" ? out : out?.content;
        if (typeof text === "string" && text.startsWith("IMAGE_URL:")) {
          const md = `\n\n![Generated image](${text.slice(10)})\n\n`;
          fullResponse += md;
          sendEvent({ type: "token", content: md });
        }

        if (typeof text === "string" && text.startsWith("IMAGE_LIMIT_REACHED")) {
          sendEvent({ type: "limit", feature: "image", message: "You've used all 2 image generations for today. Your limit resets tomorrow." });
        }
        
      }




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
