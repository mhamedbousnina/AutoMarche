import express from "express";
// Utilise ../ pour remonter d'un dossier
import Conversation from "../models/conversation.js"; 
import Message from "../models/message.js";

const router = express.Router();

// Récupérer toutes les conversations d'un utilisateur
router.get("/:userId", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    })
    .populate("members", "fullName") 
    .populate("listingId")
    .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json(err);
  }
});
// 🗑️ SUPPRIMER UNE CONVERSATION
// 🗑️ SUPPRIMER UNE CONVERSATION ENTIÈRE
router.delete("/full/:id/:userId", async (req, res) => {
  try {
    const { id, userId } = req.params;

    // 1. Trouver la conversation
    const conversation = await Conversation.findById(id);
    if (!conversation) return res.status(404).json({ error: "Introuvable" });

    // 2. Sécurité : Vérifier si l'utilisateur est membre
    const isMember = conversation.members.some(m => m.toString() === userId);
    if (!isMember) return res.status(403).json({ error: "Accès interdit" });

    // 3. Supprimer la conversation ET ses messages
    await Conversation.findByIdAndDelete(id);
    await Message.deleteMany({ conversationId: id });

    res.status(200).json({ success: true, message: "Supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});
// routes/conversation.js
router.patch("/read/:id/:userId", async (req, res) => {
  await Conversation.findByIdAndUpdate(req.params.id, {
    $pull: { unreadBy: req.params.userId } // Retire l'utilisateur de la liste des non-lus
  });
  res.status(200).send();
});





// ✅ LA CORRECTION EST ICI :
export default router;