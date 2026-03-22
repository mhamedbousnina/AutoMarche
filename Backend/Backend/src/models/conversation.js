import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);