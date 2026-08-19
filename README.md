# Banking Transaction Backend

This repository contains the backend implementation of a banking transaction system that supports users, accounts, fund transfers, transactions, and transaction ledgers.

## Features

* User registration and login
* User account creation
* Transfer funds from one account to another
* Debit one account and credit another account
* Transaction records and ledger management
* Account balance API
* JWT-based authentication
* Authentication middleware for:

  * Checking whether a token exists
  * Verifying whether the token is valid
* Register API
* Login API
* Transactions API
* Balance API
* Email notifications for:

  * Successful registration
  * Successful transactions
  * Failed transactions

## Technologies & Packages

* Node.js
* Express.js
* MongoDB & Mongoose
* JSON Web Token (JWT)
* bcryptjs
* Nodemailer
* cookie-parser
* dotenv
* Nodemon

## Email Service

Nodemailer is used to send confirmation emails for user registration and transaction status, including successful and failed transactions.
