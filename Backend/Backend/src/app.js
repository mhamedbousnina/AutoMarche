import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import listingRoutes from "./routes/listing.js";
import fs from "fs";
import path from "path";
import userRoutes from "./routes/user.js";
import favoriteRoutes from "./routes/favorite.js";


const app = express();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.get("/", (req, res) => res.send("Backend fonctionne 🚀"));

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);


app.use(errorHandler);

export default app;