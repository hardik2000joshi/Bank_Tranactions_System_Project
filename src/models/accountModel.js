const mongoose = require("mongoose");
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
const accountModel = mongoose.model("account", accountSchema);
module.exports = accountModel;