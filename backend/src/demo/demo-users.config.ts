/**
 * DEMO ONLY — Perfil académico del Estudiante Demo.
 *
 * Este archivo centraliza toda la información del Estudiante Demo.
 * El correo se lee desde la variable de entorno DEMO_STUDENT_EMAIL en .env
 * para evitar duplicar la fuente de verdad.
 *
 * Para eliminar el Demo Student en producción:
 *   1. Establecer DEMO_MODE=false en .env (el bloque de inyección se omite automáticamente).
 *   2. Opcionalmente eliminar este archivo y su import en academic.service.ts.
 *
 * NUNCA incluir este tipo de datos en producción.
 */

import { Student, AsignaturaAprobada } from '../academic/academic.interfaces';

// ─── Asignaturas aprobadas del Estudiante Demo ────────────────────────────────
// El Demo Student tiene exactamente estas dos asignaturas, suficientes para
// postular a cualquier oferta de ECIN-00619 o ECIN-00708.

const DEMO_APPROVED_COURSES: AsignaturaAprobada[] = [
  {
    nrc:             '22274',
    codigo:          'ECIN-00619',
    nombre:          'PROYECTO INTEGRADOR SOFTWARE',
    periodo:         '202520',
    nota:            6.0,
    oportunidad:     1,
    inscriptionType: 'REGULAR',
  },
  {
    nrc:             '22881',
    codigo:          'ECIN-00708',
    nombre:          'PROYECTO INTEGRADOR PLATAFORMA',
    periodo:         '202520',
    nota:            6.0,
    oportunidad:     1,
    inscriptionType: 'REGULAR',
  },
];

/**
 * Retorna el perfil académico completo del Estudiante Demo.
 * El correo se inyecta en tiempo de ejecución desde DEMO_STUDENT_EMAIL (.env)
 * para mantener un único punto de configuración del email.
 */
export function buildDemoStudentProfile(email: string): Student {
  return {
    nombre:           'Estudiante Demo',
    rut:              '11111111-1',
    telefono:         '',
    direccion:        '',
    correo:           email,
    ppa:              6.2,
    alertaAcademica:  false,
    carrera: {
      codigo: 'ITIN',
      nombre: 'Ingeniería en Tecnologías de Información',
    },
    asignaturasAprobadas: DEMO_APPROVED_COURSES,
  };
}
