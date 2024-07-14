const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    DOB: { type: String },
    phoneNumber: { type: String, unique: true },
    address: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    verificationCode:  { type: String, required: false },
    expiresAt: { type: Date, required: false },
    isVerified: { type: Boolean, default: false },
    role: { type: Boolean, default: false },
    
});

const User = mongoose.model('User', userSchema);

module.exports = User;
