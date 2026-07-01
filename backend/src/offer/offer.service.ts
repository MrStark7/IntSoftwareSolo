import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TeacherService } from '../teacher/teacher.service';
import { CreateOfferDto, UpdateOfferDto } from './offer.dto';
import { User } from '@prisma/client';
import { OfferResponse } from './offer.interfaces';

@Injectable()
export class OfferService {
  private readonly logger = new Logger(OfferService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly teacherService: TeacherService,
  ) {}

  // ─── Obtener todas ────────────────────────────────────────────────────────

  async findAll(): Promise<OfferResponse[]> {
    return this.prisma.offer.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Mis ofertas (profesor) ────────────────────────────────────────────────

  async findByProfessor(professorEmail: string): Promise<OfferResponse[]> {
    return this.prisma.offer.findMany({
      where: { professorEmail: professorEmail.toLowerCase() },
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
    // 1. Validar fechas
    if (new Date(dto.applicationEnd) <= new Date(dto.applicationStart)) {
      throw new BadRequestException(
        'La fecha de término debe ser posterior a la fecha de inicio.',
      );
    }

    // 2. Validar que el curso pertenece al profesor mediante la API institucional
    //    TODO: Cuando se implemente la resolución dinámica de RUT, esta llamada
    //          usará el RUT del profesor autenticado en lugar de DEMO_PROFESSOR_RUT.
    const courses = await this.teacherService.getMyCourses();
    const course  = courses.find(
      (c) => c.codigo === dto.courseCode && c.nrc === dto.nrc,
    );

    if (!course) {
      throw new ForbiddenException(
        'El curso seleccionado no pertenece al profesor autenticado o no existe en este período.',
      );
    }

    // 3. Evitar oferta duplicada abierta para el mismo curso
    const duplicate = await this.prisma.offer.findFirst({
      where: {
        professorEmail: professor.email.toLowerCase(),
        courseCode:     dto.courseCode,
        status:         'OPEN',
      },
    });

    if (duplicate) {
      throw new ConflictException(
        `Ya existe una oferta abierta para el curso ${dto.courseCode}. Ciérrala antes de crear una nueva.`,
      );
    }

    // 4. Crear — courseName proviene de la API, nunca del cliente
    this.logger.log(
      `Creating offer: ${course.asignatura} (${course.codigo}) by ${professor.email}`,
    );

    const offer = await this.prisma.offer.create({
      data: {
        courseCode:       course.codigo,
        courseName:       course.asignatura,
        nrc:              course.nrc,
        professorEmail:   professor.email.toLowerCase(),
        professorName:    professor.name,
        vacancies:        dto.vacancies,
        description:      dto.description,
        applicationStart: new Date(dto.applicationStart),
        applicationEnd:   new Date(dto.applicationEnd),
        status:           dto.status ?? 'OPEN',
      },
    });

    this.logger.log(`Offer created: ${offer.id}`);
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

    if (offer.status === 'CLOSED') {
      throw new BadRequestException(
        'No es posible modificar una oferta cerrada. Las vacantes han sido completadas automáticamente.',
      );
    }

    if (
      dto.applicationStart !== undefined &&
      dto.applicationEnd   !== undefined &&
      new Date(dto.applicationEnd) <= new Date(dto.applicationStart)
    ) {
      throw new BadRequestException(
        'La fecha de término debe ser posterior a la fecha de inicio.',
      );
    }

    return this.prisma.offer.update({
      where: { id },
      data: {
        ...(dto.vacancies        !== undefined && { vacancies:        dto.vacancies }),
        ...(dto.description      !== undefined && { description:      dto.description }),
        ...(dto.applicationStart !== undefined && { applicationStart: new Date(dto.applicationStart) }),
        ...(dto.applicationEnd   !== undefined && { applicationEnd:   new Date(dto.applicationEnd) }),
        ...(dto.status           !== undefined && { status:           dto.status }),
      },
    });
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
