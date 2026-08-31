const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const transaction = require("../controller/transactionController");

const router = express.Router();

// POST API - Creating a new transaction
router.post("/", authMiddleware.authMiddleware, transaction.createTransaction)

// POST API - Create initial funds transaction from system user
router.post("/system/initial-funds", authMiddleware.authSystemUserMiddleware, transaction.createInitialFundsTransaction)

// GET API - get or fetch transaction recipt
router.get("/:transactionId/receipt", authMiddleware.authMiddleware, transaction.downloadTransactionReceipt)
module.exports = router;
