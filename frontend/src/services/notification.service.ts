import { api } from './api';
import type { AppNotification, UnreadCount } from '../types';

export const notificationService = {
  /** Todas las notificaciones del usuario autenticado (más recientes primero). */
  getAll: async (): Promise<AppNotification[]> => {
    const { data } = await api.get<AppNotification[]>('/notifications');
    return data;
  },

  getUnreadCount: async (): Promise<UnreadCount> => {
    const { data } = await api.get<UnreadCount>('/notifications/unread-count');
    return data;
  },

  markAsRead: async (id: string): Promise<AppNotification> => {
    const { data } = await api.patch<AppNotification>(`/notifications/${id}/read`);
    return data;
  },

  markAllAsRead: async (): Promise<{ updated: number }> => {
    const { data } = await api.patch<{ updated: number }>('/notifications/read-all');
    return data;
  },
};
