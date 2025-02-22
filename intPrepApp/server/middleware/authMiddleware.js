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

    if (!authHeader) {
        return res.status(401).json({ message: "Token format is invalid." });
    }

    const parts = authHeader.split(" ");

    // Ensure it's formatted correctly as "Bearer <token>"
    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
        return res.status(401).json({ message: "Token format is invalid." });
    }
    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {

        // Handle expired token - 1st in order
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired.  Please login again." });     
                }

        // Handle malformed token only *if not expired*
        if (err.name === "JsonWebTokenError") {
            return res.status(400).json({ message: "Malformed token. Please provide a valid token." });
        }

        // General invalid token case
        return res.status(403).json({ message: "Invalid or expired token." });
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