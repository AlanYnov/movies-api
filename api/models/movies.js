const connection = require("../../config/db");

class Movie {
  static getMovies(limit, offset, category) {
    const query = category
      ? `SELECT m.*, c.label AS category FROM movies AS m 
        JOIN categories AS c ON m.category_id = c.id 
        WHERE c.label = ?
        LIMIT ? OFFSET ?`
      : `SELECT * FROM movies LIMIT ? OFFSET ?`;

    const queryParams = category ? [category, limit, offset] : [limit, offset];

    return new Promise((resolve, reject) => {
      connection.query(query, queryParams, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  static getMovie(movieID) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM movies WHERE id = ?`;
      connection.query(query, movieID, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  static getMoviesByCategory(categoryName, limit, offset) {
    return new Promise((resolve, reject) => {
      const query = `
          SELECT m.*, c.name FROM movies AS m 
          JOIN categories AS c ON m.id = c.movie_id 
          WHERE c.label = ?
          LIMIT ? OFFSET ?`;
      connection.query(
        query,
        [categoryName, limit, offset],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0]);
          }
        }
      );
    });
  }

  static createMovie(movie) {
    const {
      title,
      description,
      release_date,
      image_path,
      rating,
      category_id,
    } = movie;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO movies (title, description, release_date, image_path, rating, category_id) VALUES (?, ?, ?, ?, ?, ?)`;
      connection.query(
        query,
        [title, description, release_date, image_path, rating, category_id],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve({ id: results.insertId, ...movie });
          }
        }
      );
    });
  }

  // Update a movie by ID
  static updateMovie(movieId, movieData) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE movies SET ? WHERE id = ?`;
      connection.query(query, [movieData, movieId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.affectedRows === 0) {
            reject({ error: "Movie not found" });
          } else {
            resolve({ message: "Movie updated successfully" });
          }
        }
      });
    });
  }

  // Delete a movie by ID
  static deleteMovie(movieId) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM movies WHERE id = ?`;
      connection.query(query, [movieId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.affectedRows === 0) {
            reject({ error: "Movie not found" });
          } else {
            resolve({ message: "Movie deleted successfully" });
          }
        }
      });
    });
  }
}

module.exports = Movie;
