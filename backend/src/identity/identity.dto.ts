import { ApiProperty } from '@nestjs/swagger';

// ─── DTOs de respuesta para documentación Swagger ────────────────────────────
// No se utilizan para validación de entrada ya que GET /identity/me
// no recibe parámetros del cliente.

export class CarreraDto {
  @ApiProperty({ example: '8266' })
  codigo: string;

  @ApiProperty({ example: 'INGENIERIA EN TECNOLOGIAS DE INFORMACION' })
  nombre: string;
}

export class StudentProfileDto {
  @ApiProperty({ example: 'ANA MUÑOZ' })
  nombre: string;

  @ApiProperty({ example: '18428663-K' })
  rut: string;

  @ApiProperty({ example: 'ana.munoz@alumnos.ucn.cl' })
  correo: string;

  @ApiProperty({ example: '+56944638194' })
  telefono: string;

  @ApiProperty({ example: 'Av. Angamos 0610' })
  direccion: string;

  @ApiProperty({ example: 5.3, nullable: true })
  ppa: number | null;

  @ApiProperty({ example: false })
  alertaAcademica: boolean;

  @ApiProperty({ type: CarreraDto })
  carrera: CarreraDto;

  @ApiProperty({ type: 'array', description: 'Historial de asignaturas aprobadas' })
  asignaturasAprobadas: unknown[];
}

export class ProfessorProfileDto {
  @ApiProperty({ example: 'eric.ross@ucn.cl' })
  email: string;

  @ApiProperty({ example: 'ERIC GYSBERT ROSS CORTES' })
  name: string;
}

export class IdentityResponseDto {
  @ApiProperty({ enum: ['STUDENT', 'PROFESSOR'], example: 'STUDENT' })
  role: string;

  @ApiProperty({
    oneOf: [{ $ref: '#/components/schemas/StudentProfileDto' }, { $ref: '#/components/schemas/ProfessorProfileDto' }],
  })
  profile: StudentProfileDto | ProfessorProfileDto;
}
