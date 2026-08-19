require("dotenv").config()
const app = require("./src/app");
const connectToDB = require("./src/database/db");
connectToDB()
app.listen(3003, () => {
    console.log("Server is running on port 3003");
})