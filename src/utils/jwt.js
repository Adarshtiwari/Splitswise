const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../constant/DB');

function generateToken(user) {
    const payload = {
        id: user._id,
        email: user.email,
        name: user.name
        // Add other relevant data
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

module.exports={
    generateToken
}
