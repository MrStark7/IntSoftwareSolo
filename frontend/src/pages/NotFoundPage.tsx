import { useNavigate } from 'react-router-dom';
import { GraduationCap, Home } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-6">
          <GraduationCap size={32} className="text-primary-700" />
        </div>
        <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Page not found</h2>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          <Home size={16} /> Go home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
