import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Loader2, Hash } from 'lucide-react';
import { teacherService } from '../services/teacher.service';
import type { TeacherCourse } from '../types';

const ProfessorCoursesPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    teacherService
      .getMyCourses()
      .then(setCourses)
      .catch((err) => {
        const msg = err?.response?.data?.message ?? 'No se pudieron cargar los cursos.';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCreateOffer = (course: TeacherCourse) => {
    navigate('/professor/create-offer', { state: { course } });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #003057 0%, #267A8A 100%)' }}
          >
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Cursos</h1>
            <p className="text-sm text-gray-500">
              Cursos del período actual · Fuente: API Institucional UCN
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={32} className="animate-spin text-ucn-teal" />
          <p className="text-sm text-gray-400">Consultando API institucional…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-5 text-sm">
          <p className="font-medium mb-1">No se pudieron cargar los cursos</p>
          <p>{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && courses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <BookOpen size={40} strokeWidth={1.2} />
          <p className="text-base font-medium text-gray-500">Sin cursos en este período</p>
          <p className="text-sm text-center">
            No se encontraron asignaturas para el RUT configurado.
          </p>
        </div>
      )}

      {/* Course list */}
      {!loading && !error && courses.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {courses.length} asignatura{courses.length !== 1 ? 's' : ''} encontrada{courses.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <CourseCard
                key={`${course.codigo}-${course.nrc}`}
                course={course}
                onCreateOffer={handleCreateOffer}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Course Card ──────────────────────────────────────────────────────────────

const CourseCard = ({
  course,
  onCreateOffer,
}: {
  course: TeacherCourse;
  onCreateOffer: (c: TeacherCourse) => void;
}) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
    {/* Info */}
    <div className="flex items-start gap-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #E6F4F7 0%, #cce9ef 100%)' }}
      >
        <BookOpen size={18} className="text-ucn-teal" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug">
          {course.asignatura}
        </h3>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Hash size={11} />
            {course.codigo}
          </span>
          <span className="flex items-center gap-1">
            NRC {course.nrc}
          </span>
        </div>
      </div>
    </div>

    {/* Action */}
    <button
      onClick={() => onCreateOffer(course)}
      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold
                 text-white transition-all hover:brightness-110 hover:shadow-md"
      style={{ background: 'linear-gradient(135deg, #003057 0%, #267A8A 100%)' }}
    >
      <Plus size={16} />
      Crear Oferta de Ayudantía
    </button>
  </div>
);

export default ProfessorCoursesPage;
