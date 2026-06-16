const { startRideListener } = require('./listeners/rideListener');
const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { connectDB } = require('./dbs/db');

const PORT = process.env.PORT || 3002;

const startServer = async () => {
  try {
    await connectDB();
    await startRideListener();
    app.listen(PORT, () => {
      console.log(`[Captains Service] Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`[Fatal] Database connection failed. Exiting process. Error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
