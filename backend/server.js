import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import fetch from "node-fetch";

import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js";
import favoritesRoutes from "./src/routes/favorites.js";

dotenv.config();

const app = express();
  
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://movie-app-pi-ivory.vercel.app"
    ],
    credentials: false,
  })
);
app.use(cors({ origin: true }));


app.use(express.json());
app.use(morgan("dev"));

const PORT = process.env.PORT || 5000;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!process.env.MONGO_URI) console.error("❌ Missing MONGO_URI in backend/.env");
if (!process.env.JWT_SECRET) console.error("❌ Missing JWT_SECRET in backend/.env");
if (!TMDB_API_KEY) console.error("❌ Missing TMDB_API_KEY in backend/.env");

await connectDB(process.env.MONGO_URI);

const TMDB_BASE = "https://api.themoviedb.org/3";

async function tmdb(path, params = {}) {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", params.lang || "fr-FR");

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && `${v}` !== "" && k !== "lang") {
      url.searchParams.set(k, v);
    }
  });

  const res = await fetch(url.toString());
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.status_message || res.statusText || "TMDB error";
    const err = new Error(msg);
    err.status = res.status;
    err.details = data;
    throw err;
  }

  return data;
}

// health
app.get("/api/health", (req, res) => res.json({ ok: true }));

// ✅ Auth + Favorites
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);

// ✅ TMDB proxy routes
app.get("/api/trending", async (req, res, next) => {
  try {
    const data = await tmdb("/trending/movie/week", { lang: req.query.lang });
    res.json(data);
  } catch (e) { next(e); }
});

app.get("/api/top-rated", async (req, res, next) => {
  try {
    const data = await tmdb("/movie/top_rated", { lang: req.query.lang, page: req.query.page || 1 });
    res.json(data);
  } catch (e) { next(e); }
});

app.get("/api/search", async (req, res, next) => {
  try {
    const q = req.query.q || "";
    const page = req.query.page || 1;
    const lang = req.query.lang;

    if (!q.trim()) return res.status(400).json({ message: "Missing q" });

    const data = await tmdb("/search/movie", {
      lang,
      query: q,
      page,
      include_adult: false,
    });

    res.json(data);
  } catch (e) { next(e); }
});

app.get("/api/movie/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await tmdb(`/movie/${id}`, {
      lang: req.query.lang,
      append_to_response: "videos,credits,recommendations",
    });
    res.json(data);
  } catch (e) { next(e); }
});

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Server error",
    status,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});