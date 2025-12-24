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

// Utility function to add delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Axios instance with retry logic
const axiosInstance = axios.create();
axiosInstance.defaults.timeout = 10000; // 10s timeout

const fetchPage = async (page) => {
  try {
    const res = await axiosInstance.get(
      "https://api.themoviedb.org/3/movie/top_rated",
      {
        params: {
          api_key: TMDB_API_KEY,
          page,
        },
      }
    );
    return res.data.results.map((m) => ({
      name: m.title,
      description: m.overview,
      rating: m.vote_average,
      releaseDate: m.release_date,
      tmdbId: m.id,
      poster: m.poster_path
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Image",
    }));
  } catch (error) {
    console.warn(`⚠️ Error fetching page ${page}: ${error.message}. Retrying...`);
    await delay(1000); // wait 1s before retry
    return fetchPage(page); // recursive retry
  }
};

const importMovies = async () => {
  try {
    console.log("⏳ Fetching movies from TMDB...");
    let allMovies = [];

    for (let page = 1; page <= 13; page++) {
      const movies = await fetchPage(page);
      allMovies.push(...movies);

      // Small delay between requests to avoid TMDB rate-limit
      await delay(500);
      console.log(`✅ Page ${page} fetched`);
    }

    // Only top 250
    allMovies = allMovies.slice(0, 250);

    // Remove old movies
    await Movie.deleteMany({});

    // Insert new movies
    await Movie.insertMany(allMovies);

    console.log("🎬 Top 250 movies imported successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error importing movies:", error.message);
    process.exit(1);
  }
};

importMovies();
