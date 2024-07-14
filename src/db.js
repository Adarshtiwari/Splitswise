require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const { MONGODB_URI } = require('./constant/DB');

mongoose.Promise = global.Promise;

const connectDB = async () => {
    logger.info(`MongoDB URL: ${MONGODB_URI}`);

    try {
        await mongoose.connect(MONGODB_URI, {
            // Removing deprecated options
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
            socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

module.exports = connectDB;
