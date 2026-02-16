import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.get("/", (req, res) => res.send("Backend fonctionne 🚀"));

app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;