import { Controller, Get, UseGuards, Request, Logger } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IdentityService } from './identity.service';
import { IdentityResponseDto } from './identity.dto';

@ApiTags('Identity')
@Controller('identity')
export class IdentityController {
  private readonly logger = new Logger(IdentityController.name);

  constructor(private readonly identityService: IdentityService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Resolver identidad institucional del usuario autenticado',
    description:
      'Enriquece el usuario autenticado con información académica institucional. ' +
      'Detecta automáticamente si es Estudiante (@alumnos.ucn.cl) o Profesor (@ucn.cl). ' +
      'Requiere JWT válido en el header Authorization.',
  })
  @ApiResponse({ status: 200, type: IdentityResponseDto })
  @ApiResponse({ status: 401, description: 'Token JWT ausente o inválido' })
  @ApiResponse({ status: 403, description: 'Correo no institucional o no encontrado en registros' })
  @ApiResponse({ status: 502, description: 'Error al consultar la API académica externa' })
  getMe(@Request() req): Promise<IdentityResponseDto> {
    this.logger.log(`GET /identity/me — user: ${req.user.email}`);
    return this.identityService.resolve(req.user);
  }
}
