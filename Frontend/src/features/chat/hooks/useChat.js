import { initializeSocketConnection } from "../service/chat.socket"
import { createChat, generateTitle, sendMessage, getChats, getMessages, deleteChat, streamMessage } from "../service/chat.api"
import {
    setChats, setCurrentChatId, setError,
    setLoading, createNewChat, updateChatTitle,
    addNewMessage, addMessages, startStreamingMessage,
    appendStreamingMessage, updateStreamingStatus, finishStreamingMessage } from "../chat.slice"
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

    async function handleSendMessage({
    message,
    chatId
}) {

    dispatch(setLoading(true))
    dispatch(setError(null))

    try {

        let activeChatId = chatId

        // ==========================================
        // 1. CREATE NEW CHAT
        // ==========================================

        if (!activeChatId) {

            const chatData = await createChat()

            const newChat = chatData.chat

            activeChatId = newChat._id

            dispatch(createNewChat({
                chatId: newChat._id,
                title: "New Chat"
            }))

            dispatch(
                setCurrentChatId(newChat._id)
            )
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
                .catch((error) => {

                    console.error(
                        "Title generation failed:",
                        error
                    )

                })
        }


        // ==========================================
        // 4. CREATE EMPTY AI MESSAGE
        // ==========================================

        dispatch(startStreamingMessage({
            chatId: activeChatId
        }))


        // ==========================================
        // 5. START STREAM
        // ==========================================

        await streamMessage({

            message,

            chatId: activeChatId,

            onEvent: (event) => {

                // -------------------------------
                // STATUS
                // -------------------------------

                if (event.type === "status") {

                    dispatch(updateStreamingStatus({
                        chatId: activeChatId,
                        status: event.status
                    }))

                    return
                }


                // -------------------------------
                // TOKEN
                // -------------------------------

                if (event.type === "token") {

                    dispatch(
                        appendStreamingMessage({
                            chatId: activeChatId,
                            content: event.content
                        })
                    )

                    return
                }


                // -------------------------------
                // COMPLETE
                // -------------------------------

                if (event.type === "complete") {

                    dispatch(
                        finishStreamingMessage({
                            chatId: activeChatId
                        })
                    )

                    return
                }


                // -------------------------------
                // ERROR
                // -------------------------------

                if (event.type === "error") {

                    dispatch(setError(
                        event.message
                    ))
                }
            }
        })


        dispatch(
            setCurrentChatId(activeChatId)
        )

    } catch (error) {

        console.error(
            "Chat streaming error:",
            error
        )

        dispatch(setError(
            error.message ||
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
