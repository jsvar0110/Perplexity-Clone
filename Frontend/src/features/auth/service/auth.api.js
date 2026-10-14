import axios from 'axios';
import {API_URL} from '../../../config/api.js'

const api = axios.create({

    baseURL: API_URL,
    withCredentials : true

});

export async function register({ username , email , password }) {
    
    const response = await api.post('/api/auth/register' , { username , email , password })

    return response.data

}

export async function login({ email , password }) {
    
    const response = await api.post('/api/auth/login' , { email , password })

    return response.data

}

export async function getMe() {
    
    const response = await api.get('/api/auth/get-me')

    return response.data

}

export async function logOut(){
 
    const response = await api.post('/api/auth/logout')
    return response.data

}

export async function forgotPassword({email}){

    const response = await api.post('/api/auth/forgot-password', {email})
    return response.data

}

export async function resetPassword({token , password}) {
    
    const response = await api.post('/api/auth/reset-password', {token , password})
    return response.data

}