import { HumanMessage, AIMessage } from "langchain";

export function convertMessages(messages) {
  return messages
    .map((msg) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      }

      if (msg.role === "ai") {
        return new AIMessage(msg.content);
      }

      return null; // unknown role
    })
    .filter(Boolean);
}
