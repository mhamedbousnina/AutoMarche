import "dotenv/config";
import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import Conversation from "./models/conversation.js";
import Message from "./models/message.js";

const PORT = process.env.PORT || 5000;

await connectDB();

// Ensure the current Conversation indexes match the schema (drop stale legacy indexes)
try {
  await Conversation.syncIndexes();
  console.log("✅ Conversation indexes synced");
} catch (syncErr) {
  console.warn("⚠️ Conversation index sync failed:", syncErr);
}

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("🟢 Connecté:", socket.id);

  // ✅ ROOM USER
  socket.on("join_user_room", async (userId) => {
    if (userId) {
      socket.join(userId.toString());
      console.log("👤 User room:", userId);

      try {
        const pendingNotifications = await Message.find({
          receiver: userId,
          read: false,
        })
          .populate("sender", "fullName")
          .populate("listingId", "title")
          .sort({ createdAt: -1 });

        const formatted = pendingNotifications.map((message) => ({
          _id: message._id,
          fromName: message.sender?.fullName || "Utilisateur",
          text: message.text,
          listingTitle: message.listingId?.title || "",
          conversationId: message.conversationId,
          createdAt: message.createdAt,
        }));

        socket.emit("pending_notifications", formatted);
      } catch (err) {
        console.error("❌ Erreur pending_notifications:", err);
      }
    }
  });

  // ✅ ROOM CONVERSATION
  socket.on("join_conversation", (conversationId) => {
    if (conversationId) {
      const cleanId = conversationId.toString().replace("conv_", "");
      socket.join(cleanId);
      console.log("💬 Conversation room:", cleanId);
    }
  });

  // ✅ ENVOI MESSAGE
  socket.on("send_message", async (data) => {
    try {
      const { conversationId, senderId, receiverId, text, listingId } = data;

      if (!senderId || !text) return;
      if (!receiverId || !listingId) {
        console.error("❌ senderId, receiverId ou listingId manquant");
        return;
      }

      const sortedMembers = [senderId.toString(), receiverId.toString()].sort();
      const canonicalConversationId = `${sortedMembers[0]}_${sortedMembers[1]}_${listingId}`;
      const requestedId = conversationId ? conversationId.toString().replace("conv_", "") : null;
      const cleanId = requestedId || canonicalConversationId;

      let conversation = await Conversation.findById(cleanId);
      if (!conversation) {
        conversation = await Conversation.findOne({
          listingId,
          members: { $all: sortedMembers },
        });
      }

      // 🆕 création conversation
      if (!conversation) {
        try {
          conversation = await Conversation.create({
            _id: canonicalConversationId,
            members: sortedMembers,
            listingId,
          });
          console.log("✅ Nouvelle conversation créée");

          // 🔥 rejoindre room immédiatement
          socket.join(canonicalConversationId);
        } catch (createErr) {
          if (createErr.code === 11000) {
            conversation = await Conversation.findOne({
              listingId,
              members: { $all: sortedMembers },
            });
            if (!conversation) throw createErr;
          } else {
            throw createErr;
          }
        }
      }

      const finalReceiverId = conversation.members.find(
        (id) => id.toString() !== senderId.toString()
      );

      const savedMessage = await Message.create({
        conversationId: conversation._id,
        sender: senderId,
        receiver: finalReceiverId,
        text,
        listingId: conversation.listingId,
      });

      await Conversation.findByIdAndUpdate(conversation._id, {
        lastMessage: savedMessage._id,
        $addToSet: { unreadBy: finalReceiverId } // Ajoute le destinataire aux "non-lus"
      });

      const populated = await savedMessage.populate([
        { path: "sender", select: "fullName" },
        { path: "receiver", select: "fullName" },
        { path: "listingId" }
      ]);

      

      // ✅ envoyer dans room conversation
       io.to(conversation._id.toString()).emit("receive_message", populated);
      // ✅ notification temps réel pour le destinataire
      if (finalReceiverId) {
        io.to(finalReceiverId.toString()).emit("receive_message", populated);
      }
      io.to(senderId.toString()).emit("message_sent", populated);

      

    } catch (err) {
      console.error("❌ Erreur message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Déconnecté:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});