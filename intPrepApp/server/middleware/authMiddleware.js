// input validation middleware & token verification middleware to protect routes requiring authentication

const { body, validationResult } = require('express-validator');
const { verifyToken: decodeToken } = require('../utils/auth'); // import the verifyToken from auth.js


// Validation middleware for signup
const validateSignup = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
    .isLength({ min:6 })
    .withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

// Token verification middleware
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // get token from Header
    if(!token) {
        return res.status(401).json({message: 'Access denied.  No token provided.'});

    }
    try {
        const decoded = decodeToken(token); // Use the verifyToken from auth.js
        req.user = decoded.data; //Atatch user info to the request
        next();
    } catch (err) {
        res.status(403).json({message: 'Invalid or expired token.'});
    }
    };


module.exports = {
    validateSignup,
    verifyToken,
};