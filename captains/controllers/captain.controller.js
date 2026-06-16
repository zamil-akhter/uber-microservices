const captainService = require('../services/captain.service');
const BlacklistToken = require('../models/blacklistToken.model');
const { waitingCaptains, rideBuffer } = require('../listeners/rideListener');

/**
 * Controller to handle Captain Signup (Registration)
 */
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

/**
 * Controller to handle Captain Login
 */
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

/**
 * Controller to handle Captain Logout
 */
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

/**
 * Controller to retrieve captain profile (secured)
 */
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

const getNewRide = (req, res) => {
  const captainId = req.captain._id.toString();

  // If a ride is already buffered, return it immediately.
  if (rideBuffer.length > 0) {
    const ride = rideBuffer.shift();
    return res.status(200).json({
      success: true,
      message: 'New ride available',
      data: ride,
    });
  }

  const timeout = setTimeout(() => {
    const entry = waitingCaptains.get(captainId);
    if (!entry) {
      return;
    }

    waitingCaptains.delete(captainId);
    if (!res.headersSent && !res.writableEnded) {
      res.status(204).json({ message: 'No ride available' });
    }
  }, 30000);

  waitingCaptains.set(captainId, { res, timeout });

  // clean up if captain disconnects
  req.on('close', () => {
    const entry = waitingCaptains.get(captainId);
    if (entry) {
      clearTimeout(entry.timeout);
      waitingCaptains.delete(captainId);
    }
  });
};

module.exports = { signup, login, logout, getCaptainProfile, getNewRide };
