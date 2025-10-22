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


// Verify Token Middleware
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token format must be: Bearer <token>.' });
    }

    const token = authHeader.slice(7).trim();

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Normalize into a consistent shape for controllers
    req.user = {
      id: decoded.sub || decoded.id || decoded._id || null, // ← prefer sub
      username: decoded.username,
      role: decoded.role,
    };

    if (!req.user.id) {
      return res.status(401).json({ message: 'Token missing subject (id).' });
    }

    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token is invalid' });
    }
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
  

    // Admin authentication
    const requireAdmin = (req, res, next) => {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admins only.' });
        }
        next();
    };

module.exports = {
    validateSignup,
    verifyToken,
    requireAdmin,
};