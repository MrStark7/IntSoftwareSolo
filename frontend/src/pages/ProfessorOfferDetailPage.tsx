import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  Users,
  Calendar,
  Hash,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  GraduationCap,
  TrendingUp,
  Lock,
} from 'lucide-react';
import { offerService } from '../services/offer.service';
import { applicationService } from '../services/application.service';
import type {
  Offer,
  OfferStatus,
  ApplicationWithAcademic,
  ApplicationStatus,
} from '../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_ORDER: Record<ApplicationStatus, number> = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
};

function sortApplications(list: ApplicationWithAcademic[]): ApplicationWithAcademic[] {
  return [...list].sort((a, b) => {
    const diff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (diff !== 0) return diff;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

const offerStatusConfig: Record<OfferStatus, { label: string; cls: string }> = {
  OPEN:   { label: 'Abierta',  cls: 'bg-green-100 text-green-700' },
  CLOSED: { label: 'Cerrada',  cls: 'bg-red-100 text-red-700' },
  DRAFT:  { label: 'Borrador', cls: 'bg-gray-100 text-gray-500' },
};

const appStatusConfig: Record<
  ApplicationStatus,
  { label: string; icon: typeof Clock; textCls: string; bgCls: string }
> = {
  PENDING:  { label: 'Pendiente', icon: Clock,         textCls: 'text-yellow-700', bgCls: 'bg-yellow-50 border-yellow-200' },
  APPROVED: { label: 'Aprobada',  icon: CheckCircle2,  textCls: 'text-green-700',  bgCls: 'bg-green-50 border-green-200' },
  REJECTED: { label: 'Rechazada', icon: XCircle,       textCls: 'text-red-600',    bgCls: 'bg-red-50 border-red-200' },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });

// ─── Offer summary card ───────────────────────────────────────────────────────

const OfferSummary = ({
  offer,
  pendingCount,
  approvedCount,
  rejectedCount,
}: {
  offer: Offer;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}) => {
  const status = offerStatusConfig[offer.status];
  const total  = pendingCount + approvedCount + rejectedCount;
  const isClosed = offer.status === 'CLOSED';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900">{offer.courseName}</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-400">
            <span className="flex items-center gap-1"><Hash size={13} />{offer.courseCode}</span>
            <span>NRC {offer.nrc}</span>
            <span className="flex items-center gap-1"><BookOpen size={13} />{offer.professorName}</span>
          </div>
        </div>
        <span className={`flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${status.cls}`}>
          {status.label}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mb-5">
        {/* Vacantes: muestra "X / Y seleccionados" */}
        <span className="flex items-center gap-1.5">
          <Users size={14} className="text-ucn-teal" />
          <span>
            <span className={`font-semibold ${approvedCount >= offer.vacancies ? 'text-red-600' : 'text-green-700'}`}>
              {approvedCount}
            </span>
            <span className="text-gray-400"> / {offer.vacancies} seleccionado{offer.vacancies !== 1 ? 's' : ''}</span>
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={14} className="text-ucn-teal" />
          {formatDate(offer.applicationStart)} — {formatDate(offer.applicationEnd)}
        </span>
        {isClosed && offer.closedAt && (
          <span className="flex items-center gap-1.5 text-red-500 font-medium">
            <Lock size={13} />
            Cerrada el {formatDate(offer.closedAt)}
          </span>
        )}
      </div>

      {/* Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <CounterCard value={total}         label="Total"      cls="bg-gray-50 text-gray-700" />
        <CounterCard value={pendingCount}  label="Pendientes" cls="bg-yellow-50 text-yellow-700" />
        <CounterCard value={approvedCount} label="Aprobadas"  cls="bg-green-50 text-green-700" />
        <CounterCard value={rejectedCount} label="Rechazadas" cls="bg-red-50 text-red-700" />
      </div>
    </div>
  );
};

const CounterCard = ({
  value,
  label,
  cls,
}: {
  value: number;
  label: string;
  cls: string;
}) => (
  <div className={`rounded-xl p-3 text-center ${cls}`}>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs font-medium mt-0.5">{label}</p>
  </div>
);

// ─── Closed offer banner ──────────────────────────────────────────────────────

const ClosedOfferBanner = ({ closedAt }: { closedAt?: string | null }) => (
  <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-red-50 border border-red-200">
    <Lock size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
    <div>
      <p className="text-sm font-semibold text-red-700">Oferta Cerrada — Vacantes completadas</p>
      <p className="text-xs text-red-500 mt-0.5">
        Todas las vacantes fueron ocupadas. Las postulaciones pendientes fueron rechazadas automáticamente.
        {closedAt && ` Cerrada el ${formatDate(closedAt)}.`}
      </p>
    </div>
  </div>
);

// ─── Application card ─────────────────────────────────────────────────────────

const ApplicationCard = ({
  app,
  offerClosed,
  onApprove,
  onReject,
}: {
  app: ApplicationWithAcademic;
  offerClosed: boolean;
  onApprove: (id: string) => Promise<void>;
  onReject:  (id: string) => Promise<void>;
}) => {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const cfg = appStatusConfig[app.status];
  const StatusIcon = cfg.icon;

  const handle = async (action: 'approve' | 'reject') => {
    setLoading(action);
    setActionError(null);
    try {
      if (action === 'approve') await onApprove(app.id);
      else                      await onReject(app.id);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setActionError(e?.response?.data?.message ?? 'Error al procesar la acción.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg, #003057 0%, #267A8A 100%)' }}
        >
          {app.studentName.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{app.studentName}</p>
              <p className="text-xs text-gray-400">{app.studentEmail}</p>
            </div>
            {/* Status badge */}
            <span
              className={`flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bgCls} ${cfg.textCls}`}
            >
              <StatusIcon size={11} />
              {cfg.label}
            </span>
          </div>

          {/* Academic data */}
          {app.student ? (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <AcademicField
                icon={<Hash size={11} />}
                label="RUT"
                value={app.student.rut}
              />
              <AcademicField
                icon={<GraduationCap size={11} />}
                label="Carrera"
                value={app.student.carrera.nombre}
                wide
              />
              <AcademicField
                icon={<TrendingUp size={11} />}
                label="PPA"
                value={app.student.ppa !== null ? app.student.ppa.toFixed(2) : 'N/D'}
              />
              <div className="flex items-center gap-1.5">
                {app.student.alertaAcademica ? (
                  <span className="flex items-center gap-1 text-red-600 font-medium">
                    <AlertTriangle size={11} />
                    Alerta Académica
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    <CheckCircle2 size={11} />
                    Sin alerta
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="mt-2 text-xs text-gray-400 italic">
              Datos académicos no disponibles en el registro institucional.
            </p>
          )}

          {/* Date */}
          <p className="mt-2 text-xs text-gray-400">
            Postulado el {formatDate(app.createdAt)}
          </p>

          {/* Error */}
          {actionError && (
            <p className="mt-2 text-xs text-red-500">{actionError}</p>
          )}

          {/* Actions — solo para PENDING y oferta no cerrada */}
          {app.status === 'PENDING' && !offerClosed && (
            <div className="mt-3 flex items-center gap-2">
              <ActionButton
                label="Aprobar"
                loading={loading === 'approve'}
                disabled={loading !== null}
                variant="approve"
                onClick={() => handle('approve')}
              />
              <ActionButton
                label="Rechazar"
                loading={loading === 'reject'}
                disabled={loading !== null}
                variant="reject"
                onClick={() => handle('reject')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AcademicField = ({
  icon,
  label,
  value,
  wide,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  wide?: boolean;
}) => (
  <div className={wide ? 'col-span-2 sm:col-span-1' : ''}>
    <p className="text-gray-400 flex items-center gap-1 mb-0.5">
      {icon} {label}
    </p>
    <p className="font-medium text-gray-700 truncate">{value}</p>
  </div>
);

const ActionButton = ({
  label,
  loading,
  disabled,
  variant,
  onClick,
}: {
  label: string;
  loading: boolean;
  disabled: boolean;
  variant: 'approve' | 'reject';
  onClick: () => void;
}) => {
  const base = 'flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50';
  const cls =
    variant === 'approve'
      ? `${base} text-white`
      : `${base} border border-red-200 text-red-600 hover:bg-red-50`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cls}
      style={
        variant === 'approve'
          ? { background: 'linear-gradient(135deg, #003057 0%, #267A8A 100%)' }
          : {}
      }
    >
      {loading ? (
        <Loader2 size={12} className="animate-spin" />
      ) : variant === 'approve' ? (
        <CheckCircle2 size={12} />
      ) : (
        <XCircle size={12} />
      )}
      {label}
    </button>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const ProfessorOfferDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [offer, setOffer]               = useState<Offer | null>(null);
  const [applications, setApplications] = useState<ApplicationWithAcademic[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!id) return;
    const [foundOffers, apps] = await Promise.all([
      offerService.getMyOffers(),
      applicationService.getOfferApplications(id),
    ]);
    const foundOffer = foundOffers.find((o) => o.id === id) ?? null;
    if (!foundOffer) {
      setError('Oferta no encontrada o no te pertenece.');
    } else {
      setOffer(foundOffer);
      setApplications(sortApplications(apps));
    }
  }, [id]);

  useEffect(() => {
    loadData()
      .catch(() => setError('No se pudo cargar la oferta. Intenta de nuevo.'))
      .finally(() => setLoading(false));
  }, [loadData]);

  /**
   * Al aprobar se hace un full-refresh para reflejar el posible
   * cierre automático de la oferta y el rechazo de pendientes en cascada.
   */
  const handleApprove = useCallback(async (applicationId: string) => {
    await applicationService.approveApplication(applicationId);
    await loadData();
  }, [loadData]);

  /**
   * Al rechazar solo actualiza la card localmente — no hay cascade.
   */
  const handleReject = useCallback(async (applicationId: string) => {
    const updated = await applicationService.rejectApplication(applicationId);
    setApplications((prev) =>
      sortApplications(
        prev.map((a) => (a.id === updated.id ? { ...a, status: updated.status } : a)),
      ),
    );
  }, []);

  const pendingCount  = applications.filter((a) => a.status === 'PENDING').length;
  const approvedCount = applications.filter((a) => a.status === 'APPROVED').length;
  const rejectedCount = applications.filter((a) => a.status === 'REJECTED').length;

  const isClosed = offer?.status === 'CLOSED';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 size={32} className="animate-spin text-ucn-teal" />
        <p className="text-sm text-gray-400">Cargando datos del sistema y API institucional…</p>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="text-red-600 font-medium">{error ?? 'Oferta no encontrada.'}</p>
        <button
          onClick={() => navigate('/professor/offers')}
          className="mt-4 text-sm text-ucn-teal hover:underline"
        >
          Volver a Mis Ofertas
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate('/professor/offers')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Volver a Mis Ofertas
      </button>

      {/* Offer summary */}
      <OfferSummary
        offer={offer}
        pendingCount={pendingCount}
        approvedCount={approvedCount}
        rejectedCount={rejectedCount}
      />

      {/* Banner de oferta cerrada */}
      {isClosed && <ClosedOfferBanner closedAt={offer.closedAt} />}

      {/* Applications list */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Postulantes ({applications.length})
        </h2>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
            <Users size={36} strokeWidth={1.2} />
            <p className="text-sm font-medium text-gray-500">Sin postulaciones aún</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                offerClosed={isClosed}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorOfferDetailPage;
