const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const BlacklistToken = require('../models/blacklistToken.model');

/**
 * Utility to validate Authorization header
 */
const getTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};

/**
 * Middleware to authenticate user requests using JWT tokens
 */
const authenticateUser = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Check if token is blacklisted
    const isBlacklisted = await BlacklistToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: "Token has been revoked.",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message === "jwt expired" ? "Token has expired." : "Invalid or expired token.",
    });
  }
};

module.exports = { authenticateUser };
