const express = require("express");
const rideRoutes = require("./routes/ride.routes");
const app = express();

// Middleware
app.use(express.json());

// Basic health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "rides-service",
    timestamp: new Date().toISOString(),
  });
});

// Mounting ride routes
app.use('/api/rides', rideRoutes);

module.exports = app;
