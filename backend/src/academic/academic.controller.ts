import { Controller, Get, Post, Param, Logger } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AcademicService } from './academic.service';
import { EcinCourse, Student, TeacherCourses } from './academic.interfaces';

@ApiTags('Academic')
@Controller('academic')
export class AcademicController {
  private readonly logger = new Logger(AcademicController.name);

  constructor(private readonly academicService: AcademicService) {}

  @Get('courses')
  @ApiOperation({
    summary: 'Listar todos los cursos ECIN del período configurado',
    description: 'Consume GET /course/ecin-courses del servicio externo puclaro.ucn.cl',
  })
  getCourses(): Promise<EcinCourse[]> {
    this.logger.log('GET /academic/courses');
    return this.academicService.getCourses();
  }

  @Post('students')
  @ApiOperation({
    summary: 'Obtener todos los estudiantes del período configurado',
    description: 'Consume POST /estudiantes-periodo-a del servicio externo losvilos.ucn.cl — no requiere body',
  })
  getStudents(): Promise<Student[]> {
    this.logger.log('POST /academic/students');
    return this.academicService.getStudents();
  }

  @Get('teacher/:rut')
  @ApiParam({
    name: 'rut',
    description: 'RUT del profesor. Se acepta cualquier formato: "12.840.176-8", "12840176-8" o "128401768"',
    example: '12.840.176-8',
  })
  @ApiOperation({
    summary: 'Obtener los cursos asignados a un profesor por RUT',
    description: 'Consume GET /teacher/teacher-courses del servicio externo puclaro.ucn.cl. Los puntos y guión del RUT se eliminan automáticamente antes de enviarlo.',
  })
  getTeacherCourses(@Param('rut') rut: string): Promise<TeacherCourses> {
    this.logger.log(`GET /academic/teacher/${rut}`);
    return this.academicService.getTeacherCourses(rut);
  }
}
