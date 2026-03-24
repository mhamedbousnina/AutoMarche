import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

// Imports des routes
import authRoutes from "./routes/auth.js";
import listingRoutes from "./routes/listing.js";
import userRoutes from "./routes/user.js";
import favoriteRoutes from "./routes/favorite.js";
import messageRoutes from "./routes/message.js"; // Vérifie bien le nom du fichier ici !
import conversationRoutes from "./routes/conversation.js";

import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// 1. Configuration des dossiers
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// 2. Middlewares globaux
app.use(cors({ 
  origin: process.env.CORS_ORIGIN || "http://localhost:5173", 
  credentials: true 
}));
app.use(express.json()); // Indispensable pour lire le JSON envoyé par le front
app.use(express.urlencoded({ extended: true }));

// 3. Fichiers statiques
app.use("/uploads", express.static("uploads"));

// 4. Routes de l'API
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);
app.post("/api/messages/test", (req, res) => {
  res.json({ message: "Le routing fonctionne !" });
});
// Route de test santé
app.get("/", (req, res) => res.send("API opérationnelle 🚀"));

// 5. Gestion des erreurs (Toujours à la fin)
app.use(errorHandler);

export default app;