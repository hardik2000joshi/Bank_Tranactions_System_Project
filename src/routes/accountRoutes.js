const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const account = require("../controller/accountController");
const router = express.Router();
router.post("/", authMiddleware.authMiddleware, account.createAccount);
module.exports = router;