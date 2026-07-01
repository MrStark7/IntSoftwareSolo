import { Controller, Get, UseGuards } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IsProfessorGuard } from '../guards/is-professor.guard';

@Controller('teacher')
@UseGuards(JwtAuthGuard, IsProfessorGuard)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  /**
   * GET /teacher/my-courses
   * Devuelve las asignaturas del profesor autenticado obtenidas desde la API institucional.
   * Utiliza DEMO_PROFESSOR_RUT temporalmente (ver TeacherService).
   */
  @Get('my-courses')
  getMyCourses() {
    return this.teacherService.getMyCourses();
  }
}
