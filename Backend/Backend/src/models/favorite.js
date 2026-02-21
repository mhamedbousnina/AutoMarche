import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
  },
  { timestamps: true }
);

// يمنع نفس المستخدم يعمل favorite لنفس الإعلان مرتين
favoriteSchema.index({ userId: 1, listingId: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);