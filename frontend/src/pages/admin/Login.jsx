import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../api/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${API_URL}/api/admin/login`,
                {
                    email,
                    password
                }
            );

            localStorage.setItem("token", response.data.token);

            navigate("/admin/dashboard");
        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div className="min-h-[calc(100vh-73px)] bg-gray-50 px-4 py-12">

            <div className="mx-auto w-full max-w-md">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Admin Login
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Sign in to manage your blog
                    </p>
                </div>

                {/* Login Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                    <form
                        onSubmit={handleLogin}
                        className="space-y-5"
                    >

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
                        >
                            Login
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default Login;