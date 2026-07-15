const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: process.env.NODE_ENV !== 'production',
      serverSelectionTimeoutMS: 15000,
    });

    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error('[DB] Mongoose connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[DB] Mongoose disconnected');
    });

    return conn;
  } catch (err) {
    console.error('[DB] Connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
