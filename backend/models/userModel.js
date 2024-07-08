const mongoose = require("mongoose");
const validator = require("validator");
//used for encrypting password
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 character"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid Email"]

    },
    password: {
        type: String,
        required: [true, "Please enter the password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }

        
    },
    role: {
        type: String,
        default: "User",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,





});
userSchema.pre("save", async function (next) {
    //here we havent used arrow function kuki this use krna tha
    if (!this.isModified("password")) {
        next();
    }


    this.password = await bcrypt.hash(this.password, 10);



});

//jwt token jason web token isko apan ne cookie me save kia
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};
//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
// generating password reset token
userSchema.methods.getResetPasswordToken = function () {
  //generating token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // hash and add to user schema
     this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;

};






module.exports = mongoose.model("User", userSchema);