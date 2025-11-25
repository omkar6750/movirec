// scripts/generate-embeddings.js
import fs from "fs";
import path from "path";
import { getEmbedding } from "../utils/semantic.js"; // Ensure this path is correct relative to this file

const DATA_DIR = path.join(process.cwd(), "data");
const INPUT_FILE = path.join(DATA_DIR, "moviesFull.json");
const OUTPUT_FILE = path.join(DATA_DIR, "tagEmbeddings.json");

async function generate() {
        console.log("Loading movies...");
        if (!fs.existsSync(INPUT_FILE)) {
                console.error("moviesFull.json not found!");
                process.exit(1);
        }
        const movies = JSON.parse(fs.readFileSync(INPUT_FILE, "utf-8"));

        // 1. Extract Unique Tags
        console.log("🔍 Extracting unique tags...");
        const uniqueTags = new Set();
        movies.forEach(m => {
                if (m.tags && Array.isArray(m.tags)) {
                        m.tags.forEach(t => {
                                const cleanTag = t.trim().toLowerCase();
                                if (cleanTag.length > 1) uniqueTags.add(cleanTag);
                        });
                }
        });

        console.log(`Found ${uniqueTags.size} unique tags. Generating vectors...`);
        console.log("This might take a minute...");

        // 2. Generate Embeddings
        const embeddingsMap = {};
        let count = 0;
        const total = uniqueTags.size;

        for (const tag of uniqueTags) {
                try {
                        // Generate vector (Float32Array)
                        const vector = await getEmbedding(tag);

                        // Convert Float32Array to regular Array for JSON saving
                        embeddingsMap[tag] = Array.from(vector);

                        count++;
                        if (count % 50 === 0) process.stdout.write(`\rProgress: ${count}/${total}`);
                } catch (err) {
                        console.error(`\n Failed to process tag: "${tag}"`, err.message);
                }
        }

        // 3. Save to File
        console.log(`\n💾 Saving to ${OUTPUT_FILE}...`);
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(embeddingsMap));
        console.log(" Done! all tags embedded");
}

generate();