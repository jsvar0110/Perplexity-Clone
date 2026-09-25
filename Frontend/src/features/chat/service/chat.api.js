import axios from "axios"

const api = axios.create({
    baseURL : "http://localhost:3000" ,
    withCredentials : true
})


export const createChat = async () => {
    const response = await api.post("/api/chats/create")
    return response.data
}


export const streamMessage = async ({ message ,chatId ,onEvent }) => {

    const response = await fetch(
        "http://localhost:3000/api/chats/message/stream",
        {
            method: "POST",

            credentials: "include",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message,
                chat: chatId
            })
        }
    )

    if (!response.ok) {
        throw new Error(
            `Streaming request failed: ${response.status}`
        )
    }

    if (!response.body) {
        throw new Error(
            "Streaming is not supported by this browser."
        )
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