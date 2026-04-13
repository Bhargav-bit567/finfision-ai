import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/finfision');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Failed: ${error.message}`);
    console.log(`ℹ️ Falling back to Local JSON Storage for development.`);
    return false;
  }
};

export default connectDB;
