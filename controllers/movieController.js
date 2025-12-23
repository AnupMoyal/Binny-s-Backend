import Movie from "../models/Movie.js";

export const getMovies = async (req, res) => {
  res.json(await Movie.find());
};

export const searchMovies = async (req, res) => {
  const q = req.query.q;
  res.json(
    await Movie.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ]
    })
  );
};

export const sortMovies = async (req, res) => {
  res.json(await Movie.find().sort({ [req.query.by]: 1 }));
};

export const addMovie = async (req, res) => {
  res.json(await Movie.create(req.body));
};

export const updateMovie = async (req, res) => {
  res.json(await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true }));
};

export const deleteMovie = async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
