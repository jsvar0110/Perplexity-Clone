import { createSlice, current } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",

  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    error: null,
    limitNotice : null ,
  },
  reducers: {
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;

      state.chats[chatId] = {
        id: chatId,
        title,
        messages: [],
        lastUpdated: new Date().toISOString(),
      };
    },
    updateChatTitle: (state, action) => {
      const { chatId, title } = action.payload;

      if (state.chats[chatId]) {
        state.chats[chatId].title = title;
        state.chats[chatId].lastUpdated = new Date().toISOString();
      }
    },
    addNewMessage: (state, action) => {
      const { chatId, content, role } = action.payload;

      if (!state.chats[chatId]) return;

      state.chats[chatId].messages.push({
        content,
        role,
      });

      state.chats[chatId].lastUpdated = new Date().toISOString();
    },
    addMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      state.chats[chatId].messages.push(...messages);
    },
    startStreamingMessage: (state, action) => {
      const { chatId, content = "" } = action.payload;

      if (!state.chats[chatId]) return;

      state.chats[chatId].messages.push({
        content,
        role: "ai",
        isStreaming: true,
        status: "thinking",
      });

      state.chats[chatId].lastUpdated = new Date().toISOString();
    },
    appendStreamingMessage: (state, action) => {
      const { chatId, content } = action.payload;

      if (!state.chats[chatId]) return;

      const messages = state.chats[chatId].messages;

      const lastMessage = messages[messages.length - 1];

      if (
        !lastMessage ||
        lastMessage.role !== "ai" ||
        !lastMessage.isStreaming
      ) {
        return;
      }

      lastMessage.content += content;

      lastMessage.status = "writing";

      state.chats[chatId].lastUpdated = new Date().toISOString();
    }
    ,
    resetStreamingMessage: (state, action) => {
      const { chatId } = action.payload;

      if (!state.chats[chatId]) return;

      const messages = state.chats[chatId].messages;

      const lastMessage = messages[messages.length - 1];

      if (lastMessage && lastMessage.role === "ai" && lastMessage.isStreaming) {

        lastMessage.content = "";
        lastMessage.status = "thinking";

      }
    }
    ,
    updateStreamingStatus: (state, action) => {
      const { chatId, status } = action.payload;

      if (!state.chats[chatId]) return;

      const messages = state.chats[chatId].messages;

      const lastMessage = messages[messages.length - 1];

      if (lastMessage && lastMessage.role === "ai" && lastMessage.isStreaming) {
        lastMessage.status = status;
      }
    },
    finishStreamingMessage: (state, action) => {
      const { chatId } = action.payload;

      if (!state.chats[chatId]) return;

      const messages = state.chats[chatId].messages;

      const lastMessage = messages[messages.length - 1];

      if (lastMessage && lastMessage.role === "ai") {
        lastMessage.isStreaming = false;
        lastMessage.status = "complete";
      }
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLimitNotice: (state, action) => {
      state.limitNotice = action.payload;
    },
  },
});

export const {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  setLimitNotice,
  
  createNewChat,
  updateChatTitle,
  addNewMessage,
  addMessages,
  startStreamingMessage,
  appendStreamingMessage,
  resetStreamingMessage,
  updateStreamingStatus,
  finishStreamingMessage,
} = chatSlice.actions;

export default chatSlice.reducer;

// chats = {
//     "docker and AWS": {
//         messages: [
//             {
//                 role: "user",
//                 content: "What is docker?"
//             },
//             {
//                 role: "ai",
//                 content: "Docker is a platform that allows developers to automate the deployment of applications inside lightweight, portable containers. It provides an efficient way to package and distribute software, ensuring consistency across different environments."
//             }
//         ],
//         id: "docker and AWS",
//         lastUpdated: "2024-06-20T12:34:56Z",
//     }

// }
