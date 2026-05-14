import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Volver al inicio
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src="/logo-ucn.png" alt="UCN Coquimbo" className="h-14 w-auto mx-auto mb-5" />
            <h1 className="text-2xl font-bold text-gray-900">Bienvenido</h1>
            <p className="text-gray-500 mt-1">Inicia sesión para acceder a tu plataforma académica</p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={() => authService.loginWithGoogle()}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl
                       border-2 border-gray-200 bg-white text-gray-700 font-semibold
                       hover:bg-gray-50 hover:border-gray-300 transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                       shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Al ingresar, aceptas los{' '}
              <span className="text-primary-600 hover:underline cursor-pointer">Términos de Servicio</span>{' '}
              y la{' '}
              <span className="text-primary-600 hover:underline cursor-pointer">Política de Privacidad</span>{' '}
              de la universidad.
            </p>
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          Solo las cuentas universitarias están autorizadas para acceder.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
