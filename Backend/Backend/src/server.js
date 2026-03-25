import "dotenv/config";
import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import Conversation from "./models/conversation.js";
import Message from "./models/message.js";

const PORT = process.env.PORT || 5000;

await connectDB();

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
  socket.on("join_user_room", (userId) => {
    if (userId) {
      socket.join(userId.toString());
      console.log("👤 User room:", userId);
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

      const cleanId = conversationId.toString().replace("conv_", "");

      let conversation = await Conversation.findById(cleanId);

      // 🆕 création conversation
      if (!conversation) {
        if (!receiverId) {
          console.error("❌ receiverId manquant");
          return;
        }

        conversation = await Conversation.create({
          _id: cleanId,
          members: [senderId, receiverId],
          listingId: listingId || cleanId,
        });

        console.log("✅ Nouvelle conversation créée");

        // 🔥 rejoindre room immédiatement
        socket.join(cleanId);
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

      const populated = await savedMessage.populate([
        { path: "sender", select: "fullName" },
        { path: "receiver", select: "fullName" },
        { path: "listingId" }
      ]);

      // ✅ envoyer dans room conversation
      io.to(conversation._id.toString()).emit("receive_message", populated);

      

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