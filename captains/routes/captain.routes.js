import express from "express";
import { signup, login, getCaptainProfile } from "../controllers/captain.controller.js";
import { authenticateCaptain } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.get("/profile", authenticateCaptain, getCaptainProfile);

export default router;
