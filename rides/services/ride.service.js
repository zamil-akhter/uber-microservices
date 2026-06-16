const Ride = require("../models/ride.model");

/**
 * Service to create a new ride
 */
const createRide = async ({ userId, pickup, destination }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  const newRide = await Ride.create({
    user: userId,
    pickup,
    destination,
    status: "requested",
  });

  return newRide;
};

/**
 * Service to accept a ride
 */
const acceptRide = async ({ captainId, rideId }) => {
  if (!rideId) {
    throw new Error("Ride ID is required");
  }
  if (!captainId) {
    throw new Error("Captain ID is required");
  }

  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "requested") {
    throw new Error("Ride is not available for acceptance");
  }

  const updatedRide = await Ride.findByIdAndUpdate(
    rideId,
    {
      status: "accepted",
      captain: captainId,
    },
    { new: true }
  );

  return updatedRide;
};

/**
 * Service to get a ride by ID
 */
const getRideById = async ({ rideId }) => {
  if (!rideId) {
    throw new Error("Ride ID is required");
  }

  const ride = await Ride.findById(rideId).populate("user").populate("captain");
  if (!ride) {
    throw new Error("Ride not found");
  }

  return ride;
};

module.exports = { createRide, acceptRide, getRideById };