import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import http from "http";
import { Server } from "socket.io";
import { Message } from "./models/Message.js";

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  app.set("io", io);

  io.on("connection", (socket) => {
    console.log("✅ Socket connecté:", socket.id);

    socket.on("joinRoom", async ({ roomId }) => {
      if (!roomId) return;
      socket.join(roomId);
      console.log(`📥 ${socket.id} joined ${roomId}`);

      try {
        const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
        socket.emit("history", messages);
      } catch (err) {
        console.error("❌ Error fetching history:", err);
      }
    });

    socket.on("leaveRoom", async ({ roomId }) => {
      if (!roomId) return;
      socket.leave(roomId);
      console.log(`🔴 ${socket.id} left ${roomId}`);

      // Optionnel : effacer la conversation quand on quitte la room
      if (roomId) {
        try {
          await Message.deleteMany({ roomId });
          console.log(`🗑️ Conversation effacée pour room ${roomId}`);
        } catch (err) {
          console.error("❌ Erreur suppression conversation:", err);
        }
      }
    });

    socket.on("sendMessage", async (data) => {
      if (!data?.roomId || !data?.text) return;

      try {
        const message = await Message.create({
          roomId: data.roomId,
          text: data.text,
          from: data.from,
          to: data.to,
          listingId: data.listingId,
        });

        io.to(data.roomId).emit("message", message);
      } catch (err) {
        console.error("❌ Error sending message:", err);
      }
    });

    socket.on("disconnect", async (reason) => {
      console.log("❌ Socket déconnecté:", socket.id, "reason:", reason);

      // Effacer toutes les conversations des rooms jointes par ce socket
      const joinedRooms = Array.from(socket.rooms).filter((room) => room !== socket.id);
      if (joinedRooms.length > 0) {
        try {
          await Promise.all(
            joinedRooms.map((roomId) => Message.deleteMany({ roomId }))
          );
          console.log(`🗑️ Conversations effacées pour rooms: ${joinedRooms.join(", ")}`);
        } catch (err) {
          console.error("❌ Erreur suppression lors de disconnect:", err);
        }
      }
    });
  });

  server.listen(PORT, () => {
    console.log(`🔥 Server running on http://localhost:${PORT}`);
  });
}

start().catch((e) => {
  console.error("❌ Startup error:", e);
  process.exit(1);
});