import { useState } from 'react';
import { User, Mail, Shield, Calendar, Camera, Edit3, Check, X, type LucideIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { roleLabels, roleColors } from '../utils/roleLabels';

const ProfilePage = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || '');

  const handleSave = () => {
    // Future: patch /users/me with updated name
    setEditMode(false);
  };

  if (!user) return null;

  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your personal information and account settings.</p>
      </div>

      {/* Profile card */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-primary-100 flex items-center justify-center shadow-md">
                <span className="text-primary-700 text-3xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <button
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-gray-200
                         flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors
                         text-gray-400 hover:text-gray-600 cursor-not-allowed"
              disabled
              title="Photo change coming soon"
            >
              <Camera size={14} />
            </button>
          </div>

          {/* Name + role */}
          <div className="flex-1 text-center sm:text-left">
            {editMode ? (
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="text-xl font-bold text-gray-900 border-b-2 border-primary-500 outline-none bg-transparent"
                />
                <button onClick={handleSave} className="text-green-600 hover:text-green-700">
                  <Check size={18} />
                </button>
                <button onClick={() => { setEditMode(false); setDisplayName(user.name); }} className="text-red-400 hover:text-red-500">
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <button
                  onClick={() => setEditMode(true)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Edit name"
                >
                  <Edit3 size={16} />
                </button>
              </div>
            )}
            <p className="text-gray-500 text-sm mt-0.5">{user.email}</p>
            <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mt-2 ${roleColors[user.role]}`}>
              {roleLabels[user.role]}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="card">
        <h3 className="text-base font-semibold text-gray-900 mb-5">Account Information</h3>
        <div className="space-y-5">
          <InfoRow icon={User} label="Full Name" value={user.name} />
          <InfoRow icon={Mail} label="Email Address" value={user.email} />
          <InfoRow icon={Shield} label="Role" value={roleLabels[user.role]} badge />
          <InfoRow icon={Calendar} label="Member Since" value={joinDate} />
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Account linked via Google — profile photo and primary email managed by Google.
            </p>
          </div>
        </div>
      </div>

      {/* Future settings placeholder */}
      <div className="card mt-6 border-dashed border-2 border-gray-200 bg-gray-50">
        <div className="text-center py-4">
          <p className="text-sm font-medium text-gray-500">Additional settings coming soon</p>
          <p className="text-xs text-gray-400 mt-1">Notification preferences, privacy controls, and more.</p>
        </div>
      </div>
    </div>
  );
};

interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  badge?: boolean;
}

const InfoRow = ({ icon: Icon, label, value, badge }: InfoRowProps) => (
  <div className="flex items-center gap-4">
    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
      <Icon size={16} className="text-gray-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      {badge ? (
        <span className="inline-block text-sm font-semibold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full mt-0.5">
          {value}
        </span>
      ) : (
        <p className="text-sm font-medium text-gray-800 truncate">{value}</p>
      )}
    </div>
  </div>
);

export default ProfilePage;
