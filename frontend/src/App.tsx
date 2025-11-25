import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieRecommendationForm from "./pages/Recommendation";
import { Toaster } from "./components/ui/sonner";
import { Navbar } from "./components/Navbar";
import { SearchPage } from "./pages/SearchPage";
import { useState } from "react";
import { GenrePage } from "./pages/genrePage";

function App() {
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	return (
		<>
			<Router>
				<Navbar onSearch={handleSearch} />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/movies" element={<Movies />} />
					<Route
						path="/recommended"
						element={<MovieRecommendationForm />}
					/>
					<Route
						path="/search"
						element={<SearchPage searchQuery={searchQuery} />}
					/>
					<Route path="/genres" element={<GenrePage />} />
				</Routes>
				<Toaster />
			</Router>
		</>
	);
}

export default App;
