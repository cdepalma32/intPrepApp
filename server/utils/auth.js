// token management: token signing & JWT decoding
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_SECRET;

/**
 * Normalize any "user-like" object to an id, username, role.
 * Accepts:
 *  - Mongoose doc: {_id, username, role}
 *  - Decoded token: {sub, id, _id, username, role}
 */
function pickIdentity(userLike = {}) {
  const id =
    userLike.sub ||
    userLike.id ||
    (userLike._id && userLike._id.toString && userLike._id.toString()) ||
    null;

  return {
    id,
    username: userLike.username,
    role: userLike.role || 'user',
  };
}

// Generate access token (short-lived)
const generateAccessToken = (userLike) => {
  const { id, username, role } = pickIdentity(userLike);

  // IMPORTANT: put the id into `sub`
  const payload = { sub: id, username, role };

  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

// Generate refresh token (long-lived)
const generateRefreshToken = (userLike) => {
  const { id, username, role } = pickIdentity(userLike);
  const payload = { sub: id, username, role };

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
};

// Verify refresh token (used in refresh flow)
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
