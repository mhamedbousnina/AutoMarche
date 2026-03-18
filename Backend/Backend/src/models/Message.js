import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    text: { type: String, required: true },
    from: { type: String }, // buyer / seller
    to: { type: String },
    listingId: { type: String },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
