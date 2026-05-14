import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo-ucn.png" alt="UCN" className="h-10 w-auto opacity-60" />
          <div className="w-10 h-10 rounded-full animate-spin border-4"
            style={{ borderColor: '#E6F4F7', borderTopColor: '#003057' }} />
          <p className="text-sm" style={{ color: '#003057' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
