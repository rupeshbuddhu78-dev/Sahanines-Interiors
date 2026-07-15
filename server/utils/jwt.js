const jwt = require('jsonwebtoken');

const signToken = (id, role = 'admin') =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

const sendTokenCookie = (res, token) => {
  const days = parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '7', 10);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: days * 24 * 60 * 60 * 1000,
  });
};

module.exports = { signToken, verifyToken, sendTokenCookie };
