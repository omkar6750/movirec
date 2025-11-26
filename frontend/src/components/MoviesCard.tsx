import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Plus, Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../context/AuthContext";

interface Movie {
	imdbId: string;
	title: string;
	rating: number;
	year?: number;
	genres?: string[];
	poster?: string;
}

interface MovieCardProps {
	movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
	const { user, refetchUser } = useAuth();

	// Local state for immediate UI feedback (Optimistic UI)
	const [isFav, setIsFav] = useState(false);
	const [inWatchlist, setInWatchlist] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	useEffect(() => {
		if (user) {
			setIsFav(user.favourites.includes(movie.imdbId));
			setInWatchlist(user.watchlist.includes(movie.imdbId));
		}
	}, [user, movie.imdbId]);

	const handleToggle = async (
		e: React.MouseEvent,
		type: "favourites" | "watchlist"
	) => {
		e.preventDefault();
		e.stopPropagation();

		if (!user) {
			// Optional: Add toast here "Please login"
			alert("Please login to save movies!");
			return;
		}

		const isAdding = type === "favourites" ? !isFav : !inWatchlist;
		const method = isAdding ? "POST" : "DELETE";

		if (type === "favourites") setIsFav(isAdding);
		else setInWatchlist(isAdding);

		try {
			const serverUrl = import.meta.env.VITE_SERVER_URL;

			await fetch(`${serverUrl}/api/user/${type}/${movie.imdbId}`, {
				method,
				credentials: "include",
			});

			await refetchUser();
		} catch (error) {
			// Revert on error
			if (type === "favourites") setIsFav(!isAdding);
			else setInWatchlist(!isAdding);
			console.error("Failed to update", error);
		}
	};

	const posterSrc =
		movie.poster ||
		`${import.meta.env.VITE_SERVER_URL}/api/poster/${movie.imdbId}`;

	return (
		<Card
			className="group relative overflow-hidden border-0 bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl rounded-xl"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Make the whole card clickable to go to details (Optional) */}
			<Link to={`/movie/${movie.imdbId}`} className="block h-full">
				{/* Image Container */}
				<div className="relative aspect-[2/3] overflow-hidden bg-muted">
					<img
						src={posterSrc}
						alt={movie.title}
						loading="lazy"
						className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
						onError={(e) => {
							(e.target as HTMLImageElement).src =
								"/placeholder-movie.png";
						}}
					/>

					{/* Gradient Overlay */}
					<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

					{/* action buttons */}
					<div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 transition-all duration-300 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0">
						{/* FAVOURITE BUTTON */}
						<Button
							variant="secondary"
							size="icon"
							className={cn(
								"h-12 w-12 rounded-full shadow-lg transition-all duration-300 border-2",
								isFav
									? "bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700 hover:scale-110"
									: "bg-white/90 border-transparent text-gray-700 hover:bg-white hover:scale-110"
							)}
							onClick={(e) => handleToggle(e, "favourites")}
							title={
								isFav
									? "Remove from Favourites"
									: "Add to Favourites"
							}
						>
							<Heart
								className={cn(
									"h-6 w-6 transition-all",
									isFav && "fill-current scale-110"
								)}
							/>
						</Button>

						{/* WATCHLIST BUTTON */}
						<Button
							variant="secondary"
							size="icon"
							className={cn(
								"h-12 w-12 rounded-full shadow-lg transition-all duration-300 border-2",
								inWatchlist
									? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 hover:scale-110"
									: "bg-white/90 border-transparent text-gray-700 hover:bg-white hover:scale-110"
							)}
							onClick={(e) => handleToggle(e, "watchlist")}
							title={
								inWatchlist
									? "Remove from Watchlist"
									: "Add to Watchlist"
							}
						>
							{inWatchlist ? (
								<Check className="h-6 w-6 stroke-[3px]" />
							) : (
								<Plus className="h-6 w-6" />
							)}
						</Button>
					</div>

					{/* Rating Badge (Always Visible) */}
					<div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 backdrop-blur-md">
						<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
						<span className="text-xs font-bold text-white">
							{movie.rating ? movie.rating.toFixed(1) : "N/A"}
						</span>
					</div>

					{/* Mini Status Indicators */}
					<div
						className={cn(
							"absolute top-2 left-2 flex gap-1 transition-opacity duration-300",
							isHovered ? "opacity-0" : "opacity-100"
						)}
					>
						{isFav && (
							<div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
						)}
						{inWatchlist && (
							<div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
						)}
					</div>
				</div>

				{/* Content Footer */}
				<div className="p-3">
					<h3
						className="line-clamp-1 text-sm font-bold leading-tight tracking-tight text-foreground"
						title={movie.title}
					>
						{movie.title}
					</h3>
					<div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
						<span>{movie.year || "Unknown"}</span>
						{movie.genres && (
							<span className="line-clamp-1 max-w-[50%] text-right opacity-80">
								{movie.genres[0]}
							</span>
						)}
					</div>
				</div>
			</Link>
		</Card>
	);
}
