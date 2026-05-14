import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo-ucn.png" alt="UCN" className="h-10 w-auto opacity-60" />
          <div className="w-8 h-8 rounded-full animate-spin border-4 border-t-transparent"
            style={{ borderColor: '#E6F4F7', borderTopColor: 'transparent', borderLeftColor: '#003057' }} />
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
};

export default PublicRoute;
