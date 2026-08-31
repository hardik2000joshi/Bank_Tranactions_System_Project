import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SystemUserLogin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSystemUserLogin = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Email and password are required");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:3003/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            console.log("System User Login Response:", data);

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setMessage("Admin login successful");

            // Only redirect after successful login
            navigate("/system-dashboard");

        } catch (error) {

            console.error("Admin Login Error:", error);

            setError("Unable to login");

        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">

            <div className="w-96 rounded-lg bg-white p-8 shadow-md">

                <h1 className="mb-4 text-2xl font-bold text-gray-800">
                    Admin Login
                </h1>

                <p className="mb-6 text-gray-600">
                    Login to access the system user account.
                </p>

                {/* Success Message */}

                {message && (
                    <div className="mb-5 rounded-lg bg-green-100 px-4 py-3 font-medium text-green-700">
                        {message}
                    </div>
                )}

                {/* Error Message */}

                {error && (
                    <div className="mb-5 rounded-lg bg-red-100 px-4 py-3 font-medium text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSystemUserLogin}>

                    {/* Email */}

                    <div className="mb-5">

                        <label className="mb-2 block text-sm font-bold text-gray-700">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter admin email"
                            required
                            className="w-full rounded border px-3 py-2 text-gray-700 outline-none focus:border-blue-500"
                        />

                    </div>

                    {/* Password */}

                    <div className="mb-5">

                        <label className="mb-2 block text-sm font-bold text-gray-700">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter admin password"
                            required
                            className="w-full rounded border px-3 py-2 text-gray-700 outline-none focus:border-blue-500"
                        />

                    </div>

                    {/* Login Button */}

                    <button
                        type="submit"
                        className="w-full rounded bg-gray-800 px-4 py-2 font-bold text-white hover:bg-gray-900"
                    >
                        Admin Login
                    </button>

                </form>

                {/* Normal User Login */}

                <p className="mt-6 text-center text-sm text-gray-600">

                    Normal User?

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="ml-2 font-semibold text-blue-600 hover:text-blue-800"
                    >
                        User Login
                    </button>

                </p>

            </div>

        </div>
    );
}