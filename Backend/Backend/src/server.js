import "dotenv/config";
import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import Conversation from "./models/conversation.js";
import Message from "./models/message.js";

const PORT = process.env.PORT || 5000;

// Connexion DB
await connectDB();

const httpServer = createServer(app);

// Configuration Socket.io avec ton CORS_ORIGIN
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("🟢 Connecté au socket:", socket.id);

  // Rejoindre une room par ID utilisateur (pour les notifications)
  socket.on("join_user_room", (userId) => {
    if (userId) {
      socket.join(userId.toString());
      console.log(`👤 User Room: ${userId}`);
    }
  });

  // Rejoindre une room de conversation spécifique
  socket.on("join_conversation", (conversationId) => {
    if (conversationId) {
      // Nettoyage au cas où l'ID contient "conv_"
      const cleanId = conversationId.toString().replace("conv_", "");
      socket.join(cleanId);
      console.log(`💬 Conversation Room: ${cleanId}`);
    }
  });

  // Envoi de message
socket.on("send_message", async (data) => {
  try {
    const { conversationId, senderId, receiverId, text, listingId } = data;
    if (!senderId || !text) return;

    const cleanId = conversationId.toString().replace("conv_", "");
    
    let conversation = await Conversation.findById(cleanId);

    // ✨ Si la conversation n'existe pas encore
    if (!conversation) {
      console.log("🆕 Tentative de création d'une nouvelle conversation...");
      
      // Vérification de sécurité pour éviter l'erreur "members.1 is required"
      if (!receiverId) {
        console.error("❌ Impossible de créer la conversation : receiverId manquant.");
        return;
      }

      conversation = await Conversation.create({
        _id: cleanId, // On utilise l'ID généré ou celui du listing
        members: [senderId, receiverId], // ✅ On a bien les deux membres maintenant
        listingId: listingId || cleanId,
      });
      
      console.log("✅ Conversation créée avec succès !");
    }

    // On identifie le destinataire réel
    const finalReceiverId = conversation.members.find(
      (id) => id.toString() !== senderId.toString()
    );

    // Sauvegarde du message
    const savedMessage = await Message.create({
      conversationId: conversation._id,
      sender: senderId,
      receiver: finalReceiverId,
      text,
      listingId: conversation.listingId,
    });

    const populated = await savedMessage.populate([
      { path: "sender", select: "fullName" },
      { path: "receiver", select: "fullName" },
      { path: "listingId", select: "title" },
    ]);

    // Diffusion aux deux membres
    io.to(conversation._id.toString()).emit("receive_message", populated);

    if (finalReceiverId) {
      io.to(finalReceiverId.toString()).emit("new_dashboard_message", populated);
    }
  } catch (err) {
    console.error("❌ Erreur lors de l'envoi/création:", err);
  }
});

  socket.on("disconnect", () => {
    console.log("🔴 Déconnecté:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`✅ Serveur prêt sur http://localhost:${PORT}`);
});