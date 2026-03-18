import { Message } from "../models/Message.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

export const getMessagesByRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  if (!roomId) throw new AppError("roomId requis", 400);

  const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
  res.json({ success: true, messages });
});

export const getConversations = asyncHandler(async (req, res) => {
  // optional filter by listingId
  const { listingId } = req.query;
  const filter = {};
  if (listingId) filter.listingId = listingId;

  const conversations = await Message.aggregate([
    { $match: filter },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$roomId",
        lastMessage: { $first: "$text" },
        from: { $first: "$from" },
        to: { $first: "$to" },
        listingId: { $first: "$listingId" },
        updatedAt: { $first: "$createdAt" },
        count: { $sum: 1 },
      },
    },
    { $sort: { updatedAt: -1 } },
  ]);

  res.json({ success: true, conversations });
});
