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
        purpose: "email-verification"

    }, process.env.JWT_SECRET , { expiresIn: '24h' })



    await sendEmail({
        to: email,
        subject: "Welcome to Veltrix!",
        html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Veltrix</strong>. We're excited to have you on board!</p>
                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Veltrix Team</p>
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


    if (!user.password) {

        return res.status(400).json({
            message: "This account uses Google Sign-in , Please continue with Google",
            success: false,
            err: "Google account"
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
        message : "Login successfully" ,
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

        if (decoded.purpose !== "email-verification") {
            return res.status(400).json({
                message: "Invalid verification token",
                success: false
            })
        }

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
            <a href="http://localhost:5173/login">Go to Login</a>

            `


        return res.send(html)



    } catch (error) {


        if (error.name === "TokenExpiredError") {
            return res.status(400).json({
                message: "Verification link has expired",
                success: false
            })
        }

        return res.status(400).json({
            message: "Invalidor or expired token",
            success: false,
            err: error.message
        })

    }

}
/* 
    Token in register which will be made after registering .Then node-mailer sends link to the user email address
    then when the user clicks on the link it verifies the email with token if it matches then User is verified 
*/


async function generateUniqueUsername(displayName, email) {

    const clean = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20)
    let base = clean(displayName) || clean(email.split('@')[0]) || 'user'
    if (base.length < 3) base = "user" + base

    let username = base , i = 1
    while (await userModel.exists({ username })) username = `${base}${i++}`
    return username

}

export async function googleCallback(req, res) {

    const FE = process.env.FRONTEND_URL
    try {

        const { id, displayName, emails } = req.user
        const email = emails?.[0]?.value?.toLowerCase()
        
        if (!email || emails[0].verified === false) {
            
            return res.redirect(`${FE}/login?error=google_email_unverified`)

        }

        let user = await userModel.findOne({googleId : id}) || await userModel.findOne({email})

        if (!user) {
            
            const username = await generateUniqueUsername(displayName , email)
            user = await userModel.create({username , email , googleId : id , verified : true})

        }else if (!user.googleId) {
            if(!user.verified) user.password = undefined ;
            user.googleId = id
            user.verified = true
            await user.save()
        }else if (user.googleId !== id) {
            return res.redirect(`${FE}/login?error=google_account_mismatch`)
        }

        const token = jwt.sign({
            id: user._id,
            username: user.username,
        }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie("token", token)

        return res.redirect(`${FE}/`)
    
    } catch (error) {
     
        console.error('Google Auth Error:' ,error)
        return res.redirect(`${FE}/login?error=google_auth_failed`)

    }
}