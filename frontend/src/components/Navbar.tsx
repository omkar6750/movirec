import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	Menu,
	Search,
	X,
	LogOut,
	User as UserIcon,
	Heart,
	ListVideo,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const routes = [
	{ href: "/", label: "Home" },
	{ href: "/genres", label: "Genres" },
	{ href: "/recommended", label: "Recommended" },
	{ href: "/movies", label: "Movies" },
];

interface NavbarProps {
	onSearch: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const [searchQuery, setSearchQuery] = useState("");
	const [isVisible, setIsVisible] = useState(true);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// Helper to get initials for Avatar Fallback
	const getInitials = (name?: string) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((n) => n[0])
			.slice(0, 2)
			.join("")
			.toUpperCase();
	};

	const handleSearch = () => {
		if (searchQuery.trim()) {
			onSearch(searchQuery.trim());
		}
		navigate("/search");
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const handleGoogleLogin = () => {
		window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
	};

	// Handle Scroll Visibility
	useEffect(() => {
		let lastScrollY = window.scrollY;
		const controlNavbar = () => {
			const current = window.scrollY;
			if (current > lastScrollY && current > 100) {
				setIsVisible(false);
			} else {
				setIsVisible(true);
			}
			lastScrollY = current;
		};
		window.addEventListener("scroll", controlNavbar);
		return () => window.removeEventListener("scroll", controlNavbar);
	}, []);

	if (pathname.startsWith("/admin")) return null;

	return (
		<nav
			className={`fixed z-50 h-16 w-full bg-background/80 border-b backdrop-blur-md transition-transform duration-300 ${
				isVisible ? "translate-y-0" : "-translate-y-full"
			}`}
		>
			<div className="container mx-auto h-full px-4 flex items-center justify-between gap-4">
				{/* --- Logo --- */}
				<Link to="/" className="flex items-center gap-2 group">
					<div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-blue-500/20 transition-all">
						<span className="text-white font-bold font-mono">
							M
						</span>
					</div>
					<span className="text-xl font-bold tracking-tight">
						<span className="text-blue-600">movi</span>rec
					</span>
				</Link>

				{/* --- Desktop Navigation --- */}
				<div className="hidden md:flex items-center gap-1">
					{routes.map((link) => (
						<Link key={link.href} to={link.href}>
							<Button
								variant={
									pathname === link.href
										? "secondary"
										: "ghost"
								}
								className="font-medium"
							>
								{link.label}
							</Button>
						</Link>
					))}
				</div>

				{/* --- Search Bar --- */}
				<div className="hidden md:flex flex-1 max-w-sm items-center gap-2">
					<div className="relative w-full">
						<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							type="text"
							placeholder="Search movies..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyDown={handleKeyDown}
							className="pl-9 h-9 bg-muted/50 focus:bg-background transition-colors"
						/>
					</div>
				</div>

				{/* --- Auth Section (Right Side) --- */}
				<div className="flex items-center gap-2">
					{/* Mobile Search Trigger (Optional, if space is tight) */}
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						onClick={() => navigate("/search")}
					>
						<Search className="h-5 w-5" />
					</Button>

					{user ? (
						// LOGGED IN: Avatar Dropdown
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-blue-500/50 transition-all"
								>
									<Avatar className="h-9 w-9">
										<AvatarImage
											src={user.image}
											alt={user.displayName}
										/>
										<AvatarFallback className="bg-blue-600 text-white font-medium">
											{getInitials(user.displayName)}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-56"
								align="end"
								forceMount
							>
								<DropdownMenuLabel className="font-normal">
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium leading-none">
											{user.displayName}
										</p>
										<p className="text-xs leading-none text-muted-foreground">
											{user.email}
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => navigate("/favourites")}
									className="cursor-pointer"
								>
									<Heart className="mr-2 h-4 w-4" />
									<span>Favourites</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => navigate("/watchlist")}
									className="cursor-pointer"
								>
									<ListVideo className="mr-2 h-4 w-4" />
									<span>Watchlist</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={logout}
									className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
								>
									<LogOut className="mr-2 h-4 w-4" />
									<span>Log out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						// LOGGED OUT: Google Login Button
						<Button
							onClick={handleGoogleLogin}
							className="gap-2 font-semibold shadow-sm"
						>
							Login
						</Button>
					)}

					{/* Mobile Menu Toggle */}
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					>
						{isMobileMenuOpen ? (
							<X className="h-5 w-5" />
						) : (
							<Menu className="h-5 w-5" />
						)}
					</Button>
				</div>
			</div>

			{/* --- Mobile Menu Dropdown --- */}
			{isMobileMenuOpen && (
				<div className="md:hidden border-t bg-background p-4 space-y-4 shadow-lg animate-in slide-in-from-top-2">
					{/* Mobile Nav Links */}
					<div className="grid gap-2">
						{routes.map((link) => (
							<Link
								key={link.href}
								to={link.href}
								onClick={() => setIsMobileMenuOpen(false)}
								className={`flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
									pathname === link.href
										? "bg-secondary text-foreground"
										: "hover:bg-muted text-muted-foreground"
								}`}
							>
								{link.label}
							</Link>
						))}
					</div>

					{/* Mobile Search Input */}
					<div className="relative">
						<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							type="text"
							placeholder="Search..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSearch();
									setIsMobileMenuOpen(false);
								}
							}}
							className="pl-9"
						/>
					</div>
				</div>
			)}
		</nav>
	);
}
