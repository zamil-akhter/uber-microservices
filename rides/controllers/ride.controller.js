const rideModel = require("../models/ride.model");

const createRide = (req, res, next) => {
  const { user } = req;
  const { pickup, destination } = req.body;

  const newRide = new rideModel({
    user: user._id,
    pickup,
    destination
  });

  newRide.save();

  res.status(201).json({ message: "Ride created successfully", ride: newRide });
}

module.exports = {
  createRide
};