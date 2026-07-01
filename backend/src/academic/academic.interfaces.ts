// ─── API 1: GET /course/ecin-courses ────────────────────────────────────────

export interface EcinCourse {
  codigo: string;
  nombre: string;
}

// ─── API 2: POST /estudiantes-periodo-a ─────────────────────────────────────

export type InscriptionType =
  | 'REGULAR'
  | 'CONVALIDADA'
  | 'CAMBIO CATALOGO CARRERA'
  | 'CAMBIO DE CARRERA'
  | 'CAMBIO DE SEDE'
  | 'CURSO DE VERANO'
  | 'DADO POR APROBADO'
  | 'INTERCAMBIO'
  | 'PROGRAMA ENLACE'
  | 'RECONOCIMIENTO EXTRACURRICULAR'
  | 'REGULARIZACIÓN CONVALIDACIÓN'
  | 'REGULARIZACION DE CREDITOS'
  | 'TRASLADO UNIVERSIDAD';

export interface AsignaturaAprobada {
  nrc: string;
  codigo: string;
  nombre: string;
  periodo: string;
  nota: number;
  oportunidad: number;
  inscriptionType: InscriptionType;
}

export interface Carrera {
  codigo: string;
  nombre: string;
}

export interface Student {
  nombre: string;
  rut: string;
  telefono: string;
  direccion: string;
  correo: string;
  /** Puede ser null en estudiantes de primer semestre sin historial suficiente */
  ppa: number | null;
  alertaAcademica: boolean;
  carrera: Carrera;
  asignaturasAprobadas: AsignaturaAprobada[];
}

// ─── API 3: GET /teacher/teacher-courses ────────────────────────────────────

export interface TeacherAsignatura {
  nrc: string;
  codigo: string;
  /** Nota: la API usa "asignatura" en lugar de "nombre" a diferencia de la API 1 */
  asignatura: string;
}

export interface TeacherCourses {
  /** Null cuando el RUT no existe en el sistema */
  nombre: string | null;
  asignaturas: TeacherAsignatura[];
}
