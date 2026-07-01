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
  createdAt: string;
  updatedAt: string;
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
