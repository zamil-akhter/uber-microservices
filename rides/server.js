const dotenv = require("dotenv");
const app = require("./app");
const { connectDB } = require("./dbs/db");

dotenv.config();

const PORT = process.env.PORT || 3003;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[Rides Service] Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("[Rides Service] Failed to start:", error);
    process.exit(1);
  }
};

start();
