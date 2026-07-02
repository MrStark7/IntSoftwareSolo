export type Role = 'STUDENT' | 'TEACHING_ASSISTANT' | 'PROFESSOR' | 'ADMIN';

// Public user shape returned by /auth/profile and /users/me.
// googleId is intentionally excluded — it never leaves the backend.
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Ofertas de Ayudantía ────────────────────────────────────────────────────

export type OfferStatus = 'DRAFT' | 'OPEN' | 'CLOSED';

export interface Offer {
  id: string;
  courseCode: string;
  courseName: string;
  nrc: string;
  professorEmail: string;
  professorName: string;
  vacancies: number;
  description: string;
  applicationStart: string;
  applicationEnd: string;
  status: OfferStatus;
  /** Fecha de cierre automático. Presente cuando status === 'CLOSED'. */
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Cursos del profesor (API institucional) ──────────────────────────────────

export interface TeacherCourse {
  nrc: string;
  codigo: string;
  asignatura: string;
}

// ─── Crear oferta (input del formulario del profesor) ────────────────────────

export interface CreateOfferInput {
  courseCode: string;
  nrc: string;
  vacancies: number;
  description: string;
  applicationStart: string;
  applicationEnd: string;
  status?: OfferStatus;
}

// ─── Elegibilidad ─────────────────────────────────────────────────────────────

export interface EligibilityResult {
  canApply: boolean;
  reasons: string[];
}

export interface OfferDetail {
  offer: Offer;
  eligibility: EligibilityResult;
}

// ─── Postulaciones ────────────────────────────────────────────────────────────

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Application {
  id: string;
  offerId: string;
  studentEmail: string;
  studentRut: string;
  studentName: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationWithOffer extends Application {
  offer: Offer;
}

// ─── Postulación enriquecida con datos académicos institucionales ─────────────

export interface StudentAcademicInfo {
  nombre: string;
  correo: string;
  rut: string;
  carrera: { codigo: string; nombre: string };
  ppa: number | null;
  alertaAcademica: boolean;
}

export interface ApplicationWithAcademic extends Application {
  /** null si el estudiante no figura en el registro institucional */
  student: StudentAcademicInfo | null;
}

// ─── Notificaciones ───────────────────────────────────────────────────────────

export type NotificationType =
  | 'NEW_APPLICATION'
  | 'APPLICATION_APPROVED'
  | 'APPLICATION_REJECTED';

export interface AppNotification {
  id: string;
  recipientEmail: string;
  recipientRole: 'STUDENT' | 'PROFESSOR';
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  /** Para navegación contextual futura — no se utiliza todavía. */
  relatedOfferId: string | null;
  /** Para navegación contextual futura — no se utiliza todavía. */
  relatedApplicationId: string | null;
  createdAt: string;
}

export interface UnreadCount {
  unread: number;
}
