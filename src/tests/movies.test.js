const request = require("supertest");
const app = require("../app");


describe("Movies API", () => {
    it("It should ", async () => {
        const res = await request(app).get("/api/movies?page=9");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);

        const movie = res.body[0];
        expect(movie).toHaveProperty("imdbId");
        expect(movie).toHaveProperty("title");
        expect(movie).toHaveProperty("genres");
        expect(movie).toHaveProperty("releaseDate");
        expect(movie).toHaveProperty("budget");
    })
})

describe("Movies API - Get by imdbId", () => {
    it("should return movie details for a valid imdbId", async () => {
      const res = await request(app).get("/api/movies/tt0048347");
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("imdbId", "tt0048347");
      expect(res.body).toHaveProperty("title", "The Man with the Golden Arm");
      expect(res.body).toHaveProperty("budget", "$0");
      expect(res.body).toHaveProperty("runtime");
      expect(res.body).toHaveProperty("releaseDate");
      expect(res.body).toHaveProperty("genres");
      expect(res.body).toHaveProperty("productionCompanies");
      expect(res.body).toHaveProperty("averageRating");
  
      // Extra: validate array structure
      expect(Array.isArray(res.body.genres)).toBe(true);
      expect(Array.isArray(res.body.productionCompanies)).toBe(true);
    });
  
    it("should return 404 for invalid imdbId", async () => {
      const res = await request(app).get("/api/movies/t123456");
  
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });
  

describe("GET /api/movies/genre/:genre", () => {
    it("It should return paginated list of movies in that genre", async () => {
        const res = await request(app).get("/api/movies/genre/Romance?page=1");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("movies");
        expect(res.body.movies.length).toBeLessThanOrEqual(50);
        expect(res.body).toHaveProperty("totalPages");
    })
})

describe("GET /api/movies/year/:year", () => {
  it("should return list of movies from the given year", async () => {
    const res = await request(app).get("/api/movies/year/1994");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const movie = res.body[0];
    expect(movie).toHaveProperty("imdbId");
    expect(movie.releaseDate.startsWith("1994")).toBe(true);
  });

  it("should return an empty list for a year with no movies", async () => {
    const res = await request(app).get("/api/movies/year/1800");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});


