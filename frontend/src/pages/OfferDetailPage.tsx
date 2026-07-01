import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Users,
  Calendar,
  Mail,
  CheckCircle2,
  XCircle,
  Loader2,
  ClipboardList,
  Send,
} from 'lucide-react';
import { applicationService } from '../services/application.service';
import type { OfferDetail, OfferStatus, ApplicationStatus } from '../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const statusConfig: Record<OfferStatus, { label: string; classes: string }> = {
  OPEN:   { label: 'Abierta',  classes: 'bg-green-100 text-green-700' },
  CLOSED: { label: 'Cerrada',  classes: 'bg-red-100 text-red-700' },
  DRAFT:  { label: 'Borrador', classes: 'bg-gray-100 text-gray-500' },
};

const applicationStatusConfig: Record<ApplicationStatus, { label: string; classes: string }> = {
  PENDING:  { label: 'Pendiente', classes: 'bg-yellow-100 text-yellow-700' },
  APPROVED: { label: 'Aprobada',  classes: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Rechazada', classes: 'bg-red-100 text-red-700' },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

// ─── Page ─────────────────────────────────────────────────────────────────────

const OfferDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [detail, setDetail]           = useState<OfferDetail | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [applying, setApplying]       = useState(false);
  const [applied, setApplied]         = useState(false);
  const [applyError, setApplyError]   = useState<string | null>(null);
  const [appStatus, setAppStatus]     = useState<ApplicationStatus | null>(null);

  useEffect(() => {
    if (!id) return;
    applicationService
      .getOfferDetail(id)
      .then(setDetail)
      .catch(() => setError('No se pudo cargar la oferta. Verifica que existe.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!id) return;
    setApplying(true);
    setApplyError(null);
    try {
      await applicationService.apply(id);
      setApplied(true);
      setAppStatus('PENDING');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; reasons?: string[] } } };
      const reasons  = axiosErr?.response?.data?.reasons;
      const msg      = axiosErr?.response?.data?.message;
      if (reasons?.length) {
        setApplyError(reasons.join(' · '));
      } else {
        setApplyError(msg ?? 'Ocurrió un error al postular. Intenta de nuevo.');
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 size={32} className="animate-spin text-ucn-teal" />
        <p className="text-sm text-gray-400">Cargando oferta…</p>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="text-red-600 font-medium">{error ?? 'Oferta no encontrada.'}</p>
        <button
          onClick={() => navigate('/offers')}
          className="mt-4 text-sm text-ucn-teal hover:underline"
        >
          Volver a Ofertas
        </button>
      </div>
    );
  }

  const { offer, eligibility } = detail;
  const status   = statusConfig[offer.status];
  const isOpen   = offer.status === 'OPEN';
  const canApply = eligibility.canApply && isOpen && !applied;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate('/offers')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Volver a Ofertas
      </button>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              {offer.courseName}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {offer.courseCode} · NRC {offer.nrc}
            </p>
          </div>
          <span className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full ${status.classes}`}>
            {status.label}
          </span>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed mb-5">
          {offer.description}
        </p>

        {/* Meta grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <BookOpen size={15} className="text-ucn-teal flex-shrink-0" />
            <span className="font-medium">{offer.professorName}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Mail size={15} className="text-ucn-teal flex-shrink-0" />
            <span className="truncate">{offer.professorEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users size={15} className="text-ucn-teal flex-shrink-0" />
            <span>{offer.vacancies} vacante{offer.vacancies !== 1 ? 's' : ''} disponible{offer.vacancies !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={15} className="text-ucn-teal flex-shrink-0" />
            <span>
              {formatDate(offer.applicationStart)} — {formatDate(offer.applicationEnd)}
            </span>
          </div>
        </div>
      </div>

      {/* Eligibility card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ClipboardList size={17} className="text-ucn-teal" />
          Requisitos de postulación
        </h2>

        <ul className="space-y-2.5">
          {/* Alerta académica */}
          <EligibilityItem
            met={!eligibility.reasons.includes('Posee alerta académica.')}
            label="Sin alerta académica"
          />
          {/* Curso aprobado */}
          <EligibilityItem
            met={!eligibility.reasons.includes('No ha aprobado la asignatura.')}
            label={`Curso aprobado (${offer.courseCode})`}
          />
        </ul>

        {/* Si no puede postular: lista de razones adicionales no cubiertas arriba */}
        {!eligibility.canApply &&
          eligibility.reasons.filter(
            (r) =>
              r !== 'Posee alerta académica.' &&
              r !== 'No ha aprobado la asignatura.',
          ).length > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-100">
              {eligibility.reasons
                .filter(
                  (r) =>
                    r !== 'Posee alerta académica.' &&
                    r !== 'No ha aprobado la asignatura.',
                )
                .map((r) => (
                  <p key={r} className="text-sm text-red-600">{r}</p>
                ))}
            </div>
          )}
      </div>

      {/* Action card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Postulación</h2>

        {/* Ya postulado */}
        {applied && appStatus && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium mb-4">
            <CheckCircle2 size={18} />
            Tu postulación fue enviada. Estado: {applicationStatusConfig[appStatus].label}
          </div>
        )}

        {/* Error al postular */}
        {applyError && (
          <div className="flex items-start gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
            <XCircle size={18} className="flex-shrink-0 mt-0.5" />
            {applyError}
          </div>
        )}

        {/* Oferta cerrada */}
        {!isOpen && !applied && (
          <p className="text-sm text-gray-500 mb-4">
            Esta oferta no está disponible para postulaciones.
          </p>
        )}

        <button
          onClick={handleApply}
          disabled={!canApply || applying || applied}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all
            ${canApply && !applying && !applied
              ? 'text-white shadow-sm hover:shadow-md hover:brightness-110'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          style={canApply && !applying && !applied
            ? { background: 'linear-gradient(135deg, #003057 0%, #267A8A 100%)' }
            : {}
          }
        >
          {applying ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Enviando…
            </>
          ) : applied ? (
            <>
              <CheckCircle2 size={16} />
              Postulación enviada
            </>
          ) : (
            <>
              <Send size={16} />
              Postular
            </>
          )}
        </button>

        {!canApply && !applied && isOpen && eligibility.reasons.length > 0 && (
          <p className="mt-3 text-xs text-gray-400">
            No cumples los requisitos: {eligibility.reasons.join(' · ')}
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Sub-componente reutilizable ──────────────────────────────────────────────

const EligibilityItem = ({ met, label }: { met: boolean; label: string }) => (
  <li className="flex items-center gap-2.5 text-sm">
    {met ? (
      <CheckCircle2 size={17} className="text-green-500 flex-shrink-0" />
    ) : (
      <XCircle size={17} className="text-red-400 flex-shrink-0" />
    )}
    <span className={met ? 'text-gray-700' : 'text-gray-500 line-through'}>
      {label}
    </span>
  </li>
);

export default OfferDetailPage;
