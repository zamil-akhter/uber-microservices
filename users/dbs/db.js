import mongoose from 'mongoose';

/**
 * Establish connection to MongoDB database
 */
export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  console.log(`[Database] Connecting to MongoDB at ${mongoUri}...`);

  const conn = await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000
  });

  console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
};
