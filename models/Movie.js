import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  name: String,
  description: String,
  rating: Number,
  releaseDate: Date,
  duration: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Movie", movieSchema);
