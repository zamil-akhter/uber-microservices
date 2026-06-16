const jwt = require("jsonwebtoken");

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

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify user role
    if (decoded.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Forbidden. User access required.",
      });
    }

    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message === "jwt expired" ? "Token has expired." : "Invalid or expired token.",
    });
  }
};

/**
 * Middleware to authenticate captain requests using JWT tokens
 */
const authenticateCaptain = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify captain role
    if (decoded.role !== "captain") {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Captain access required.",
      });
    }

    req.captain = decoded;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message === "jwt expired" ? "Token has expired." : "Invalid or expired token.",
    });
  }
};

module.exports = {
  authenticateUser,
  authenticateCaptain,
};
