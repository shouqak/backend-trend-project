import express from "express";
import Place from "../models/Place.js";

const router = express.Router();

// GET all places
router.get("/", async (req, res) => {
  const places = await Place.find();
  res.json(places);
});

// ADD new place
router.post("/", async (req, res) => {
  const newPlace = new Place(req.body);
  await newPlace.save();
  res.json(newPlace);
});

export default router;
