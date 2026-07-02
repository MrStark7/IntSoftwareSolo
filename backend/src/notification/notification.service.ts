import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import {
  CreateNotificationParams,
  NotificationResponse,
  UnreadCountResponse,
} from './notification.interfaces';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Crear notificación (uso interno) ────────────────────────────────────
  // Toda la lógica de creación pasa por aquí para mantener un único punto de control.
  // Diseñado para ser invocado de forma no bloqueante desde ApplicationService.

  async create(params: CreateNotificationParams): Promise<NotificationResponse> {
    const notification = await this.prisma.notification.create({
      data: {
        recipientEmail:       params.recipientEmail,
        recipientRole:        params.recipientRole,
        type:                 params.type,
        title:                params.title,
        message:              params.message,
        relatedOfferId:       params.relatedOfferId   ?? null,
        relatedApplicationId: params.relatedApplicationId ?? null,
      },
    });

    this.logger.log(
      `Notification created [${params.type}] for ${params.recipientEmail}`,
    );

    return notification;
  }

  // ─── Helpers públicos para ApplicationService ─────────────────────────────
  // Estos métodos encapsulan la lógica de mensaje de cada tipo de notificación
  // y son invocados de forma no bloqueante (fire-and-forget) desde ApplicationService.

  async notifyNewApplication(params: {
    professorEmail: string;
    studentName: string;
    courseName: string;
    offerId: string;
    applicationId: string;
  }): Promise<void> {
    await this.create({
      recipientEmail:       params.professorEmail,
      recipientRole:        'PROFESSOR',
      type:                 'NEW_APPLICATION',
      title:                'Nueva postulación recibida',
      message:              `${params.studentName} ha postulado a "${params.courseName}".`,
      relatedOfferId:       params.offerId,
      relatedApplicationId: params.applicationId,
    });
  }

  async notifyApplicationApproved(params: {
    studentEmail: string;
    courseName: string;
    offerId: string;
    applicationId: string;
  }): Promise<void> {
    await this.create({
      recipientEmail:       params.studentEmail,
      recipientRole:        'STUDENT',
      type:                 'APPLICATION_APPROVED',
      title:                '¡Has sido seleccionado!',
      message:              `Has sido seleccionado como Ayudante de Cátedra para "${params.courseName}".`,
      relatedOfferId:       params.offerId,
      relatedApplicationId: params.applicationId,
    });
  }

  async notifyApplicationRejected(params: {
    studentEmail: string;
    courseName: string;
    offerId: string;
    applicationId: string;
  }): Promise<void> {
    await this.create({
      recipientEmail:       params.studentEmail,
      recipientRole:        'STUDENT',
      type:                 'APPLICATION_REJECTED',
      title:                'Resultado de tu postulación',
      message:              `Tu postulación para "${params.courseName}" no fue seleccionada.`,
      relatedOfferId:       params.offerId,
      relatedApplicationId: params.applicationId,
    });
  }

  async findByUser(user: User): Promise<NotificationResponse[]> {
    return this.prisma.notification.findMany({
      where: { recipientEmail: user.email.toLowerCase() },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadCount(user: User): Promise<UnreadCountResponse> {
    const unread = await this.prisma.notification.count({
      where: {
        recipientEmail: user.email.toLowerCase(),
        read: false,
      },
    });
    return { unread };
  }

  async markAsRead(id: string, user: User): Promise<NotificationResponse> {
    const notification = await this.prisma.notification.findUnique({ where: { id } });

    if (!notification) {
      throw new NotFoundException('Notificación no encontrada.');
    }

    if (notification.recipientEmail.toLowerCase() !== user.email.toLowerCase()) {
      throw new ForbiddenException(
        'No tienes permiso para modificar esta notificación.',
      );
    }

    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async markAllAsRead(user: User): Promise<{ updated: number }> {
    const result = await this.prisma.notification.updateMany({
      where: {
        recipientEmail: user.email.toLowerCase(),
        read: false,
      },
      data: { read: true },
    });

    this.logger.log(
      `Marked ${result.count} notification(s) as read for ${user.email}`,
    );

    return { updated: result.count };
  }
}
