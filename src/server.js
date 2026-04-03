// server.js
import dotenv from 'dotenv';
import './db.js';
import express from 'express';
import { connectDB } from './db.js';
import questionRoutes from "./routes/questionRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import cors from 'cors';
import { clerkMiddleware } from "@clerk/express";



dotenv.config();
const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://problem-picker-frontend.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware());
await connectDB();

// routes
app.use("/api/questions", questionRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/dashboard", dashboardRoutes);
console.log("✅ NEW CORS CONFIG ACTIVE");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});