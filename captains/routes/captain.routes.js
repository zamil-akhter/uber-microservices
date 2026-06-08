const express = require('express');
const captainController = require('../controllers/captain.controller');
const { authenticateCaptain } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.post("/signup", captainController.signup);
router.post("/login", captainController.login);

// Protected routes
router.post("/logout", authenticateCaptain, captainController.logout);
router.get("/profile", authenticateCaptain, captainController.getCaptainProfile);

module.exports = router;
