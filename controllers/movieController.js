// controllers/movieController.js
import Movie from "../models/Movie.js";

/**
 * GET /movies?page=1
 * Pagination supported
 */
export const getMovies = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const totalMovies = await Movie.countDocuments();

    const movies = await Movie.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      movies,
      totalPages: Math.ceil(totalMovies / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movies" });
  }
};

/**
 * GET /movies/search?q=batman
 */
export const searchMovies = async (req, res) => {
  try {
    const q = req.query.q || "";

    const movies = await Movie.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    });

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};

/**
 * GET /movies/sorted?sort=name
 */
export const sortMovies = async (req, res) => {
  try {
    const sortBy = req.query.sort || "name";
    const movies = await Movie.find().sort({ [sortBy]: 1 });

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: "Sorting failed" });
  }
};

/**
 * POST /movies (ADMIN)
 */
export const addMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ message: "Failed to add movie" });
  }
};

/**
 * PUT /movies/:id (ADMIN)
 */
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(movie);
  } catch (error) {
    res.status(400).json({ message: "Update failed" });
  }
};

/**
 * DELETE /movies/:id (ADMIN)
 */
export const deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Delete failed" });
  }
};
