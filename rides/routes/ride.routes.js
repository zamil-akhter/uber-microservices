import express from "express";
import { getAllRides } from "../controllers/ride.controller.js";

const router = express.Router();

router.get("/", getAllRides);

export default router;
