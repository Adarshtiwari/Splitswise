// src/middlewares/authenticate.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');
const { isBlacklisted } = require('../utils/blacklist');
const { JWT_SECRET } = require('../constant/DB');

const authenticate = async (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    if (isBlacklisted(token)) {
        return res.status(401).json({ message: 'Token is not valid' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found, authorization denied' });
        }

        req.user = user;
        next();
    } catch (error) {
        logger.error('Authentication error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authenticate;
