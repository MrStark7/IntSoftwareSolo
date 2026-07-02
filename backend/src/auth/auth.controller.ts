import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  Logger,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { DemoLoginDto } from './demo-login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth — redirects to Google consent screen' })
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback — validates user, issues JWT, redirects to frontend' })
  googleAuthCallback(@Request() req, @Res() res: Response) {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

    try {
      if (!req.user) {
        this.logger.error('Google callback: no user on request');
        return res.redirect(`${frontendUrl}/login?error=auth_failed`);
      }

      const token = this.authService.generateToken(req.user);
      this.logger.log(`Issuing JWT for user: ${req.user.email}`);

      return res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } catch (error) {
      this.logger.error('Google callback error', error);
      return res.redirect(`${frontendUrl}/login?error=server_error`);
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  getProfile(@Request() req) {
    if (!req.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.getProfile(req.user);
  }

  /**
   * Demo Login — solo disponible cuando DEMO_MODE=true y NODE_ENV !== "production".
   * Genera un JWT idéntico al del login con Google, facilitando pruebas de desarrollo
   * sin necesidad de credenciales institucionales reales.
   *
   * Profesor Demo: JWT incluye { email, name, rut } para preparar la arquitectura
   *               de resolución institucional de identidad.
   * Estudiante Demo: JWT incluye { email, name }.
   */
  @Post('demo-login')
  @ApiOperation({
    summary: 'Demo Login (solo desarrollo) — genera JWT sin Google OAuth',
    description:
      'Solo disponible cuando DEMO_MODE=true y NODE_ENV !== "production". ' +
      'Acepta { "type": "professor" | "student" }.',
  })
  async demoLogin(@Body() dto: DemoLoginDto) {
    const isDemoMode = this.configService.get<string>('DEMO_MODE') === 'true';
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    if (!isDemoMode || isProduction) {
      throw new ForbiddenException(
        'Demo Login está deshabilitado. Solo disponible con DEMO_MODE=true y NODE_ENV !== production.',
      );
    }

    const isProfessor = dto.type === 'professor';

    const email = this.configService.get<string>(
      isProfessor ? 'DEMO_PROFESSOR_EMAIL' : 'DEMO_STUDENT_EMAIL',
    );
    const name = this.configService.get<string>(
      isProfessor ? 'DEMO_PROFESSOR_NAME' : 'DEMO_STUDENT_NAME',
    );
    const rut = isProfessor
      ? this.configService.get<string>('DEMO_PROFESSOR_RUT')
      : undefined;

    if (!email || !name) {
      throw new ForbiddenException(
        `Las variables DEMO_${isProfessor ? 'PROFESSOR' : 'STUDENT'}_EMAIL y ` +
        `DEMO_${isProfessor ? 'PROFESSOR' : 'STUDENT'}_NAME no están configuradas en .env.`,
      );
    }

    const googleId = isProfessor ? 'demo-professor' : 'demo-student';
    const user = await this.usersService.upsertDemoUser({ googleId, email, name });

    const token = this.authService.generateToken(user, rut);

    this.logger.log(`Demo login issued for ${dto.type}: ${email}`);

    return {
      token,
      user: this.authService.getProfile(user),
    };
  }
}
