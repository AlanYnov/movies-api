const Movie = require("./../models/movies");

//Get all movies
exports.getMovies = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const category = req.query.category;

    try {
        const movies = await Movie.getMovies(limit, offset, category);
        if (!movies) {
            return res.status(404).json({ error: "Movies not found" });
        }
        return res.status(200).json({
            message: "Movies fetched successfully",
            total: movies.length,
            movies,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

//Get movie by ID
exports.getMovie = async (req, res) => {
  const movieID = req.params.id;
  try {
    const movie = await Movie.getMovie(movieID);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    return res.status(200).json({
      message: "Movie fetched successfully",
      movie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Add a new movie
exports.createMovie = async (req, res) => {
    const movieData = req.body.movie;
    const requiredFields = ['title', 'description', 'release_date', 'image_path', 'rating', 'category_id'];
    const missingFields = [];

    requiredFields.forEach(field => {
        if (!movieData[field]) {
            missingFields.push(field);
        }
    });

    if (missingFields.length > 0) {
        const errorMessage = `The following fields are required: ${missingFields.join(', ')}`;
        return res.status(422).json({ error: errorMessage });
    }

    try {
        const newMovie = await Movie.createMovie(movieData);
        return res.status(201).json({ message: "Movie created successfully", movie: newMovie });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};