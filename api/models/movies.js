const connection = require("../../config/db");

class Movie {
  static getMovies(limit, offset, category, searchTerm) {
    const query = 
      `SELECT m.* FROM movies AS m 
      ${category ? `
      JOIN category_movie AS cm ON cm.movie_id = m.id 
      JOIN categories AS c ON cm.category_id = c.id 
      WHERE c.label = ?` : ''}
      ${searchTerm ? (category ? 'AND' : 'WHERE') + ` (m.title LIKE ? OR m.description LIKE ?)` : ''}
      LIMIT ? OFFSET ?`;

      const queryParams = category
      ? (searchTerm ? [category, `%${searchTerm}%`, `%${searchTerm}%`, limit, offset] : [category, limit, offset])
      : (searchTerm ? [`%${searchTerm}%`, `%${searchTerm}%`, limit, offset] : [limit, offset]);

    return new Promise((resolve, reject) => {
      connection.query(query, queryParams, (error, results) => {
        console.log(results)
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
      const query = `
        SELECT m.* FROM movies AS m
        LEFT JOIN category_movie AS cm ON cm.movie_id = m.id 
        LEFT JOIN categories AS c ON cm.category_id = c.id 
        WHERE m.id = ?`;
      connection.query(query, movieID, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  static getMovieCategories(movieID) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.label FROM categories AS c
        JOIN category_movie AS cm ON cm.category_id = c.id 
        WHERE cm.movie_id = ?`;
      connection.query(query, movieID, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  static createMovie(movie, moviePath) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO movies (title, description, release_date, image, rating) VALUES (?, ?, ?, ?, ?)`;
      connection.query(
        query,
        [
          movie.title,
          movie.description,
          movie.release_date,
          moviePath,
          movie.rating,
        ],
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

  static countMovies(category, searchTerm) {
    const query =
      `SELECT COUNT(m.id) AS total FROM movies AS m 
      ${category ? `
      JOIN category_movie AS cm ON cm.movie_id = m.id 
      JOIN categories AS c ON cm.category_id = c.id 
      WHERE c.label = ?` : ''}
      ${searchTerm ? (category ? 'AND' : 'WHERE') + ` (m.title LIKE ? OR m.description LIKE ?)` : ''}`;

      const queryParams = category ? (searchTerm ? [category, `%${searchTerm}%`, `%${searchTerm}%`] : [category]) : (searchTerm ? [`%${searchTerm}%`, `%${searchTerm}%`] : []);

    return new Promise((resolve, reject) => {
      connection.query(query, queryParams, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0].total);
        }
      });
    });
  }
}

module.exports = Movie;
