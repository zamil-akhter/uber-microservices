const express = require("express");
const rideRoutes = require("./routes/ride.routes");
const { connectRabbitMq } = require("./services/rabbit");
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


connectRabbitMq().catch((err) => {
  console.error("Failed to connect to RabbitMQ:", err);
  process.exit(1);
});

// Mounting ride routes
app.use('/api/rides', rideRoutes);

module.exports = app;
