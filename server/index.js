import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send("Finfision Backend Running");
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Working health route
app.get('/health', (req, res) => {
  console.log("Health check requested");
  res.json({ 
    status: 'ok', 
    message: 'Backend is healthy',
    timestamp: new Date().toISOString() 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`API Structure:`);
  console.log(`- Auth: http://localhost:${PORT}/api/auth`);
  console.log(`- AI:   http://localhost:${PORT}/api/ai`);
});