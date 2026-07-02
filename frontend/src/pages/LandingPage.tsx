import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Award, ArrowRight, CheckCircle } from 'lucide-react';
import { authService } from '../services/auth.service';
import { APP_NAME } from '../constants/app';

const features = [
  {
    icon: BookOpen,
    title: 'Gestión de Cursos',
    description: 'Accede a materiales del curso, tareas y recursos académicos en un solo lugar.',
  },
  {
    icon: Users,
    title: 'Asistentes de Cátedra',
    description: 'Postúlate para ser Asistente de Cátedra y apoya a tus compañeros en su camino académico.',
  },
  {
    icon: Award,
    title: 'Excelencia Académica',
    description: 'Lleva el seguimiento de tu progreso, obtén reconocimiento y desarrolla tu perfil académico.',
  },
];

const benefits = [
  'Inicio de sesión único con tu cuenta Google universitaria',
  'Notificaciones en tiempo real sobre tareas y anuncios',
  'Proceso de postulación a Asistente de Cátedra simplificado',
  'Entorno de aprendizaje colaborativo',
];

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <img src="/logo-ucn.png" alt="UCN Coquimbo" className="h-10 w-auto" />
          <button
            onClick={() => authService.loginWithGoogle()}
            className="btn-primary py-2 px-5 text-sm"
          >
            Ingresar
          </button>
        </div>
      </nav>

      {/* Hero — gradiente UCN navy → teal */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #000d18 0%, #003057 55%, #267A8A 100%)' }} />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-medium
                            px-3 py-1.5 rounded-full border border-white/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#3499AB' }} />
              Plataforma Académica Universitaria
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Impulsa tu
              <span className="block" style={{ color: '#3499AB' }}>Camino Académico</span>
            </h1>

            <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-xl">
              La plataforma integral para estudiantes, asistentes de cátedra y profesores.
              Gestiona cursos, postúlate como AC y colabora sin complicaciones.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => authService.loginWithGoogle()}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl
                           bg-white text-ucn-navy font-semibold text-base
                           hover:bg-ucn-teal-light transition-all duration-200 shadow-lg shadow-black/20
                           focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <GoogleIcon />
                Ingresar con Google
              </button>

              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl
                           border border-white/30 text-white font-semibold text-base
                           hover:bg-white/10 transition-all duration-200"
              >
                Más información <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 40C1200 0 960 80 720 40C480 0 240 80 0 40L0 80Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#003057' }}>Todo lo que necesitas</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Una plataforma completa diseñada específicamente para los flujos de trabajo académico universitario.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title}
                  className="group p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300"
                  style={{ ['--tw-border-opacity' as string]: '1' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#3499AB')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors"
                    style={{ backgroundColor: '#E6F4F7' }}>
                    <Icon size={24} style={{ color: '#003057' }} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24" style={{ backgroundColor: '#f0f7f9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Construida para la universidad moderna
              </h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                Optimiza las operaciones académicas con una plataforma que entiende
                las necesidades de estudiantes, asistentes y docentes.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle size={20} className="flex-shrink-0" style={{ color: '#3499AB' }} />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => authService.loginWithGoogle()}
                className="btn-primary mt-10"
              >
                Comenzar gratis <ArrowRight size={16} />
              </button>
            </div>

            {/* Mock UI card */}
            <div className="relative">
              <div className="rounded-2xl p-8 shadow-2xl" style={{ background: 'linear-gradient(135deg, #003057 0%, #267A8A 100%)' }}>
                <div className="bg-white/10 rounded-xl p-6 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/20" />
                    <div>
                      <div className="h-3 w-24 bg-white/40 rounded mb-1.5" />
                      <div className="h-2 w-16 bg-white/20 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-white/20 rounded w-full" />
                    <div className="h-2 bg-white/20 rounded w-4/5" />
                    <div className="h-2 bg-white/20 rounded w-3/5" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['Cursos', 'Postulaciones', 'Calificaciones', 'Horario'].map((item) => (
                    <div key={item} className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="h-6 w-6 rounded bg-white/20 mx-auto mb-2" />
                      <p className="text-white/70 text-xs">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full blur-2xl" style={{ backgroundColor: '#3499AB33' }} />
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full blur-2xl" style={{ backgroundColor: '#00305733' }} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ backgroundColor: '#000d18' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Listo para comenzar?</h2>
          <p className="text-white/60 text-lg mb-10">
            Únete hoy a tu comunidad universitaria en la {APP_NAME}.
          </p>
          <button
            onClick={() => authService.loginWithGoogle()}
            className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl
                       bg-white font-semibold text-base
                       hover:bg-ucn-teal-light transition-all duration-200 shadow-lg"
            style={{ color: '#003057' }}
          >
            <GoogleIcon />
            Ingresar con Google
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8" style={{ backgroundColor: '#000d18', borderColor: '#ffffff0d' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col items-center gap-3">
            <img src="/logo-ucn.png" alt="UCN Coquimbo" className="h-10 w-auto opacity-60 brightness-0 invert" />
            <p className="text-white/30 text-sm">
              © {new Date().getFullYear()} Escuela de Ingeniería UCN Coquimbo. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
