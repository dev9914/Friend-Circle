import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = () => {
        const token = localStorage.getItem("token");
        const tokenExpiry = localStorage.getItem("tokenExpiry");

        // Check if token and expiration exist, and if the token is still valid
        if (token && tokenExpiry) {
            if (Date.now() > tokenExpiry) {
                localStorage.removeItem("token");
                localStorage.removeItem("tokenExpiry");
                console.log("Token expired. Please log in again.");
                return false;
            }
            return true;
        }
        return false;
    };

    if (!isAuthenticated()) {
        return <Navigate to="/signin" replace />; // Redirect to login if not authenticated
    }

    return children; // Render protected component if authenticated
};

export default ProtectedRoute;