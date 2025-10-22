require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateExpiredToken = () => {
    const payload = {
  sub: userIdString,
  username: '...',
  role: 'user',
    };

    // Generate an expired token (-10 minutes)
    const expiredToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "-10m" });

    console.log("Expired Token:", expiredToken);
};

generateExpiredToken();
