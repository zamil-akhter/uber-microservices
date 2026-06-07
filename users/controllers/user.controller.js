import * as userService from "../services/user.service.js";
import BlacklistToken from "../models/blacklistToken.model.js";

/**
 * Controller to handle User Registration (Signup)
 */
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields (fullName, email, password) are required",
      });
    }
    const user = await userService.registerUser({ fullName, email, password });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error occurred during registration",
    });
  }
};

/**
 * Controller to handle User Login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const { user, token } = await userService.loginUser({ email, password });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        token: token,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Invalid email or password",
    });
  }
};

export const logout = async (req, res) => {
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

/**
 * Controller to retrieve user profile (secured)
 */
export const getUserProfile = async (req, res) => {
  try {
    // req.user is populated by the authentication middleware
    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
