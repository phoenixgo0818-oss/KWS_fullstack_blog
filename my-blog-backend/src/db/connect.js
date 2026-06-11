/**
 * MongoDB connection — reads MONGODB_URI from .env and connects via Mongoose.
 */
const mongoose = require('mongoose');

/**
 * Connect to MongoDB. Throws if MONGODB_URI is missing or connection fails.
 * @returns {Promise<void>}
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. Copy .env.example to .env and add your connection string.'
    );
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log(`MongoDB connected (${mongoose.connection.name})`);
}

module.exports = connectDB;
