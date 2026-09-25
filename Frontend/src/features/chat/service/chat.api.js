import axios from "axios"

const api = axios.create({
    baseURL : "http://localhost:3000" ,
    withCredentials : true
})


export const createChat = async () => {
    const response = await api.post("/api/chats/create")
    return response.data
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