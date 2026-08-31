const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const tokenBlackList = require("../models/blacklistModel");
async function authMiddleware(req, res, next){
   
    const token = req.cookies.JWT_Token || req.headers.authorization?.split(" ")[1];  // check if there is token in cookies or not
     console.log("Cookies:", req.cookies);
    // console.log("Auth Header:", req.headers.authorization);
    if(!token){     
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        })
    }

    const isBlacklisted = await tokenBlackList.findOne({token})

    if(isBlacklisted){
        return res.status(401).json({
            message: "unauthorized access, token is invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)  // verifying the token: is token correct or not
        const user = await userModel.findById(decoded.userId)
        req.user = user
        return next()
    }
    catch(error){
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }
}

// along with auth middleware we also have to create auth system user middleware to create initial funds transaction from system user
async function authSystemUserMiddleware(req, res, next){

   

    const token = req.cookies.JWT_Token
    if(!token){
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        })
    }

     const isBlacklisted = await tokenBlackList.findOne({token})

    if(isBlacklisted){
        return res.status(401).json({
            message: "unauthorized access, token is invalid"
        })
    }

    

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.userId).select("+systemUser")
        if(!user.systemUser){
            return res.status(403).json({
                message: "Forbidden access, not a system user"
            })
    }
    req.user = user
    return next()
}

catch(error){
return res.status(401).json({
    message: "unauthorized access, token is invalid"
})
}
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
}