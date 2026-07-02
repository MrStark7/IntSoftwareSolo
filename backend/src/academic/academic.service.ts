import { Injectable, Logger, BadGatewayException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { EcinCourse, Student, TeacherCourses } from './academic.interfaces';
import { buildDemoStudentProfile } from '../demo/demo-users.config';

const PUCLARO_BASE = 'https://puclaro.ucn.cl/totoralillo/api';
const HAWAII_BASE  = 'https://losvilos.ucn.cl/hawaii/api';

@Injectable()
export class AcademicService {
  private readonly logger = new Logger(AcademicService.name);

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  private get token(): string {
    return this.config.get<string>('UCN_TOKEN') ?? '';
  }

  private get period(): string {
    return this.config.get<string>('UCN_PERIOD') ?? '202520';
  }

  /** Elimina puntos y guión del RUT antes de enviarlo a la API.
   *  Ejemplo: "12.840.176-8" → "128401768"
   */
  private formatRut(rut: string): string {
    return rut.replace(/\./g, '').replace(/-/g, '');
  }

  // ─── GET /academic/courses ───────────────────────────────────────────────

  async getCourses(): Promise<EcinCourse[]> {
    const url = `${PUCLARO_BASE}/course/ecin-courses`;
    this.logger.log(`GET ${url} [period=${this.period}]`);

    try {
      const response = await firstValueFrom(
        this.http.get<EcinCourse[]>(url, {
          params: { token: this.token, period: this.period },
        }),
      );
      return response.data;
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data ?? error?.message ?? 'Unknown error';
      this.logger.error(`getCourses failed — HTTP ${status}: ${JSON.stringify(message)}`);
      throw new BadGatewayException(
        `No se pudo obtener la lista de cursos ECIN desde el servicio externo (HTTP ${status ?? 'N/A'})`,
      );
    }
  }

  // ─── POST /academic/students ─────────────────────────────────────────────

  async getStudents(): Promise<Student[]> {
    const url = `${HAWAII_BASE}/estudiantes-periodo-a`;
    this.logger.log(`POST ${url} [period=${this.period}]`);

    try {
      const response = await firstValueFrom(
        this.http.post<Student[]>(
          `${url}?${this.period}`,
          null, // sin body
          { headers: { 'X-HAWAII-AUTH': this.token } },
        ),
      );

      // DEMO ONLY ─────────────────────────────────────────────────────────────
      // El Estudiante Demo no existe en la API institucional.
      // Cuando DEMO_MODE=true, se añade su perfil académico al final del arreglo
      // para que atraviese exactamente la misma lógica de validación que un
      // estudiante real. La respuesta original de la API NO se modifica.
      // Para deshabilitar: establecer DEMO_MODE=false en .env.
      // ────────────────────────────────────────────────────────────────────────
      const isDemoMode       = this.config.get<string>('DEMO_MODE') === 'true';
      const demoStudentEmail = this.config.get<string>('DEMO_STUDENT_EMAIL');

      if (isDemoMode && demoStudentEmail) {
        const emailLower    = demoStudentEmail.toLowerCase();
        const alreadyInApi  = response.data.some(
          (s) => s.correo.toLowerCase() === emailLower,
        );

        if (!alreadyInApi) {
          const demoProfile = buildDemoStudentProfile(demoStudentEmail);
          this.logger.log(`[DEMO] Injecting demo student profile for ${demoStudentEmail}`);
          return [...response.data, demoProfile];
        }
      }
      // ─────────────────────────────────────────────────────────────────────

      return response.data;
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data ?? error?.message ?? 'Unknown error';
      this.logger.error(`getStudents failed — HTTP ${status}: ${JSON.stringify(message)}`);
      throw new BadGatewayException(
        `No se pudo obtener la lista de estudiantes desde el servicio externo (HTTP ${status ?? 'N/A'})`,
      );
    }
  }

  // ─── GET /academic/teacher/:rut ──────────────────────────────────────────

  async getTeacherCourses(rut: string): Promise<TeacherCourses> {
    const formattedRut = this.formatRut(rut);
    const url = `${PUCLARO_BASE}/teacher/teacher-courses`;
    this.logger.log(`GET ${url} [rut=${rut} → ${formattedRut}, period=${this.period}]`);

    try {
      const response = await firstValueFrom(
        this.http.get<TeacherCourses>(url, {
          params: { token: this.token, period: this.period, rut: formattedRut },
        }),
      );
      return response.data;
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data ?? error?.message ?? 'Unknown error';
      this.logger.error(`getTeacherCourses failed — HTTP ${status}: ${JSON.stringify(message)}`);
      throw new BadGatewayException(
        `No se pudo obtener los cursos del profesor desde el servicio externo (HTTP ${status ?? 'N/A'})`,
      );
    }
  }
}
