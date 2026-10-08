import { useRef, useState, useCallback, useEffect } from "react"
import { transcribeAudio, fetchSpeech } from "../service/audio.api.js"
import {useDispatch} from "react-redux"
import { setLimitNotice } from "../chat.slice.js"

// Strip markdown/citations and split into chunks Chatterbox can handle
const splitForTts = (raw, max = 280) => {
    const clean = raw
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/`([^`]*)`/g, '$1')
        .replace(/\[(\d+)\]/g, '')
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[#*_>~|-]{1,}/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

    const sentences = clean.match(/[^.!?]+[.!?]*/g) || []
    const chunks = []
    let cur = ''
    for (const sentence of sentences) {
        if ((cur + sentence).length > max) {
            if (cur) chunks.push(cur.trim())
            cur = sentence.length > max ? '' : sentence
            if (sentence.length > max) {
                for (let i = 0; i < sentence.length; i += max) chunks.push(sentence.slice(i, i + max).trim())
            }
        } else {
            cur += sentence
        }
    }
    if (cur.trim()) chunks.push(cur.trim())
    return chunks.filter(Boolean)
}

export const useAudio = () => {
    const dispatch = useDispatch()
    const mediaRecorderRef = useRef(null)
    const chunksRef = useRef([])
    const audioPlayerRef = useRef(null)
    const playTokenRef = useRef(0)

    const [isRecording, setIsRecording] = useState(false)
    const [isTranscribing, setIsTranscribing] = useState(false)
    const [speakingMsgId, setSpeakingMsgId] = useState(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [countdown, setCountdown] = useState(0)


    useEffect(() => {
        if (!isGenerating) return
        setCountdown(0)
        const id = setInterval(() => setCountdown((i) => (i + 1)), 1000)
        return () => clearInterval(id)
    }, [isGenerating])



    const startRecording = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const recorder = new MediaRecorder(stream)
        chunksRef.current = []

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data)
        }

        recorder.start()
        mediaRecorderRef.current = recorder
        setIsRecording(true)
    }, [])

    // Resolves with the transcribed text (or null on failure)
    const stopRecording = useCallback(() => {
        return new Promise((resolve) => {
            const recorder = mediaRecorderRef.current
            if (!recorder) return resolve(null)

            recorder.onstop = async () => {
                setIsRecording(false)
                recorder.stream.getTracks().forEach((track) => track.stop())

                const blob = new Blob(chunksRef.current, { type: "audio/webm" })

                setIsTranscribing(true)
                try {
                    const { text } = await transcribeAudio(blob)
                    resolve(text)
                } catch (error) {
                    console.error("Transcription failed:", error)
                    resolve(null)
                } finally {
                    setIsTranscribing(false)
                }
            }

            recorder.stop()
        })
    }, [])

    // Toggle speaking a given message. Text is cleaned and split into <=280-char
    // sentence chunks (Chatterbox Space limit is 300); chunk N+1 is fetched while N plays.
    const playText = useCallback(async (text, msgId) => {
        if (speakingMsgId === msgId) {
            playTokenRef.current++
            audioPlayerRef.current?.pause()
            setSpeakingMsgId(null)
            setIsGenerating(false)
            return
        }

        const token = ++playTokenRef.current
        audioPlayerRef.current?.pause()
        setSpeakingMsgId(msgId)
        setIsGenerating(true)

        try {
            const chunks = splitForTts(text)
            let next = chunks.length ? fetchSpeech(chunks[0] , true) : null

            for (let i = 0; i < chunks.length; i++) {
                
                setIsGenerating(true)
                const url = await next
                setIsGenerating(false)

                if (token !== playTokenRef.current) return
                next = i + 1 < chunks.length ? fetchSpeech(chunks[i + 1]) : null

                await new Promise((resolve) => {
                    const audio = new Audio(url)
                    audioPlayerRef.current = audio
                    audio.onended = resolve
                    audio.onerror = resolve
                    audio.play().catch(resolve)
                })
                if (token !== playTokenRef.current) return
            }
        } catch (error) {

            if (error.response?.status === 429) {
                dispatch(setLimitNotice({feature : "tts" , message : "You've used all 5 voice playbacks for today. Your limit resets tomorrow"}))
            }

            console.error("TTS playback failed:", error)
        } finally {
            if (token === playTokenRef.current) {
                setSpeakingMsgId(null),
                    setIsGenerating(false)
            }
        }
    }, [speakingMsgId])

    return {
        isRecording,
        isTranscribing,
        speakingMsgId,
        isGenerating,
        countdown,
        startRecording,
        stopRecording,
        playText
    }
}

export default useAudio