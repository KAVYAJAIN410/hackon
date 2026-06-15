<div align="center">
  <h1>♻️ ReLoop</h1>
  <p><strong>Second Life Commerce: AI-Powered Returns & Sustainable Resale</strong></p>

  [![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
  [![Gemini AI](https://img.shields.io/badge/AI-Google_Gemini-orange.svg)](https://deepmind.google/technologies/gemini/)
  [![Prisma](https://img.shields.io/badge/ORM-Prisma-black.svg)](https://www.prisma.io/)
</div>

---

## 🚀 Live Demo
**Experience ReLoop live:** [https://amazonreloop-kappa.vercel.app/](https://amazonreloop-kappa.vercel.app/)

## 🌎 Overview

Millions of products bought online are returned, underused, or discarded despite being perfectly usable. Traditional reverse logistics operates linearly: items are shipped back to centralized warehouses thousands of miles away, manually inspected, and often landfilled because the processing cost exceeds the item's value. 

**ReLoop** is an intelligent, localized ecosystem where AI not only decides an item's next best owner but actively works to keep the item in its local geographic radius, gamifying sustainable choices along the way. We transform reverse logistics from a massive cost center into a profitable, localized circular economy.

## ✨ Key Features

1. **Predictive Return Prevention (The Green Pledge)**
   Users are alerted to high-risk items at checkout and can pledge *not* to return an item in exchange for "Green Credits." The backend physically locks down the return API for that order.
2. **Zero-Touch AI Grading**
   Users snap a photo of their return. Google Gemini Vision AI instantly assesses the condition, assigns a grade (A+, B, etc.), and generates an immutable "Health Card" for the next buyer.
3. **Localized Re-Commerce Routing**
   Items are stored at local Delivery Centers rather than centralized warehouses. The marketplace dynamically prices items based on geographic distance to the new buyer, passing shipping savings directly to local consumers.
4. **"Outgrown It" Instant Resell**
   Bypassing traditional returns entirely, users can instantly relist past purchases. Gemini semantic AI predicts depreciation and auto-generates the marketplace listing.

## 🛠️ Tech Stack

| Layer | Technology | Why |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS | Lightning-fast edge delivery; Context API for robust auth/cart state. |
| **Backend** | Node.js, Express, Prisma | High-throughput async I/O; Type-safe ORM preventing SQL injection. |
| **Data/ML** | PostgreSQL, Google Gemini | Relational ACID compliance; cutting-edge multi-modal AI for visual grading. |
| **Infra** | AWS EC2, RDS, S3, Vercel | Enterprise-grade availability; separation of blob storage and compute. |

## 📖 Architecture & Deep Dive

For a comprehensive technical breakdown including Entity-Relationship Diagrams (ERDs), Service Modules, system sequence diagrams, and technical debt notes, please read our [Architecture Documentation](./ARCHITECTURE.md).

## 🚀 Getting Started (Local Development)

### Prerequisites
* Node.js (v18+)
* PostgreSQL
* Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/KAVYAJAIN410/hackon.git
cd hackon
```

### 2. Setup Backend
```bash
cd backend
npm install
# Set up your .env based on the provided .env.example
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
# Ensure you have a .env with VITE_API_URL pointing to the backend
npm run dev
```

The application will be running concurrently. Open your browser and navigate to the frontend URL (typically `http://localhost:5173`).

