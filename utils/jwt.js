const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = SECRET + '_refresh';

exports.generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '15m' });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    throw new Error('Invalid token');
  }
};

exports.generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, REFRESH_SECRET, { expiresIn: '7d' });
};

exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};