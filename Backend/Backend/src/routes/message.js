import express from "express";
import {
  sendMessage,
  getReceivedMessages,
  getSentMessages,
  getConversation,
  deleteMessage,
} from "../controllers/messageController.js";

const router = express.Router();

// ✅ 1. POST en premier
router.post("/", sendMessage);

// ✅ 2. routes spécifiques
router.get("/received/:userId", getReceivedMessages);
router.get("/sent/:userId", getSentMessages);

// ✅ 3. ⚠️ TOUJOURS EN DERNIER
router.get("/:conversationId", getConversation);
router.delete("/:id", deleteMessage);

export default router;