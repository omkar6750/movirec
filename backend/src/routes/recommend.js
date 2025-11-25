import { Router } from "express";
import fs from "fs";
import path from "path";
import { getEmbedding, cosineSimilarity } from "../../utils/semantic.js";

const router = Router();
const dataDir = path.join(process.cwd(), "data");

// 1. Load Data
const moviesPath = path.join(dataDir, "moviesFull.json");
const allMovies = JSON.parse(fs.readFileSync(moviesPath, "utf-8"));

// 2. Load Tag Embeddings (for the final semantic step)
const embeddingsPath = path.join(dataDir, "tagEmbeddings.json");
let tagEmbeddings = {};
if (fs.existsSync(embeddingsPath)) {
        tagEmbeddings = JSON.parse(fs.readFileSync(embeddingsPath, "utf-8"));
}

const WEIGHTS = {
        // Stage 1 Weights 
        DECADE_MATCH: 30,
        RATING_MULTIPLIER: 5,
        POPULARITY_LOG: 3,

        // Stage 2 Weights 
        SEMANTIC_MATCH: 100,
};

const MOOD_MAP = {
        "happy": ["Comedy", "Adventure", "Animation"],
        "sad": ["Drama", "Romance"],
        "excited": ["Action", "Thriller", "Sci-Fi"],
        "chill": ["Documentary", "Fantasy"],
        "scared": ["Horror", "Thriller", "Mystery"]
};

router.post("/", async (req, res) => {
        const { mood, genres, decade, minRating, vibe, limit = 10 } = req.body;

        // 0. Handle "Empty State" 
        if (!mood && !genres && !decade && !minRating && !vibe) {
                return res.json(allMovies.sort(() => 0.5 - Math.random()).slice(0, limit));
        }


        // A. Merge User Genres & Mood Genres
        const targetGenres = new Set(genres || []);
        if (mood && MOOD_MAP[mood.toLowerCase()]) {
                MOOD_MAP[mood.toLowerCase()].forEach(g => targetGenres.add(g));
        }

        // B. Prepare User Vibe Vector (AI)
        let userVibeVector = null;
        if (vibe) {
                try {
                        const raw = await getEmbedding(vibe);
                        userVibeVector = Array.from(raw);
                } catch (e) { console.error("Model Error:", e); }
        }


        // Broad filtering with genre and decade
        let candidates = allMovies;

        // Filter 1: Overlap Check

        if (targetGenres.size > 0) {
                candidates = candidates.filter(m =>
                        m.genres.some(g => targetGenres.has(g))
                );
        }

        // Scoring Loop: Calculate "Base Score" (Decade + Rating)
        candidates = candidates.map(movie => {
                let baseScore = 0;

                // Decade Weight
                if (decade) {
                        const movieDecade = Math.floor(movie.year / 10) * 10;
                        if (movieDecade === parseInt(decade)) {
                                baseScore += WEIGHTS.DECADE_MATCH;
                        } else if (Math.abs(movieDecade - parseInt(decade)) === 10) {
                                // Soft match: +/- 10 years gets partial points
                                baseScore += (WEIGHTS.DECADE_MATCH / 2);
                        }
                }

                // Rating Weight
                if (movie.avgRating) {
                        baseScore += (movie.avgRating * WEIGHTS.RATING_MULTIPLIER);
                }

                // Popularity Weight (Logarithmic to smooth out huge numbers)
                if (movie.numRatings) {
                        baseScore += Math.log(movie.numRatings) * WEIGHTS.POPULARITY_LOG;
                }

                return { ...movie, score: baseScore };
        });


        // Sort by Base Score and take the top 50
        let topCandidates = candidates
                .sort((a, b) => b.score - a.score)
                .slice(0, 50);

        //embedded semantic search
        if (userVibeVector && topCandidates.length > 0) {
                topCandidates = topCandidates.map(movie => {
                        let maxSimilarity = 0;

                        // Check every tag of this movie against user vibe
                        if (movie.tags && movie.tags.length > 0) {
                                movie.tags.forEach(tag => {
                                        const tagVec = tagEmbeddings[tag.toLowerCase()];
                                        if (tagVec) {
                                                const sim = cosineSimilarity(userVibeVector, tagVec);
                                                if (sim > maxSimilarity) maxSimilarity = sim;
                                        }
                                });
                        }

                        movie.score += (maxSimilarity * WEIGHTS.SEMANTIC_MATCH);

                        return movie;
                });
        }

        // Final Sort & Limit
        const finalResults = topCandidates
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);

        res.json(finalResults);
});

export default router;