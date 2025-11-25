import { Router } from "express";
import fs from "fs";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

const movies = JSON.parse(fs.readFileSync("./data/moviesFull.json", "utf-8"));

const findMovieByImdbId = (imdbId) => {
        return movies.find((movie) => String(movie.imdbId) === String(imdbId));
};



// GET: Get all favourites (Full Objects)
router.get("/favourites", protect, async (req, res) => {
        try {
                // Fetch fresh user data
                const user = await User.findById(req.user._id);
                if (!user) return res.status(404).json({ message: "User not found" });

                const userMovieIds = user.favourites;


                // Map IDs to full JSON objects
                const fullMovies = userMovieIds
                        .map((id) => findMovieByImdbId(id))
                        .filter((movie) => movie !== undefined);

                res.json(fullMovies);
        } catch (error) {
                console.error("Error fetching favourites:", error);
                res.status(500).json({ message: "Server Error" });
        }
});

// POST: Add to favourites (With Validation)
router.post("/favourites/:id", protect, async (req, res) => {
        const imdbId = req.params.id;

        // 1. VALIDATION: Check if movie exists in our database
        const movieExists = findMovieByImdbId(imdbId);

        if (!movieExists) {
                return res.status(404).json({ message: "Movie not found in database" });
        }

        try {
                // 2. Add to MongoDB ($addToSet prevents duplicates)
                await User.findByIdAndUpdate(req.user._id, {
                        $addToSet: { favourites: imdbId }
                });
                res.json({ message: "Added to favourites" });
        } catch (error) {
                res.status(500).json({ message: "Error adding favourite" });
        }
});

// DELETE: Remove from favourites
router.delete("/favourites/:id", protect, async (req, res) => {
        const imdbId = req.params.id;

        try {
                await User.findByIdAndUpdate(req.user._id, {
                        $pull: { favourites: imdbId }
                });
                res.json({ message: "Removed from favourites" });
        } catch (error) {
                res.status(500).json({ message: "Error removing favourite" });
        }
});


// GET: Get all watchlist (Full Objects)
router.get("/watchlist", protect, async (req, res) => {
        try {
                const user = await User.findById(req.user._id);
                if (!user) return res.status(404).json({ message: "User not found" });

                const userMovieIds = user.watchlist;

                const fullMovies = userMovieIds
                        .map((id) => findMovieByImdbId(id))
                        .filter((movie) => movie !== undefined);

                res.json(fullMovies);
        } catch (error) {
                console.error("Error fetching watchlist:", error);
                res.status(500).json({ message: "Server Error" });
        }
});

// POST: Add to watchlist (With Validation)
router.post("/watchlist/:id", protect, async (req, res) => {
        const imdbId = req.params.id;

        // 1. VALIDATION
        const movieExists = findMovieByImdbId(imdbId);

        if (!movieExists) {
                return res.status(404).json({ message: "Movie not found in database" });
        }

        try {
                await User.findByIdAndUpdate(req.user._id, {
                        $addToSet: { watchlist: imdbId }
                });
                res.json({ message: "Added to watchlist" });
        } catch (error) {
                res.status(500).json({ message: "Error adding to watchlist" });
        }
});

// DELETE: Remove from watchlist
router.delete("/watchlist/:id", protect, async (req, res) => {
        const imdbId = req.params.id;

        try {
                await User.findByIdAndUpdate(req.user._id, {
                        $pull: { watchlist: imdbId }
                });
                res.json({ message: "Removed from watchlist" });
        } catch (error) {
                res.status(500).json({ message: "Error removing from watchlist" });
        }
});

export default router;