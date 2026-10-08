import { io } from "socket.io-client";
import { API_URL } from "../../../config/api.js"

export const initializeSocketConnection = () => {

    const socket = io( API_URL , {
        withCredentials : true
    })

    socket.on("connect" , () => {
        console.log("Connected to Socket.io server")
    })

}