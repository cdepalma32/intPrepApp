require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateExpiredToken = () => {
    const payload = {
        id: "67cc89d1878b385935f4a360", // Use a real user ID
        email: "Winnerdub@example.com"
    };

    // Generate an expired token (-10 minutes)
    const expiredToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "-10m" });

    console.log("Expired Token:", expiredToken);
};

generateExpiredToken();
