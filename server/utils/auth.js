// token management: token signing & JWT decoding
const jwt =  require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;

// Generate access token (short-lived)
const generateAccessToken = (user) => {
    return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
    );
};

// Generate refresh token (long-lived)
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '30d' }
    );
};


// Verify refresh token (used in refresh flow)
const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch(err) {
        return null;
    }
    };


module.exports = {
generateAccessToken,
generateRefreshToken,
verifyRefreshToken,
};
