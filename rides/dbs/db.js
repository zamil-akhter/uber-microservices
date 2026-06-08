const mongoose = require("mongoose");

/**
 * Establish connection to the rides MongoDB database.
 */
exports.connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in environment variables.");
  }

  console.log(`[Database] Connecting to MongoDB at ${mongoUri}...`);

  const conn = await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
};
