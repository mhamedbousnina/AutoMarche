import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import listingRoutes from "./routes/listing.js";
import fs from "fs";
import path from "path";
const app = express();
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.get("/", (req, res) => res.send("Backend fonctionne 🚀"));

app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads")); // pour servir les images
app.use("/api/listings", listingRoutes);

app.use(errorHandler);

export default app;