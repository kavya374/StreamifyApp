import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5002;
const __dirname = path.resolve();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5175"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// ✅ Serve frontend build in production or Render
const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER;

if (isProduction) {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  // Only serve index.html if the request does NOT include a file extension
  app.get("/*", (req, res) => {
    if (req.path.includes(".") || req.path.startsWith("/api")) {
      return res.status(404).send("Not Found");
    }
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  connectDB();
});
