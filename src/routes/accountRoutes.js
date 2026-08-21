const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const account = require("../controller/accountController");
const router = express.Router();
router.post("/", authMiddleware.authMiddleware, account.createAccount);

// get all accounts:
router.get("/", authMiddleware.authMiddleware, account.getUserAccountsController)

// get balance
router.get("/balance/:accountId", authMiddleware.authMiddleware, account.getAccountsBalanceController)
module.exports = router;