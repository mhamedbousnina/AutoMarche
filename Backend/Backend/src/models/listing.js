import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    title: { type: String, required: true },
    state: { type: String, enum: ["Occasion", "Neuf"], required: true },

    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    mileage: { type: Number, required: true },

    fuel: { type: String, required: true },
    gearbox: { type: String, required: true },

    color: { type: String, default: "" },
    body: { type: String, default: "" },
    power: { type: Number, default: null },
    doors: { type: Number, default: null },
    description: { type: String, default: "" },

    price: { type: Number, required: true },
    negotiable: { type: Boolean, default: true },

    contactFullName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    gov: { type: String, required: true },
    city: { type: String, default: "" },

    photos: [{ type: String, default: [] }], // ✅ "/uploads/xxx.jpg"

    status: { type: String, default: "Pending" }, // optionnel
    views: { type: Number, default: 0 },          // optionnel
    favoritesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);