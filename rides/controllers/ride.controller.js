const rideModel = require("../models/ride.model");
const { publishToQueue } = require("../services/rabbit");
const rideService = require("../services/ride.service");

const createRide = async (req, res, next) => {
  const { user } = req;
  const { pickup, destination } = req.body;

  const newRide = await rideModel.create({
    user: user._id,
    pickup,
    destination
  });

  publishToQueue("ride_created", JSON.stringify(newRide));
  res.status(201).json({ message: "Ride created successfully", ride: newRide });
}

const acceptRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    // console.log("[TCL] --------- ~ acceptRide ~ rideId --------->>>>  ", rideId)
    const captainId = req.captain._id;
    // console.log("[TCL] --------- ~ acceptRide ~ captainId --------->>>>  ", captainId)

    if (!rideId) {
      return res.status(400).json({ success: false, message: "Ride ID is required" });
    }

    const updatedRide = await rideService.acceptRide({ rideId, captainId });
    console.log("updatedRide --------->>>>  ", updatedRide)

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

module.exports = {
  createRide,
  acceptRide
};