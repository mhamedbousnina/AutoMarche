import Message from "../models/message.js";
import Conversation from "../models/conversation.js";

// 🔥 Envoyer un message
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, text } = req.body;

    if (!conversationId || !senderId || !text) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    // 🔥 Vérifier que la conversation existe
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ error: "Conversation introuvable" });

    // 🔥 Déterminer le destinataire
    const receiverId = conversation.members.find((id) => id.toString() !== senderId);

    // 🔥 Créer le message
    const message = await Message.create({
      conversationId,
      sender: senderId,
      receiver: receiverId,
      text,
      listingId: conversation.listingId,
    });

    const populated = await message.populate([
      { path: "sender", select: "fullName" },
      { path: "receiver", select: "fullName" },
      { path: "listingId", select: "title" },
    ]);

    // 🔥 Envoyer en temps réel via Socket.IO
    const io = req.app.get("io");
    if (io) {
      io.to(conversationId).emit("receive_message", populated); // chat temps réel
      io.to(receiverId).emit("new_dashboard_message", populated); // notification destinataire
      io.to(senderId).emit("message_sent", populated); // sync expéditeur
    }

    res.status(201).json(populated);
  } catch (err) {
    console.error("❌ sendMessage:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔥 Obtenir les messages d’une conversation
export const getConversation = async (req, res) => {
  try {
    // On récupère l'ID depuis params au lieu de query
    const { conversationId } = req.params; 
    
    if (!conversationId) return res.status(400).json({ error: "ID manquant" });

    const messages = await Message.find({ conversationId })
      .populate("sender", "fullName")
      .populate("receiver", "fullName")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("❌ getConversation:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔥 Messages reçus pour le dashboard
export const getReceivedMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({ receiver: userId })
      .populate("sender", "fullName")
      .populate("listingId", "title")
      .sort({ createdAt: -1 });

    const formatted = messages.map((m) => ({
      _id: m._id,
      fromName: m.sender?.fullName || "Utilisateur",
      text: m.text,
      listingTitle: m.listingId?.title || "",
      conversationId: m.conversationId,
      createdAt: m.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ getReceivedMessages:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔥 Messages envoyés
export const getSentMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({ sender: userId })
      .populate("receiver", "fullName")
      .populate("listingId", "title")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    console.error("❌ getSentMessages:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔥 Supprimer un message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ deleteMessage:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};