import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export function SystemUserDashboard(){
    const [accounts, setAccounts] = useState([]);
    const [toAccount, setToAccount] = useState("");
     const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState(null);

    const navigate = useNavigate();

    // Get accounts
    const getAccounts = async () => {
        try {
            const response = await fetch(
                "http://localhost:3003/api/account/",
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            const data = await response.json();
            if (!response.ok) {
                setError(data.message);
                return;
            }
            setAccounts(data.accounts);
        } catch (error) {
            setError("Unable to fetch accounts");
        }
    };

     // Get accounts when dashboard loads
    useEffect(() => {
        getAccounts();
    }, []);

    // provide initial funds
    const handleInitialFunds = async(e) => {
        e.preventDefault();
        if(!toAccount || !amount){
            setError("please select toAccount and eneter amount");
            return;
        }
        try {
            const idempotencyKey = crypto.randomUUID(); // randomUUID() method of the Crypto interface is used to generate a v4 UUID using a cryptographically secure random number generator.
            const response = await fetch(
                "http://localhost:3003/api/transactions/system/initial-funds", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        toAccount: toAccount,
                        amount: Number(amount),
                        idempotencyKey: idempotencyKey
                    })
                }
            );
            const data = await response.json();
            if(!response.ok){
                setError(data.message);
                return;
            }
            setMessage(data.message);
            setTransaction(data.transaction);

            // refresh accounts
            getAccounts();
        }
        catch(error){
            setError(
                "Unable to process initial funds transaction"
            );
        }
    }

    const downloadReceipt = async () => {
    try {
        const response = await fetch(
            `http://localhost:3003/api/transactions/${transaction._id}/receipt`,
            {
                method: "GET",
                credentials: "include"
            }
        );
        const data = await response.json();
        if (!response.ok) {
            setError(data.message);
            return;
        }
        window.open(data.receiptUrl, "_blank");
    } 
    
    catch (error) {
        console.log(error);
        setError("Unable to download receipt");
    }
};

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-5xl">
                 <button onClick={() => navigate("/system-login")} className="mb-8 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
                    Back
                </button>
                {/* Dashboard Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
                System User Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
                Manage initial funds for user accounts
            </p>
        </div>

        <h2>TEST AFTER HEADER</h2>
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

         {/* Initial Funds Card */}
         <div className="rounded-xl bg-white p-8 shadow-md">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">
                Provide Initial Funds
            </h2>

            <form action="" onSubmit={handleInitialFunds}>
                 <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                    User Account
                </label>

                <input 
                type="text" 
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                placeholder="Enter normal user's account ID"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
                </div>

                <div className="mb-6">

        <label className="mb-2 block text-sm font-semibold text-gray-700">
            Amount
        </label>

        <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            required
        />

    </div>

      <button
      type="submit"
    disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >

                            {loading
                                ? "Processing..."
                                : "Provide Initial Funds"
                            }

                        </button>

            </form>
         </div>

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
                        <p className="font-semibold text-gray-800">
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
                        onClick={downloadReceipt}
                        className="mt-6 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
                        >
                            Downnload Recipt PDF
                        </button>
                    </div>
                </div>
            </div>
         )}

         <div className="mt-8">

                    <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                        User Accounts
                    </h2>

                    <div className="grid gap-6 md:grid-cols-2">

                        {accounts.map((account) => (

                            <div
                                key={account._id}
                                className="rounded-xl bg-white p-6 shadow-md"
                            >

                                <h3 className="mb-4 text-xl font-semibold text-gray-800">
                                    Account
                                </h3>

                                <p className="mb-2 text-sm text-gray-500">
                                    Account ID
                                </p>

                                <p className="mb-4 break-all font-mono text-sm text-gray-700">
                                    {account._id}
                                </p>

                                <p className="mb-2 text-sm text-gray-500">
                                    Status
                                </p>

                                <p className="font-semibold text-green-600">
                                    {account.status}
                                </p>

                                <p className="mt-4 mb-2 text-sm text-gray-500">
                                    Currency
                                </p>

                                <p className="font-semibold text-gray-800">
                                    {account.currency}
                                </p>

                            </div>

                        ))}

                    </div>
                    {accounts.length === 0 && (
                        <div className="rounded-xl bg-white p-8 text-center shadow">
                            <p className="text-gray-500">
                                No accounts found.
                            </p>
                        </div>
                    )}
                    </div>
        </div>
        </div>
    )
}