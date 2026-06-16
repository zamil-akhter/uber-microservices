const { connectRabbitMQ } = require("./services/rabbit");
const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const { connectDB } = require("./dbs/db");

const PORT = process.env.PORT || 3003;

const start = async () => {
  try {
    await connectDB();
    await connectRabbitMQ();
    app.listen(PORT, () => {
      console.log(`[Rides Service] Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("[Rides Service] Failed to start:", error);
    process.exit(1);
  }
};

start();
