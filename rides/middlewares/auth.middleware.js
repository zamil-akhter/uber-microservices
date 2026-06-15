const jwt = require("jsonwebtoken");
const axios = require("axios");

const authUserMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "user") {
      return res.status(401).json({ message: "Unauthorized : not a user" });
    }

    const user = decoded;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const authCaptainMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "captain") {
      return res.status(401).json({ message: "Unauthorized : not a captain" });
    }

    req.captain = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = {
  authUserMiddleware,
  authCaptainMiddleware,
};
