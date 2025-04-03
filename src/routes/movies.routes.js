const express = require("express")
const router = express.Router();
const { listMovies, movieDetails, moviesByYear, moviesByGenre } = require("../controllers/movies.controller");

//Placeholder
router.get("/", listMovies)
router.get("/:id", movieDetails)
//Default Set ASC or  /api/movies/year/2003?page=1&sort=desc
router.get("/year/:year", moviesByYear)
router.get("/genre/:genre", moviesByGenre)

module.exports = router;
