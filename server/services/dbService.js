import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, '../users_backup.json');

// Initialize local file if not exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

const isMongoAvailable = () => mongoose.connection.readyState === 1;

export const findUserByEmail = async (email) => {
  if (isMongoAvailable()) {
    return await User.findOne({ email }).select('+password');
  } else {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    return users.find(u => u.email === email);
  }
};

export const saveUser = async (userData) => {
  if (isMongoAvailable()) {
    return await User.create(userData);
  } else {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    const newUser = {
      _id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return newUser;
  }
};
