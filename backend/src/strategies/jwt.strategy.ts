import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  /**
   * RUT del usuario. Actualmente solo se incluye en el JWT del Profesor Demo.
   * TODO: Cuando se implemente la resolución institucional de identidad, este campo
   *       será poblado automáticamente por el servicio de autenticación institucional,
   *       eliminando la necesidad de DEMO_PROFESSOR_RUT en las variables de entorno.
   *       El resto del sistema (TeacherService, etc.) no requerirá modificaciones.
   */
  rut?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (payload.rut) {
      return { ...user, rut: payload.rut };
    }
    return user;
  }
}
