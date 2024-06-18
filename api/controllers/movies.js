const Movie = require("./../models/movies");
const Category = require("./../models/categories");
const convert = require("xml-js");

//Get all movies
exports.getMovies = async (req, res) => {
  const link = req.protocol + '://' + req.get('host');
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const {category, searchTerm} = req.query;

  if(limit < 0 || limit > 50){
    return res.status(422).json({error: "Limit should be between 0 and 50"});
  }

  try {
    // Get number of movies
    const totalMovies = await Movie.countMovies(category, searchTerm);
    const totalPages = Math.ceil(totalMovies / limit);

    if (page < 1 || page > totalPages) {
      return res.status(404).json({ error: "Page not found" });
    }

    const offset = (page - 1) * limit;

    // Pagination system
    const baseUrl = link + req.baseUrl + req.path;
    const links = {
      first: `${baseUrl}?limit=${limit}&page=1${category ? `&category=${category}` : ''}${searchTerm ? `&searchTerm=${searchTerm}` : ''}`,
      prev: page > 1 ? `${baseUrl}?limit=${limit}&page=${page - 1}${category ? `&category=${category}` : ''}${searchTerm ? `&searchTerm=${searchTerm}` : ''}` : null,
      next: page < totalPages ? `${baseUrl}?limit=${limit}&page=${page + 1}${category ? `&category=${category}` : ''}${searchTerm ? `&searchTerm=${searchTerm}` : ''}` : null,
      last: `${baseUrl}?limit=${limit}&page=${totalPages}${category ? `&category=${category}` : ''}${searchTerm ? `&searchTerm=${searchTerm}` : ''}`,
    };

    // Get movies
    const movies = await Movie.getMovies(limit, offset, category, searchTerm);

    //Get all categories for movies
    for (const movie of movies) {
      const categories = await Movie.getMovieCategories(movie.id);
      movie.categories = categories.map(category => category.label);
      movie.image = `${link}/image/${movie.image}`;
    }

    if (!movies) {
      return res.status(404).json({ error: "Movies not found" });
    }
    const acceptHeader = req.get("Accept");
    if (acceptHeader && acceptHeader.includes("application/xml")) {
      const xmlData = convert.js2xml({
        message: "Movies fetched successfully",
        meta: {
          total: totalMovies,
          limit,
          page,
          totalPages,
        },
        links,
        movies
      }, { compact: true, spaces: 2 });
      res.set("Content-Type", "application/xml");
      return res.status(200).send(xmlData);
    } else {
      return res.status(200).json({
        message: "Movies fetched successfully",
        meta: {
          total: totalMovies,
          limit,
          page,
          totalPages,
        },
        links,
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
  const link = req.protocol + '://' + req.get('host');
  const movieID = req.params.id;
  try {
    const movie = await Movie.getMovie(movieID);
    movie.image = `${link}/image/${movie.image}`;

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
  const moviePath = `${req.file ? req.file.path.replace(/\\/g, '/') : null}`;
  const movieData = JSON.parse(req.body.movie);
  const categories = req.body.categories.split(',') || [];
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
        const isCategoryExists = await Category.checkIfCategoryExists(category);
        if (!isCategoryExists) {
          errorMessage = `The category ${category} does not exist. `;
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