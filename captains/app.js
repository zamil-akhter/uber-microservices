import express from "express";
import captainRoutes from "./routes/captain.routes.js";

const app = express();

// Middleware
app.use(express.json());

// Basic health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "captains-service",
    timestamp: new Date().toISOString(),
  });
});

// Mounting captain routes
app.use("/api/captains", captainRoutes);

export default app;
