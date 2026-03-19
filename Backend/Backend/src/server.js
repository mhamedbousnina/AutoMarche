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
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // 🔥 SOCKET
  io.on("connection", (socket) => {
    console.log("✅ Socket connecté:", socket.id);

    // 📥 JOIN ROOM
    socket.on("joinRoom", async ({ roomId }) => {
      if (!roomId) return;

      socket.join(roomId);

      try {
        const messages = await Message.find({ roomId }).sort({ createdAt: 1 });

        // 🔥 FORMAT FRONT
        const formatted = messages.map((m) => ({
          id: m._id,
          text: m.text,
          from: m.from,
          to: m.to,
          createdAt: m.createdAt,
        }));

        socket.emit("history", formatted);
      } catch (err) {
        console.error("❌ history error:", err);
      }
    });

    // 🚪 LEAVE
    socket.on("leaveRoom", ({ roomId }) => {
      socket.leave(roomId);
    });

    // 💬 SEND MESSAGE
    socket.on("sendMessage", async (data) => {
      try {
        if (!data?.roomId || !data?.text) return;

        const message = await Message.create({
          roomId: data.roomId,
          text: data.text,
          from: data.from,
          to: data.to,
          listingId: data.listingId,
        });

        const formatted = {
          id: message._id,
          text: message.text,
          from: message.from,
          to: message.to,
          createdAt: message.createdAt,
        };

        // 🔥 envoi temps réel
        io.to(data.roomId).emit("message", formatted);
      } catch (err) {
        console.error("❌ sendMessage error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket déconnecté:", socket.id);
    });
  });

  server.listen(PORT, () => {
    console.log(`🔥 Server running on http://localhost:${PORT}`);
  });
}

start();