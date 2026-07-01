import {
  AsignaturaAprobada,
  Carrera,
} from '../academic/academic.interfaces';

// ─── Dominios institucionales reconocidos ────────────────────────────────────

export const STUDENT_DOMAIN  = '@alumnos.ucn.cl';
export const PROFESSOR_DOMAIN = '@ucn.cl';

export type InstitutionalRole = 'STUDENT' | 'PROFESSOR';

// ─── Perfiles por rol ─────────────────────────────────────────────────────────

export interface StudentProfile {
  nombre: string;
  rut: string;
  correo: string;
  telefono: string;
  direccion: string;
  ppa: number | null;
  alertaAcademica: boolean;
  carrera: Carrera;
  asignaturasAprobadas: AsignaturaAprobada[];
}

export interface ProfessorProfile {
  email: string;
  name: string;
}

// ─── Respuesta unificada ──────────────────────────────────────────────────────

export interface IdentityResponse {
  role: InstitutionalRole;
  profile: StudentProfile | ProfessorProfile;
}
