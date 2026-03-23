import express from "express";
import {
  sendMessage,
  getReceivedMessages,
  getSentMessages,
  getConversation,
  deleteMessage, // ✅ assure-toi qu'il est bien exporté
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/", sendMessage);
router.get("/received/:userId", getReceivedMessages);
router.get("/sent/:userId", getSentMessages);
router.get("/:conversationId", getConversation);
router.delete("/:id", deleteMessage); // route DELETE

export default router;