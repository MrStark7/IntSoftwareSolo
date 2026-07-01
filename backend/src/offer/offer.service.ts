import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto, UpdateOfferDto } from './offer.dto';
import { User } from '@prisma/client';
import { OfferResponse } from './offer.interfaces';

@Injectable()
export class OfferService {
  private readonly logger = new Logger(OfferService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Obtener todas ────────────────────────────────────────────────────────

  async findAll(): Promise<OfferResponse[]> {
    return this.prisma.offer.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Obtener una ──────────────────────────────────────────────────────────

  async findOne(id: string): Promise<OfferResponse> {
    const offer = await this.prisma.offer.findUnique({ where: { id } });
    if (!offer) {
      throw new NotFoundException(`Oferta con ID "${id}" no encontrada`);
    }
    return offer;
  }

  // ─── Crear ────────────────────────────────────────────────────────────────

  async create(dto: CreateOfferDto, professor: User): Promise<OfferResponse> {
    this.logger.log(`Creating offer for professor: ${professor.email}`);

    const offer = await this.prisma.offer.create({
      data: {
        courseCode:       dto.courseCode,
        courseName:       dto.courseName,
        nrc:              dto.nrc,
        professorEmail:   professor.email,
        professorName:    professor.name,
        vacancies:        dto.vacancies,
        description:      dto.description,
        applicationStart: new Date(dto.applicationStart),
        applicationEnd:   new Date(dto.applicationEnd),
        status:           dto.status ?? 'DRAFT',
      },
    });

    this.logger.log(`Offer created with ID: ${offer.id}`);
    return offer;
  }

  // ─── Editar ───────────────────────────────────────────────────────────────

  async update(
    id: string,
    dto: UpdateOfferDto,
    professor: User,
  ): Promise<OfferResponse> {
    const offer = await this.findOne(id);
    this.assertOwnership(offer, professor);

    const updated = await this.prisma.offer.update({
      where: { id },
      data: {
        ...(dto.courseCode       !== undefined && { courseCode:       dto.courseCode }),
        ...(dto.courseName       !== undefined && { courseName:       dto.courseName }),
        ...(dto.nrc              !== undefined && { nrc:              dto.nrc }),
        ...(dto.vacancies        !== undefined && { vacancies:        dto.vacancies }),
        ...(dto.description      !== undefined && { description:      dto.description }),
        ...(dto.applicationStart !== undefined && { applicationStart: new Date(dto.applicationStart) }),
        ...(dto.applicationEnd   !== undefined && { applicationEnd:   new Date(dto.applicationEnd) }),
        ...(dto.status           !== undefined && { status:           dto.status }),
      },
    });

    this.logger.log(`Offer ${id} updated by ${professor.email}`);
    return updated;
  }

  // ─── Eliminar ─────────────────────────────────────────────────────────────

  async remove(id: string, professor: User): Promise<{ message: string }> {
    const offer = await this.findOne(id);
    this.assertOwnership(offer, professor);

    await this.prisma.offer.delete({ where: { id } });
    this.logger.log(`Offer ${id} deleted by ${professor.email}`);

    return { message: `Oferta "${offer.courseName}" eliminada correctamente` };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private assertOwnership(offer: OfferResponse, professor: User): void {
    if (offer.professorEmail.toLowerCase() !== professor.email.toLowerCase()) {
      throw new ForbiddenException(
        'No tienes permiso para modificar una oferta de otro profesor',
      );
    }
  }
}
