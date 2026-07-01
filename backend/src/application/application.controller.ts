import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './application.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IsProfessorGuard } from '../guards/is-professor.guard';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  // ── Estudiante ────────────────────────────────────────────────────────────

  @Get('me')
  findMyApplications(@Request() req) {
    return this.applicationService.findMyApplications(req.user);
  }

  /** Ayudantías asignadas — solo postulaciones APPROVED del estudiante autenticado. */
  @Get('my-assistantships')
  findMyAssistantships(@Request() req) {
    return this.applicationService.findMyAssistantships(req.user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateApplicationDto, @Request() req) {
    return this.applicationService.create(dto, req.user);
  }

  // ── Profesor ──────────────────────────────────────────────────────────────

  @Patch(':id/approve')
  @UseGuards(IsProfessorGuard)
  approve(@Param('id') id: string, @Request() req) {
    return this.applicationService.approve(id, req.user);
  }

  @Patch(':id/reject')
  @UseGuards(IsProfessorGuard)
  reject(@Param('id') id: string, @Request() req) {
    return this.applicationService.reject(id, req.user);
  }
}
