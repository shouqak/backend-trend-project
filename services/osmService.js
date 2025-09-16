// services/osmService.js
import axios from "axios";

/**
 * البحث عن المكان في OpenStreetMap (Nominatim)
 * وإرجاع الإحداثيات + التصنيف
 */
export async function searchPlace(placeName) {
  try {
    const url = "https://nominatim.openstreetmap.org/search";
    const response = await axios.get(url, {
      params: {
        q: placeName,
        format: "json",
        addressdetails: 1,
        limit: 1,
      },
    });

    if (response.data.length === 0) return [];

    const place = response.data[0];
    return [
      {
        name: place.display_name,
        lat: parseFloat(place.lat),
        lon: parseFloat(place.lon),
        category: place.type, // مثال: cafe, restaurant
      },
    ];
  } catch (err) {
    console.error("OSM Error:", err.message);
    return [];
  }
}
