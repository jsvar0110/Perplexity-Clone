import { generateResponse , generateChatTitle , streamResponse } from "../services/ai.service.js";
import {extractFileContent} from "../services/file.service.js"

import chatModel from '../models/chat.model.js'
import messageModel from "../models/message.model.js"
import mongoose from "mongoose";

async function getOwnedChat (chatId , userId){

    if (typeof chatId !== "string" || !mongoose.isValidObjectId(chatId)) return null
    return chatModel.findOne({_id : chatId , user : userId}) 
}


export async function sendMessage(req, res) {

    const { message, chat: chatId } = req.body

    if (!chatId) {
        return res.status(400).json({
            message: "Chat ID is required"
        })
    }

    const chat = await getOwnedChat(chatId , req.user.id)

    if(!chat) return res.status(404).json({ message: "Chat not found" })

    if (typeof message !== "string" || !message.trim() ) {
        return res.status(400).json({ message: "Message is required" })
    }

    // Save user message
    await messageModel.create({
        chat: chat._id,
        content: message,
        role: 'user'
    })

    // Get previous messages
    const messages = await messageModel.find({
        chat: chat._id
    })

    // Generate AI response
    const result = await generateResponse(messages)

    // Save AI message
    const aiMessage = await messageModel.create({
        chat: chat._id,
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

    const chat = await getOwnedChat(chatId, req.user.id)
    if (!chat) return res.status(404).json({ message: "Chat not found" })
    
    // SSE HEADERS
    

    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.setHeader("X-Accel-Buffering", "no")

    res.flushHeaders?.()


    
    // SEND SSE EVENT
    

    const sendEvent = (data) => {

        res.write(
            `data: ${JSON.stringify(data)}\n\n`
        )
    }


    try {

        let fileContent = await extractFileContent(file)
        
        
        // SAVE USER MESSAGE
        

        await messageModel.create({
            chat: chat._id,
            content: message,
            role: "user"
        })


        
        // GET CHAT HISTORY
        

        const messages = await messageModel.find({
            chat: chat._id
        })


        
        // START AI STREAM
        

        const fullResponse = await streamResponse(
            messages,
            sendEvent ,
            fileContent ,
            req.user.id
        )


        
        // SAVE COMPLETE AI RESPONSE
        

        const aiMessage = await messageModel.create({
            chat: chat._id,
            content: fullResponse,
            role: "ai"
        })


        
        // SEND FINAL EVENT
        

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
    
    if (!chat){
        return res.status(404).json({
            message : "Chat not found"
        })
    }
    
    await messageModel.deleteMany({ 
        chat : chat._id 
    })

    res.status(200).json({
        message : "Chat deleted successfully"
    })

}
