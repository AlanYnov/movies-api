const express = require("express");
const router = express.Router();
const controllers = require("../controllers/movies");
const { upload } = require("../middlewares/upload");

// Movies routes

/**
 * @openapi
 * /movies/{id}:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Get a movie by ID
 *     description: Retrieve a movie from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the movie to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *           application/xml:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.get("/movies/:id", controllers.getMovie);

/**
 * @openapi
 * /movies:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Get all movies
 *     description: Retrieve a list of all movies from the database.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of movies to return (default is 10, minimum is 0, maximum is 50)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Number of page (default is 1)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter movies by category
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search movies by title or description
 *     responses:
 *       200:
 *         description: List of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Movies fetched successfully"
 *                 total:
 *                   type: integer
 *                   example: 20
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 offset:
 *                   type: integer
 *                   example: 0
 *                 prev:
 *                   type: string
 *                   example: http://localhost:4000/movies?limit=2&offset=0&category="
 *                 next:
 *                   type: string
 *                   example: http://localhost:4000/movies?limit=2&offset=4&category="
 *                 movies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *           application/xml:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Movies fetched successfully"
 *                 total:
 *                   type: integer
 *                   example: 20
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 offset:
 *                   type: integer
 *                   example: 0
 *                 prev:
 *                   type: string
 *                   example: http://localhost:4000/movies?limit=2&offset=0&category="
 *                 next:
 *                   type: string
 *                   example: http://localhost:4000/movies?limit=2&offset=4&category="
 *                 movies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movies not found
 *       500:
 *         description: Server error
 */
router.get("/movies", controllers.getMovies);

/**
 * @openapi
 * /movies:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Create a new movie
 *     description: Add a new movie to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               movie:
 *                 $ref: '#/components/schemas/MovieInput'
 *               categories:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: ["Drama", "Comedy"]
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       422:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post("/movies", upload.single('file'), controllers.createMovie);

/**
 * @openapi
 * /movies/{id}:
 *   put:
 *     security:
 *       - BearerAuth: []
 *     summary: Update a movie
 *     description: Update an existing movie in the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the movie to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated movie data (optional)
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *             example:
 *               description: "new description"
 *     responses:
 *       201:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.put("/movies/:id", controllers.updateMovie);

/**
 * @openapi
 * /movies/{id}:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     summary: Delete a movie
 *     description: Delete a movie from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the movie to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Movie deleted successfully
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.delete("/movies/:id", controllers.deleteMovie);

module.exports = router;
