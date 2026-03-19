import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    text: { type: String, required: true },

    from: {
      id: String,
      name: String,
    },

    to: {
      id: String,
      name: String,
    },

    listingId: String,
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);