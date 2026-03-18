import { Router } from "express";
import { getConversations, getMessagesByRoom } from "../controllers/message.controller.js";

const router = Router();

// Liste des conversations (rooms)
router.get("/", getConversations);

// Historique d'une salle (conversation)
router.get("/:roomId", getMessagesByRoom);

export default router;
