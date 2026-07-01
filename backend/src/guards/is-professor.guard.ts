import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

const PROFESSOR_DOMAIN = '@ucn.cl';

@Injectable()
export class IsProfessorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.email?.toLowerCase().endsWith(PROFESSOR_DOMAIN)) {
      throw new ForbiddenException(
        'Solo los profesores con correo @ucn.cl pueden realizar esta acción',
      );
    }

    return true;
  }
}
