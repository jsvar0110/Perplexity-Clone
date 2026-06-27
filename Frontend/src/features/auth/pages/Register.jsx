import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";

const Input = ({
    icon,
    type,
    name,
    value,
    onChange,
    placeholder,
}) => {
    const [focused, setFocused] = useState(false);

    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
                {icon}
            </span>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={`w-full bg-[#ffffff0a] border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 outline-none transition-all ${
                    focused
                        ? "border-[#31b8c6]"
                        : "border-[#31b8c633]"
                }`}
            />
        </div>
    );
};

export default function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const { handleRegister } = useAuth();

    const onChange = (e) =>
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await handleRegister({
                username: form.username,
                email: form.email,
                password: form.password,
            });

            alert(
                "Registration successful! Please verify your email before logging in."
            );

            navigate("/login");
        } catch (error) {
            console.error(error);

            alert(
                error?.response?.data?.message ||
                "Registration failed. Please try again."
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#061216] p-4">
            <div className="w-full max-w-md bg-[#0d1b20] border border-[#31b8c633] rounded-3xl p-8 shadow-[0_0_40px_rgba(49,184,198,0.2)]">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#31b8c6] to-[#1d6f78] mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                        🚀
                    </div>

                    <h1 className="text-3xl font-bold text-white">
                        Create Account
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Register to get started
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={onChange}
                        placeholder="Enter username"
                        icon={<span>👤</span>}
                    />

                    <Input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="Enter email"
                        icon={<span>📧</span>}
                    />

                    <Input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={onChange}
                        placeholder="Enter password"
                        icon={<span>🔒</span>}
                    />

                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-linear-to-r from-[#31b8c6] to-[#1d6f78] text-white font-semibold hover:scale-[1.02] transition-all"
                    >
                        Create Account
                    </button>
                </form>

                <p className="text-center text-slate-400 mt-6">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-[#31b8c6] transition hover:text-[#45c7d4]"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}