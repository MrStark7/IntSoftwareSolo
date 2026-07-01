import { ApplicationStatus, Offer } from '@prisma/client';
import { Student, Carrera } from '../academic/academic.interfaces';

// ─── Resultado de elegibilidad ────────────────────────────────────────────────

export interface EligibilityResult {
  canApply: boolean;
  /** Lista de razones de bloqueo. Vacía cuando canApply = true. */
  reasons: string[];
}

// ─── Respuesta de detalle de oferta ──────────────────────────────────────────

export interface OfferDetailResponse {
  offer: Offer;
  eligibility: EligibilityResult;
}

// ─── Respuesta de postulación ─────────────────────────────────────────────────

export interface ApplicationResponse {
  id: string;
  offerId: string;
  studentEmail: string;
  studentRut: string;
  studentName: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationWithOffer extends ApplicationResponse {
  offer: Offer;
}

// ─── Info académica del postulante (desde API institucional) ──────────────────

export interface StudentAcademicInfo {
  nombre: string;
  correo: string;
  rut: string;
  carrera: Carrera;
  ppa: number | null;
  alertaAcademica: boolean;
}

/** Postulación enriquecida con datos académicos del estudiante desde la API. */
export interface ApplicationWithAcademic extends ApplicationResponse {
  /** null si el estudiante no se encontró en el registro institucional */
  student: StudentAcademicInfo | null;
}

// ─── Constante interna ────────────────────────────────────────────────────────

export const STUDENT_DOMAIN = '@alumnos.ucn.cl';

/** Orden de display para ordenar postulaciones: PENDING → APPROVED → REJECTED */
export const APPLICATION_STATUS_ORDER: Record<ApplicationStatus, number> = {
  PENDING:  0,
  APPROVED: 1,
  REJECTED: 2,
};

/**
 * Evalúa si un estudiante cumple los requisitos fijos de ayudantía.
 * Requisitos inmutables:
 *   1. Sin alerta académica.
 *   2. Haber aprobado el curso de la oferta.
 */
export function evaluateEligibility(
  student: Student,
  courseCode: string,
): EligibilityResult {
  const reasons: string[] = [];

  if (student.alertaAcademica) {
    reasons.push('Posee alerta académica.');
  }

  const hasApproved = student.asignaturasAprobadas?.some(
    (a) => a.codigo === courseCode,
  );
  if (!hasApproved) {
    reasons.push('No ha aprobado la asignatura.');
  }

  return { canApply: reasons.length === 0, reasons };
}
