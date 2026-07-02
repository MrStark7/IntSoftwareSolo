import { NotificationType, Role } from '@prisma/client';

// ─── Respuesta de notificación ────────────────────────────────────────────────

export interface NotificationResponse {
  id: string;
  recipientEmail: string;
  recipientRole: Role;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  relatedOfferId: string | null;
  relatedApplicationId: string | null;
  createdAt: Date;
}

// ─── Conteo de no leídas ──────────────────────────────────────────────────────

export interface UnreadCountResponse {
  unread: number;
}

// ─── Parámetros internos para crear notificaciones ────────────────────────────

export interface CreateNotificationParams {
  recipientEmail: string;
  recipientRole: Role;
  type: NotificationType;
  title: string;
  message: string;
  relatedOfferId?: string;
  relatedApplicationId?: string;
}
