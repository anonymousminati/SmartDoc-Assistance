import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
// import connectDB from "./config/db.js";
import summarizeRoutes from "./routes/summarizeRoutes.js";
import qnaRoutes from "./routes/qna_routes.js";
import insightMirrorRouter from "./routes/insightMirrorRoutes.js";
import extractorRoutes from "./routes/extractorRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://smartdoc-ai.onrender.com", // Your frontend URL
    // origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
  })
);
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Connect to database
// connectDB();

// Uptime Robot Ping
app.get("/", (req, res) => {
  res.send("Server is alive and being monitored!");
});

// Routes
app.use("/api/summarize", summarizeRoutes);
app.use("/api/ai-qna", qnaRoutes);
app.use("/api/insight-mirror", insightMirrorRouter);
app.use("/api/ai", extractorRoutes);
app.use("/api/report", reportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    return res.status(400).json({
      error: err.message || "File upload error",
    });
  } else if (err) {
    // Unknown error
    return res.status(500).json({
      error: err.message || "Internal server error",
    });
  }
  next();
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
