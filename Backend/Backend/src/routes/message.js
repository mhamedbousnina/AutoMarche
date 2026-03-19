import { Router } from "express";
import {
  getConversations,
  getMessagesByRoom,
} from "../controllers/message.controller.js";

const router = Router();

router.get("/", getConversations);
router.get("/:roomId", getMessagesByRoom);

export default router;