import {
  Controller,
  Get,
  UseGuards,
  Request,
  Res,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth — redirects to Google consent screen' })
  googleAuth() {
    // Passport intercepts this and redirects to Google. No body needed.
  }

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

      // Redirect to the frontend callback page with the token.
      // The frontend immediately stores it and removes it from the URL.
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
}
