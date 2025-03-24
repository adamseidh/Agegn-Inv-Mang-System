const jwt = require('jsonwebtoken');
require('dotenv').config();
//const bcrypt = require('bcryptjs');

const SECRET_KEY = process.env.JWT_SECRET;

const generateToken = (user) => {
    return jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1d' });
};

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];
    console.log('token from header:', token);

    if (!token) return res.status(403).send('A token is required for authentication');

    // Remove 'Bearer ' prefix if present in the token
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
    } catch (err) {
        console.log('Error fetching data for invalid token:', err);
        return res.status(401).send('Invalid Token');
    }

    return next();
};

module.exports = { generateToken, verifyToken };