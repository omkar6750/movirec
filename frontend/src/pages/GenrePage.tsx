import { useState, useEffect } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import MovieCard from "@/components/MoviesCard";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

interface Movie {
	imdbId: string;
	title: string;
	rating: number;
	year?: number;
	genre?: string[];
}

interface GenreListResponse {
	results: string[];
}

interface MovieListResponse {
	page: number;
	limit: number;
	totalMovies: number;
	totalPages: number;
	results: Movie[];
}

function getPaginationRange(current: number, total: number) {
	const delta = 1;
	const range: (number | "...")[] = [];
	const left = Math.max(2, current - delta);
	const right = Math.min(total - 1, current + delta);

	range.push(1);
	if (left > 2) range.push("...");
	for (let i = left; i <= right; i++) range.push(i);
	if (right < total - 1) range.push("...");
	if (total > 1) range.push(total);

	return range;
}

export function GenrePage() {
	// Genre List State
	const [allGenres, setAllGenres] = useState<string[]>([]);
	const [loadingGenres, setLoadingGenres] = useState(true);

	// Selection State
	const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

	// Movie List State
	const [movies, setMovies] = useState<Movie[]>([]);
	const [loadingMovies, setLoadingMovies] = useState(false);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [movieData, setMovieData] = useState<MovieListResponse | null>(null);

	// Config
	const limit = 20;
	const serverUrl =
		import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

	// 1. Fetch All Genres on Mount
	useEffect(() => {
		const fetchGenres = async () => {
			try {
				// Fetching a large limit to get all genres at once for the UI
				const response = await fetch(`${serverUrl}/api/genres`);
				if (!response.ok) throw new Error("Failed to fetch genres");
				const data: GenreListResponse = await response.json();
				setAllGenres(data.results);
			} catch (error) {
				console.error("Error fetching genres:", error);
			} finally {
				setLoadingGenres(false);
			}
		};

		fetchGenres();
	}, [serverUrl]);

	// 2. Fetch Movies when Selected Genre or Page changes
	useEffect(() => {
		if (!selectedGenre) return;

		const fetchMovies = async () => {
			setLoadingMovies(true);
			try {
				const response = await fetch(
					`${serverUrl}/api/movies?genre=${encodeURIComponent(
						selectedGenre
					)}&page=${page}&limit=${limit}`
				);

				if (!response.ok) throw new Error("Failed to fetch movies");

				const data: MovieListResponse = await response.json();
				setMovies(data.results);
				setTotalPages(data.totalPages);
				setMovieData(data);
			} catch (error) {
				console.error("Error fetching movies:", error);
				setMovies([]);
			} finally {
				setLoadingMovies(false);
			}
		};

		fetchMovies();
	}, [selectedGenre, page, serverUrl]);

	// -- Handlers --

	const handleGenreSelect = (genre: string) => {
		setSelectedGenre(genre);
		setPage(1); // Reset to page 1 when switching genres
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleBackToGenres = () => {
		setSelectedGenre(null);
		setMovies([]); // Optional: clear movies to save memory
		setMovieData(null);
	};

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setPage(newPage);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	// -- Render --

	// VIEW 1: Loading Genres
	if (loadingGenres) {
		return (
			<div className="flex justify-center items-center h-[50vh]">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	// VIEW 2: Genre Selection List (No genre selected)
	if (!selectedGenre) {
		return (
			<div className="container mx-auto px-4 pt-16 py-8">
				<div className="mb-8 text-center">
					<h2 className="text-3xl font-bold mb-4">Browse by Genre</h2>
					<p className="text-muted-foreground">
						Select a category to explore movies
					</p>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
					{allGenres.map((genre) => (
						<button
							key={genre}
							onClick={() => handleGenreSelect(genre)}
							className="bg-card hover:bg-accent/50 border rounded-lg p-6 text-center transition-all hover:scale-105 shadow-sm hover:shadow-md group"
						>
							<span className="font-semibold text-lg group-hover:text-primary transition-colors">
								{genre}
							</span>
						</button>
					))}
				</div>
			</div>
		);
	}

	// VIEW 3: Movie List (Genre Selected) - Matches your requested UI
	return (
		<div className="container mx-auto px-4 pt-16 py-8">
			{/* Header with Back Button */}
			<div className="mb-8">
				<Button
					variant="ghost"
					onClick={handleBackToGenres}
					className="mb-4 pl-0 hover:pl-2 transition-all"
				>
					<ArrowLeft className="mr-2 h-4 w-4" /> Back to Genres
				</Button>

				<h2 className="mb-2 text-3xl font-bold capitalize">
					{selectedGenre} Movies
				</h2>
				{movieData && (
					<p className="text-muted-foreground">
						Found {movieData.totalMovies} results • Page {page} of{" "}
						{totalPages}
					</p>
				)}
			</div>

			{/* Loading State */}
			{loadingMovies && (
				<div className="flex justify-center items-center py-16">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<span className="ml-2 text-muted-foreground">
						Loading {selectedGenre} movies...
					</span>
				</div>
			)}

			{/* Empty State */}
			{!loadingMovies && movies.length === 0 && (
				<div className="text-center py-16">
					<h3>No movies found</h3>
					<p className="text-muted-foreground mt-2">
						We couldn't find any movies in the{" "}
						<strong>{selectedGenre}</strong> category.
					</p>
				</div>
			)}

			{/* Movies Grid */}
			{!loadingMovies && movies.length > 0 && (
				<>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
						{movies.map((movie) => (
							<MovieCard key={movie.imdbId} movie={movie} />
						))}
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="mt-10 flex justify-center">
							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious
											href="#"
											onClick={(e) => {
												e.preventDefault();
												handlePageChange(page - 1);
											}}
											className={
												page <= 1
													? "pointer-events-none opacity-50"
													: ""
											}
										/>
									</PaginationItem>

									{getPaginationRange(page, totalPages).map(
										(item, idx) => {
											if (item === "...") {
												return (
													<PaginationItem key={idx}>
														<PaginationEllipsis />
													</PaginationItem>
												);
											}
											return (
												<PaginationItem key={idx}>
													<PaginationLink
														href="#"
														isActive={item === page}
														onClick={(e) => {
															e.preventDefault();
															handlePageChange(
																item as number
															);
														}}
													>
														{item}
													</PaginationLink>
												</PaginationItem>
											);
										}
									)}

									<PaginationItem>
										<PaginationNext
											href="#"
											onClick={(e) => {
												e.preventDefault();
												handlePageChange(page + 1);
											}}
											className={
												page >= totalPages
													? "pointer-events-none opacity-50"
													: ""
											}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					)}
				</>
			)}
		</div>
	);
}
