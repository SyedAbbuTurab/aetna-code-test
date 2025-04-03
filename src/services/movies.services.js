const { moviesDb, ratingsDb } = require("../config/db");

const getAllMovies = (page = 1) => {
    const limit = 50;
    const offset = (page - 1) * limit;

    const sql = `
    SELECT imdbId, title, genres, releaseDate, budget
    FROM movies LIMIT ? OFFSET ?`;

    return new Promise((resolve, reject) => {
        moviesDb.all(sql, [limit, offset], (err, rows) => {
            if (err) return reject(err);

            const formatted = rows.map((rows) => ({
                imdbId: rows.imdbId,
                title: rows.title,
                genres: JSON.parse(rows.genres),
                releaseDate: rows.releaseDate,
                budget: `$${Number(rows.budget).toLocaleString("en-US")}`
            }))

            resolve(formatted)
        })
    })
}

const getMovieDetails = (imdbId) => {
    return new Promise((resolve, reject) => {
        const sql = `
        SELECT movieId, imdbId, title, overview, overview, releaseDate, budget, runtime, genres, language, productionCompanies
        FROM movies WHERE imdbId = ?`;

        moviesDb.get(sql, [imdbId], (err, movie) => {
            if (err) reject(err);
            if (!movie) return resolve(null);

            // Now get average rating from ratingsDB
            const ratingSql = `SELECT AVG(rating) as average_rating FROM ratings
            WHERE movieId = ?`;

            ratingsDb.get(ratingSql, [movie.movieId], (ratingErr, ratingRow) => {
                if (ratingErr) reject(ratingErr);
                const formatted = {
                    imdbId: movie.imdbId,
                    movieId: movie.movieId,
                    title: movie.title,
                    description: movie.description,
                    releaseDate: movie.releaseDate,
                    budget: `$${Number(movie.budget).toLocaleString("en-US")}`,
                    runtime: movie.runtime,
                    genres: JSON.parse(movie.genres),
                    productionCompanies: JSON.parse(movie.productionCompanies),
                    averageRating: ratingRow?.average_rating ? parseFloat(ratingRow.average_rating).toFixed(1) : null

                }
                resolve(formatted)
            })
        })
    })
}

const getMoviesByYear = (year, page = 1, sort = 'asc') => {
    const limit = 50;
    const offset = (page - 1) * limit;

    //Sanitize Sort
    const sortOrder = sort.toLowerCase() === "desc" ? "DESC" : "ASC";

    const sql = `SELECT imdbId, title, genres, releaseDate, budget 
    FROM movies
    WHERE strftime('%Y', releaseDate) = ?
    ORDER BY releaseDate ${sortOrder}
    LIMIT ? OFFSET ?`;

    return new Promise((resolve, reject) => {
        moviesDb.all(sql, [year.toString(), limit, offset], (err, rows) => {
            if (err) return reject(err);

            const formatted = rows.map((row) => ({
                imdbId: row.imdbId,
                title: row.title,
                genres: JSON.parse(row.genres),
                releaseDate: row.releaseDate,
                budget: `$${Number(row.budget).toLocaleString("en-US")}`,
            }))
            resolve(formatted)
        })
    })
}

const getMoviesByGenre = (genre, page = 1) => {
    const limit = 50;
    const offset = (page - 1) * limit;
  
    // We search inside the genres JSON string field
    const genrePattern = `%\"name\": \"${genre.toLowerCase()}\"%`;
  
    const countSql = `
      SELECT COUNT(*) as count
      FROM movies
      WHERE LOWER(genres) LIKE ?
    `;
  
    const dataSql = `
      SELECT imdbId, title, genres, releaseDate, budget
      FROM movies
      WHERE LOWER(genres) LIKE ?
      LIMIT ? OFFSET ?
    `;
  
    return new Promise((resolve, reject) => {
      moviesDb.get(countSql, [genrePattern], (countErr, countRow) => {
        if (countErr) return reject(countErr);
  
        const totalResults = countRow?.count || 0;
        const totalPages = Math.ceil(totalResults / limit);
  
        moviesDb.all(dataSql, [genrePattern, limit, offset], (err, rows) => {
          if (err) return reject(err);
  
          const formatted = rows.map((row) => ({
            imdbId: row.imdbId,
            title: row.title,
            genres: JSON.parse(row.genres),
            releaseDate: row.releaseDate,
            budget: `$${Number(row.budget).toLocaleString("en-US")}`,
          }));
  
          resolve({
            page,
            pageSize: limit,
            totalPages,
            totalResults,
            movies: formatted,
          });
        });
      });
    });
  };
  

module.exports = {
    getAllMovies, getMovieDetails, getMoviesByYear, getMoviesByGenre
}
