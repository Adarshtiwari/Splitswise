const bcrypt = require('bcryptjs');
const jwt = require('../utils/jwt');
const User = require('../models/User');
const authService = require('../services/authService');
const logger = require('../utils/logger');
const { addToBlacklist } = require('../utils/blacklist');

const signup = async (req, res) => {
    const { name, email, password, phoneNumber, address, DOB,role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // Generate verification code and expiration time
        const {code,expiresAt} = await authService.generateVerificationCode();
       
        // Create a new user instance
        console.log(" object signup ",{
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            address,
            DOB,
            verificationCode: code,
            expiresAt,
            isVerified:false,
            role
        })
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            address,
            DOB,
            verificationCode: code,
            expiresAt,
            isVerified:false,
            role
        });

        // Save the user to the database
        await newUser.save();


        logger.info(` verfication code ${code}`)
        // Send verification email (not implemented here)
       await authService.sendVerificationCode(email,code,expiresAt)

        res.json({ message: 'User registered successfully. Please verify your email.' });
    } catch (error) {
        logger.error('Error in signup:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { token } = await authService.authenticateUser(email, password);
        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(401).json({ message: error.message });
    }
};

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        logger.info(`otp and email ${JSON.stringify(user)}`)
        logger.info(`otp and verificationCode ${JSON.stringify(user.verificationCode)} otp is ${otp}`)
        console.log("user.verificationCode ", typeof user.verificationCode ,"opt type ",typeof otp)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the OTP matches and is not expired
        if (user.verificationCode !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Check if the OTP is expired
        if (user.expiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Update user status to verified (optional step based on your application logic)

        // Clear the verification code after successful verification (optional)
        user.verificationCode = undefined;
        user.isVerified=true
        await user.save();

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        logger.error('Error in verifying OTP:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    const userId = req.user.id; // Assuming user ID is set in req.user by middleware
    const { name, password, DOB, phoneNumber, address } = req.body;

    const updateData = { name, DOB, phoneNumber, address };

    if (password) {
        const bcrypt = require('bcryptjs');
        updateData.password = await bcrypt.hash(password, 10);
    }

    try {
        const updatedUser = await authService.updateProfile(userId, updateData);
        res.json(updatedUser);
    } catch (error) {
        logger.error('Error updating profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const logout = async (req, res) => {
    const token = req.header('x-auth-token');
    const userId = req.user.id; // Assuming user ID is set in req.user by middleware

    try {
        addToBlacklist(token); // Add the token to the blacklist
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        logger.error('Error logging out:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    userLogin,
    signup,
    verifyOTP,
    updateProfile,
    logout
};
