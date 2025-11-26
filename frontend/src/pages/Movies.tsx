import { useEffect, useState } from "react";

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
} from "@/components/ui/pagination";
import MoviesGrid from "@/components/MoviesGrid";

function getPaginationRange(current: number, total: number) {
	const delta = 1;
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

export default function Movies() {
	const [movies, setMovies] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const limit = 20;

	useEffect(() => {
		fetch(
			`${
				import.meta.env.VITE_SERVER_URL
			}/api/movies?page=${page}&limit=${limit}`
		)
			.then((res) => res.json())
			.then((data) => {
				setMovies(data.results);
				setTotalPages(data.totalPages);
			});
	}, [page]);

	return (
		<div className="p-8 pt-16 max-w-6xl mx-auto">
			<h1 className="text-3xl font-bold mb-6">Movies</h1>

			{/* Movies Grid */}
			<MoviesGrid
				movies={movies}
				// isLoading={loading}
				// onCardClick={(movie) => navigate(`/movie/${movie.imdbId}`)}
				// optional: override columns for small pages
				colsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
			/>

			{/* Pagination */}
			<div className="mt-10 flex justify-center">
				<Pagination>
					<PaginationContent>
						{/* Previous */}
						<PaginationItem>
							<PaginationPrevious
								href="#"
								onClick={(e) => {
									e.preventDefault();
									setPage((p) => Math.max(1, p - 1));
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
									setPage((p) => Math.min(totalPages, p + 1));
								}}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
}
