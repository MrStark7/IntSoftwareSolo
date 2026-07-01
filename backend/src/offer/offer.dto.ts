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
  @IsString()
  @MinLength(2)
  courseCode: string;

  @IsString()
  @MinLength(2)
  courseName: string;

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
  @IsString()
  @MinLength(2)
  @IsOptional()
  courseCode?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  courseName?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  nrc?: string;

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
