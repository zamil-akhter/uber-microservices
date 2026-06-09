const express = require('express');
const userRoutes = require('./routes/user.routes');
const { connectRabbitMq } = require("./services/rabbit");

const app = express();

// Middleware
app.use(express.json());

connectRabbitMq().catch((error) => {
  console.error("[Users Service] Failed to connect to RabbitMQ:", error);
  process.exit(1);
}); 

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'users-service',
    timestamp: new Date().toISOString()
  });
});

// Mounting user routes
app.use('/api/users', userRoutes);

module.exports = app;
