import express from 'express'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.route.js'
import chatRouter from './routes/chat.routes.js'
import audioRouter from './routes/audio.route.js'

import morgan from 'morgan'
import cors from 'cors'


const app = express()

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(cookieParser())
app.use(morgan("dev"))
app.use(cors({
    origin : "http://localhost:5173" ,
    credentials : true ,
    methods : ["GET" , "POST" , "PUT" , "DELETE"]
}))

//Health check
app.get("/" , (req ,res)=>{
    res.json({message :"server is running"})
})

app.use("/api/auth" , authRouter)
app.use('/api/chats' , chatRouter)
app.use('/api/audio' , audioRouter)

export default app