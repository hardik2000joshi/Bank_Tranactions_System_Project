const transactionModel = require("../models/transactionModel");
const ledgerModel = require("../models/ledgerModel");
const emailService = require("../services/emailService");
const receiptService = require("../services/receiptService");
const accountModel = require("../models/accountModel");
const mongoose = require("mongoose");
/*
* Create a new transaction
* THE 10-STEP TRANSFER FLOW:
     * 1. Validate request
     * 2. Validate idempotency key
     * 3. Check account status
     * 4. Derive sender balance from ledger
     * 5. Create transaction (PENDING)
     * 6. Create DEBIT ledger entry
     * 7. Create CREDIT ledger entry
     * 8. Mark transaction COMPLETED  - save
     * 9. Commit MongoDB session
     * 10. Send email notification
     */

async function createTransaction(req, res){
    // First Step - validate request
    // Idempotency key - to ensure amount not deducted twice for same payment or same transaction we ensure that through idempotency key
const {fromAccount, toAccount, amount, idempotencyKey} = req.body
if(!fromAccount || !toAccount || !amount || !idempotencyKey){  // to check is fromAccount, toAccount, amount and idempotency key are there or not
    return res.status(400).json({
        message: "fromAccount, toAccount, amount, idempotencyKey are required"
    })
}

// fromAccount
const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
})

// toAccount
const toUserAccount = await accountModel.findOne({
    _id: toAccount,
})

if(!fromUserAccount || !toUserAccount){
    return res.status(400).json({
        message: "Invalid fromAccount or toAccount",
    })
    
}

// Step-2: validate idempotency key
// to ensure same amount not deducted twice for same transaction

const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey: idempotencyKey
})

if (isTransactionAlreadyExists){
    if(isTransactionAlreadyExists.status === "COMPLETED"){
        return res.status(200).json({
            message: "Transaction alredy processed or completed",
            transaction: isTransactionAlreadyExists
        })
    }

    if(isTransactionAlreadyExists.status === "PENDING"){
        return res.status(200).json({
            message: "Transaction is still in process",
        })
    }

    if(isTransactionAlreadyExists.status === "FAILED"){
        return res.status(500).json({
            message: "Transaction processing failed, please retry"
        })
    }

    if(isTransactionAlreadyExists.status === "REVERSED"){
        return res.status(500).json({
            message: "Transaction was reversed, please retry"
        })
    }
}

// check account status: is account active,  frozen or closed: account must be active

if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status!=="ACTIVE"){
    return res.status(400).json({
        message: "Both fromAccount and toAccount must be active to process the transaction"
    })
}

// derive sender balance from ledger: is balance in account sufficient or not
const balance = await fromUserAccount.getBalance()
if(balance < amount){
    return res.status(400).json({
        message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`
    })
}


    // create transaction
    try{
    const session = await mongoose.startSession()
        session.startTransaction()
        const transaction = await transactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        }], {session})

        const transactions = transaction[0];

        // create debitLedgerEntry
        const debitLedgerEntry = await ledgerModel.create([{
            account: fromAccount,
            amount: amount,
            transaction: transactions._id,
            type: "DEBIT"
        }], {session})

        // create creditLedgerEntry
        const creditLedgerEntry = await ledgerModel.create([{
            account: toAccount,
            amount: amount,
            transaction: transactions._id,
            type: "CREDIT"
        }], {session})

        console.log("DEBIT LEDGER:", debitLedgerEntry);
console.log("CREDIT LEDGER:", creditLedgerEntry);
console.log("TRANSACTION COMMITTED");

        // transaction status completed
        await transactionModel.findOneAndUpdate(
            {
                _id: transactions._id
            },
            {
                status: "COMPLETED"
            },
            {
                session
            }
        )

        transactions.status = "COMPLETED";

        // commit mongodb session
        await session.commitTransaction()  // Commits the currently active transaction in this session.

        // end mongodb session
        session.endSession()

        const populatedTransaction = await transactionModel
    .findById(transactions._id)
    .populate({
        path: "fromAccount",
        populate: {
            path: "user",
            select: "name email"
        }
    })
    .populate({
        path: "toAccount",
        populate: {
            path: "user",
            select: "name email"
        }
    });

        // send email notification
        await emailService.sendTransactionEmail(
            req.user.email,
            req.user.name,
            amount,
            toAccount
        )

        return res.status(201).json({
            message: "Transaction Completed Successfully",
            transaction: populatedTransaction
        })
        }
    catch(error){
        console.log("TRANSACTION ERROR:", error);
          return res.status(400).json({
            message: "Transaction is Pending due to some issue, please retry after sometime",
        })
    }
    }

async function createInitialFundsTransaction(req, res){  // to whose account funds transferred, how much amount transferred and idempotency key
const {toAccount, amount, idempotencyKey} = req.body
if(!toAccount || !amount || !idempotencyKey){
    return res.status(400).json({
        message: "toAccount, amount and idempotencyKey are required"
    })
}

const toUserAccount = await accountModel.findOne({
    _id: toAccount,
})
if(!toUserAccount){
    return res.status(400).json({
        message: "Invalid Account"
    })
}

const fromUserAccount = await accountModel.findOne({
    user: req.user._id,
})
console.log(req.user);

if(!fromUserAccount){
    return res.status(400).json({
        message: "System user account not found"
    })
}

const session = await mongoose.startSession()
 // for creating transactions we start the session
 session.startTransaction()  // startTransaction - Starts a new transaction with the given options.

 const transaction = new transactionModel({
    fromAccount: fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status: "PENDING"
 })

 const debitLedgerEntry = await ledgerModel.create([{
    account: fromUserAccount._id,
    amount: amount,
    transaction: transaction._id,
    type: "DEBIT"
 }], {session})

 const creditLedgerEntry = await ledgerModel.create([{
    account: toAccount,
    amount: amount,
    transaction: transaction._id,
    type: "CREDIT"
 }], {session})

// save(): saves the entire state of the canvas by pushing the current state onto a stack.
transaction.status = "COMPLETED"
await transaction.save({session})

await session.commitTransaction()  // Commits the currently active transaction in this session.
session.endSession() // Frees any client-side resources held by the current session. If a session is in a transaction, the transaction is aborted.

const populatedTransaction = await transactionModel
    .findById(transaction._id)
    .populate({
        path: "fromAccount",
        populate: {
            path: "user",
            select: "name email"
        }
    })
    .populate({
        path: "toAccount",
        populate: {
            path: "user",
            select: "name email"
        }
    });

return res.status(201).json({
    message: "Initial funds transaction completed successfully",
    transaction: populatedTransaction
})
}

async function downloadTransactionReceipt(req, res) {
    try {
        const { transactionId } = req.params;
        console.log("1. Transaction ID:", transactionId);
        const transaction = await transactionModel
            .findById(transactionId)
            .populate({
                path: "fromAccount",
                populate: {
                    path: "user",
                    select: "name email"
                }
            })
            .populate({
                path: "toAccount",
                populate: {
                    path: "user",
                    select: "name email"
                }
            });
             console.log("2. Transaction fetched:", transaction);

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        console.log("3. Transaction status:", transaction.status);

        if (transaction.status !== "COMPLETED") {

            return res.status(400).json({
                message: "Receipt is available only for completed transactions"
            });

        }
        console.log("4.Calling receipt service" );

        const receipt = await receiptService.generateTransactionReceipt(
            transaction
        );

         console.log("5. Receipt generated:", receipt);

        return res.status(200).json({
            message: "Transaction receipt generated successfully",
            receiptUrl: receipt.url
        });

    } catch (error) {

        console.error("RECEIPT ERROR:", error);

        return res.status(500).json({
            message: "Unable to generate transaction receipt"
        });

    }
}
module.exports = {
    createTransaction,
    createInitialFundsTransaction,
    downloadTransactionReceipt
}