import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { GraduationCap } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-950 to-primary-800">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
          <GraduationCap size={32} className="text-white" />
        </div>
        <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"
          style={{ borderWidth: '3px' }} />
        <p className="text-white font-medium">Signing you in...</p>
        <p className="text-white/50 text-sm mt-1">Please wait a moment</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
