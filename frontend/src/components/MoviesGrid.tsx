import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import MovieCard from "./MoviesCard";

export type Movie = {
	imdbId: string;
	title: string;
	rating: number;
	year?: number;
	genres?: string[];
	poster?: string;
	[k: string]: any;
};

interface MoviesGridProps {
	movies: Movie[];
	isLoading?: boolean;
	emptyState?: React.ReactNode;
	className?: string;
	onCardClick?: (movie: Movie) => void;
	colsClassName?: string; // e.g. "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
}

export default function MoviesGrid({
	movies,
	isLoading = false,
	emptyState,
	className = "",
	onCardClick,
	colsClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
}: MoviesGridProps) {
	const [activeCard, setActiveCard] = useState<string | null>(null);

	useEffect(() => {
		if (!activeCard) return;
		const onDocClick = () => setActiveCard(null);
		document.addEventListener("click", onDocClick);
		return () => document.removeEventListener("click", onDocClick);
	}, [activeCard]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-16">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!isLoading && (!movies || movies.length === 0)) {
		return (
			<div className="text-center py-12">
				{emptyState ?? (
					<>
						<h3 className="text-lg font-semibold">
							No movies found
						</h3>
						<p className="text-muted-foreground mt-2">
							Try a different filter.
						</p>
					</>
				)}
			</div>
		);
	}

	return (
		<div className={`w-full ${className}`}>
			<div className={`grid gap-6 ${colsClassName}`}>
				{movies.map((m) => (
					// wrapper stops propagation so global doc click doesn't close
					<div
						key={m.imdbId}
						onClick={(e) => e.stopPropagation()}
						// allow keyboard accessibility if needed
						role="button"
						tabIndex={0}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								onCardClick?.(m);
							}
						}}
					>
						<MovieCard
							movie={m}
							activeCard={activeCard}
							setActiveCard={setActiveCard}
							onNavigate={() => onCardClick?.(m)}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
