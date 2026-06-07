import express from "express";
import { signup, login, logout, getUserProfile } from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.post("/logout", authenticateUser, logout);
router.get("/profile", authenticateUser, getUserProfile);

export default router;
