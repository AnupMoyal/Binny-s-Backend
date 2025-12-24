import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    rating: Number,
    releaseDate: String,
    poster: String,

    tmdbId: {
      type: Number,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);
