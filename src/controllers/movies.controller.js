const { getAllMovies, getMovieDetails, getMoviesByYear, getMoviesByGenre } = require("../services/movies.services")

const listMovies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const movies = await getAllMovies(page);
        if (!movies) return res.status(404).json({ error: "Movie not found" });
        res.json(movies)
    } catch (error) {
        console.error("Error Listing Movies:", error);
        res.status(500).json({ error: "Failed to fetch movies" })
    }
}

const movieDetails = async (req, res) => {
    try {
        const imdbId = req.params.id;
        const movie = await getMovieDetails(imdbId);
        if (!movie) return res.status(404).json({ error: "Movie not found" });
        res.json(movie)
    } catch (error) {
        console.error("Error fetchig movie details:", error);
        res.status(500).json({ error: "Failed to fetch movie details." })
    }

}

const moviesByYear = async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const page = parseInt(req.params.page) || 1;
        const sort = req.params.sort || "asc";
        const movies = await getMoviesByYear(year, page, sort);
        if (!movies) return res.status(404).json({ error: "Movie not found" });
        res.json(movies)
    } catch (error) {
        console.error("Error fetching movies by year:", error);
        res.status(500).json({ error: "Failed to fetch movies by year" });
    }
}

const moviesByGenre = async (req, res) => {
    try {
        const genre = req.params.genre;
        const page = parseInt(req.query.page) || 1;
        const movies = await getMoviesByGenre(genre, page)
        if (!movies) return res.status(404).json({ error: "Movie not found" });
        res.json(movies);
    } catch (error) {
        console.error("Error fetching movies by genre:", error);
        res.status(500).json({ error: "Failed fetching movies by genre!" })
    }
}

module.exports = {
    listMovies, movieDetails, moviesByYear, moviesByGenre
}
