import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./dbs/db.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3002;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[Captains Service] Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`[Fatal] Database connection failed. Exiting process. Error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
