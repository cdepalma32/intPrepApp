// token management: token signing & JWT decoding

const jwt =  require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'mysecretkey';
const expiration = '2h';

module.exports = {
    signToken: function ({ email, username, _id }) {
        const payload = { email, username, _id };
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    }, 
    verifyToken: function (token) {
        try {
            return jwt.verify(token, secret);
        } catch (err) {
            throw new Error('Invalid or expired token.');
        }
        }
    };
