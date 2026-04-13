# Finfision AI - Project Setup Guide

This project is a Behavioral Finance platform with a React + Vite frontend and an Express + MongoDB backend.

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env and add your MONGODB_URI and JWT_SECRET
npm run dev
```

### 2. Frontend Setup
```bash
# In a new terminal, from the root directory:
npm install
cp .env.example .env
# Edit .env and ensure VITE_API_URL=http://localhost:5000
npm run dev
```

## 🏗 Backend Architecture
The backend is built with Node.js and Express, following a clean folder structure:
- `config/`: Database connection using Mongoose.
- `models/`: Database schemas (User).
- `routes/`: API endpoint definitions (Auth, AI).
- `middleware/`: Custom middleware (Protect routes with JWT).
- `controllers/`: Logic for handling requests (integrated into routes for simplicity).

## 🔐 Features
- **Authentication**: JWT-based login and signup.
- **Security**: Password hashing with `bcryptjs`.
- **Validation**: Strict password rules (8+ chars, uppercase, number, special char).
- **AI Integration**: Connected to Groq/OpenAI for behavioral insights.
- **State Management**: Zustand with persistence.

## 🛠 Troubleshooting
- **ERR_CONNECTION_REFUSED**: Ensure the backend is running on port 5000.
- **MongoDB Connection Error**: Ensure MongoDB is running locally or provide a valid Atlas URI in `.env`.
- **JWT Secret**: Ensure `JWT_SECRET` is defined in `server/.env`.
