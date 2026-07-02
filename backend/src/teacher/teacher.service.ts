import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AcademicService } from '../academic/academic.service';
import { TeacherAsignatura } from '../academic/academic.interfaces';

@Injectable()
export class TeacherService {
  private readonly logger = new Logger(TeacherService.name);

  constructor(
    private readonly academicService: AcademicService,
    private readonly config: ConfigService,
  ) {}

  // En producción esta lógica debe reemplazarse por un mecanismo institucional
  // que resuelva el RUT a partir del correo autenticado del usuario
  // (p.ej. directorio LDAP UCN, API de directorio institucional, etc.).
  async getMyCourses(): Promise<TeacherAsignatura[]> {
    const rut = this.config.get<string>('DEMO_PROFESSOR_RUT');

    if (!rut || rut.trim() === '') {
      throw new BadRequestException(
        'DEMO_PROFESSOR_RUT no está configurado en el archivo .env. ' +
        'Agrega el RUT del profesor para la demo.',
      );
    }

    this.logger.log(`Fetching courses for demo RUT: ${rut}`);

    const teacherData = await this.academicService.getTeacherCourses(rut);
    return teacherData.asignaturas ?? [];
  }
}
