const mongoose = require('mongoose');

let mongoUri = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    if (!mongoUri) {
      // Use in-memory MongoDB if no URI provided
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log('Using in-memory MongoDB');
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    // Fallback to in-memory
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (in-memory): ${conn.connection.host}`);
    } catch (err2) {
      console.error(`Fallback DB error: ${err2.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
