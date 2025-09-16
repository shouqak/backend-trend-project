import mongoose from "mongoose";
import Place from "../models/place.js";
import { getTrendingPlaces } from "./tiktokService.js";
import { searchPlace } from "./osmService.js";

mongoose.connect("mongodb://127.0.0.1:27017/tiktok_places");

async function updatePlaces() {
  const tiktokPlaces = await getTrendingPlaces();

  for (let p of tiktokPlaces) {
    const geo = await searchPlace(p.name);

    if (geo.length > 0) {
      await Place.create({
        name: p.name,
        location: { lat: geo[0].lat, lng: geo[0].lon },
        category: geo[0].category || "unknown",
        popularItems: p.popularItems,
        images: p.images,
      });
      console.log("💾 Saved:", p.name);
    }
  }

  mongoose.connection.close();
}

updatePlaces();
