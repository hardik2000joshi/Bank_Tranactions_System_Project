import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export function AccountPage(){
    const [accounts, setAccounts] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [balance, setBalance] = useState({});
    const navigate = useNavigate();

    const getAccounts = async() => {
        try{
            const response = await fetch("http://localhost:3003/api/account/", {
                method: "GET",
                credentials: "include"
            });
            const data = await response.json();
            if(!response.ok){
                setError(data.message);
                return;
            }
            setAccounts(data.accounts);
        }
        catch(error){
            setError("unable to fetch accounts");
        }
    }
    const createAccount = async() => {
        try{
        const response = await fetch(
            "http://localhost:3003/api/account/", {
                method: "POST",
                credentials: "include"
            }
        );
        const data = await response.json();
        if(!response.ok){
            setError(data.message);
            return;
        }


        setMessage(data.message);
        console.log(data);
        getAccounts();
    }
    catch(error){
        setError("unable to create account");
    }
    }


    const getBalance = async (accountId) => {
        try {
            const response = await fetch(
                `http://localhost:3003/api/account/balance/${accountId}`,{
                    method: "GET",
                    credentials: "include"
                }
            );
            const data = await response.json();
            if(!response.ok){
                setError(data.message);
                return;
            }

            setBalance((previousBalance) => ({
                ...previousBalance,
                [accountId]: data.balance
            }));
        }
        catch(error){
            setError("Unable to fetch balance");
        }
    }

    useEffect(() => {
        getAccounts();
    }, []);

    return(
        <div className="min h-screen bg-gray-100p-8 "> {/* h-screen: height: 100vh  */}
        <div className="mx-auto max-w-5xl">
            <h1 className="mb-8 text-3xl font-bold text-gray-800">
                My Accounts
            </h1>

           <div className="mb-8 flex gap-4">

            {/* Create Account */}
            <button
            onClick={createAccount}
            className="mb-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
                Create New Account
            </button>

            <button 
            onClick={() => navigate("/transactions")}
            className="mb-8 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
            >
                Transactions
            </button>

            <button
            onClick={() => navigate("/login")}
            className="mb-8 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
                Back
            </button>
            </div>


            {/* Messages */}
            {
                message && (
                    <div className="mb-6 rounded-lg bg-green-100 px-4 py-3 font-medium text-green-700">
                        {message}
                    </div>
                )
            }

            {error && (
                <div className="mb-6 rounded-lg bg-red-100 px-4 py-3 font-medium text-red-700">
                    {error}
                </div>
            )}

            {/* Accounts */}
            <div className="grid gap-6 md:grid-cols-2">
                {accounts.map((account) => {
                    return(
                    <div key={account._id}
                    className="rounded-xl bg-white p-6 shadow-md"
                    >
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">
                            Account
                        </h2>
                        <p className="mb-2 text-sm text-gray-500">
                            Account ID
                        </p>

                        <p className="mb-4 break-all font-mono text-sm text-gray-700">
                            {account._id}
                        </p>

                        <p className="mb-2 text-sm text-gray-500">
                            status
                        </p>

                        <p className="mb-4 font-semibold text-green-600">
                            {account.status}
                        </p>

                        <p className="mb-2 text-sm text-gray-500">
                            currency
                        </p>

                        <p className="mb-4 font-semibold">
                            {account.currency}
                        </p>

                        {balance[account._id] !==undefined && (
                            <div className="mb-4 rounded-lg bg-blue-50 p-4">
                                <p className="text-sm text-gray-500">
                                    Available Balance
                                </p>
                                <p className="text-2xl font-bold text-blue-700">
                                    {balance[account._id]}
                                </p>
                            </div>
                        )}

                        <button onClick={() => getBalance(account._id)}
                        className="rounded-lg bg-gray-800 px-4 py-2 font-medium text-white hover:bg-gray-900"
                        >
                            Check Balance
                        </button>
                    </div>
                    )
                })}
            </div>

            {accounts.length === 0 && (
                <div className="rounded-xl bg-white p-8 text-center shadow">
                    <p className="text-gray-500">
                        No accounts found. Create an account to get started.
                    </p>
                </div>
    )}
            </div>
        </div>
    )
}