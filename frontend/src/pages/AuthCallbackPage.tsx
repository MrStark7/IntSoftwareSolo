import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, fetchUser } = useAuthStore();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const token = searchParams.get('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    (async () => {
      setToken(token);
      await fetchUser();
      navigate('/home', { replace: true });
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #000d18 0%, #003057 60%, #267A8A 100%)' }}>
      <div className="text-center">
        <div className="mb-6">
          <img src="/logo-ucn.png" alt="UCN Coquimbo" className="h-14 w-auto mx-auto brightness-0 invert opacity-90" />
        </div>
        <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"
          style={{ borderWidth: '3px' }} />
        <p className="text-white font-medium">Iniciando sesión...</p>
        <p className="text-white/50 text-sm mt-1">Por favor espera un momento</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
