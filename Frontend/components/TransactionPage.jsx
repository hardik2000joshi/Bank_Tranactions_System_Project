import { useState } from "react";
import { useNavigate } from "react-router-dom";
export function TransactionPage(){
    const [fromAccount, setFromAccount] = useState("");
    const [toAccount, setToAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [transaction, setTransaction] = useState(null);
    const navigate = useNavigate();

    // funds transfer button
    const handleTransfer = async(e) => {
        e.preventDefault();
        if(!fromAccount || !toAccount || !amount){
            setError("Please select fromAccount, toAccount and enter amount to initiate transfer");
            return;
        }
        const idempotencyKey = crypto.randomUUID();
        try {
            const response = await fetch(
                "http://localhost:3003/api/transactions/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        fromAccount,
                        toAccount,
                        amount: Number(amount),
                        idempotencyKey
                    })
                }
            )

            const data = await response.json();
            console.log("Transaction Response: ", data);

            if(!response.ok){
                setError(data.message);
                return;
            }

            setMessage(data.message);
            setTransaction(data.transaction);

            // clear form after successful transaction
            setFromAccount("");
            setToAccount("");
            setAmount("");
        }
        catch(error){
            console.error("Transaction Error: ", error);
            setError("Unable to process transaction");
                }
    };

    const downloadRecipt = async() => {
        try {
            setError("");
            const response = await fetch(
                `http://localhost:3003/api/transactions/${transaction._id}/receipt`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const data = await response.json();
            if(!response.ok){
                setError(data.message);
                return;
            }
            window.open(data.receiptUrl, "_blank");
        }
        catch(error){
            console.error("Receipt Error:", error);
        setError("Unable to download transaction receipt");
        }
    };

    return(
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-2xl">
                <button onClick={() => navigate("/accounts")} className="mb-8 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
                    Back
                </button>
                <h1 className="mb-8 text-3xl font-bold text-gray-800">
                    Transfer Funds Dashboard
                </h1>
                <p className="mt-2 text-gray-600">
                    Transfer funds from one user account to another user account
                </p>

                

                {/* Transfer form */}

                <div className="rounded-xl bg-white p-8 shadow-md">
                    <h2 className="mb-6 text-2xl font-semibold text-gray-800">
                Transfer funds from the balance amount available
            </h2>
                    <form onSubmit={handleTransfer}>
                        {/* From Account */}
                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                From Account
                            </label>
                            <input 
                            type="text"
                            value={fromAccount}
                            onChange={(e) => setFromAccount(e.target.value)} 
                            placeholder="enter fromAccount Id"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                            required
                            />
                        </div>

                        {/* To Account */}
                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                To Account
                            </label>

                            <input 
                            type="text"
                            value={toAccount}
                            onChange={(e) => setToAccount(e.target.value)}
                            placeholder="Enter Receiver Account ID"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                            required
                            />
                        </div>

                        {/* Amount */}
                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Amount
                            </label>

                            <input 
                            type="number"
                            min="1"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter Amount"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                            required
                            />
                        </div>

                        {/* Transfer button */}
                        <button 
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            Transfer Funds
                        </button>
                    </form>
                </div>

                {/* Messages */} 
                {message && ( 
                    <div className="mb-6 rounded-lg bg-green-100 px-4 py-3 font-medium text-green-700">
                         {message} 
                         </div> 
                        )} 
                        {error && (
                            <div className="mb-6 rounded-lg bg-red-100 px-4 py-3 font-medium text-red-700">
                                 {error} 
                                 </div> 
                                )}

                                 {transaction && (
            <div className="mb-8 rounded-xl bg-white p-6 shadow-md mt-6">
                <h2 className="mb-6 text-2xl font-bold text-gray-800">
                    Transaction Details
                </h2>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">
                            Transaction ID
                        </p>
                        <p className="break-all font-mono text-sm text-gray-800">
                            {transaction._id}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            From Account
                        </p>
                        <p className="break-all font-mono text-sm text-gray-800">
                            {transaction.fromAccount._id}
                        </p>
                        <p className="font-semibold text-gray-800">
                            {transaction.fromAccount.user.name}
                        </p>
                        <p className="font-semibold text-gray-800">
                            {transaction.fromAccount.user.email}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            To Account
                        </p>
                        <p className="break-all font-mono text-sm text-gray-800">
                            {transaction.toAccount._id}
                        </p>
                        <p className="font-semibold text-gray-800">
                            {transaction.toAccount.user.name}
                        </p>
                        <p className="font-semibold text-gray-500">
                            {transaction.toAccount.user.email}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Amount Transferred
                        </p>
                        <p className="text-2xl font-bold text-blue-700">
                            {transaction.amount}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            status
                        </p>
                        <p className="font-semibold text-green-600">
                            {transaction.status}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Idempotency Key
                            </p>
                            <p className="break-all font-mono text-sm text-gray-700">
                                {transaction.idempotencyKey}
                            </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Transaction Date
                            </p>
                            <p>
                                {new Date(transaction.createdAt).toLocaleString()}
                                </p>
                    </div>

                    <div>
                        <button
                        type="button"
                        onClick={downloadRecipt}
                        className="mt-6 w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
                        >
                            Download Recipt
                        </button>
                    </div>
                </div>
            </div>
         )}
            </div>
        </div>
    )
}