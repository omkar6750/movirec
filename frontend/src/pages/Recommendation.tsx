"use client";

import * as React from "react";
import { z } from "zod";
import {
	X,
	Film,
	Loader2,
	Plus,
	CircleCheck,
	Info,
	AlertTriangle,
	AlertOctagon,
} from "lucide-react";
import { toast, Toaster as Sonner } from "sonner";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			className="toaster group"
			toastOptions={{
				classNames: {
					toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
					description: "group-[.toast]:text-muted-foreground",
					actionButton:
						"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					cancelButton:
						"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
				},
			}}
			icons={{
				success: <CircleCheck className="h-4 w-4 text-green-500" />,
				info: <Info className="h-4 w-4 text-blue-500" />,
				warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
				error: <AlertOctagon className="h-4 w-4 text-red-500" />,
				loading: <Loader2 className="h-4 w-4 animate-spin" />,
			}}
			{...props}
		/>
	);
};

// --- ENUMS ---
enum Mood {
	HAPPY = "happy",
	SAD = "sad",
	EXCITED = "excited",
	CHILL = "chill",
	SCARED = "scared",
}

enum Genre {
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

// --- SCHEMA ---
const movieFormSchema = z.object({
	vibe: z
		.string()
		.trim()
		.min(3, { message: "Describe the vibe in at least 3 characters." })
		.max(200, { message: "Keep it under 200 characters." }),
	mood: z.nativeEnum(Mood, {
		error: () => ({ message: "Please select a mood." }),
	}),
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

type MovieFormValues = z.infer<typeof movieFormSchema>;

// --- CONSTANTS ---
const DECADES = Array.from({ length: 11 }, (_, i) => 1920 + i * 10).reverse();

export default function MovieRecommendationForm() {
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	// State for form fields
	const [formData, setFormData] = React.useState<Partial<MovieFormValues>>({
		vibe: "",
		genres: [],
		minRating: 7,
		decade: undefined,
		mood: undefined,
	});

	// State for validation errors
	const [errors, setErrors] = React.useState<Record<string, string>>({});

	// --- HANDLERS ---

	const handleVibeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setFormData((prev) => ({ ...prev, vibe: e.target.value }));
		// Clear error on change
		if (errors.vibe) setErrors((prev) => ({ ...prev, vibe: "" }));
	};

	const handleMoodChange = (value: string) => {
		setFormData((prev) => ({ ...prev, mood: value as Mood }));
		if (errors.mood) setErrors((prev) => ({ ...prev, mood: "" }));
	};

	const handleDecadeChange = (value: string) => {
		setFormData((prev) => ({ ...prev, decade: value }));
	};

	const handleAddGenre = (value: string) => {
		const currentGenres = formData.genres || [];
		const genreToAdd = value as Genre;

		if (!currentGenres.includes(genreToAdd)) {
			const newGenres = [...currentGenres, genreToAdd];
			setFormData((prev) => ({ ...prev, genres: newGenres }));
			if (errors.genres) setErrors((prev) => ({ ...prev, genres: "" }));
		}
	};

	const handleRemoveGenre = (genreToRemove: Genre) => {
		const currentGenres = formData.genres || [];
		const newGenres = currentGenres.filter((g) => g !== genreToRemove);
		setFormData((prev) => ({ ...prev, genres: newGenres }));
	};

	const handleRatingChange = (value: string) => {
		setFormData((prev) => ({ ...prev, minRating: parseFloat(value) }));
	};

	// --- SUBMIT ---

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setIsSubmitting(true);
		setErrors({});

		// Validate using Zod
		const result = movieFormSchema.safeParse(formData);

		if (!result.success) {
			const formattedErrors: Record<string, string> = {};
			// Use .issues instead of .errors to satisfy ZodError type definition
			result.error.issues.forEach((err) => {
				if (err.path[0]) {
					formattedErrors[err.path[0] as string] = err.message;
				}
			});
			setErrors(formattedErrors);
			setIsSubmitting(false);
			toast.error("Please fix the errors in the form.");
			return;
		}

		const validData = result.data;
		console.log("Submitting Payload:", validData);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			const count = Math.floor(Math.random() * 10) + 1;

			toast.success("Recommendations Ready!", {
				description: `Found ${count} movies matching your criteria. Check your dashboard.`,
				duration: 5000,
			});
		} catch (error) {
			console.error("Submission Error:", error);
			toast.error("Submission Failed", {
				description:
					"Something went wrong fetching recommendations. Please try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="flex justify-center p-4 pt-16 h-screen w-full relative">
			<Toaster position="bottom-right" />

			<Card className="w-full max-w-2xl border-border bg-card shadow-sm h-fit radius-lg">
				<CardHeader className="space-y-1">
					<div className="flex items-center gap-2">
						<div className="p-2 rounded-md bg-primary/10">
							<Film className="w-4 h-4 text-primary" />
						</div>
						<CardTitle className="text-xl font-bold tracking-tight text-foreground">
							Movie Matchmaker
						</CardTitle>
					</div>
					<CardDescription className="text-muted-foreground">
						Tell us your vibe, and we'll handle the popcorn choices.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={onSubmit} className="space-y-4">
						{/* VIBE INPUT */}
						<div className="space-y-2">
							<Label htmlFor="vibe" className="text-foreground">
								The Vibe
							</Label>
							<Textarea
								id="vibe"
								placeholder="e.g. A rainy night in Tokyo with neon lights..."
								className="resize-none min-h-[100px] bg-background focus-visible:ring-2"
								value={formData.vibe}
								onChange={handleVibeChange}
							/>
							{errors.vibe && (
								<p className="text-sm font-medium text-destructive">
									{errors.vibe}
								</p>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* MOOD SELECT */}
							<div className="space-y-2">
								<Label className="text-foreground">Mood</Label>
								<Select
									onValueChange={handleMoodChange}
									value={formData.mood}
								>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Select a mood" />
									</SelectTrigger>
									<SelectContent>
										{Object.values(Mood).map((m) => (
											<SelectItem
												key={m}
												value={m}
												className="capitalize"
											>
												{m}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.mood && (
									<p className="text-sm font-medium text-destructive">
										{errors.mood}
									</p>
								)}
							</div>

							{/* DECADE SELECT */}
							<div className="space-y-2">
								<Label className="text-foreground">
									Decade
								</Label>
								<Select
									onValueChange={handleDecadeChange}
									value={formData.decade || "all"}
								>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Any Era" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">
											Any Era
										</SelectItem>
										{DECADES.map((d) => (
											<SelectItem
												key={d}
												value={d.toString()}
											>
												{d}s
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* GENRES MULTI-SELECT */}
						<div className="space-y-2">
							<Label className="text-foreground">Genres</Label>

							{/* Genre Selector */}
							<Select onValueChange={handleAddGenre}>
								<SelectTrigger className="bg-background">
									<SelectValue placeholder="Add genres..." />
								</SelectTrigger>
								<SelectContent>
									{Object.values(Genre).map((g) => (
										<SelectItem
											key={g}
											value={g}
											disabled={formData.genres?.includes(
												g
											)}
										>
											{g}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							{/* Selected Genres List */}
							<div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-md border border-input bg-muted/30 mt-2">
								{(!formData.genres ||
									formData.genres.length === 0) && (
									<span className="text-sm text-muted-foreground flex items-center">
										<Plus className="w-3 h-3 mr-2" /> No
										genres selected
									</span>
								)}

								{formData.genres?.map((genre) => (
									<Badge
										key={genre}
										variant="secondary"
										className="pl-2.5 pr-1 py-1 h-7 text-sm font-medium transition-all hover:bg-secondary/80"
									>
										{genre}
										<button
											type="button"
											onClick={() =>
												handleRemoveGenre(genre)
											}
											className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
										>
											<X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive transition-colors" />
											<span className="sr-only">
												Remove {genre}
											</span>
										</button>
									</Badge>
								))}
							</div>

							<p className="text-[0.8rem] text-muted-foreground">
								Select up to 5 genres to refine your search.
							</p>

							{errors.genres && (
								<p className="text-sm font-medium text-destructive">
									{errors.genres}
								</p>
							)}
						</div>

						{/* RATING SLIDER / INPUT */}
						<div className="space-y-2">
							<Label className="flex justify-between text-foreground">
								<span>Minimum Rating</span>
								<span className="text-muted-foreground font-normal">
									{formData.minRating} / 10
								</span>
							</Label>
							<div className="flex items-center gap-4">
								<Input
									type="range"
									min={0}
									max={10}
									step={0.5}
									value={formData.minRating}
									onChange={(e) =>
										handleRatingChange(e.target.value)
									}
									className="flex-1 h-2 bg-secondary accent-primary cursor-pointer border-0 p-0"
								/>
								<Input
									type="number"
									min={0}
									max={10}
									step={0.1}
									value={formData.minRating}
									onChange={(e) =>
										handleRatingChange(e.target.value)
									}
									className="w-20 text-center bg-background"
								/>
							</div>
							{errors.minRating && (
								<p className="text-sm font-medium text-destructive">
									{errors.minRating}
								</p>
							)}
						</div>

						<CardFooter className="px-0 pt-4">
							<Button
								type="submit"
								className="w-full text-base font-medium h-11"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Curating...
									</>
								) : (
									"Get Recommendations"
								)}
							</Button>
						</CardFooter>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
