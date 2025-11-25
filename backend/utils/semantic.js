import { pipeline } from '@xenova/transformers';
// singleton model instance
let extractor = null;

export async function loadModel() {
        if (!extractor) {
                console.log("⏳ Loading AI Model for Semantic Search... (This happens once)");
                extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
                console.log("✅ AI Model Loaded!");
        }
        return extractor;
}

// 2. Convert text to Vector (Embedding)
export async function getEmbedding(text) {
        if (!text) return null;
        const model = await loadModel();
        const output = await model(text, { pooling: 'mean', normalize: true });
        return output.data;
}

// 3. Cosine Similarity 
// 1 identical, -1 opposite
export function cosineSimilarity(vecA, vecB) {
        if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

        let dotProduct = 0;
        let magnitudeA = 0;
        let magnitudeB = 0;

        for (let i = 0; i < vecA.length; i++) {
                dotProduct += vecA[i] * vecB[i];
                magnitudeA += vecA[i] * vecA[i];
                magnitudeB += vecB[i] * vecB[i];
        }

        magnitudeA = Math.sqrt(magnitudeA);
        magnitudeB = Math.sqrt(magnitudeB);

        if (magnitudeA === 0 || magnitudeB === 0) return 0;

        return dotProduct / (magnitudeA * magnitudeB);
}