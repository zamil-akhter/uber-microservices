const Ride = require("../models/ride.model");

exports.acceptRide = async ({ captainId, rideId }) => {
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

  return {
    message: `Ride ${rideId} accepted successfully`,
    ride: updatedRide,
  };
};