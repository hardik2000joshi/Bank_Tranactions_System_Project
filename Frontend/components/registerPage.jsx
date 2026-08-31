import { useState } from "react";
export function RegisterPage(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const [message, setMessage] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:3003/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                name,
                email,
                password
            })
        })

        const data = await response.json();
        if(!response.ok){
            console.log(data.message);
            return;
         }

         setMessage(data.message)
        console.log(data);
        console.log("Registration Successful");
    }
    return(
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h1 className="text-2xl font-bold mb-4">
                Registration Page - Sign Up
            </h1>

            <form action="" onSubmit={handleRegister}>
                <div className="mb-5">
                <label className="text-gray-700 text-sm font-bold mb-2">
                    Name
                </label>
                <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="border rounded w-full py-2 px-3 text-gray-700 focus: outline-none"
                />
                </div>

                <div className="mb-5">
                <label className="text-gray-700 text-sm font-bold mb-2">
                    Email
                </label>
                <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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
                className="border rounded w-full py-2 px-3 text-gray-700 focus: outline-none"
                />
                </div>

                <div className="flex flex-col items-center justify-center">
                <button type="submit" className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
                    Create Account
                </button>
                <button type="button" className="bg-green-500 hover:bg-green-500 text-white font-bold py-2 px-4 rounded mt-2 focus:outline-none">
                    Cancel
                </button>
                </div>
            </form>

            <p className="text-sm text-gray-600 mt-2">
                Already have an account?
                <a href="/login" className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:shadow-outline">
                    Log in
                </a>
            </p>

            {
                message && (
                    <p className="mt-4 rounded-lg bg-green-100 px-4 py-3 text-center font-medium text-green-700">{message}</p>
                )
            }
            </div>
        </div>
    );
}