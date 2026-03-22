import express from "express";
import Message from "../models/message.js";
import Conversation from "../models/conversation.js";
import Listing from "../models/listing.js"; // ✅ remplacer Car par Listing

const router = express.Router();

// récupérer tous les messages reçus pour un utilisateur (dashboard)
router.get("/received/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // 1️⃣ récupérer toutes les conversations où l'utilisateur est membre
    const conversations = await Conversation.find({
      members: userId,
    });

    if (!conversations.length) return res.json([]);

    const convIds = conversations.map((c) => c._id);

    // 2️⃣ récupérer tous les messages dans ces conversations
    const messages = await Message.find({
      conversationId: { $in: convIds },
      sender: { $ne: userId }, // seulement messages reçus
    })
      .populate("sender", "fullName")
      .populate("listing", "title") // ✅ ton listing
      .sort({ createdAt: -1 });

    // 3️⃣ formater pour frontend
    const formatted = messages.map((m) => ({
      _id: m._id,
      senderName: m.sender?.fullName || "Utilisateur inconnu",
      text: m.text,
      listingTitle: m.listing?.title || "",
      createdAt: m.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Erreur fetch received messages:", err);
    res.status(500).json({ error: "Impossible de récupérer les messages reçus" });
  }
});

export default router;