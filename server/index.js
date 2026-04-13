import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/auth.js';

dotenv.config();

// Connect to database
// Note: If MONGODB_URI is not set, it will fallback to local mongo or error out.
// For development without MongoDB, you can temporarily comment this or use a mock.
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Restrict to frontend origin
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send("Finfision Backend API is Running");
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend is healthy',
    timestamp: new Date().toISOString() 
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`- Health: http://localhost:${PORT}/api/health`);
  console.log(`- Auth:   http://localhost:${PORT}/api/auth`);
  console.log(`- AI:     http://localhost:${PORT}/api/ai`);
});