# 🚀 Finfision AI

### Behavioral Finance + Trading Simulation Platform

---

## 🧠 Overview

Finfision AI is a **full-stack trading simulation platform** that analyzes user behavior and provides AI-based insights on trading decisions.

It helps users understand:

* Emotional trading patterns
* Fear, hesitation & impulsive decisions
* Profit/Loss performance

> ⚠️ This is a **prototype/demo project** — no real trading involved.

---

## 🔥 Features

* 📊 Simulated Trading (Buy/Sell)
* 🧠 Behavioral Tracking (fear, hesitation, panic)
* 🤖 AI Trading Advice (with fallback demo mode)
* 💼 Portfolio Tracking
* 📈 Profit/Loss Visualization
* 🔐 Authentication (Signup/Login)
* ✨ Modern UI + Animations + 3D Effects

---

## 🛠 Tech Stack

* **Frontend:** React + Vite
* **Backend:** Node.js + Express
* **State Management:** Zustand
* **Animations:** Framer Motion + GSAP
* **3D:** Three.js
* **AI:** Groq (OpenAI-compatible API)

---

## 📁 Project Structure

```id="2sh3o5"
finfision-ai/
│
├── src/              # Frontend (React)
├── server/           # Backend (Node + Express)
│   ├── routes/
│   ├── services/
│   ├── models/
│
├── .env.example      # Example environment config
├── package.json
```

---

## ⚙️ Environment Setup

Create a `.env` file in the root:

```env id="7q3o3j"
VITE_API_URL=http://localhost:5000
```

---

### 🔑 Optional (AI Feature)

Create `.env` inside `/server`:

```env id="mxt1lf"
OPENAI_API_KEY=your_api_key_here
```

> If not provided, the app runs in **demo mode (no crash)**

---

## 🚀 How to Run the Project

---

# 🔥 METHOD 1 (RECOMMENDED — ONE COMMAND)

From project root:

```bash id="r5p8kz"
npm install
npm run dev
```

---

### 👉 This starts BOTH:

* Frontend → http://localhost:5173
* Backend → http://localhost:5000

---

# 🧩 METHOD 2 (MANUAL — 2 TERMINALS)

---

### 🔹 Terminal 1 → Backend

```bash id="gq3y8n"
cd server
npm install
npm run dev
```

---

### 🔹 Terminal 2 → Frontend

```bash id="7q1w9r"
cd ..
npm install
npm run dev
```

---

## ⚠️ Important Notes

* Do NOT run backend twice → causes port error
* If port 5000 is busy → kill process (see below)
* AI feature works even without API key (demo mode enabled)

---

## 🚨 Common Errors & Fixes

---

### ❌ Error: Server connection failed

* Check `.env` file exists
* Restart frontend (`npm run dev`)

---

### ❌ Error: Port already in use (EADDRINUSE)

```bash id="1eql9w"
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

### ❌ Error: OPENAI_API_KEY missing

✔ Already handled
✔ App runs in demo mode

---

### ❌ Error: Cannot GET /

👉 This is normal
Use:

```id="j6b2kw"
http://localhost:5000/health
```

---

## 🧪 API Endpoints

* Auth → http://localhost:5000/api/auth
* AI → http://localhost:5000/api/ai
* Health → http://localhost:5000/health

---

## 🧠 AI Behavior Logic

The system analyzes:

* Click frequency
* Hesitation time
* Asset switching
* Scroll behavior
* Decision speed

And returns:

* Recommendation
* Confidence score
* Emotional insight
* Risk warning

---

## 🚀 Future Scope

* Real stock API integration
* Advanced ML-based predictions
* Live portfolio tracking
* Mobile app version
* Multi-user system

---

## 👨‍💻 Author

Bhargav

---

## 📌 Note

This project is built for:

* Learning
* Demonstration
* Hackathons

Not intended for real financial use.
