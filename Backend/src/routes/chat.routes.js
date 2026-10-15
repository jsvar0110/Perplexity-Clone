import { Router } from 'express'
import {
    createChat,
    generateTitle,
    sendMessage,
    streamMessage, 
    getChats,
    getMessages,
    deleteChat
} from '../controllers/chat.controller.js';

import { authUser } from '../middlewares/auth.middleware.js';

import { uploadFile } from '../middlewares/upload.middleware.js';
import { aiLimiter } from '../middlewares/auth-rate-limt.middleware.js';


const chatRouter = Router()

chatRouter.post('/create' , authUser , createChat)
chatRouter.post('/title', authUser , aiLimiter ,generateTitle )

//Stream Response
chatRouter.post('/message/stream' , authUser, aiLimiter , uploadFile , streamMessage)

chatRouter.post('/message', authUser, aiLimiter , sendMessage)

chatRouter.get('/', authUser, getChats)

chatRouter.get('/:chatId/messages', authUser, getMessages)

chatRouter.delete('/delete/:chatId', authUser, deleteChat)



export default chatRouter; 