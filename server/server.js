import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ✅ Fix CORS Configuration
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // ✅ Must be true for cookies/auth headers
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "client", "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Connect to MongoDB
(async () => {
  try {
    await connectToMongoDB();
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
})();

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

export default app;