import jwt, { decode } from "jsonwebtoken";
import userModel from "../models/user.model.js";

export function authUser( req , res , next ) {
    

    const token = req.cookies?.token 

    if (!token) {
        
        return res.status(401).json({
            message : "Unauthorized" , 
            success : false ,
            err : "No token provided"
        })

    }


    try {
        
        const decoded = jwt.verify(
            token , 
            process.env.JWT_SECRET
        )

        const user = userModel.findById(decoded.id).select("tokenVersion")

        if (!user) {
            return res.status(401).json({
                message: "unauthorized" ,
                success : false ,
                err : "User not found"
            })
        }

        if (decoded.tokenVersion !== (user.tokenVersion ?? 0)) {
            
            return res.status(401).json({
                message: "Session expired. Please log in again.",
                success: false,
                err: "Session revoked",
            });
        }

        req.user = decoded 

        next()


    } catch (err) {
        
        if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError" || err.name === "NotBeforeError") {
            return res.status(401).json({
                message: "Unauthorized",
                success: false,
                err: "Invalid or expired token",
            });
        }

        console.error("Authentication error " , err)
        
        return res.status(500).json({
            message: "Authentication service unavailable" ,
            success: false 
        })
    }

}