import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
	const { user, loading } = useAuth();

	if (loading) return <div>Loading...</div>; // Or a spinner

	// If user exists, render the child route (Outlet), otherwise redirect to login
	return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
