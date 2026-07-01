import { useState } from 'react';
import { ArrowLeft, AlertCircle, FlaskConical, GraduationCap, BookOpen } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService, DemoUserType } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';

const errorMessages: Record<string, string> = {
  auth_failed: 'No se pudo autenticar con Google. Intenta nuevamente.',
  server_error: 'Error interno del servidor. Intenta en unos momentos.',
};

const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setToken, fetchUser } = useAuthStore();

  const errorKey = searchParams.get('error');
  const errorMsg = errorKey ? (errorMessages[errorKey] ?? 'Ocurrió un error. Intenta nuevamente.') : null;

  const [demoLoading, setDemoLoading] = useState<DemoUserType | null>(null);
  const [demoError, setDemoError] = useState<string | null>(null);

  const handleDemoLogin = async (type: DemoUserType) => {
    setDemoLoading(type);
    setDemoError(null);
    try {
      const { token } = await authService.demoLogin(type);
      setToken(token);
      await fetchUser();
      navigate('/home', { replace: true });
    } catch {
      setDemoError(
        'No se pudo iniciar sesión en Modo Demo. ' +
        'Verifica que el backend esté ejecutándose y que las variables DEMO_* estén configuradas.',
      );
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #000d18 0%, #003057 60%, #267A8A 100%)' }}>
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Volver al inicio
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
          <div className="text-center mb-8">
            <img src="/logo-ucn.png" alt="UCN Coquimbo" className="h-14 w-auto mx-auto mb-5" />
            <h1 className="text-2xl font-bold text-gray-900">Bienvenido</h1>
            <p className="text-gray-500 mt-1">Inicia sesión para acceder a tu plataforma académica</p>
          </div>

          {/* OAuth error feedback */}
          {errorMsg && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errorMsg}</p>
            </div>
          )}

          <button
            onClick={() => authService.loginWithGoogle()}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl
                       border-2 bg-white font-semibold transition-all duration-200 shadow-sm"
            style={{ borderColor: '#003057', color: '#003057' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E6F4F7')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          {/* ── Modo Demo ─────────────────────────────────────────────── */}
          {IS_DEMO_MODE && (
            <div className="mt-6 pt-6 border-t border-dashed border-amber-300">
              <div className="flex items-center gap-2 mb-3">
                <FlaskConical size={14} className="text-amber-500 flex-shrink-0" />
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                  Modo Demo — solo desarrollo
                </p>
              </div>

              {demoError && (
                <div className="mb-3 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                  <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{demoError}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleDemoLogin('professor')}
                  disabled={demoLoading !== null}
                  className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2
                             border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800
                             font-medium text-sm transition-all duration-150 disabled:opacity-50
                             disabled:cursor-not-allowed"
                >
                  {demoLoading === 'professor' ? (
                    <div className="w-4 h-4 rounded-full animate-spin border-2 border-amber-400 border-t-transparent" />
                  ) : (
                    <BookOpen size={18} className="text-amber-600" />
                  )}
                  <span className="text-xs leading-tight text-center">Entrar como<br/>Profesor</span>
                </button>

                <button
                  onClick={() => handleDemoLogin('student')}
                  disabled={demoLoading !== null}
                  className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2
                             border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800
                             font-medium text-sm transition-all duration-150 disabled:opacity-50
                             disabled:cursor-not-allowed"
                >
                  {demoLoading === 'student' ? (
                    <div className="w-4 h-4 rounded-full animate-spin border-2 border-amber-400 border-t-transparent" />
                  ) : (
                    <GraduationCap size={18} className="text-amber-600" />
                  )}
                  <span className="text-xs leading-tight text-center">Entrar como<br/>Estudiante</span>
                </button>
              </div>
            </div>
          )}
          {/* ── Fin Modo Demo ──────────────────────────────────────────── */}

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Al ingresar, aceptas los{' '}
              <span className="hover:underline cursor-pointer" style={{ color: '#3499AB' }}>Términos de Servicio</span>{' '}
              y la{' '}
              <span className="hover:underline cursor-pointer" style={{ color: '#3499AB' }}>Política de Privacidad</span>{' '}
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
