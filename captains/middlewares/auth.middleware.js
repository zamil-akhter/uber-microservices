import jwt from "jsonwebtoken";
import Captain from "../models/captain.model.js";

export const authenticateCaptain = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await Captain.findById(decoded._id);
    if (!captain) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Captain not found.",
      });
    }

    req.captain = captain;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
