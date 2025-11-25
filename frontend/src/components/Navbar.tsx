import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";

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
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const [searchQuery, setSearchQuery] = useState("");
	const [isVisible, setIsVisible] = useState(true);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

	// Hide navbar on scroll
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

	// Hide navbar on admin routes
	if (pathname.startsWith("/admin")) return null;

	return (
		<nav
			className={`fixed z-50 h-14 w-full bg-background/70 border-b shadow-md backdrop-blur-md transition-transform duration-300 ${
				isVisible ? "translate-y-0" : "-translate-y-full"
			}`}
		>
			<div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
				{/* Logo */}
				<Link
					to="/"
					className="flex items-center gap-2 hover:opacity-80 transition-opacity"
				>
					<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
						<span className="text-white">M</span>
					</div>
					<span className="text-xl">
						<span className="text-blue-600">movi</span>rec
					</span>
				</Link>

				{/* Nav links (Desktop) */}
				<div className="hidden md:flex items-center space-x-8">
					{routes.map((link) => (
						<Link
							key={link.href}
							to={link.href}
							className={`muted-foreground hover:text-foreground rounded-md px-3 py-2 font-semibold transition-colors ${
								pathname === link.href
									? "text-primary underline underline-offset-4"
									: ""
							}`}
						>
							{link.label}
						</Link>
					))}
				</div>

				{/* Search Bar */}
				<div className="flex-1 max-w-xl">
					<div className="relative flex items-center gap-2">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								type="text"
								placeholder="Search for movies..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								onKeyDown={handleKeyDown}
								className="pl-10 pr-4"
							/>
						</div>
						<Button onClick={handleSearch}>
							<Search className="h-4 w-4 mr-2" />
							Search
						</Button>
					</div>
				</div>

				{/* Mobile Button */}
				<div className="md:hidden flex items-center">
					<Button
						variant="outline"
						onClick={() => setIsMobileMenuOpen((v) => !v)}
					>
						{!isMobileMenuOpen ? <Menu /> : <X />}
					</Button>
				</div>
			</div>

			{/* Mobile Dropdown */}
			<div
				className={`overflow-hidden transition-all duration-300 md:hidden ${
					isMobileMenuOpen
						? "max-h-64 opacity-100"
						: "max-h-0 opacity-0"
				}`}
			>
				<div className="px-4 py-3 space-y-2">
					{routes.map((link) => (
						<Link
							key={link.href}
							to={link.href}
							onClick={() => setIsMobileMenuOpen(false)}
							className={`block px-3 py-2 rounded-md text-sm font-medium ${
								pathname === link.href
									? "text-primary"
									: "text-muted-foreground"
							}`}
						>
							{link.label}
						</Link>
					))}

					<div className="pt-4 border-t" />
				</div>
			</div>
		</nav>
	);
}
