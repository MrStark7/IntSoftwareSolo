import { ApplicationStatus, Offer } from '@prisma/client';
import { Student } from '../academic/academic.interfaces';

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

// ─── Constante interna ────────────────────────────────────────────────────────

export const STUDENT_DOMAIN = '@alumnos.ucn.cl';

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
