import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { User } from '@prisma/client';
import { AcademicService } from '../academic/academic.service';
import {
  IdentityResponse,
  StudentProfile,
  ProfessorProfile,
  STUDENT_DOMAIN,
  PROFESSOR_DOMAIN,
} from './identity.interfaces';

@Injectable()
export class IdentityService {
  private readonly logger = new Logger(IdentityService.name);

  constructor(private readonly academicService: AcademicService) {}

  async resolve(user: User): Promise<IdentityResponse> {
    const email = user.email.toLowerCase();
    this.logger.log(`Resolving institutional identity for: ${email}`);

    if (email.endsWith(STUDENT_DOMAIN)) {
      return this.resolveStudent(email);
    }

    if (email.endsWith(PROFESSOR_DOMAIN)) {
      return this.resolveProfessor(user);
    }

    this.logger.warn(`Rejected non-institutional email: ${email}`);
    throw new ForbiddenException(
      'El correo institucional no pertenece a un dominio reconocido (@alumnos.ucn.cl o @ucn.cl)',
    );
  }

  // ─── CASO 1: Estudiante ───────────────────────────────────────────────────

  private async resolveStudent(email: string): Promise<IdentityResponse> {
    this.logger.log(`Querying student registry for: ${email}`);

    const students = await this.academicService.getStudents();
    const found = students.find(
      (s) => s.correo.toLowerCase() === email,
    );

    if (!found) {
      this.logger.warn(`Student not found in institutional registry: ${email}`);
      throw new ForbiddenException(
        `El usuario con correo ${email} no existe en los registros institucionales`,
      );
    }

    const profile: StudentProfile = {
      nombre:               found.nombre,
      rut:                  found.rut,
      correo:               found.correo,
      telefono:             found.telefono,
      direccion:            found.direccion,
      ppa:                  found.ppa,
      alertaAcademica:      found.alertaAcademica,
      carrera:              found.carrera,
      asignaturasAprobadas: found.asignaturasAprobadas,
    };

    this.logger.log(`Student resolved: ${found.nombre} (${found.rut})`);
    return { role: 'STUDENT', profile };
  }

  // ─── CASO 2: Profesor ─────────────────────────────────────────────────────

  private resolveProfessor(user: User): IdentityResponse {
    this.logger.log(`Professor identity resolved from JWT: ${user.email}`);

    const profile: ProfessorProfile = {
      email: user.email,
      name:  user.name,
    };

    return { role: 'PROFESSOR', profile };
  }
}
