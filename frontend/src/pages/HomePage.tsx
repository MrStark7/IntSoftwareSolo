import { BookOpen, ClipboardList, Users, Bell, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { roleLabels, roleColors } from '../utils/roleLabels';

const statCards = [
  {
    label: 'Enrolled Courses',
    value: '—',
    icon: BookOpen,
    color: 'bg-blue-50 text-blue-600',
    description: 'Coming soon',
  },
  {
    label: 'TA Applications',
    value: '—',
    icon: ClipboardList,
    color: 'bg-purple-50 text-purple-600',
    description: 'Coming soon',
  },
  {
    label: 'Classmates',
    value: '—',
    icon: Users,
    color: 'bg-green-50 text-green-600',
    description: 'Coming soon',
  },
  {
    label: 'Notifications',
    value: '0',
    icon: Bell,
    color: 'bg-orange-50 text-orange-600',
    description: 'Up to date',
  },
];

const quickActions = [
  {
    label: 'Apply for TA',
    description: 'Submit your teaching assistant application',
    icon: ClipboardList,
    color: 'border-purple-200 hover:border-purple-400 hover:bg-purple-50',
    iconColor: 'text-purple-600',
    soon: true,
  },
  {
    label: 'View Courses',
    description: 'Browse and manage your enrolled courses',
    icon: BookOpen,
    color: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50',
    iconColor: 'text-blue-600',
    soon: true,
  },
  {
    label: 'Progress Tracker',
    description: 'Monitor your academic performance',
    icon: TrendingUp,
    color: 'border-green-200 hover:border-green-400 hover:bg-green-50',
    iconColor: 'text-green-600',
    soon: true,
  },
  {
    label: 'Schedule',
    description: 'View your upcoming classes and deadlines',
    icon: Clock,
    color: 'border-orange-200 hover:border-orange-400 hover:bg-orange-50',
    iconColor: 'text-orange-600',
    soon: true,
  },
];

const HomePage = () => {
  const { user } = useAuth();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-2xl object-cover shadow-sm flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-700 text-xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="text-gray-500 text-sm">{greeting()}</p>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'Student'}</h1>
            {user?.role && (
              <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mt-1 ${roleColors[user.role]}`}>
                {roleLabels[user.role]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm font-medium text-gray-700 mt-0.5">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                disabled={action.soon}
                className={`relative text-left p-5 rounded-xl border-2 bg-white transition-all duration-200 cursor-not-allowed
                            ${action.color} opacity-80`}
              >
                {action.soon && (
                  <span className="absolute top-3 right-3 text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                    Coming soon
                  </span>
                )}
                <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-3 ${action.iconColor}`}>
                  <Icon size={20} />
                </div>
                <p className="font-semibold text-gray-900">{action.label}</p>
                <p className="text-sm text-gray-500 mt-0.5">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Welcome notice */}
      <div className="rounded-xl bg-gradient-to-r from-primary-700 to-primary-600 p-6 text-white">
        <h3 className="font-semibold text-lg mb-1">Welcome to TA Platform!</h3>
        <p className="text-white/70 text-sm leading-relaxed">
          This is your academic hub. More features are being added soon — including course enrollment,
          TA applications, progress tracking, and collaboration tools.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
