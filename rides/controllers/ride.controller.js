const rideModel = require("../models/ride.model");
const { publishToQueue } = require("../services/rabbit");
const rideService = require("../services/ride.service");

/**
 * Controller to create a new ride
 */
const createRide = async (req, res) => {
  try {
    const { user } = req;
    const { pickup, destination } = req.body;

    if (!pickup || !destination) {
      return res.status(400).json({
        success: false,
        message: "Pickup and destination are required",
      });
    }

    const newRide = await rideService.createRide({
      userId: user._id,
      pickup,
      destination,
    });

    // Publish to RabbitMQ for captains to receive
    publishToQueue("ride_created", JSON.stringify(newRide));

    res.status(201).json({
      success: true,
      message: "Ride created successfully",
      data: newRide,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create ride",
    });
  }
};

/**
 * Controller to accept a ride
 */
const acceptRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { captain } = req;

    if (!rideId) {
      return res.status(400).json({
        success: false,
        message: "Ride ID is required",
      });
    }

    const updatedRide = await rideService.acceptRide({
      rideId,
      captainId: captain._id,
    });

    res.status(200).json({
      success: true,
      message: "Ride accepted successfully",
      data: updatedRide,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to accept ride",
    });
  }
};

/**
 * Controller to get ride details
 */
const getRideDetails = async (req, res) => {
  try {
    const { rideId } = req.params;

    if (!rideId) {
      return res.status(400).json({
        success: false,
        message: "Ride ID is required",
      });
    }

    const ride = await rideService.getRideById({ rideId });

    res.status(200).json({
      success: true,
      message: "Ride retrieved successfully",
      data: ride,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve ride",
    });
  }
};

module.exports = {
  createRide,
  acceptRide,
  getRideDetails,
};