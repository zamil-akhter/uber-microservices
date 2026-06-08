const rideModel = require("../models/ride.model");

const createRide = async (req, res, next) => {
  const { user } = req;
  const { pickup, destination } = req.body;

  const newRide = await rideModel.create({
    user: user._id,
    pickup,
    destination
  });

  res.status(201).json({ message: "Ride created successfully", ride: newRide });
}

module.exports = {
  createRide
};