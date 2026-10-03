import { generateResponse , generateChatTitle , streamResponse } from "../services/ai.service.js";
import {extractFileContent} from "../services/file.service.js"

import chatModel from '../models/chat.model.js'
import messageModel from "../models/message.model.js"

export async function sendMessage(req, res) {

    const { message, chat: chatId } = req.body

    if (!chatId) {
        return res.status(400).json({
            message: "Chat ID is required"
        })
    }

    // Save user message
    await messageModel.create({
        chat: chatId,
        content: message,
        role: 'user'
    })

    // Get previous messages
    const messages = await messageModel.find({
        chat: chatId
    })

    // Generate AI response
    const result = await generateResponse(messages)

    // Save AI message
    const aiMessage = await messageModel.create({
        chat: chatId,
        content: result,
        role: 'ai'
    })

    res.status(201).json({
        aiMessage
    })
}


export async function streamMessage(req, res) {

    const { message, chat: chatId } = req.body

    const file = req.file

    if (!chatId) {
        return res.status(400).json({
            message: "Chat ID is required"
        })
    }

    // ==========================================
    // SSE HEADERS
    // ==========================================

    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.setHeader("X-Accel-Buffering", "no")

    res.flushHeaders?.()


    // ==========================================
    // SEND SSE EVENT
    // ==========================================

    const sendEvent = (data) => {

        res.write(
            `data: ${JSON.stringify(data)}\n\n`
        )
    }


    try {

        let fileContent = await extractFileContent(file)
        
        // ==========================================
        // SAVE USER MESSAGE
        // ==========================================

        await messageModel.create({
            chat: chatId,
            content: message,
            role: "user"
        })


        // ==========================================
        // GET CHAT HISTORY
        // ==========================================

        const messages = await messageModel.find({
            chat: chatId
        })


        // ==========================================
        // START AI STREAM
        // ==========================================

        const fullResponse = await streamResponse(
            messages,
            sendEvent ,
            fileContent
        )


        // ==========================================
        // SAVE COMPLETE AI RESPONSE
        // ==========================================

        const aiMessage = await messageModel.create({
            chat: chatId,
            content: fullResponse,
            role: "ai"
        })


        // ==========================================
        // SEND FINAL EVENT
        // ==========================================

        sendEvent({
            type: "saved",
            messageId: aiMessage._id
        })


        res.end()

    } catch (error) {

        console.error(error)

        sendEvent({
            type: "error",
            message: error.message || "AI response failed"
        })

        res.end()
    }
}



export async function createChat(req, res) {

    const chat = await chatModel.create({
        user: req.user.id,
        title: "New Chat"
    })

    res.status(201).json({
        chat
    })
}


export async function generateTitle(req, res) {

    const { chatId, message } = req.body

    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    const title = await generateChatTitle(message)

    chat.title = title

    await chat.save()

    res.status(200).json({
        chatId: chat._id,
        title: chat.title
    })
}



export async function getChats(req , res) {

    const user = req.user

    const chats = await chatModel.find({user : user.id}).sort({createdAt : -1})

    res.status(200).json({
        message : "Chats retrieved successfully",
        chats
    })
 
}

export async function getMessages(req , res) {

    const {chatId} = req.params

    const chat = await chatModel.findOne({
        _id : chatId ,
        user : req.user.id
    })

    if (!chat){
        return res.status(404).json({
            message : "Chat not found"
        })
    }

    const messages = await messageModel.find({
        chat : chatId
    })


    res.status(200).json({
        message : "Messages retrieved successfully" ,
        messages
    })
}

export async function deleteChat(req , res) {
    
    const {chatId} = req.params

    const chat = await chatModel.findOneAndDelete({
        _id : chatId ,
        user : req.user.id

    })


    await messageModel.deleteMany({
        chat : chatId
    })
    
    if (!chat){
        return res.status(404).json({
            message : "Chat not found"
        })
    }

    res.status(200).json({
        message : "Chat deleted successfully"
    })

}
