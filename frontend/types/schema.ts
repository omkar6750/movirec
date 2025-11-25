import { z } from "zod";

// --- Enums ---
// Defined here to be used in both validation and UI generation
export enum Mood {
	HAPPY = "happy",
	SAD = "sad",
	EXCITED = "excited",
	CHILL = "chill",
	SCARED = "scared",
}

export enum Genre {
	ACTION = "Action",
	ADVENTURE = "Adventure",
	ANIMATION = "Animation",
	CHILDREN = "Children",
	COMEDY = "Comedy",
	CRIME = "Crime",
	DOCUMENTARY = "Documentary",
	DRAMA = "Drama",
	FANTASY = "Fantasy",
	FILM_NOIR = "Film-Noir",
	HORROR = "Horror",
	MUSICAL = "Musical",
	MYSTERY = "Mystery",
	ROMANCE = "Romance",
	SCI_FI = "Sci-Fi",
	THRILLER = "Thriller",
	WAR = "War",
	WESTERN = "Western",
}

// --- Zod Schema ---
export const movieFormSchema = z.object({
	vibe: z
		.string()
		.trim()
		.min(3, { message: "Describe the vibe in at least 3 characters." })
		.max(200, { message: "Keep it under 200 characters." }),
	mood: z.nativeEnum(Mood, {
		error: () => ({ message: "Please select a mood." }),
	}),
	// Transform string input from Select into the enum, or validate direct enum
	genres: z
		.array(z.nativeEnum(Genre))
		.min(1, { message: "Select at least one genre." })
		.max(5, { message: "You can select up to 5 genres." }),
	decade: z.string().optional(),
	minRating: z.coerce
		.number()
		.min(0, { message: "Rating must be at least 0." })
		.max(10, { message: "Rating cannot exceed 10." })
		.default(7),
});
