const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('../utils/jwt');
const logger = require('../utils/logger');
const { sendEmail } = require('../utils/emailNotification');
// Function to verify if user is verified
const isUserVerified = async (email) => {
    const user = await User.findOne({ email });
    logger.info(` user data ${user}`)
    return user && user.isVerified;
};

// Function to authenticate user
const authenticateUser = async (email, password) => {
    try {
        // Check if user is verified
        const verified = await isUserVerified(email);
        if (!verified) {
            throw new Error('User not verified');
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // Generate JWT token
        const token = jwt.generateToken(user);

        return { token };
    } catch (error) {
        throw error;
    }
};
const generateVerificationCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

    return { code, expiresAt };
};

const sendVerificationCode = async (email,verificationCode,expirationTime = new Date(Date.now() + 2 * 60 * 1000)) => {
    try {
        logger.info(`Sending verification code to ${email}`);

        const subject = 'Your Verification Code';
        const body = `Your verification code is ${verificationCode}`;

        // Send email using the email service function
        await sendEmail(email, subject, body);

        // Update user with the verification code and expiration time
        const user = await User.findOneAndUpdate(
            { email },
            { verificationCode, verificationCodeExpires: expirationTime },
            { new: true }
        );

        if (!user) {
            throw new Error('User not found');
        }

        return { message: 'Verification code sent' };
    } catch (error) {
        throw error;
    }
};

const updateProfile = async (userId, updateData) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        return updatedUser;
    } catch (error) {
        throw new Error('Error updating profile');
    }
};


module.exports = {
    authenticateUser,
    generateVerificationCode,
    sendVerificationCode,
    updateProfile
};
