const transactionModel = require("../models/transactionModel");
const ledgerModel = require("../models/ledgerModel");
const emailService = require("../services/emailService");
const accountModel = require("../models/accountModel");

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
     * 8. Mark transaction COMPLETED
     * 9. Commit MongoDB session
     * 10. Send email notification
     */

async function createTransaction(req, res){
    // First Step - validate request
    // Idempotency key - to ensure amount not deducted twice for same payment or same transaction we ensure that through idempotency key
const {fromAccount, toAccount, amount, idempotencyKey} = req.body
if(!fromAccount || !toAccount || !amount || !idempotencyKey){
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
        message: "Invalid fromAccount or toAccount"
    })
}

// Step-2: validate idempotency key




const transaction = await transactionModel.create({
    fromAccount,
    toAccount,
    amount,
    idempotencyKey
})
}

module.exports = {createTransaction}