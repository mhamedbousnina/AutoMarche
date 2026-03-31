import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    unreadBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  
  { timestamps: true }
);
conversationSchema.index(
  { listingId: 1, "members.0": 1, "members.1": 1 },
  { unique: true }
);
const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);
export default Conversation;