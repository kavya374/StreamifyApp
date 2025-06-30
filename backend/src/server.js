import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Needed for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5002;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5175"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// ✅ Serve frontend in production
const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER;

if (isProduction) {
  // Adjusted path to work on Render.com
  const frontendPath = path.resolve(__dirname, "../../dist");

  if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));

    app.get("*", (req, res) => {
      if (req.path.includes(".") || req.path.startsWith("/api")) {
        return res.status(404).send("Not Found");
      }
      res.sendFile(path.join(frontendPath, "index.html"));
    });
  } else {
    console.error("❌ Frontend build not found at:", frontendPath);
  }
}

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  connectDB();
});
