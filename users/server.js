const dotenv = require("dotenv");
const { connectRabbitMQ } = require("./services/rabbit");

dotenv.config();

const app = require("./app");
const { connectDB } = require("./dbs/db");

const PORT = process.env.PORT || 3001;

// Connect to Database and start the server
const startServer = async () => {
  try {
    await connectDB();
    await connectRabbitMQ();
    app.listen(PORT, () => {
      console.log(`[Users Service] Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`[Fatal] Database connection failed. Exiting process. Error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
