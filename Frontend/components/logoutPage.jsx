import { useState } from "react";

export function LogoutPage(){
    const [message, setMessage] = useState("");
    const handleLogout = async() => {
        const response = await fetch(
            "http://localhost:3003/api/auth/logout", {
                method: "POST",
                credentials: "include"
            }
        );
        const data = await response.json();
         if (!response.ok) {
                console.log(data.message);
                return;
            }
            setMessage(data.message);
            console.log(data);
    }
    return(
        <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-12 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-4">
                Logging out from exiting account
            </h1>
            <p className="text-gray-600 mb-6">
                Welcome back, for logging out click on logout button 
            </p>
            <button onClick={handleLogout} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none">
                Logout
            </button>

            {message && (
                <p className="mt-4 rounded-lg bg-green-100 px-4 py-3 text-center font-medium text-green-700">{message}</p>
            )}
            </div>
        </div>
    )
}