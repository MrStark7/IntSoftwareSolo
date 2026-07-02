import { useEffect, useState, useCallback } from 'react';
import {
  Bell,
  CheckCheck,
  Loader2,
  CheckCircle2,
  XCircle,
  ClipboardList,
  Circle,
} from 'lucide-react';
import { notificationService } from '../services/notification.service';
import type { AppNotification, NotificationType } from '../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const typeConfig: Record<
  NotificationType,
  { icon: typeof Bell; iconCls: string; borderCls: string }
> = {
  NEW_APPLICATION: {
    icon: ClipboardList,
    iconCls: 'text-purple-600',
    borderCls: 'border-l-purple-400',
  },
  APPLICATION_APPROVED: {
    icon: CheckCircle2,
    iconCls: 'text-green-600',
    borderCls: 'border-l-green-400',
  },
  APPLICATION_REJECTED: {
    icon: XCircle,
    iconCls: 'text-red-500',
    borderCls: 'border-l-red-400',
  },
};

// ─── Notification card ────────────────────────────────────────────────────────

const NotificationCard = ({
  notification,
  onMarkRead,
}: {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
}) => {
  const [marking, setMarking] = useState(false);
  const cfg = typeConfig[notification.type];
  const TypeIcon = cfg.icon;

  const handleMarkRead = async () => {
    if (notification.read || marking) return;
    setMarking(true);
    try {
      await notificationService.markAsRead(notification.id);
      onMarkRead(notification.id);
    } finally {
      setMarking(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 border-l-4 transition-opacity
                  ${cfg.borderCls} ${notification.read ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
            notification.read ? 'bg-gray-50' : 'bg-gray-100'
          }`}
        >
          <TypeIcon size={18} className={cfg.iconCls} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm font-semibold ${notification.read ? 'text-gray-500' : 'text-gray-900'}`}>
              {notification.title}
            </p>
            {!notification.read && (
              <span className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-ucn-teal" />
            )}
          </div>

          <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
            {notification.message}
          </p>

          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-400">{formatDate(notification.createdAt)}</p>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  notification.read
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-ucn-teal-light text-ucn-teal-dark'
                }`}
              >
                {notification.read ? 'Leída' : 'No leída'}
              </span>

              {!notification.read && (
                <button
                  onClick={handleMarkRead}
                  disabled={marking}
                  className="flex items-center gap-1 text-xs text-ucn-teal hover:text-ucn-teal-dark transition-colors disabled:opacity-50"
                >
                  {marking ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : (
                    <Circle size={11} />
                  )}
                  Marcar leída
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [markingAll, setMarkingAll]       = useState(false);

  const load = useCallback(async () => {
    const data = await notificationService.getAll();
    setNotifications(data);
  }, []);

  useEffect(() => {
    load()
      .catch(() => setError('No se pudieron cargar las notificaciones. Intenta de nuevo.'))
      .finally(() => setLoading(false));
  }, [load]);

  const handleMarkRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const handleMarkAll = async () => {
    setMarkingAll(true);
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      setError('No se pudo marcar todas como leídas.');
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #003057 0%, #267A8A 100%)' }}
          >
            <Bell size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
            <p className="text-sm text-gray-500">
              {unreadCount > 0
                ? `${unreadCount} notificación${unreadCount !== 1 ? 'es' : ''} sin leer`
                : 'Todo al día'}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            disabled={markingAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white
                       transition hover:brightness-110 disabled:opacity-60 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #003057 0%, #267A8A 100%)' }}
          >
            {markingAll ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <CheckCheck size={15} />
            )}
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={32} className="animate-spin text-ucn-teal" />
          <p className="text-sm text-gray-400">Cargando notificaciones…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-5 text-sm">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <Bell size={44} strokeWidth={1.2} />
          <p className="text-base font-medium text-gray-500">Sin notificaciones</p>
          <p className="text-sm text-center max-w-xs">
            Aquí aparecerán tus notificaciones sobre postulaciones y ayudantías.
          </p>
        </div>
      )}

      {/* List */}
      {!loading && !error && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onMarkRead={handleMarkRead}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
