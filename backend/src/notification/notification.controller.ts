import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /** Devuelve todas las notificaciones del usuario autenticado (más recientes primero). */
  @Get()
  @ApiOperation({ summary: 'Obtener notificaciones del usuario autenticado' })
  findAll(@Request() req) {
    return this.notificationService.findByUser(req.user);
  }

  /** Devuelve la cantidad de notificaciones no leídas. */
  @Get('unread-count')
  @ApiOperation({ summary: 'Cantidad de notificaciones no leídas' })
  getUnreadCount(@Request() req) {
    return this.notificationService.getUnreadCount(req.user);
  }

  /** Marca todas las notificaciones del usuario como leídas. */
  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marcar todas las notificaciones como leídas' })
  markAllAsRead(@Request() req) {
    return this.notificationService.markAllAsRead(req.user);
  }

  /** Marca una notificación específica como leída. */
  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marcar una notificación como leída' })
  markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationService.markAsRead(id, req.user);
  }
}
