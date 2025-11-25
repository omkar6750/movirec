import { Router } from "express";
import fs from "fs";

const router = Router();

// Process genres once when server starts
const genreSet = new Set();
try {
        const allMovies = JSON.parse(fs.readFileSync("./data/moviesFull.json", "utf-8"));
        allMovies.forEach(movie => {
                if (movie.genres && Array.isArray(movie.genres)) {
                        movie.genres.forEach(g => genreSet.add(g));
                }
        });
} catch (error) {
        console.error("Error reading movies file for genres:", error);
}

const allGenres = Array.from(genreSet).sort();

router.get("/", (req, res) => {
        let { page = 1, limit = 20 } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 20;

        const start = (page - 1) * limit;
        const end = start + limit;

        const results = allGenres.slice(start, end);

        res.json({
                page,
                limit,
                totalGenres: allGenres.length,
                totalPages: Math.ceil(allGenres.length / limit),
                results
        });
});

export default router;