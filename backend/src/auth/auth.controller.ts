import { Controller, Get, UseGuards, Request, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  googleAuth() {
    // Passport redirects to Google — no body needed
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback — issues JWT' })
  googleAuthCallback(@Request() req, @Res() res: Response) {
    const token = this.authService.generateToken(req.user);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

    // Redirect to frontend with token in query param (frontend stores it)
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user);
  }
}
