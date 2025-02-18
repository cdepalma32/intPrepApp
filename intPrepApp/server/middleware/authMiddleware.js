// input validation middleware & token verification middleware to protect routes requiring authentication

const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");

// Validation middleware for signup
const validateSignup = [
    body("email")
    .trim()
   .notEmpty().withMessage("Email is required.")
   .bail() // stops validation if field is empty
   .isEmail().withMessage("Invalid email format."),

    body("password")
    .trim()
    .notEmpty().withMessage("Password is required.")
    .bail()
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
    
    body("username")
    .trim()
    .notEmpty().withMessage("Username is required."),


    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array().map(err=> ({
                    field: err.path,
                    message: err.msg
                })),
            });
        }
        next();
    },
];

// Token verification middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
        console.log("Token format is invalid.");
        return res.status(401).json({ message: "Token format is invalid." });
    }
    const token = parts[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message); // logs error details

        // handle expired tokens!
        console.error('Token verification failed:', err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please login again.' })
        }

        res.status(403).json({message: 'Invalid or expired token.'});
    }
    };

    // Admin authentication
    const requireAdmin = (req, res, next) => {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admins only!' });
        }
        next();
    };

module.exports = {
    validateSignup,
    verifyToken,
    requireAdmin,
};