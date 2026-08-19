const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required for creating user"],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
        unique: [true, "Email already exists."]
        },
        name: {
            type: String,
            required: [true, "Name is required for creating an account"]
        },
        password: {
            type: String,
            required: [true, "Password is required for creating an account"],
            minLength: [6, "Password should contain more than 6 character"],
            select: false,
        },
        systemUser: {
            type: Boolean,
            immutable: true,
            default: false,
            select: false
        }
}, {
    timestamps: true   // to get when user created and when user details get updated last time
});

userSchema.pre("save", async function(){  // pre converts password into hash password and stored in database
    if(!this.isModified("password")){
        return;
    }

    // Hashing is a cryptographic algorithm which is used to convert password(plain text) into hash.
    const hash = await bcrypt.hash(this.password, 10) // 10 is cryptographic salt to delay password attacks blocking hackers to crack our account
    this.password = hash;
    return;
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;