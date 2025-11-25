import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, Eye, Plus } from "lucide-react";
import { useState } from "react";

interface Movie {
	imdbId: string;
	title: string;
	rating: number;
	year?: number;
	genre?: string[];
}

interface MovieCardProps {
	movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
	const [isFavorite, setIsFavorite] = useState(false);
	const [isWatched, setIsWatched] = useState(false);
	const [isInWatchlist, setIsInWatchlist] = useState(false);

	const posterSrc = `${import.meta.env.VITE_SERVER_URL}/api/poster/${
		movie.imdbId
	}`;

	const handleFavorite = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsFavorite(!isFavorite);
	};

	const handleWatched = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsWatched(!isWatched);
	};

	const handleWatchlist = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsInWatchlist(!isInWatchlist);
	};

	return (
		<Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
			{/* Poster Image */}
			<div className="relative aspect-[2/3] overflow-hidden bg-muted">
				<img
					src={posterSrc}
					alt={movie.title}
					className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>

				{/* Overlay on Hover */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

				{/* Action Buttons - Show on Hover */}
				<div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					<Button
						size="icon"
						variant="secondary"
						className={`rounded-full ${
							isFavorite
								? "bg-red-500 hover:bg-red-600 text-white"
								: "bg-white/90 hover:bg-white"
						}`}
						onClick={handleFavorite}
					>
						<Heart
							className={`h-4 w-4 ${
								isFavorite ? "fill-current" : ""
							}`}
						/>
					</Button>
					<Button
						size="icon"
						variant="secondary"
						className={`rounded-full ${
							isWatched
								? "bg-green-500 hover:bg-green-600 text-white"
								: "bg-white/90 hover:bg-white"
						}`}
						onClick={handleWatched}
					>
						<Eye
							className={`h-4 w-4 ${
								isWatched ? "fill-current" : ""
							}`}
						/>
					</Button>
					<Button
						size="icon"
						variant="secondary"
						className={`rounded-full ${
							isInWatchlist
								? "bg-blue-500 hover:bg-blue-600 text-white"
								: "bg-white/90 hover:bg-white"
						}`}
						onClick={handleWatchlist}
					>
						<Plus
							className={`h-4 w-4 ${
								isInWatchlist ? "rotate-45" : ""
							} transition-transform`}
						/>
					</Button>
				</div>

				{/* Rating Badge */}
				<div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
					<span className="text-yellow-400 text-sm">⭐</span>
					<span className="text-white text-sm">
						{movie.rating?.toFixed(1) || "N/A"}
					</span>
				</div>

				{/* Status Indicators */}
				<div className="absolute top-2 left-2 flex gap-1">
					{isFavorite && (
						<div className="bg-red-500 rounded-full p-1">
							<Heart className="h-3 w-3 text-white fill-current" />
						</div>
					)}
					{isWatched && (
						<div className="bg-green-500 rounded-full p-1">
							<Eye className="h-3 w-3 text-white fill-current" />
						</div>
					)}
					{isInWatchlist && (
						<div className="bg-blue-500 rounded-full p-1">
							<Plus className="h-3 w-3 text-white" />
						</div>
					)}
				</div>
			</div>

			{/* Movie Info */}
			<CardContent className="p-4">
				<h3 className="truncate" title={movie.title}>
					{movie.title}
				</h3>
				{movie.year && (
					<p className="text-sm text-muted-foreground">
						{movie.year}
					</p>
				)}
			</CardContent>

			<CardFooter className="p-4 pt-0">
				{movie.genre && movie.genre.length > 0 && (
					<div className="flex gap-1 flex-wrap">
						{movie.genre.slice(0, 2).map((g, i) => (
							<span
								key={i}
								className="text-xs bg-muted px-2 py-1 rounded"
							>
								{g}
							</span>
						))}
					</div>
				)}
			</CardFooter>
		</Card>
	);
}
