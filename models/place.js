import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      lat: Number,
      lng: Number,
    },
    category: { type: String, required: true },
    popularItems: [String],
    images: [String],
    source: { type: String, default: "tiktok" },
  },
  { timestamps: true }
);

export default mongoose.model("Place", placeSchema);
