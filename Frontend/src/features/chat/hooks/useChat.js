import { initializeSocketConnection } from "../service/chat.socket"
import { createChat , generateTitle , sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api"
import { setChats, setCurrentChatId, setError, setLoading, createNewChat,updateChatTitle , addNewMessage, addMessages } from "../chat.slice"
import { useDispatch } from "react-redux"

export const useChat = () => {
    const dispatch = useDispatch()

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

    dispatch(setLoading(true))
    dispatch(setError(null))

    try {

        let activeChatId = chatId

        // ==========================================
        // 1. NEW CHAT
        // ==========================================

        if (!activeChatId) {

            const chatData = await createChat()

            const newChat = chatData.chat

            activeChatId = newChat._id

            // Immediately add chat to Redux
            dispatch(createNewChat({
                chatId: newChat._id,
                title: "New Chat"
            }))

            // Immediately open the new chat
            dispatch(setCurrentChatId(newChat._id))
        }

        // ==========================================
        // 2. SHOW USER MESSAGE IMMEDIATELY
        // ==========================================

        dispatch(addNewMessage({
            chatId: activeChatId,
            content: message,
            role: "user"
        }))


        // ==========================================
        // 3. GENERATE TITLE
        // ==========================================

        if (!chatId) {

            generateTitle({
                chatId: activeChatId,
                message
            })
                .then((data) => {

                    dispatch(updateChatTitle({
                        chatId: activeChatId,
                        title: data.title
                    }))

                })
                .catch((err) => {

                    console.error(
                        "Title generation failed:",
                        err
                    )

                })
        }


        // ==========================================
        // 4. GENERATE AI RESPONSE
        // ==========================================

        const data = await sendMessage({
            message,
            chatId: activeChatId
        })

        const { aiMessage } = data


        // ==========================================
        // 5. ADD AI RESPONSE
        // ==========================================

        dispatch(addNewMessage({
            chatId: activeChatId,
            content: aiMessage.content,
            role: aiMessage.role
        }))


        // Make absolutely sure this chat remains active
        dispatch(setCurrentChatId(activeChatId))


    } catch (err) {

        console.error(err)

        dispatch(setError(
            err.response?.data?.message ||
            err.message ||
            "Something went wrong"
        ))

    } finally {

        dispatch(setLoading(false))

    }
}

    async function handleGetChats() {
        dispatch(setLoading(true))

        const data = await getChats()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc, chat) => {

            acc[chat._id] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt,
            }
            return acc
        }, {})))

        dispatch(setLoading(false))
    }

    async function handleOpenChat(chatId, chats) {

        console.log(chats[chatId].messages.length)

        if (chats[chatId].messages.length === 0) {

            const data = await getMessages(chatId)

            const { messages } = data

            const formattedMessages = messages.map(msg => ({
                content: msg.content,
                role: msg.role

            }))

            dispatch(addMessages({
                chatId,
                messages: formattedMessages
            }))

        }

        dispatch(setCurrentChatId(chatId))
    }


    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    }

}

export default useChat
