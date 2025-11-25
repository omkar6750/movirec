import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";

// Types
interface User {
	_id: string;
	email: string;
	displayName?: string;
	image?: string;
	favourites: string[]; // Stores IDs
	watchlist: string[]; // Stores IDs
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	logout: () => Promise<void>;
	refetchUser: () => Promise<void>; // <--- NEW FUNCTION
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	// Define the fetch logic as a reusable function
	const refetchUser = async () => {
		try {
			const response = await fetch("http://localhost:4000/api/me", {
				method: "GET",
				credentials: "include", // CRITICAL: Sends the HttpOnly cookie
				headers: { "Content-Type": "application/json" },
			});

			if (!response.ok) throw new Error("Not authenticated");

			const data = await response.json();
			if (data.authenticated && data.user) {
				setUser(data.user);
			} else {
				setUser(null);
			}
		} catch (err) {
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refetchUser();
	}, []);

	const logout = async () => {
		try {
			await fetch("http://localhost:4000/api/logout", {
				method: "POST",
				credentials: "include",
			});
			setUser(null);
			window.location.href = "/";
		} catch (error) {
			console.error("Logout failed", error);
		}
	};

	return (
		<AuthContext.Provider value={{ user, loading, logout, refetchUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context)
		throw new Error("useAuth must be used within an AuthProvider");
	return context;
};
