const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();
const rideController = require("../controllers/ride.controller");



router.post("/create-ride", authMiddleware, rideController.createRide);

module.exports = router;
