const sqlite3 = require("sqlite3").verbose();
const path = require("path");
// const dotenv = require("dotenv");

// dotenv.config(); 

const moviesDbPath = path.join(__dirname, "..", "..", process.env.MOVIES_DB)
const ratingsDbPath = path.join(__dirname, "..", "..", process.env.RATINGS_DB)

const moviesDb = new sqlite3.Database(moviesDbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) console.log("Error connecting to movies.db:", err.message);
});

const ratingsDb = new sqlite3.Database(ratingsDbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) console.log("Error connecting to movies.db:", err.message);
});

module.exports = {
    moviesDb, ratingsDb
}

