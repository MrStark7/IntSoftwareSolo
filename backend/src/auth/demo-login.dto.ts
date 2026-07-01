import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type DemoUserType = 'professor' | 'student';

export class DemoLoginDto {
  @ApiProperty({
    enum: ['professor', 'student'],
    description: '"professor" genera un JWT con rol PROFESSOR y RUT. "student" genera un JWT con rol STUDENT.',
    example: 'professor',
  })
  @IsEnum(['professor', 'student'], {
    message: 'type debe ser "professor" o "student"',
  })
  type: DemoUserType;
}
