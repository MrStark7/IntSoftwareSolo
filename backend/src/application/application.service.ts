import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AcademicService } from '../academic/academic.service';
import { User } from '@prisma/client';
import { CreateApplicationDto } from './application.dto';
import {
  ApplicationResponse,
  ApplicationWithOffer,
  EligibilityResult,
  STUDENT_DOMAIN,
  evaluateEligibility,
} from './application.interfaces';

@Injectable()
export class ApplicationService {
  private readonly logger = new Logger(ApplicationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly academicService: AcademicService,
  ) {}

  // ─── Elegibilidad ─────────────────────────────────────────────────────────
  // Único punto de verdad. Reutilizado por OfferController y create().

  async checkEligibilityForUser(
    user: User,
    courseCode: string,
  ): Promise<EligibilityResult> {
    const email = user.email.toLowerCase();

    if (!email.endsWith(STUDENT_DOMAIN)) {
      return {
        canApply: false,
        reasons: ['Solo los estudiantes pueden postular a ofertas de ayudantía.'],
      };
    }

    const students = await this.academicService.getStudents();
    const student  = students.find((s) => s.correo.toLowerCase() === email);

    if (!student) {
      return {
        canApply: false,
        reasons: ['No se encontraron datos académicos para este estudiante.'],
      };
    }

    return evaluateEligibility(student, courseCode);
  }

  // ─── Crear postulación ────────────────────────────────────────────────────

  async create(
    dto: CreateApplicationDto,
    user: User,
  ): Promise<ApplicationResponse> {
    const email = user.email.toLowerCase();

    // 1. Solo estudiantes pueden postular (validación backend — no confiar en frontend)
    if (!email.endsWith(STUDENT_DOMAIN)) {
      throw new ForbiddenException('Solo los estudiantes pueden postular.');
    }

    // 2. La oferta debe existir
    const offer = await this.prisma.offer.findUnique({
      where: { id: dto.offerId },
    });
    if (!offer) {
      throw new NotFoundException('La oferta no existe.');
    }

    // 3. La oferta debe estar abierta
    if (offer.status !== 'OPEN') {
      throw new BadRequestException(
        'La oferta no está abierta para postulaciones.',
      );
    }

    // 4. Obtener datos institucionales del estudiante
    const students = await this.academicService.getStudents();
    const student  = students.find((s) => s.correo.toLowerCase() === email);
    if (!student) {
      throw new ForbiddenException(
        'No se encontraron datos académicos para este estudiante en el registro institucional.',
      );
    }

    // 5. Validar requisitos fijos (desde la API — jamás desde el frontend)
    const eligibility = evaluateEligibility(student, offer.courseCode);
    if (!eligibility.canApply) {
      throw new BadRequestException({
        message: 'No cumples los requisitos para postular a esta oferta.',
        reasons: eligibility.reasons,
      });
    }

    // 6. Sin postulación duplicada
    const existing = await this.prisma.application.findUnique({
      where: {
        offerId_studentEmail: { offerId: dto.offerId, studentEmail: email },
      },
    });
    if (existing) {
      throw new ConflictException(
        'Ya posees una postulación activa para esta oferta.',
      );
    }

    // 7. Crear postulación
    this.logger.log(`Application: ${email} → offer ${offer.id} (${offer.courseCode})`);

    return this.prisma.application.create({
      data: {
        offerId:      dto.offerId,
        studentEmail: email,
        studentRut:   student.rut,
        studentName:  student.nombre,
        status:       'PENDING',
      },
    });
  }

  // ─── Mis postulaciones ────────────────────────────────────────────────────

  async findMyApplications(user: User): Promise<ApplicationWithOffer[]> {
    return this.prisma.application.findMany({
      where: { studentEmail: user.email.toLowerCase() },
      include: { offer: true },
      orderBy: { createdAt: 'desc' },
    }) as Promise<ApplicationWithOffer[]>;
  }
}
