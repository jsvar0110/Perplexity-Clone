import { useDispatch } from "react-redux"
import { register, login, getMe , logOut} from "../service/auth.api.js"
import { setUser, setLoading, setError } from "../auth.slice.js"
import { setChats , setCurrentChatId} from '../../chat/chat.slice.js'

export function useAuth() {

    const dispatch = useDispatch()

    async function handleRegister({ email, username, password }) {

        try {
            dispatch(setLoading(true))
            const data = await register({ email, username, password })
        } catch (error) {
            dispatch(setError(error.response?.data.message || "Registration failed"))
            throw error
        } finally {
            dispatch(setLoading(false))
        }

    }


    async function handleLogin({ email, password }) {

        try {
            dispatch(setLoading(true))
            const data = await login({ email, password })
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.response?.data.message || "Login failed"))
        } finally {
            dispatch(setLoading(false))
        }

    }



    async function handleGetMe() {

        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.response?.data.message || "Failed to fetch your data"))
        } finally {
            dispatch(setLoading(false))
        }

    }



    async function handleLogOut(){

        try {
            
            await logOut()

        } catch (err) {
            console.log("logOut failed: ", err)
        } finally {
            dispatch(setUser(null))
            dispatch(setChats({}))
            dispatch(setCurrentChatId(null))
        }


    }




    return{
        handleRegister ,
        handleLogin ,
        handleGetMe ,
        handleLogOut ,
    }

}
