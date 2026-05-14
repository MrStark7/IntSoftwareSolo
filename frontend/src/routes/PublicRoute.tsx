import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/** Redirects authenticated users away from public-only pages like /login */
const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
};

export default PublicRoute;
