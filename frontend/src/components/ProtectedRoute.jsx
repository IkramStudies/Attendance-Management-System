import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // Wait until auth state is restored
  if (loading) {
    return null; // or a spinner
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access control
  if (Array.isArray(allowedRoles) && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
