import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * PublicRoute — Only accessible when NOT logged in.
 * If already authenticated → redirect to /
 */
function PublicRoute({ children }) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    return !isAuthenticated ? children : <Navigate to="/" replace />;
}

export default PublicRoute;
