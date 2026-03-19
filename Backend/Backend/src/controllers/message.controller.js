import { Message } from "../models/Message.js";

// 📥 récupérer toutes les conversations
export const getConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$roomId",
          lastMessage: { $first: "$text" },
          lastDate: { $first: "$createdAt" },
          from: { $first: "$from" },
          to: { $first: "$to" },
        },
      },
      {
        $project: {
          roomId: "$_id",
          preview: "$lastMessage",
          when: "$lastDate",
          from: 1,
          to: 1,
          _id: 0,
        },
      },
    ]);

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📜 messages d'une room
export const getMessagesByRoom = async (req, res) => {
  try {
    const messages = await Message.find({
      roomId: req.params.roomId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};