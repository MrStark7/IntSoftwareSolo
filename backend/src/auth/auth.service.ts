import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { JwtPayload } from '../strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Genera un JWT con el mismo formato utilizado por el login con Google.
   * @param user  Registro del usuario en base de datos.
   * @param rut   RUT opcional. Se incluye en el payload cuando está disponible
   *              (Profesor Demo y, en el futuro, autenticación institucional).
   */
  generateToken(user: User, rut?: string): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      ...(rut ? { rut } : {}),
    };
    return this.jwtService.sign(payload);
  }

  // Returns a safe public representation of the user — never exposes googleId.
  getProfile(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
