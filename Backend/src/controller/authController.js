const userLogin = require("../models/userModel")
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const bcrypt = require("bcryptjs");
const emailService = require("../services/emailService");
const tokenBlackList = require("../models/blacklistModel");
async function registerUser(req, res){
    const {name, email, password} = req.body;
    const isUserExists = await userLogin.findOne({
        email: email
    })

    if(isUserExists){
        return res.status(409).json({
            message: "User already exists with this email",
            status: "failed",
        })
    }

    const user = await userLogin.create({
        name,
        email,
        password,
    })

    const token = jwt.sign({
        userId: user._id
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "3Days"
})
res.cookie("JWT_Token", token)
res.status(201).json({
    message: "User registered successfully",
    user: {
        _id: user._id,
        name: user.name,
        email: user.email,
    },
    token
})

await emailService.sendRegistrationEmail(user.email, user.name)
}

async function loginUser(req, res){
    const {email, password} = req.body
    const user = await userLogin.findOne({
        email
    }).select("+password")
    if(!user){
        return res.status(401).json({
            message: "Email or password is invalid - Invalid Credentials"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(401).json({
            message: "Invalid Credentials",
        })
    }

     const token = jwt.sign({
        userId: user._id
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "3Days"
})
res.cookie("JWT_Token", token)
res.status(200).json({
    message: "User Logged in successfully",
    user: {
        _id: user._id,
        name: user.name,
        email: user.email,
    },
    token
})


}

async function logoutUser(req, res){
    const token = req.cookies.JWT_Token;
    console.log("TOKEN FROM COOKIE:", token);

    if(!token){
        return res.status(200).json({
            message: "user logged out successfully"
        })
    }

    const blacklistedToken = await tokenBlackList.create({
        token: token
    })

    console.log("BLACKLISTED TOKEN:", blacklistedToken);

    res.clearCookie("JWT_Token");
    res.status(200).json({
        message: "User logged out successfully"
    })
}
module.exports = {registerUser, loginUser, logoutUser}