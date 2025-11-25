import fs from "fs";
import path from "path";
import csv from "csvtojson";

const INPUT_FOLDER = "../ml-latest-small";
const OUTPUT_FILE = "./data/moviesFull.json";


// Extract year from movie title
function extractYear(title) {
    const match = title.match(/\((\d{4})\)/);
    return match ? parseInt(match[1]) : null;
}

// Normalize genres into array
function parseGenres(genreString) {
    return genreString.split("|").filter(g => g !== "(no genres listed)");
}

// main fn
async function mergeDataset() {
    console.log("Loading CSV files...");

    const movies = await csv().fromFile(path.join(INPUT_FOLDER, "movies.csv"));
    const ratings = await csv().fromFile(path.join(INPUT_FOLDER, "ratings.csv"));
    const tags = await csv().fromFile(path.join(INPUT_FOLDER, "tags.csv"));
    const links = await csv().fromFile(path.join(INPUT_FOLDER, "links.csv"));

    console.log(`Movies: ${movies.length}`);
    console.log(`Ratings: ${ratings.length}`);
    console.log(`Tags: ${tags.length}`);

    const ratingMap = {};

    ratings.forEach(r => {
        const movieId = r.movieId;
        const rating = parseFloat(r.rating);

        if (!ratingMap[movieId]) {
            ratingMap[movieId] = { total: 0, count: 0 };
        }

        ratingMap[movieId].total += rating;
        ratingMap[movieId].count += 1;
    });

    // Compute avgRating
    const avgRatingMap = {};
    Object.keys(ratingMap).forEach(movieId => {
        const { total, count } = ratingMap[movieId];
        avgRatingMap[movieId] = {
            avgRating: parseFloat((total / count).toFixed(2)),
            numRatings: count
        };
    });

    const tagMap = {};

    tags.forEach(t => {
        const movieId = t.movieId;
        const tag = t.tag.toLowerCase().trim();
        if (!tagMap[movieId]) tagMap[movieId] = [];
        tagMap[movieId].push(tag);
    });

    const linksMap = {}; // movieId → { tmdbId, imdbId }

    links.forEach(l => {
        linksMap[l.movieId] = {
            imdbId: l.imdbId || null,
            tmdbId: (l.tmdbId && l.tmdbId !== "0") ? parseInt(l.tmdbId) : null
        };
    });

    const finalMovies = movies.map(m => {
        const movieId = m.movieId;
        const linkData = linksMap[movieId] || {};

        return {
            movieId: parseInt(movieId),
            title: m.title,
            year: extractYear(m.title),
            genres: parseGenres(m.genres),
            tags: tagMap[movieId] || [],
            avgRating: avgRatingMap[movieId]?.avgRating || null,
            numRatings: avgRatingMap[movieId]?.numRatings || 0,
            imdbId: linkData.imdbId || null,
            tmdbId: linkData.tmdbId || null
        };
    });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalMovies, null, 2));
    console.log(`\n✨ Merged dataset created at: ${OUTPUT_FILE}`);
    console.log(`Total movies: ${finalMovies.length}`);
}

mergeDataset();