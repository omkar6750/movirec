import { z } from "zod";
import { movieFormSchema, Genre, Mood } from "./schema";

// Inferred type from Zod schema
export type MovieFormValues = z.infer<typeof movieFormSchema>;

// Re-export enums for easier imports in the component
export { Genre, Mood };

// API Response type (Mocked structure based on assumed backend)
export interface RecommendationResponse {
	success: boolean;
	data: Array<{
		id: string;
		title: string;
		year: string;
		rating: number;
	}>;
}

export interface Movie {
	movieId: number;
	title: string;
	year: number | null; // Updated to allow null
	genres: string[];
	tags: string[]; // Required for the Vibe/Semantic features
	avgRating: number | null;
	numRatings: number;
	imdbId: number | null; // Updated to number per your schema
	tmdbId: number | null;

	// Frontend specific props (added by backend engine)
	score?: number;
	poster?: string;
}

// export interface RecommendationResponse {
// 	data: Movie[];
// }
