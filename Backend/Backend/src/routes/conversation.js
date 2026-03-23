import express from "express";
// Utilise ../ pour remonter d'un dossier
import Conversation from "../models/Conversation.js"; 
import Message from "../models/Message.js";

const router = express.Router();

// Récupérer toutes les conversations d'un utilisateur
router.get("/:userId", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    })
    .populate("members", "fullName") 
    .populate("listingId", "title photos price")
    .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json(err);
  }
});
// 🗑️ SUPPRIMER UNE CONVERSATION
router.delete("/:id", async (req, res) => {
  try {
    await Conversation.findByIdAndDelete(req.params.id);
    // Optionnel : Supprimer aussi tous les messages liés à cette conversation
    // await Message.deleteMany({ conversationId: req.params.id });
    
    res.status(200).json("Conversation supprimée avec succès.");
  } catch (err) {
    res.status(500).json(err);
  }
});




// ✅ LA CORRECTION EST ICI :
export default router;