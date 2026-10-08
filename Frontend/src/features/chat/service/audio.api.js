import axios from "axios"
import { API_URL } from "../../../config/api.js"

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

export const transcribeAudio = async (audioBlob) => {
    const formData = new FormData()
    formData.append("audio", audioBlob, "recording.webm")

    const response = await api.post("/api/audio/transcribe", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })

    return response.data
}

export const fetchSpeech = async (text , first = false) => {
    const response = await api.post(
        "/api/audio/speech",
        { text , first },
        { responseType: "blob" }
    )

    return URL.createObjectURL(response.data)
}