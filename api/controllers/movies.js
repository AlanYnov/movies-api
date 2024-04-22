const Movie = require("./../models/movies");
const convert = require("xml-js");

//Get all movies
exports.getMovies = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const category = req.query.category;

  try {
    const movies = await Movie.getMovies(limit, offset, category);
    if (!movies) {
      return res.status(404).format({
        "application/json": () => {
          res.status(404).json({ error: "Movies not found" });
        },
        "application/xml": () => {
          res.status(404).send("<error>Movies not found</error>");
        },
        default: () => {
          res.status(404).send("Movies not found");
        },
      });
    }
    const acceptHeader = req.get("Accept");
    if (acceptHeader && acceptHeader.includes("application/xml")) {
      // Convert movies array to XML format
      const xmlData = convert.js2xml(movies, { compact: true, spaces: 2 });
      res.set("Content-Type", "application/xml");
      return res.status(200).send(xmlData);
    } else {
      // Respond with JSON by default
      return res.status(200).json({
        message: "Movies fetched successfully",
        total: movies.length,
        movies,
      });
    }
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
      return res.status(404).format({
        "application/json": () => {
          res.status(404).json({ error: "Movie not found" });
        },
        "application/xml": () => {
          res.status(404).send("<error>Movie not found</error>");
        },
        default: () => {
          res.status(404).send("Movie not found");
        },
      });
    }

    // Check the Accept header for JSON or XML
    const acceptHeader = req.get("Accept");
    if (acceptHeader.includes("application/xml")) {
      // Convert movie object to XML
      const xml = convert.js2xml(movie, { compact: true, spaces: 2 });
      // Respond with XML
      res.set("Content-Type", "application/xml");
      return res.status(200).send(xml);
    } else {
      // Respond with JSON by default
      return res.status(200).json({
        message: "Movie fetched successfully",
        movie,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).format({
      "application/json": () => {
        res.status(500).json({ error: "Server error" });
      },
      "application/xml": () => {
        res.status(500).send("<error>Server error</error>");
      },
      default: () => {
        res.status(500).send("Server error");
      },
    });
  }
};

// Add a new movie
exports.createMovie = async (req, res) => {
  const movieData = req.body;
  const requiredFields = [
    "title",
    "description",
    "release_date",
    "image_path",
    "rating",
    "category_id",
  ];
  const missingFields = [];
  const invalidFields = [];

  requiredFields.forEach((field) => {
    if (!movieData[field]) {
      missingFields.push(field);
    } else if (
      (field === "rating" || field === "category_id") &&
      movieData[field] === 0
    ) {
      invalidFields.push(field);
    }
  });

  if (missingFields.length > 0 || invalidFields.length > 0) {
    let errorMessage = "";
    if (missingFields.length > 0) {
      errorMessage += `The following fields are required: ${missingFields.join(
        ", "
      )}. `;
    }
    if (invalidFields.length > 0) {
      errorMessage += `The following fields cannot be 0: ${invalidFields.join(
        ", "
      )}.`;
    }
    return res.status(422).json({ error: errorMessage });
  }

  try {
    const newMovie = await Movie.createMovie(movieData);
    return res
      .status(201)
      .json({ message: "Movie created successfully", movie: newMovie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a movie by its ID
exports.updateMovie = async (req, res) => {
  const movieId = req.params.id;
  const movieData = req.body;
  if (!movieData) {
    return res.status(422).json({ error: "Movie changement is missing" });
  }
  try {
    const result = await Movie.updateMovie(movieId, movieData);
    return res.status(201).json(result);
  } catch (error) {
    if (error.error && error.error === "Movie not found") {
      return res.status(404).json({ error: "Movie not found" });
    } else {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
};

// Delete a movie by its ID
exports.deleteMovie = async (req, res) => {
  const movieId = req.params.id;

  try {
    const result = await Movie.deleteMovie(movieId);
    return res.status(200).json(result);
  } catch (error) {
    if (error.error && error.error === "Movie not found") {
      return res.status(404).json({ error: "Movie not found" });
    } else {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
};
