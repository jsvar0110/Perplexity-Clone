import { Router } from "express";
import { getMe, login, register, verifyEmail, googleCallback } from "../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";
import { authUser } from "../middlewares/auth.middleware.js";
import passport from "passport";

const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */


authRouter.post('/register', registerValidator, register)



/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 * @body { email, password }
 */

authRouter.post('/login', loginValidator, login)


authRouter.get('/get-me', authUser, getMe)

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 * @query { token }
 */


authRouter.get('/verify-email', verifyEmail)

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))

authRouter.get('/google/callback', passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
}), googleCallback)

export default authRouter