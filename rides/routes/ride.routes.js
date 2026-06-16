const express = require("express");
const { authenticateUser, authenticateCaptain } = require("../middlewares/auth.middleware");
const router = express.Router();
const rideController = require("../controllers/ride.controller");

// User routes
router.post("/create-ride", authenticateUser, rideController.createRide);

// Captain routes
router.patch("/accept-ride/:rideId", authenticateCaptain, rideController.acceptRide);

module.exports = router;
