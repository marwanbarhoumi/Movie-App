import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    // movie fields
    movieId: { type: Number, required: true },
    title: { type: String, default: "" },
    poster_path: { type: String, default: "" },
    release_date: { type: String, default: "" },
    vote_average: { type: Number, default: 0 },

    // optional: lang at save time
    lang: { type: String, default: "fr-FR" },
  },
  { timestamps: true }
);

// تمنع duplications: نفس user + نفس movieId
favoriteSchema.index({ user: 1, movieId: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);