import {
  IsString,
  IsInt,
  IsDateString,
  IsEnum,
  IsOptional,
  Min,
  MinLength,
} from 'class-validator';
import { OfferStatus } from '@prisma/client';

export class CreateOfferDto {
  /**
   * Código de la asignatura obtenido desde GET /teacher/my-courses.
   * El backend valida que pertenezca al profesor antes de crear la oferta.
   */
  @IsString()
  @MinLength(2)
  courseCode: string;

  /**
   * NRC de la sección obtenido desde GET /teacher/my-courses.
   * No puede ingresarse manualmente desde el formulario.
   */
  @IsString()
  @MinLength(1)
  nrc: string;

  @IsInt()
  @Min(1)
  vacancies: number;

  @IsString()
  @MinLength(10)
  description: string;

  @IsDateString()
  applicationStart: string;

  @IsDateString()
  applicationEnd: string;

  @IsEnum(OfferStatus)
  @IsOptional()
  status?: OfferStatus;
}

export class UpdateOfferDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  vacancies?: number;

  @IsString()
  @MinLength(10)
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  applicationStart?: string;

  @IsDateString()
  @IsOptional()
  applicationEnd?: string;

  @IsEnum(OfferStatus)
  @IsOptional()
  status?: OfferStatus;
}
