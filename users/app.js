const express = require('express');
const userRoutes = require('./routes/user.routes');

const app = express();

// Middleware
app.use(express.json());

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
