import axios from "axios";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Movie from "../models/Movie.js";

dotenv.config();

// ✅ Connect MongoDB
await connectDB();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
  console.error("❌ TMDB_API_KEY missing in .env file");
  process.exit(1);
}

const importMovies = async () => {
  try {
    let allMovies = [];

    console.log("⏳ Fetching movies from TMDB...");

    for (let page = 1; page <= 13; page++) {
      const res = await axios.get(
        "https://api.themoviedb.org/3/movie/top_rated",
        {
          params: {
            api_key: TMDB_API_KEY,
            page,
          },
        }
      );

      const movies = res.data.results.map((m) => ({
        name: m.title,
        description: m.overview,
        rating: m.vote_average,
        releaseDate: m.release_date,
        tmdbId: m.id, // 🔥 prevent duplicates
      }));

      allMovies.push(...movies);
    }

    // ✅ Only Top 250
    allMovies = allMovies.slice(0, 250);

    // ❌ Remove old movies (optional but recommended)
    await Movie.deleteMany({});

    // ✅ Insert new movies
    await Movie.insertMany(allMovies);

    console.log("✅ Top 250 movies imported successfully!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error importing movies:", error.message);
    process.exit(1);
  }
};

importMovies();
