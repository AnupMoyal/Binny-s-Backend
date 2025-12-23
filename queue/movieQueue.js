import Queue from "bull";
import Movie from "../models/Movie.js";

const movieQueue = new Queue("movieQueue");

movieQueue.process(async job => {
  await Movie.create(job.data);
});

export default movieQueue;
