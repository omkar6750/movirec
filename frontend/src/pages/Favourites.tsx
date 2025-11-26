import { useState, useEffect } from "react";
import { Loader2, Heart } from "lucide-react";
import MovieCard from "@/components/MoviesCard";

interface Movie {
	imdbId: string;
	title: string;
	rating: number;
	year?: number;
	genres?: string[];
	poster?: string;
}

export default function Favourites() {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchFavourites();
	}, []);

	const fetchFavourites = async () => {
		try {
			const serverUrl = import.meta.env.VITE_SERVER_URL;

			// credentials: "include" is CRITICAL to send the Auth Cookie
			const response = await fetch(`${serverUrl}/api/user/favourites`, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch favourites");
			}

			const data = await response.json();
			console.log(data);
			// The backend returns the array of movies directly
			setMovies(data);
		} catch (err) {
			setError("Could not load your favourites. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto px-4 pt-20 py-8">
			{/* Header */}
			<div className="mb-8 flex items-center gap-3">
				<Heart className="h-8 w-8 text-red-500 fill-red-500" />
				<h2 className="text-3xl font-bold tracking-tight">
					Your Favourites
				</h2>
			</div>

			{/* Loading State */}
			{loading && (
				<div className="flex justify-center items-center py-20">
					<Loader2 className="h-10 w-10 animate-spin text-primary" />
				</div>
			)}

			{/* Error State */}
			{error && (
				<div className="text-center py-20 text-red-500 bg-red-50 rounded-lg">
					<p>{error}</p>
				</div>
			)}

			{/* Empty State */}
			{!loading && !error && movies.length === 0 && (
				<div className="text-center py-20 border rounded-lg bg-muted/20">
					<h3 className="text-xl font-semibold">No favourites yet</h3>
					<p className="text-muted-foreground mt-2">
						Start adding movies you love to this list!
					</p>
				</div>
			)}

			{/* Movies Grid */}
			{!loading && movies.length > 0 && (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
					{movies.map((movie) => (
						<MovieCard key={movie.imdbId} movie={movie} />
					))}
				</div>
			)}
		</div>
	);
}
