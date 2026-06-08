const captainService = require('../services/captain.service');
const BlacklistToken = require('../models/blacklistToken.model');

const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields (fullName, email, password) are required",
      });
    }

    const captain = await captainService.registerCaptain({ fullName, email, password });

    res.status(201).json({
      success: true,
      message: "Captain registered successfully",
      data: {
        id: captain._id,
        fullName: captain.fullName,
        email: captain.email,
        createdAt: captain.createdAt,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error occurred during registration",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const { captain, token } = await captainService.loginCaptain({ email, password });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        id: captain._id,
        fullName: captain.fullName,
        email: captain.email,
        token,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Invalid email or password",
    });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.token;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token not found in request",
      });
    }

    await BlacklistToken.create({ token });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Logout failed",
    });
  }
};

const getCaptainProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Captain profile retrieved successfully",
      data: {
        id: req.captain._id,
        fullName: req.captain.fullName,
        email: req.captain.email,
        createdAt: req.captain.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = { signup, login, logout, getCaptainProfile };
