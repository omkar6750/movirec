import express, { Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import moviesRoute from "./routes/movies.js";
import posterRoute from "./routes/poster.js";
import recommendRoute from "./routes/recommend.js";
import searchRoute from "./routes/search.js";
import fs from "fs";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const router = Router()


// genre route
const genreSet = new Set();
const allMovies = JSON.parse(fs.readFileSync("./data/moviesFull.json", "utf-8"));
allMovies.forEach(movie => {
    if (movie.genres && Array.isArray(movie.genres)) {
        movie.genres.forEach(g => genreSet.add(g));
    }
});

const allGenres = Array.from(genreSet).sort();
app.get("/", (req, res) => {
    res.json({ message: "Backend is running" });
});

app.use("/api/genres", router.get("/", (req, res) => {
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
})
)


app.use("/api/movies", moviesRoute);

app.use("/api/poster", posterRoute);

app.use("/api/recommendations", recommendRoute)

app.use("/api/search", searchRoute);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
