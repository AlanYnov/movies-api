const Movie = require("./../models/movies");
const Category = require("./../models/categories");
const convert = require("xml-js");

//Get all movies
exports.getMovies = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const {category, searchTerm} = req.query;

    // Get number of movies
    const totalMovies = await Movie.countMovies(category, searchTerm);

    // Pagination system
    const baseUrl = req.protocol + '://' + req.get('host') + req.baseUrl + req.path;
    const prevOffset = Math.max(0, offset - limit);
    const nextOffset = offset + limit;
    const prevLink = (offset > 0) ? `${baseUrl}?limit=${limit}&offset=${prevOffset}&category=${category || ''}` : null;
    const nextLink = (nextOffset < totalMovies) ? `${baseUrl}?limit=${limit}&offset=${nextOffset}&category=${category || ''}` : null;

  try {
    const movies = await Movie.getMovies(limit, offset, category, searchTerm);

    //Get all categories for movies
    for (const movie of movies) {
      const categories = await Movie.getMovieCategories(movie.id);
      movie.categories = categories.map(category => category.label);
    }

    if (!movies) {
      return res.status(404).json({ error: "Movies not found" });
    }
    const acceptHeader = req.get("Accept");
    if (acceptHeader && acceptHeader.includes("application/xml")) {
      const xmlData = convert.js2xml({
        message: "Movies fetched successfully",
        total: totalMovies,
        limit,
        offset,
        prev: prevLink || null,
        next: nextLink || null,
        movies
      }, { compact: true, spaces: 2 });
      res.set("Content-Type", "application/xml");
      return res.status(200).send(xmlData);
    } else {
      return res.status(200).json({
        message: "Movies fetched successfully",
        total: totalMovies,
        limit,
        offset,
        prev: prevLink || null,
        next: nextLink || null,
        movies
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

    // Get all categories for the movie
    const categories = await Movie.getMovieCategories(movie.id);
    movie.categories = categories.map(category => category.label);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Check the Accept header for JSON or XML
    const acceptHeader = req.get("Accept");
    if (acceptHeader.includes("application/xml")) {
      const xml = convert.js2xml(movie, { compact: true, spaces: 2 });
      res.set("Content-Type", "application/xml");
      return res.status(200).send(xml);
    } else {
      return res.status(200).json({
        message: "Movie fetched successfully",
        movie,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Add a new movie
exports.createMovie = async (req, res) => {
  const moviePath = req.file?.path || null;
  const movieData = JSON.parse(req.body.movie);
  const categories = req.body.categories.split(',') || [];
  console.log(categories)
  const requiredFields = [
    "title",
    "description",
    "release_date",
    "rating"
  ];
  const missingFields = [];
  
  requiredFields.forEach((field) => {
    if (!(field in movieData)) {
      missingFields.push(field);
    }
  });

    let errorMessage = undefined;

    if(categories.length > 0) {
    // Check if category exists
      for (const category of categories) {
        console.log(category);
        const isCategoryExists = await Category.checkIfCategoryExists(category);
        if (!isCategoryExists) {
          errorMessage = `The category ID ${category} does not exist. `;
        }
      }
    }

    // Check if rating is correctly set
    if (movieData.rating < 1 || movieData.rating > 5) {
      errorMessage = `The rating parameters should be between 1 and 5. `;
    }
    
    // Check if all required fields are present
    if (missingFields.length > 0) {
      errorMessage = `The following fields are required: ${missingFields.join(", ")}. `;
    }

    if(errorMessage) {
      return res.status(422).json({ error: errorMessage });
    }

  try {
    const newMovie = await Movie.createMovie(movieData, moviePath);
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