import express from 'express';
import userRoutes from './routes/user.routes.js';

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

export default app;
