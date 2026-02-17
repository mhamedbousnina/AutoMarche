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

    color: { type: String },
    body: { type: String },
    power: { type: Number },
    doors: { type: Number },
    description: { type: String },

    price: { type: Number, required: true },
    negotiable: { type: Boolean, default: true },

    contactFullName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    gov: { type: String, required: true },
    city: { type: String },

    photos: [{ type: String }], // chemins fichiers
  },
  { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);