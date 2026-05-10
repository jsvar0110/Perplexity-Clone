import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";


/* Register */

export async function register(req, res) {
    const { username, email, password } = req.body

    const isUserAlreadyExists = await userModel.findOne({

        $or: [{ email }, { username }]

    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with username or email already exists",
            success: false,
            err: "User Already Exists"
        })
    }


    const user = await userModel.create({ username, email, password })


    const emailVerificationToken = jwt.sign({
        email: user.email,
    }, process.env.JWT_SECRET)



    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity!",
        html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
        `
    })

    res.status(201).json({
        message: "user registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }

    })




}



/* Login */


export async function login(req, res) {


    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "User not found"
        })
    }

    const isPasswordMatch = await user.comparePassword(password)

    if (!isPasswordMatch) {
        return  res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect Password"
        })
    }


    if (!user.verified) {
        return res.status(400).json({
            message: "please verify your email before logging in",
            success: false,
            err: "Email not found"
        })
    }

    const token = jwt.sign({

        id: user._id,
        username: user.username,

    }, process.env.JWT_SECRET, { expiresIn: '7d' })


    res.cookie("token" , token)

    res.status(200).json({
        messsage : "Login successfully" ,
        success : true ,
        user : {
            id : user._id ,
            username : user.username ,
            email : user.email
        }
    })


}



/* Get-me */

export async function getMe( req , res ) {
    

    const userId = req.user.id

    const user = await userModel.findById(userId).select("-password")

    if (!user) {
        
        return res.status(400).json({
            message : "User not found" ,
            success : false ,
            err : "User not found"
        })

    }


    res.status(200).json({
        message : "User details fetched successfully" ,
        success : true ,
        user
    })

}




/* Verify - Email */

export async function verifyEmail(req, res) {

    const { token } = req.query

    try {


        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findOne({ email: decoded.email })

        if (!user) {

            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "User not found"
            })

        }


        user.verified = true

        await user.save()

        const html =
            `
            <h1>Email Verified Successfully!</h1>
            <p>Your email has been verified. You can now log in to your account.</p>
            <a href="http://localhost:3000/login">Go to Login</a>

            `


        return res.send(html)



    } catch (error) {


        return res.status(400).json({
            message: "Invalidor or expired token",
            success: false,
            err: err.message
        })

    }

}


/* 
    Token in register which will be made after registering .Then node-mailer sends link to the user email address
    then when the user clicks on the link it verifies the email with token if it matches then User is verified 
*/