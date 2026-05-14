import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <div className="mb-6">
          <img src="/logo-ucn.png" alt="UCN Coquimbo" className="h-12 w-auto mx-auto opacity-60" />
        </div>
        <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Página no encontrada</h2>
        <p className="text-gray-500 mb-8">La página que buscas no existe o fue movida.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          <Home size={16} /> Ir al inicio
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
