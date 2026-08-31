const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/authRoutes");
const accountRouter = require("./routes/accountRoutes");
const transaction = require("./routes/transactionRoutes");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter);
app.use("/api/transactions", transaction);

module.exports = app;