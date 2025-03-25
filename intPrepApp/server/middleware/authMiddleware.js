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
      console.log("Entered verifyToken middleware.");
      console.log("Full Request Headers:", req.headers);
  
      const authHeader = req.headers.authorization;
      console.log("Authorization Header:", authHeader);
  
      if (!authHeader) {
        console.error("Missing Authorization Header");
        return res.status(401).json({ message: "Authorization header missing" });
      }
  
      const parts = authHeader.split(" ");
      console.log("Token Parts:", parts);
  
      if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
        console.error("Incorrect token format");
        return res.status(401).json({ message: "Token format must be: Bearer <token>" });
      }
  
      const token = parts[1].trim();
      console.log("Token to verify:", token);
      console.log("Using secret:", process.env.JWT_SECRET);
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token Decoded:", decoded);
      req.user = decoded;
      next();
    } catch (err) {
      console.error("Error in verifyToken:", err);
      return res.status(403).json({ message: "Invalid or expired token" });
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