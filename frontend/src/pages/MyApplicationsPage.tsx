import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  BookOpen,
  Calendar,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { applicationService } from '../services/application.service';
import type { ApplicationWithOffer, ApplicationStatus } from '../types';

// ─── Status config ────────────────────────────────────────────────────────────

const statusConfig: Record<
  ApplicationStatus,
  { label: string; icon: typeof Clock; textClass: string; bgClass: string }
> = {
  PENDING: {
    label: 'Pendiente',
    icon: Clock,
    textClass: 'text-yellow-700',
    bgClass: 'bg-yellow-50 border-yellow-200',
  },
  APPROVED: {
    label: 'Aprobada',
    icon: CheckCircle2,
    textClass: 'text-green-700',
    bgClass: 'bg-green-50 border-green-200',
  },
  REJECTED: {
    label: 'Rechazada',
    icon: XCircle,
    textClass: 'text-red-600',
    bgClass: 'bg-red-50 border-red-200',
  },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

// ─── Application row card ─────────────────────────────────────────────────────

const ApplicationCard = ({ app }: { app: ApplicationWithOffer }) => {
  const navigate = useNavigate();
  const cfg      = statusConfig[app.status];
  const StatusIcon = cfg.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex items-start gap-4">
        {/* Left */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate">
            {app.offer.courseName}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {app.offer.courseCode} · NRC {app.offer.nrc}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <BookOpen size={12} className="text-ucn-teal" />
              {app.offer.professorName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-ucn-teal" />
              Postulado el {formatDate(app.createdAt)}
            </span>
          </div>
        </div>

        {/* Right: status */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bgClass} ${cfg.textClass}`}
          >
            <StatusIcon size={12} />
            {cfg.label}
          </span>
          <button
            onClick={() => navigate(`/offers/${app.offerId}`)}
            className="flex items-center gap-0.5 text-xs text-ucn-teal hover:text-ucn-teal-dark transition-colors"
          >
            Ver oferta
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const MyApplicationsPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ApplicationWithOffer[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);

  useEffect(() => {
    applicationService
      .getMyApplications()
      .then(setApplications)
      .catch(() => setError('No se pudieron cargar tus postulaciones.'))
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    PENDING:  applications.filter((a) => a.status === 'PENDING').length,
    APPROVED: applications.filter((a) => a.status === 'APPROVED').length,
    REJECTED: applications.filter((a) => a.status === 'REJECTED').length,
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #003057 0%, #267A8A 100%)' }}
          >
            <ClipboardList size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Postulaciones</h1>
            <p className="text-sm text-gray-500">Historial de postulaciones a ofertas de ayudantía</p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={32} className="animate-spin text-ucn-teal" />
          <p className="text-sm text-gray-400">Cargando postulaciones…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-5 text-sm">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && applications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <ClipboardList size={40} strokeWidth={1.2} />
          <p className="text-base font-medium text-gray-500">Sin postulaciones aún</p>
          <p className="text-sm">Revisa las ofertas disponibles y postula a las que te interesen.</p>
          <button
            onClick={() => navigate('/offers')}
            className="mt-2 px-5 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #003057 0%, #267A8A 100%)' }}
          >
            Ver Ofertas
          </button>
        </div>
      )}

      {/* Summary badges */}
      {!loading && !error && applications.length > 0 && (
        <>
          <div className="flex flex-wrap gap-3 mb-6">
            <SummaryBadge count={counts.PENDING}  label="Pendiente{s}"  cfg={statusConfig.PENDING}  />
            <SummaryBadge count={counts.APPROVED} label="Aprobada{s}"  cfg={statusConfig.APPROVED} />
            <SummaryBadge count={counts.REJECTED} label="Rechazada{s}" cfg={statusConfig.REJECTED} />
          </div>

          <div className="space-y-3">
            {applications.map((app) => (
              <ApplicationCard key={app.id} app={app} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const SummaryBadge = ({
  count,
  label,
  cfg,
}: {
  count: number;
  label: string;
  cfg: (typeof statusConfig)[ApplicationStatus];
}) => {
  const StatusIcon = cfg.icon;
  const singular = label.replace('{s}', '');
  const plural   = label.replace('{s}', 's');
  return (
    <div
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${cfg.bgClass} ${cfg.textClass}`}
    >
      <StatusIcon size={12} />
      {count} {count === 1 ? singular : plural}
    </div>
  );
};

export default MyApplicationsPage;
