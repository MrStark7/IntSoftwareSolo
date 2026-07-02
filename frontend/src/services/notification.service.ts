import { api } from './api';
import type { AppNotification, UnreadCount } from '../types';

export const notificationService = {
  /** Todas las notificaciones del usuario autenticado (más recientes primero). */
  getAll: async (): Promise<AppNotification[]> => {
    const { data } = await api.get<AppNotification[]>('/notifications');
    return data;
  },

  /** Cantidad de notificaciones no leídas. */
  getUnreadCount: async (): Promise<UnreadCount> => {
    const { data } = await api.get<UnreadCount>('/notifications/unread-count');
    return data;
  },

  /** Marca una notificación específica como leída. */
  markAsRead: async (id: string): Promise<AppNotification> => {
    const { data } = await api.patch<AppNotification>(`/notifications/${id}/read`);
    return data;
  },

  /** Marca todas las notificaciones del usuario como leídas. */
  markAllAsRead: async (): Promise<{ updated: number }> => {
    const { data } = await api.patch<{ updated: number }>('/notifications/read-all');
    return data;
  },
};
