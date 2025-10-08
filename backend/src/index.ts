import express from "express";
import connectToMongo from "./config/db";
import authRoutes from "./routes/user";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load environment variables first

const app = express();

// ✅ Connect to MongoDB after environment is loaded
connectToMongo();

const PORT = process.env.PORT || 3000;

// ✅ Enable CORS for cross-origin requests
app.use(cors());

// ✅ Parse JSON payloads
app.use(express.json());

// ✅ Basic API endpoint
app.get("/", (req, res) => {
  res.send("API is working....");
});

// ✅ Authentication routes
app.use("/api", authRoutes);

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`---- Connected with Express server on PORT ${PORT}`);
});
