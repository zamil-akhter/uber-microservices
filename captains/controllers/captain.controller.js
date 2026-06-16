const captainService = require('../services/captain.service');
const BlacklistToken = require('../models/blacklistToken.model');
const { subscribeToQueue } = require('../services/rabbit');

const pendingRidePolls = [];
const rideBuffer = [];

/**
 * Helper to deliver rides from buffer to pending polls
 */
function deliverRideToPendingPolls(ride) {
  if (!pendingRidePolls.length) {
    return false;
  }

  const pending = pendingRidePolls.splice(0, pendingRidePolls.length);
  pending.forEach(({ res, timeout }) => {
    clearTimeout(timeout);
    if (!res.headersSent) {
      res.status(200).json({
        success: true,
        message: "New ride available",
        data: ride,
      });
    }
  });

  return true;
}

// Subscribe to ride events from RabbitMQ
subscribeToQueue('ride_created', (data) => {
  const ride = typeof data === 'string' ? JSON.parse(data) : data;

  if (!deliverRideToPendingPolls(ride)) {
    rideBuffer.push(ride);
    // Keep only last 10 rides in buffer
    if (rideBuffer.length > 10) {
      rideBuffer.shift();
    }
  }
});

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

/**
 * Controller to poll for new rides (long-polling)
 * Keeps connection open until a new ride is available or timeout occurs
 */
const pollNewRide = (req, res) => {
  try {
    // Check if there are buffered rides
    if (rideBuffer.length) {
      const ride = rideBuffer.shift();
      return res.status(200).json({
        success: true,
        message: "New ride available",
        data: ride,
      });
    }

    // Set timeout for long polling (30 seconds)
    const timeout = setTimeout(() => {
      const index = pendingRidePolls.findIndex((item) => item.res === res);
      if (index !== -1) {
        pendingRidePolls.splice(index, 1);
      }
      if (!res.headersSent) {
        res.status(200).json({
          success: false,
          message: "No new rides available",
        });
      }
    }, 30000);

    // Add to pending polls
    pendingRidePolls.push({ res, timeout });

    // Handle client disconnect
    req.on('close', () => {
      const index = pendingRidePolls.findIndex((item) => item.res === res);
      if (index !== -1) {
        clearTimeout(pendingRidePolls[index].timeout);
        pendingRidePolls.splice(index, 1);
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error polling for rides",
    });
  }
};

module.exports = { signup, login, logout, getCaptainProfile, pollNewRide };
