import Place from "../models/place.js";
import updatePlaces from "../services/updatePlaces.js";

// GET /api/places
export const getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/places/:id
export const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ error: "Place not found" });
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/places/update
export const updatePlacesManually = async (req, res) => {
  try {
    await updatePlaces();
    res.json({ message: "✅ Places updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// DELETE /api/places/:id
export const deletePlaceById = async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id); 
    if (!place) return res.status(404).json({ error: "Place not found" });
    res.json({ message: "✅ Place deleted successfully" });
    } catch (err) { 
    res.status(500).json({ error: err.message });
    }
};
