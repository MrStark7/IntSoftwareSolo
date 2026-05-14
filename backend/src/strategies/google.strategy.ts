import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
      // Stateless mode: disables session-based state verification.
      // Safe for JWT-based apps; re-enable with express-session for stricter CSRF protection.
      state: false,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { id, displayName, emails, photos } = profile;

      if (!emails || emails.length === 0) {
        return done(new Error('No email returned from Google'), null);
      }

      const user = await this.usersService.createOrUpdate({
        googleId: id,
        email: emails[0].value,
        name: displayName,
        avatar: photos?.[0]?.value ?? null,
      });

      this.logger.log(`OAuth login: ${user.email} (id: ${user.id})`);
      done(null, user);
    } catch (error) {
      this.logger.error('GoogleStrategy.validate error', error);
      done(error, null);
    }
  }
}
