const mongoose = require("mongoose");
const ledgerModel = require("./ledgerModel");
const accountSchema = new mongoose.Schema({
    user:{
        // mongoose is imported module
        // .Schema is a class
        // .Types is static property on that class
        // .ObjectId is one of the type of Schema Class 
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
                required: [true, "Account must be associated with a user"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "FROZEN", "CLOSED"],
            message: "Status can be ACTIVE, FROZEN or CLOSED",
        },
        default: "ACTIVE"
    },
    currency: {
        type: String,
        required: [true, "Currency is required for creating an account"],
        default: "INR"
    }
}, {
    timestamps: true
})

accountSchema.index({
    user:1, 
    status:1
})   // when we are creating index on two fields - compound index


// ledger entries which has type debit: + sumup seperatley and ledger entries which has type credit: + sumup seperatley and then debit sum - credit sum
accountSchema.methods.getBalance = async function(){
    const balanceData = await ledgerModel.aggregate([
        {
            $match: {  // Get only ledger entries belonging to this account
                account: this._id
            }
        },
        {
            $group: {   // group - combine and calculate
                _id: null,
                totalDebit: {
                    $sum: {  // $sum - add all the values
                        $cond: [   // * cond - if-else condition 
                            {$eq: [     // $eq - check equality
                                "$type", "DEBIT"  // is type equal to debit
                            ]},
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    "$type", "CREDIT"
                                ]
                            },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: { // Choosing what fields you want in the final result.
                _id: 0,
                balance: {
                    $subtract: [
                        "$totalCredit",
                        "$totalDebit"
                    ]
                }
            }
        }
    ])

    if(balanceData.length === 0){
        return 0
    }

    return balanceData[0].balance
}
const accountModel = mongoose.model("account", accountSchema);
module.exports = accountModel;