import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import Message from "./models/message.js";

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();

  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    },
  });

  // rendre io accessible partout
  app.set("io", io);

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // rejoindre une room (conversation)
    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
    });

    // envoyer message
   socket.on("send_message", async (data) => {
  try {
    const { conversationId, senderId, text } = data;

    if (!conversationId || !senderId || !text) {
      console.log("❌ données invalides:", data);
      return;
    }

    const savedMessage = await Message.create({
      conversationId,
      sender: senderId, // ✅ FIX
      text: text,       // ✅ FIX
    });

    const populated = await savedMessage.populate("sender", "fullName");

    io.to(conversationId).emit("receive_message", populated);

  } catch (err) {
    console.error("❌ Error send_message:", err);
  }
});

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

start().catch((e) => {
  console.error("❌ Startup error:", e);
  process.exit(1);
});