import express from 'express'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.route.js'



const app = express()

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(cookieParser())

//Health check
app.get("/" , (req ,res)=>{
    res.json({message :"server is running"})
})

app.use("/api/auth" , authRouter)

export default app