const mongoose = require("mongoose");

function connectToDB(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to Database...");
    })
    .catch(error => {
        console.log("Error connecting to db");
        process.exit(1)
    })
}

module.exports = connectToDB;