import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectToMongo from "./config/db";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";

const app = express();

// Connect to MongoDB
connectToMongo();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

//allow fronted to send cookie
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, //allow cookie to be sent
  })
);

// Routes
app.use("/api/auth", authRoutes);

// Test endpoint
app.get("/api/test", (req, res) => {
  res.send({ message: "API is working...." });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
