import { Router } from "express";
import fs from "fs";

const router = Router();

// Load movies once when the server starts
const movies = JSON.parse(fs.readFileSync("./data/moviesFull.json", "utf-8"));

router.get("/", (req, res) => {

    let { page = 1, limit = 20, genre, sortBy, order = "desc" } = req.query;


    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 20;


    let filteredMovies = movies;

    // filter by genre 
    if (genre) {
        const searchGenre = genre.toLowerCase();
        filteredMovies = filteredMovies.filter((movie) => {

            return (
                movie.genres &&
                Array.isArray(movie.genres) &&
                movie.genres.some((g) => g.toLowerCase() === searchGenre)
            );
        });
    }

    // sort by year
    if (sortBy === "year") {
        filteredMovies.sort((a, b) => {
            const yearA = a.year || 0;
            const yearB = b.year || 0;

            if (order === "asc") {
                return yearA - yearB;
            } else {
                return yearB - yearA;
            }
        });
    }


    const start = (page - 1) * limit;
    const end = start + limit;

    const results = filteredMovies.slice(start, end);

    res.json({
        page,
        limit,
        totalMovies: filteredMovies.length,
        totalPages: Math.ceil(filteredMovies.length / limit),
        genre: genre || "All",
        sortBy: sortBy || "Default",
        results,
    });
});

export default router;


