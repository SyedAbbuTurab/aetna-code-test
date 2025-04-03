const express = require("express");
const dotenv = require("dotenv").config();
const moviesRouter = require("./routes/movies.routes")


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

//Routes
app.use("/api/movies", moviesRouter);

//Root
app.get("/", (req, res) => {
    res.send("Aetna Movie API is running")
})

app.listen(PORT, () => {
    console.log(`Server runnig on port ${PORT}`);
})

module.exports = app;
