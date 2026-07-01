import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OfferService } from './offer.service';
import { ApplicationService } from '../application/application.service';
import { CreateOfferDto, UpdateOfferDto } from './offer.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IsProfessorGuard } from '../guards/is-professor.guard';
import { OfferDetailResponse } from '../application/application.interfaces';

@Controller('offers')
@UseGuards(JwtAuthGuard)
export class OfferController {
  constructor(
    private readonly offerService: OfferService,
    private readonly applicationService: ApplicationService,
  ) {}

  // ── Todos los usuarios autenticados ───────────────────────────────────────

  @Get()
  findAll() {
    return this.offerService.findAll();
  }

  /** Devuelve la oferta junto al estado de elegibilidad del usuario autenticado. */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<OfferDetailResponse> {
    const offer       = await this.offerService.findOne(id);
    const eligibility = await this.applicationService.checkEligibilityForUser(
      req.user,
      offer.courseCode,
    );
    return { offer, eligibility };
  }

  // ── Solo profesores ───────────────────────────────────────────────────────

  @Post()
  @UseGuards(IsProfessorGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateOfferDto, @Request() req) {
    return this.offerService.create(dto, req.user);
  }

  @Patch(':id')
  @UseGuards(IsProfessorGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOfferDto,
    @Request() req,
  ) {
    return this.offerService.update(id, dto, req.user);
  }

  @Delete(':id')
  @UseGuards(IsProfessorGuard)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @Request() req) {
    return this.offerService.remove(id, req.user);
  }
}
