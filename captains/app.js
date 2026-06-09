const express = require('express');
const captainRoutes = require('./routes/captain.routes');
const { connectRabbitMq } = require("./services/rabbit");
const app = express();

// Middleware
app.use(express.json());

connectRabbitMq().catch((error) => {
  console.error("[Captains Service] Failed to connect to RabbitMQ:", error);
  process.exit(1);
});

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

module.exports = app;
