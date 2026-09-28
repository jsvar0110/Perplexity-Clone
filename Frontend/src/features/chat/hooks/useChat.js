import { initializeSocketConnection } from "../service/chat.socket";
import {
  createChat,
  generateTitle,
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
  streamMessage,
} from "../service/chat.api";
import {
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  createNewChat,
  updateChatTitle,
  addNewMessage,
  addMessages,
  startStreamingMessage,
  appendStreamingMessage,
  resetStreamingMessage,
  updateStreamingStatus,
  finishStreamingMessage,
} from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();

  // async function handleSendMessage({ message, chatId }) {
  //     dispatch(setLoading(true))
  //     const data = await sendMessage({ message, chatId })
  //     const { chat, aiMessage } = data

  //     try {

  //         if (!chatId)
  //             dispatch(createNewChat({
  //                 chatId: chat._id,
  //                 title: chat.title
  //             }))

  //         dispatch(addNewMessage({
  //             chatId: chatId || chat._id,
  //             content: message,
  //             role: "user"
  //         }))

  //         dispatch(addNewMessage({
  //             chatId: chatId || chat._id,
  //             content: aiMessage.content,
  //             role: aiMessage.role
  //         }))

  //         dispatch(setCurrentChatId(chat._id))

  //     } catch (err) {

  //         dispatch(setError(err.message))

  //     } finally {

  //         dispatch(setLoading(false))

  //     }

  // }

  async function handleSendMessage({ message, chatId }) {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      let activeChatId = chatId;

      
      // 1. CREATE NEW CHAT
      // ==========================================

      if (!activeChatId) {
        const chatData = await createChat();

        const newChat = chatData.chat;

        activeChatId = newChat._id;

        dispatch(
          createNewChat({
            chatId: newChat._id,
            title: "New Chat",
          }),
        );

        dispatch(setCurrentChatId(newChat._id));
      }

      
      // 2. SHOW USER MESSAGE IMMEDIATELY
      // ==========================================

      dispatch(
        addNewMessage({
          chatId: activeChatId,
          content: message,
          role: "user",
        }),
      );

      
      // 3. GENERATE TITLE
      // ==========================================

      if (!chatId) {
        generateTitle({
          chatId: activeChatId,
          message,
        })
          .then((data) => {
            dispatch(
              updateChatTitle({
                chatId: activeChatId,
                title: data.title,
              }),
            );
          })
          .catch((error) => {
            console.error("Title generation failed:", error);
          });
      }

      
      // 4. CREATE EMPTY AI MESSAGE
      // ==========================================

      dispatch(
        startStreamingMessage({
          chatId: activeChatId,
        }),
      );

      
      // 5. STREAM BUFFER
      // ==========================================

      const STREAM_FLUSH_INTERVAL = 60;

      let tokenBuffer = "";
      let flushTimer = null;

      
      // Flush buffered tokens into Redux
      // ------------------------------------------

      const flushTokens = () => {
        if (!tokenBuffer) {
          flushTimer = null;
          return;
        }

        dispatch(
          appendStreamingMessage({
            chatId: activeChatId,
            content: tokenBuffer,
          }),
        );

        tokenBuffer = "";
        flushTimer = null;
      };

      
      // 6. START STREAM
      // ==========================================

      await streamMessage({
        message,

        chatId: activeChatId,

        onEvent: (event) => {
          
          // STATUS
          // -------------------------------

          if (event.type === "status") {
            dispatch(
              updateStreamingStatus({
                chatId: activeChatId,
                status: event.status,
              }),
            );

            return;
          }

          
          // RESTART


          if (event.type === "restart") {
            // Discard any buffered tokens from the model
            // that just died mid-response.

            if (flushTimer) {
              clearTimeout(flushTimer);
              flushTimer = null;
            }

            tokenBuffer = "";

            dispatch(
              resetStreamingMessage({
                chatId: activeChatId,
              }),
            );

            return;
          }

          
          // TOKEN
          // -------------------------------

          if (event.type === "token") {
            // Add incoming token/chunk
            // to the buffer.

            tokenBuffer += event.content;

            // Only create one timer.
            //
            // Any tokens received during
            // these 60ms are added to the
            // same buffer.

            if (!flushTimer) {
              flushTimer = setTimeout(flushTokens, STREAM_FLUSH_INTERVAL);
            }

            return;
          }

          // -------------------------------
          // COMPLETE
          // -------------------------------

          if (event.type === "complete") {
            // Cancel pending timer
            if (flushTimer) {
              clearTimeout(flushTimer);

              flushTimer = null;
            }

            // IMPORTANT: Render anything that is still
            // inside the buffer.

            flushTokens();

            // Now mark streaming as finished.

            dispatch(
              finishStreamingMessage({
                chatId: activeChatId,
              }),
            );

            return;
          }

          // -------------------------------
          // ERROR
          // -------------------------------

          if (event.type === "error") {
            console.error("AI streaming error:", event.message);

            dispatch(setError(event.message || "AI response failed"));

            return;
          }
        },
      });

      // ==========================================
      // 7. KEEP CURRENT CHAT ACTIVE
      // ==========================================

      dispatch(setCurrentChatId(activeChatId));
    } catch (error) {
      console.error("Chat streaming error:", error);

      dispatch(setError(error.message || "Something went wrong"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetChats() {
    dispatch(setLoading(true));

    const data = await getChats();
    const { chats } = data;
    dispatch(
      setChats(
        chats.reduce((acc, chat) => {
          acc[chat._id] = {
            id: chat._id,
            title: chat.title,
            messages: [],
            lastUpdated: chat.updatedAt,
          };
          return acc;
        }, {}),
      ),
    );

    dispatch(setLoading(false));
  }

  async function handleOpenChat(chatId, chats) {
    console.log(chats[chatId].messages.length);

    if (chats[chatId].messages.length === 0) {
      const data = await getMessages(chatId);

      const { messages } = data;

      const formattedMessages = messages.map((msg) => ({
        content: msg.content,
        role: msg.role,
      }));

      dispatch(
        addMessages({
          chatId,
          messages: formattedMessages,
        }),
      );
    }

    dispatch(setCurrentChatId(chatId));
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
  };
};

export default useChat;
