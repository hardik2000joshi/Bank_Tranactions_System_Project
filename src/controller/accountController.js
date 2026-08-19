const accountModel = require("../models/accountModel");

async function createAccount(req, res){
    const user = req.user;
    const account = await accountModel.create({
        user: user._id
    })

    res.status(201).json({
        message: "Account Created Successfully",
        account
    })
}

module.exports = { 
    createAccount
}