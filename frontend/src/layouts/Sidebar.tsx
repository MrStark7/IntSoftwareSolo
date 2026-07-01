import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  User,
  BookOpen,
  ClipboardList,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// ─── Role detection ───────────────────────────────────────────────────────────

const isProfessorEmail = (email: string | undefined) =>
  email?.toLowerCase().endsWith('@ucn.cl') ?? false;

// ─── Nav item definitions ─────────────────────────────────────────────────────

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  disabled?: boolean;
}

const STUDENT_NAV: NavItem[] = [
  { label: 'Inicio',             to: '/home',             icon: Home },
  { label: 'Perfil',            to: '/profile',          icon: User },
  { label: 'Ofertas',           to: '/offers',           icon: ClipboardList },
  { label: 'Mis Postulaciones', to: '/my-applications',  icon: FileText },
];

const PROFESSOR_NAV: NavItem[] = [
  { label: 'Inicio',      to: '/home',              icon: Home },
  { label: 'Perfil',      to: '/profile',           icon: User },
  { label: 'Mis Cursos',  to: '/professor/courses', icon: BookOpen },
  { label: 'Mis Ofertas', to: '/professor/offers',  icon: ClipboardList },
];

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = isProfessorEmail(user?.email) ? PROFESSOR_NAV : STUDENT_NAV;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center px-4 py-4 border-b border-gray-100 ${collapsed ? 'justify-center' : ''}`}>
        {collapsed ? (
          <img src="/logo-ucn.png" alt="UCN" className="h-8 w-8 object-contain" />
        ) : (
          <img src="/logo-ucn.png" alt="UCN Coquimbo" className="h-10 w-auto max-w-[160px] object-contain" />
        )}
      </div>

      {/* Role badge */}
      {!collapsed && user && (
        <div className="px-4 py-2 border-b border-gray-50">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isProfessorEmail(user.email)
                ? 'bg-ucn-teal-light text-ucn-teal-dark'
                : 'bg-primary-50 text-primary-700'
            }`}
          >
            {isProfessorEmail(user.email) ? 'Profesor' : 'Estudiante'}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.disabled) {
            return (
              <div
                key={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 cursor-not-allowed ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} />
                {!collapsed && (
                  <span className="flex-1">
                    {item.label}
                    <span className="ml-2 text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">
                      Pronto
                    </span>
                  </span>
                )}
              </div>
            );
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-gray-100">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 text-sm font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium
                     text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors
                     ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Cerrar sesión' : undefined}
          style={{} as React.CSSProperties}
        >
          <LogOut size={18} />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 lg:hidden
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 bg-white border-r border-gray-100 shadow-sm
                    transition-all duration-300 ease-in-out
                    ${collapsed ? 'w-16' : 'w-64'}`}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-1/2 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full
                     flex items-center justify-center shadow-sm text-gray-400 hover:text-primary-600
                     transition-colors z-10"
          style={{ transform: 'translateY(-50%)' }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
          <button onClick={() => setMobileOpen(true)} className="text-gray-500 hover:text-gray-700">
            <Menu size={22} />
          </button>
          <img src="/logo-ucn.png" alt="UCN Coquimbo" className="h-8 w-auto object-contain" />
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
