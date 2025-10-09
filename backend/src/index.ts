import express from "express";
import connectToMongo from "./config/db";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";

dotenv.config(); // Load environment variables first

const app = express();
// Connect to MongoDB after environment is loaded
connectToMongo();
const PORT = process.env.PORT || 3000;

// Middleware
// Enable CORS for cross-origin requests
app.use(cors());

// Parse JSON payloads
app.use(express.json());

app.use("/api/auth", authRoutes);

// Basic API endpoint
app.get("/api/test", (req, res) => {
  res.send({ message: "API is working...." });
});

// Authentication routes
// app.use("/api", authRoutes);

//  Start the server
app.listen(PORT, () => {
  console.log(`---- Connected with Express server on PORT ${PORT}`);
});
