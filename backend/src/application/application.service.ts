import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AcademicService } from '../academic/academic.service';
import { NotificationService } from '../notification/notification.service';
import { User } from '@prisma/client';
import { CreateApplicationDto } from './application.dto';
import {
  ApplicationResponse,
  ApplicationWithAcademic,
  ApplicationWithOffer,
  EligibilityResult,
  StudentAcademicInfo,
  STUDENT_DOMAIN,
  APPLICATION_STATUS_ORDER,
  evaluateEligibility,
} from './application.interfaces';

@Injectable()
export class ApplicationService {
  private readonly logger = new Logger(ApplicationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly academicService: AcademicService,
    private readonly notificationService: NotificationService,
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

    if (!email.endsWith(STUDENT_DOMAIN)) {
      throw new ForbiddenException('Solo los estudiantes pueden postular.');
    }

    const offer = await this.prisma.offer.findUnique({ where: { id: dto.offerId } });
    if (!offer) throw new NotFoundException('La oferta no existe.');

    // Oferta cerrada: vacantes completas — 409 Conflict
    if (offer.status === 'CLOSED') {
      throw new ConflictException(
        'La oferta ya fue cerrada. Todas las vacantes han sido cubiertas.',
      );
    }

    if (offer.status !== 'OPEN') {
      throw new BadRequestException('La oferta no está abierta para postulaciones.');
    }

    const students = await this.academicService.getStudents();
    const student  = students.find((s) => s.correo.toLowerCase() === email);
    if (!student) {
      throw new ForbiddenException(
        'No se encontraron datos académicos para este estudiante en el registro institucional.',
      );
    }

    const eligibility = evaluateEligibility(student, offer.courseCode);
    if (!eligibility.canApply) {
      throw new BadRequestException({
        message: 'No cumples los requisitos para postular a esta oferta.',
        reasons: eligibility.reasons,
      });
    }

    const existing = await this.prisma.application.findUnique({
      where: {
        offerId_studentEmail: { offerId: dto.offerId, studentEmail: email },
      },
    });
    if (existing) {
      throw new ConflictException('Ya posees una postulación activa para esta oferta.');
    }

    this.logger.log(`Application: ${email} → offer ${offer.id} (${offer.courseCode})`);

    const application = await this.prisma.application.create({
      data: {
        offerId:      dto.offerId,
        studentEmail: email,
        studentRut:   student.rut,
        studentName:  student.nombre,
        status:       'PENDING',
      },
    });

    // Notificación al profesor — fire-and-forget (no bloquea la respuesta)
    this.notificationService
      .notifyNewApplication({
        professorEmail: offer.professorEmail,
        studentName:    student.nombre,
        courseName:     offer.courseName,
        offerId:        offer.id,
        applicationId:  application.id,
      })
      .catch((e) =>
        this.logger.error('Failed to create NEW_APPLICATION notification', e),
      );

    return application;
  }

  // ─── Mis postulaciones (estudiante) ───────────────────────────────────────

  async findMyApplications(user: User): Promise<ApplicationWithOffer[]> {
    return this.prisma.application.findMany({
      where: { studentEmail: user.email.toLowerCase() },
      include: { offer: true },
      orderBy: { createdAt: 'desc' },
    }) as Promise<ApplicationWithOffer[]>;
  }

  // ─── Mis ayudantías (estudiante — solo postulaciones APPROVED) ────────────

  async findMyAssistantships(user: User): Promise<ApplicationWithOffer[]> {
    return this.prisma.application.findMany({
      where: {
        studentEmail: user.email.toLowerCase(),
        status: 'APPROVED',
      },
      include: { offer: true },
      orderBy: { updatedAt: 'desc' },
    }) as Promise<ApplicationWithOffer[]>;
  }

  // ─── Postulaciones de una oferta (profesor propietario) ───────────────────

  async findByOffer(
    offerId: string,
    professor: User,
  ): Promise<ApplicationWithAcademic[]> {
    // 1. Verificar que la oferta pertenece al profesor autenticado
    const offer = await this.prisma.offer.findUnique({ where: { id: offerId } });
    if (!offer) throw new NotFoundException('Oferta no encontrada.');

    if (offer.professorEmail.toLowerCase() !== professor.email.toLowerCase()) {
      throw new ForbiddenException(
        'No tienes permiso para ver las postulaciones de esta oferta.',
      );
    }

    // 2. Obtener postulaciones de la oferta
    const applications = await this.prisma.application.findMany({
      where: { offerId },
      orderBy: { createdAt: 'asc' },
    });

    // 3. Obtener todos los estudiantes desde la API institucional (una sola llamada)
    const students    = await this.academicService.getStudents();
    const studentMap  = new Map<string, StudentAcademicInfo>(
      students.map((s) => [
        s.correo.toLowerCase(),
        {
          nombre:          s.nombre,
          correo:          s.correo,
          rut:             s.rut,
          carrera:         s.carrera,
          ppa:             s.ppa,
          alertaAcademica: s.alertaAcademica,
        },
      ]),
    );

    // 4. Enriquecer con datos académicos
    const enriched: ApplicationWithAcademic[] = applications.map((app) => ({
      ...app,
      student: studentMap.get(app.studentEmail) ?? null,
    }));

    // 5. Ordenar: PENDING → APPROVED → REJECTED; dentro de cada grupo por fecha ASC
    enriched.sort((a, b) => {
      const statusDiff =
        APPLICATION_STATUS_ORDER[a.status] - APPLICATION_STATUS_ORDER[b.status];
      if (statusDiff !== 0) return statusDiff;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    this.logger.log(
      `Returned ${enriched.length} applications for offer ${offerId} to ${professor.email}`,
    );

    return enriched;
  }

  // ─── Aprobar postulación ──────────────────────────────────────────────────

  async approve(
    applicationId: string,
    professor: User,
  ): Promise<ApplicationResponse> {
    return this.updateApplicationStatus(applicationId, 'APPROVED', professor);
  }

  // ─── Rechazar postulación ─────────────────────────────────────────────────

  async reject(
    applicationId: string,
    professor: User,
  ): Promise<ApplicationResponse> {
    return this.updateApplicationStatus(applicationId, 'REJECTED', professor);
  }

  // ─── Helper privado: cambio de estado con validaciones y cierre automático ─

  private async updateApplicationStatus(
    applicationId: string,
    newStatus: ApplicationStatus,
    professor: User,
  ): Promise<ApplicationResponse> {
    // 1. Verificar que la postulación existe e incluir la oferta para validar propiedad
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { offer: true },
    });

    if (!app) {
      throw new NotFoundException('Postulación no encontrada.');
    }

    // 2. No se puede modificar postulaciones de una oferta cerrada
    if (app.offer.status === 'CLOSED') {
      throw new BadRequestException(
        'Esta oferta está cerrada. No es posible modificar sus postulaciones.',
      );
    }

    // 3. Solo el profesor propietario puede administrar esta postulación
    if (app.offer.professorEmail.toLowerCase() !== professor.email.toLowerCase()) {
      throw new ForbiddenException(
        'No tienes permiso para administrar las postulaciones de una oferta que no te pertenece.',
      );
    }

    // 4. Solo se puede modificar desde estado PENDING
    if (app.status !== 'PENDING') {
      const estadoActual = app.status === 'APPROVED' ? 'aprobada' : 'rechazada';
      throw new BadRequestException(
        `La postulación ya fue ${estadoActual} y no puede modificarse nuevamente.`,
      );
    }

    this.logger.log(
      `Application ${applicationId}: PENDING → ${newStatus} by ${professor.email}`,
    );

    // 5. Ejecutar en una única transacción Prisma para garantizar consistencia
    const updated = await this.prisma.$transaction(async (tx) => {
      // a) Actualizar el estado de esta postulación
      const u = await tx.application.update({
        where: { id: applicationId },
        data: { status: newStatus },
      });

      // b) Lógica de cierre automático — solo al aprobar
      if (newStatus === 'APPROVED') {
        const approvedCount = await tx.application.count({
          where: { offerId: app.offerId, status: 'APPROVED' },
        });

        if (approvedCount >= app.offer.vacancies) {
          // Cerrar la oferta y registrar fecha de cierre
          await tx.offer.update({
            where: { id: app.offerId },
            data: {
              status:   'CLOSED',
              closedAt: new Date(),
            },
          });

          // Rechazar todas las postulaciones PENDING restantes
          const { count: rejectedCount } = await tx.application.updateMany({
            where: { offerId: app.offerId, status: 'PENDING' },
            data: { status: 'REJECTED' },
          });

          this.logger.log(
            `Offer ${app.offerId} auto-closed — ` +
            `${approvedCount}/${app.offer.vacancies} vacancies filled. ` +
            `${rejectedCount} pending application(s) auto-rejected.`,
          );
        }
      }

      return u;
    });

    // 6. Notificación al estudiante — fire-and-forget (fuera de la transacción)
    const notifyFn =
      newStatus === 'APPROVED'
        ? this.notificationService.notifyApplicationApproved.bind(
            this.notificationService,
          )
        : this.notificationService.notifyApplicationRejected.bind(
            this.notificationService,
          );

    notifyFn({
      studentEmail:  app.studentEmail,
      courseName:    app.offer.courseName,
      offerId:       app.offerId,
      applicationId: app.id,
    }).catch((e) =>
      this.logger.error(
        `Failed to create ${newStatus} notification for ${app.studentEmail}`,
        e,
      ),
    );

    return updated;
  }
}
