import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";
import Dashboard from "../features/chat/pages/Dashboard.jsx";
import Protected from "../features/auth/components/Protected.jsx";
import PrivacyPolicy from "../features/auth/pages/PrivacyPolicy.jsx";
import ForgotPassword from "../features/auth/pages/ForgotPassword.jsx";
import ResetPassword from "../features/auth/pages/ResetPassword.jsx";
import { Navigate } from "react-router";

export const router = createBrowserRouter([

    {
        path: "/login",
        element: <Login />
    }
    ,
    {
        path: "/register",
        element: <Register />
    }
    ,
    {
        path: "/forgot-password",
        element: <ForgotPassword />
    }
    ,
    {
        path: "/reset-password",
        element: <ResetPassword />
    }
    ,
    {
        path: "/",
        element: <Protected> <Dashboard /> </Protected>

    }
    ,
    {
        path  : "/dashboard" ,
        element : <Navigate to={"/"} replace />
    }
    ,
    {
        path: "/privacy-policy",
        element: <PrivacyPolicy />
    }

])