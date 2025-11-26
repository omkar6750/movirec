import { Link, useLocation } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import MoviesGrid from "@/components/MoviesGrid";

interface Movie {
	imdbId: string;
	title: string;
	rating: number;
	year?: number;
	genre?: string[];
	score?: number; // Optional, as the backend adds this
}

export default function RecommendedMovies() {
	const location = useLocation();

	// Retrieve data passed via React Router state
	const { results: movies, vibe } = location.state || {};

	// Handling direct access (e.g., refresh)
	if (!movies) {
		return (
			<div className="container mx-auto px-4 pt-32 text-center">
				<h2 className="text-2xl font-bold mb-4">
					No Recommendations Found
				</h2>
				<p className="text-muted-foreground mb-8">
					It looks like you refreshed the page or came here directly.
					Please fill out the form to get fresh recommendations.
				</p>
				<Link to="/recommended">
					<Button>Go to Form</Button>
				</Link>
			</div>
		);
	}

	const movieList = movies as Movie[];

	return (
		<div className="container mx-auto px-4 pt-16 py-8">
			{/* Header */}
			<div className="mb-8 flex flex-col gap-4">
				<Link to="/recommended" className="w-fit">
					<Button
						variant="ghost"
						size="sm"
						className="-ml-2 text-muted-foreground hover:text-foreground"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Try Another Vibe
					</Button>
				</Link>

				<div>
					<div className="flex items-center gap-2 mb-2">
						<Sparkles className="h-5 w-5 text-primary" />
						<h2 className="text-2xl font-bold">
							Your Curated Picks
						</h2>
					</div>

					{vibe && (
						<p className="text-muted-foreground italic">
							Based on: "{vibe}"
						</p>
					)}
				</div>
			</div>

			{/* Empty State */}
			{movieList.length === 0 && (
				<div className="text-center py-16">
					<h3 className="text-lg font-semibold">No matches found</h3>
					<p className="text-muted-foreground mt-2">
						Try adjusting your vibe description or lowering the
						rating filter.
					</p>
				</div>
			)}

			{/* Movies Grid */}
			{movieList.length > 0 && (
				<MoviesGrid
					movies={movies}
					//   isLoading={loading}
					//   onCardClick={(movie) => navigate(`/movie/${movie.imdbId}`)}
					// optional: override columns for small pages
					colsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
				/>
			)}
		</div>
	);
}
