import express from "express";
import Favorite from "../models/Favorite.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/favorites
router.get("/", requireAuth, async (req, res) => {
  const list = await Favorite.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ favorites: list });
});

// POST /api/favorites  (add)
router.post("/", requireAuth, async (req, res) => {
  const { movieId, title, poster_path, release_date, vote_average, lang } = req.body || {};
  if (!movieId) return res.status(400).json({ message: "movieId is required" });

  try {
    const fav = await Favorite.create({
      user: req.user.id,
      movieId,
      title: title || "",
      poster_path: poster_path || "",
      release_date: release_date || "",
      vote_average: vote_average ?? 0,
      lang: lang || "fr-FR",
    });
    res.status(201).json({ favorite: fav });
  } catch (e) {
    // duplicate key => already exists
    if (e?.code === 11000) return res.status(409).json({ message: "Already in favorites" });
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/favorites/:movieId  (remove by movieId)
router.delete("/:movieId", requireAuth, async (req, res) => {
  const movieId = Number(req.params.movieId);
  if (!movieId) return res.status(400).json({ message: "Invalid movieId" });

  await Favorite.deleteOne({ user: req.user.id, movieId });
  res.json({ ok: true });
});

export default router;