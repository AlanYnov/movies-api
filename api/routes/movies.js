const express = require('express');
const router = express.Router();
const controllers = require('../controllers/movies');

//Movies routes
router.get('/movies/:id', controllers.getMovie);
router.get('/movies', controllers.getMovies);
router.post('/movies', controllers.createMovie);
// router.put('/movies/:id', controllers.updateMovie);
// router.delete('/movies/:id', controllers.deleteMovie);

module.exports = router;