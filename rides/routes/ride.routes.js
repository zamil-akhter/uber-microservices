const express = require("express");
const { authUserMiddleware, authCaptainMiddleware } = require("../middlewares/auth.middleware");
const router = express.Router();
const rideController = require("../controllers/ride.controller");



router.post("/create-ride", authUserMiddleware, rideController.createRide);
router.patch("/accept-ride/:rideId", authCaptainMiddleware, rideController.acceptRide);

module.exports = router;
