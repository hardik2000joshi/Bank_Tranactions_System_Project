import { useState } from "react";
import { useNavigate } from "react-router-dom";
export function LoginPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async(e) => {
        try {
        e.preventDefault();
        const response = await fetch("http://localhost:3003/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                        email,
                        password
                    })
        })

        const data = await response.json();

            if (!response.ok) {
                console.log(data.message);
                return;
            }

            setMessage(data.message)
            console.log(data);
            console.log("Login successful");

            navigate("/accounts");
        }
        catch(error){
            console.log("unable to login");
        }
    }
    

    return(
        <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h1 className="text-2xl font-bold mb-4">
                Log in to your account
            </h1>
            <p className="text-gray-600 mb-6">
                Welcome back, we hope you're <br /> having a great day.
            </p>

            <form action="" onSubmit={handleLogin}>
                <div className="mb-5">
                    <label className="text-gray-700 text-sm font-bold mb-2">
                       Email 
                    </label>
                    <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email"
                    required
                    className="border rounded w-full py-2 px-3 text-gray-700 focus: outline-none"
                    />
                </div>

                <div className="mb-5">
                    <label className="text-gray-700 text-sm font-bold mb-2">
                        Password
                    </label>
                    <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="border rounded w-full py-2 px-3 text-gray-700 focus: outline-none"
                    />
                </div>

                <div className="flex flex-col items-center justify-center">
                    <div className="flex justify-center mb-4 space-x-4">
                    <button type="submit" className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none">
                        Login
                    </button>
                    <button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none mr-4">
                        Cancel
                    </button>
                    </div>
                </div>
            </form>

            <p className="text-sm text-gray-600 mt-2">
                Don't have an account?
                <a href="/" className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:shadow-outline">
                    Sign up
                </a>
            </p>

             {message && (
                <p className="mt-4 rounded-lg bg-green-100 px-4 py-3 text-center font-medium text-green-700">{message}</p>
            )}

            </div>
        </div>
    )
}