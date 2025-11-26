import { Router } from "express";
import fs from "fs";


const router = Router()

const allMovies = JSON.parse(fs.readFileSync("./data/moviesFull.json", "utf-8"));

router.get("/", (req, res) => {
        const { title } = req.query;

        let { page = 1, limit = 20 } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 20;

        const start = (page - 1) * limit;
        const end = start + limit;

        if (!title || typeof title !== "string") {
                return res.status(400).json({
                        message: "Please provide a valid 'title' query parameter."
                });
        }


        const normalizedQuery = title.toLowerCase().trim();

        const searchResults = allMovies.filter(movie => {
                const normalizedMovieTitle = movie.title.toLowerCase();


                return normalizedMovieTitle.includes(normalizedQuery);
        })

        const results = searchResults.slice(start, end);

        res.json({
                page,
                limit,
                totalMovies: results.length,
                totalPages: Math.ceil(searchResults.length / limit),
                query: normalizedQuery,
                results: results
        });
});

export default router