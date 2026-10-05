
export function extractChunkText(chunk) {
  if (!chunk) return "";

  if (typeof chunk.content === "string") {
    return chunk.content;
  }

  if (Array.isArray(chunk.content)) {
    return chunk.content
      .filter((item) => item.type === "text")
      .map((item) => item.text)
      .join("");
  }
  return "";
}



export function handleToolEvent(event, sendEvent) {

  // =========================================
  // TOOL START
  // =========================================

  if (event.event === "on_tool_start") {
    if (event.name === "searchInternet") {
      sendEvent({
        type: "status",
        status: "searching",
        message: "Searching the web...",
      });
    }


    if (event.name === "generateImage") {
      sendEvent({ type: "status", status: "imagining", message: "Generating image..." });
    }

  }

  // =========================================
  // TOOL END
  // =========================================

  if (event.event === "on_tool_end") {
    if (event.name === "searchInternet") {
      sendEvent({
        type: "status",
        status: "researching",
        message: "Reviewing search results...",
      });
    }
  }
}




export function getStreamText(event, usedModel) {
  if (event.event !== "on_chat_model_stream") {
    return null;
  }

  const chunk = event.data?.chunk;

  if (!chunk) {
    return null;
  }

  // console.log(
  //   "[RAW CHUNK]",
  //   usedModel,
  //   JSON.stringify(chunk)
  // );

  let text = "";

  if (typeof chunk.content === "string") {
    text = chunk.content;
  } else if (Array.isArray(chunk.content)) {
    text = chunk.content
      .filter((item) => item.type === "text")
      .map((item) => item.text)
      .join("");
  }

  if (!text) {
    return null;
  }

  return text;
}
