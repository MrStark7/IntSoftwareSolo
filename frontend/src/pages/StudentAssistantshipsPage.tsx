import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Hash,
  Users,
  Calendar,
  ChevronRight,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { applicationService } from '../services/application.service';
import type { ApplicationWithOffer } from '../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Deriva el período académico a partir de la fecha de inicio de la oferta.
 * UCN usa dos semestres: primer semestre (ene–jun) y segundo semestre (jul–dic).
 */
function getPeriodo(dateIso: string): string {
  const d     = new Date(dateIso);
  const year  = d.getFullYear();
  const month = d.getMonth() + 1;
  return month <= 6 ? `Primer Semestre ${year}` : `Segundo Semestre ${year}`;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

// ─── Assistantship card ───────────────────────────────────────────────────────

const AssistantshipCard = ({ app }: { app: ApplicationWithOffer }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #003057 0%, #267A8A 100%)' }}
        >
          <GraduationCap size={18} className="text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate">
                {app.offer.courseName}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {app.offer.courseCode} · NRC {app.offer.nrc}
              </p>
            </div>

            {/* Status badge */}
            <span className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border bg-green-50 border-green-200 text-green-700">
              <CheckCircle2 size={11} />
              Ayudante Asignado
            </span>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <BookOpen size={12} className="text-ucn-teal" />
              {app.offer.professorName}
            </span>
            <span className="flex items-center gap-1">
              <Hash size={12} className="text-ucn-teal" />
              {app.offer.courseCode}
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} className="text-ucn-teal" />
              NRC {app.offer.nrc}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-ucn-teal" />
              {getPeriodo(app.offer.applicationStart)}
            </span>
          </div>

          {/* Assigned date */}
          <p className="mt-2 text-xs text-gray-400">
            Asignado el {formatDate(app.updatedAt)}
          </p>
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-3 pt-3 border-t border-gray-50">
        <button
          onClick={() => navigate(`/offers/${app.offerId}`)}
          className="flex items-center gap-1 text-xs text-ucn-teal hover:text-ucn-teal-dark transition-colors"
        >
          Ver oferta
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const StudentAssistantshipsPage = () => {
  const navigate = useNavigate();
  const [assistantships, setAssistantships] = useState<ApplicationWithOffer[]>([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);

  useEffect(() => {
    applicationService
      .getMyAssistantships()
      .then(setAssistantships)
      .catch(() => setError('No se pudieron cargar tus ayudantías. Intenta de nuevo.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #003057 0%, #267A8A 100%)' }}
          >
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Ayudantías</h1>
            <p className="text-sm text-gray-500">
              Cursos donde fuiste seleccionado como Asistente de Cátedra
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={32} className="animate-spin text-ucn-teal" />
          <p className="text-sm text-gray-400">Cargando ayudantías…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-5 text-sm">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && assistantships.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <GraduationCap size={44} strokeWidth={1.2} />
          <p className="text-base font-medium text-gray-500">Sin ayudantías asignadas</p>
          <p className="text-sm text-center max-w-xs">
            Cuando un profesor apruebe tu postulación, la ayudantía aparecerá aquí.
          </p>
          <button
            onClick={() => navigate('/offers')}
            className="mt-2 px-5 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #003057 0%, #267A8A 100%)' }}
          >
            Ver Ofertas Disponibles
          </button>
        </div>
      )}

      {/* List */}
      {!loading && !error && assistantships.length > 0 && (
        <>
          {/* Summary */}
          <div className="flex items-center gap-2 mb-6">
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border bg-green-50 border-green-200 text-green-700">
              <CheckCircle2 size={12} />
              {assistantships.length} ayudantía{assistantships.length !== 1 ? 's' : ''} asignada{assistantships.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-3">
            {assistantships.map((app) => (
              <AssistantshipCard key={app.id} app={app} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentAssistantshipsPage;
