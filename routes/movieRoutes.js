import express from "express";
import {
  getMovies,
  searchMovies,
  sortMovies,
  addMovie,
  updateMovie,
  deleteMovie
} from "../controllers/movieController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getMovies);
router.get("/search", searchMovies);
router.get("/sorted", sortMovies);
router.post("/", protect, adminOnly, addMovie);
router.put("/:id", protect, adminOnly, updateMovie);
router.delete("/:id", protect, adminOnly, deleteMovie);

export default router;
