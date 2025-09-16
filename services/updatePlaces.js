import Place from "../models/Place.js";
import { getTrendingPlaces } from "./tiktokService.js";
import { searchPlace } from "./osmService.js";

/**
 * تحديث الأماكن وحفظها في MongoDB
 */
export default async function updatePlaces() {
  const tiktokPlaces = await getTrendingPlaces();

  for (let p of tiktokPlaces) {
    const geo = await searchPlace(p.name);

    if (geo.length > 0) {
      // تحقق إذا المكان موجود بالفعل
      const existing = await Place.findOne({ name: p.name });
      if (existing) continue;

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
}
