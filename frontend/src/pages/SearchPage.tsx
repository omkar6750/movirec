import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
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
// import { Alert, AlertDescription } from "./ui/alert";

interface SearchPageProps {
	searchQuery: string;
}

interface Movie {
	imdbId: string;
	title: string;
	rating: number;
	year?: number;
	genre?: string[];
}

interface SearchResponse {
	page: number;
	limit: number;
	totalMovies: number;
	totalPages: number;
	query: string;
	results: Movie[];
}

function getPaginationRange(current: number, total: number) {
	const delta = 1; // show current ±1 pages
	const range: (number | "...")[] = [];
	const left = Math.max(2, current - delta);
	const right = Math.min(total - 1, current + delta);

	// Always show first page
	range.push(1);

	// Left ellipsis
	if (left > 2) {
		range.push("...");
	}

	// Middle pages
	for (let i = left; i <= right; i++) {
		range.push(i);
	}

	// Right ellipsis
	if (right < total - 1) {
		range.push("...");
	}

	// Always show last page (only if >1)
	if (total > 1) {
		range.push(total);
	}

	return range;
}

export function SearchPage({ searchQuery }: SearchPageProps) {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [searchData, setSearchData] = useState<SearchResponse | null>(null);
	const limit = 20;

	useEffect(() => {
		if (searchQuery) {
			fetchMovies(searchQuery, page);
		}
	}, [searchQuery, page]);

	const fetchMovies = async (query: string, currentPage: number) => {
		setLoading(true);
		setError(null);

		try {
			const serverUrl =
				import.meta.env.VITE_SERVER_URL || "http://localhost:4000";
			const response = await fetch(
				`${serverUrl}/api/search?title=${encodeURIComponent(
					query
				)}&page=${currentPage}&limit=${limit}`
			);

			if (!response.ok) {
				throw new Error("Failed to fetch movies");
			}

			const data: SearchResponse = await response.json();
			setMovies(data.results);
			setTotalPages(data.totalPages);
			setSearchData(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			setMovies([]);
		} finally {
			setLoading(false);
		}
	};

	if (!searchQuery) {
		return (
			<div className="container mx-auto px-4 py-16">
				<div className="text-center space-y-4">
					<h2>Search for Movies</h2>
					<p className="text-muted-foreground">
						Use the search bar above to find your favorite movies
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 pt-16 py-8">
			{/* Search Results Header */}
			<div className="mb-8">
				<h2 className="mb-2">Search Results for "{searchQuery}"</h2>
				{searchData && (
					<p className="text-muted-foreground">
						Found {searchData.results.length} results on page {page}{" "}
						of {totalPages}
					</p>
				)}
			</div>

			{/* Loading State */}
			{loading && (
				<div className="flex justify-center items-center py-16">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<span className="ml-2 text-muted-foreground">
						Loading movies...
					</span>
				</div>
			)}

			{/* Error State */}
			{/* {error && (=
				<Alert variant="destructive" className="mb-8">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)} */}

			{/* No Results */}
			{!loading && !error && movies.length === 0 && (
				<div className="text-center py-16">
					<h3>No movies found</h3>
					<p className="text-muted-foreground mt-2">
						Try searching with different keywords
					</p>
				</div>
			)}

			{/* Movies Grid */}
			{!loading && movies.length > 0 && (
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
									{/* Previous */}
									<PaginationItem>
										<PaginationPrevious
											href="#"
											onClick={(e) => {
												e.preventDefault();
												setPage((p) =>
													Math.max(1, p - 1)
												);
											}}
										/>
									</PaginationItem>

									{/* Page numbers with ellipsis */}
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
															setPage(item);
														}}
													>
														{item}
													</PaginationLink>
												</PaginationItem>
											);
										}
									)}

									{/* Next */}
									<PaginationItem>
										<PaginationNext
											href="#"
											onClick={(e) => {
												e.preventDefault();
												setPage((p) =>
													Math.min(totalPages, p + 1)
												);
											}}
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
