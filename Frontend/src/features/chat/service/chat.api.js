import axios from "axios"
import { API_URL } from "../../../config/api.js"

const api = axios.create({
    baseURL : API_URL  ,
    withCredentials : true
})


export const createChat = async () => {
    const response = await api.post("/api/chats/create")
    return response.data
}


export const streamMessage = async ({ message ,chatId , file ,onEvent }) => {

    const formData = new FormData()

    formData.append("message" , message)
    formData.append("chat" , chatId )

    if (file) {
        formData.append("file" , file)
    }


    const response = await fetch(
        `${API_URL}/api/chats/message/stream`,
        {
            method: "POST",

            credentials: "include",

            body : formData
        }
    )

    if (!response.ok) {
        throw new Error(
            `Streaming request failed: ${response.status}`
        )
    }

    if (!response.body) {
        const err = await response.json().catch(() => null)
        throw new Error(err?.message || `Streaming request failed: ${response.status}`)
    }

    const reader = response.body.getReader()

    const decoder = new TextDecoder()

    let buffer = ""

    while (true) {

        const { value, done } =
            await reader.read()

        if (done) break

        buffer += decoder.decode(
            value,
            { stream: true }
        )

        const events = buffer.split("\n\n")

        buffer = events.pop() || ""

        for (const event of events) {

            const line = event
                .split("\n")
                .find(line =>
                    line.startsWith("data:")
                )

            if (!line) continue

            const json = line
                .replace(/^data:\s*/, "")

            try {

                const data = JSON.parse(json)

                onEvent(data)

            } catch (error) {

                console.error(
                    "Invalid SSE event:",
                    json
                )
            }
        }
    }
}


export const generateTitle = async ({ chatId, message }) => {
    const response = await api.post("/api/chats/title", {
        chatId,
        message
    })

    return response.data
}

export const sendMessage = async ({ message , chatId }) => {
    const response = await api.post("/api/chats/message" , { message , chat: chatId})
    return response.data
}

export const getChats = async () => {
    const response = await api.get("/api/chats")
    return response.data
}

export const getMessages = async (chatId)=>{
    const response = await api.get(`/api/chats/${chatId}/messages`)
    return response.data
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chats/delete/${chatId}`)
    return response.data
}