const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticateUser } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);

// Protected routes
router.post("/logout", authenticateUser, userController.logout);
router.get("/profile", authenticateUser, userController.getUserProfile);

module.exports = router;
