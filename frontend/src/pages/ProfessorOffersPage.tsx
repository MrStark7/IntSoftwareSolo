import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Users,
  Calendar,
  Loader2,
  Plus,
  Hash,
  ChevronRight,
} from 'lucide-react';
import { offerService } from '../services/offer.service';
import type { Offer, OfferStatus } from '../types';

// ─── Status config ────────────────────────────────────────────────────────────

const statusConfig: Record<OfferStatus, { label: string; classes: string }> = {
  OPEN:   { label: 'Abierta',  classes: 'bg-green-100 text-green-700' },
  CLOSED: { label: 'Cerrada',  classes: 'bg-red-100 text-red-700' },
  DRAFT:  { label: 'Borrador', classes: 'bg-gray-100 text-gray-500' },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

// ─── Offer row ────────────────────────────────────────────────────────────────

const OfferRow = ({ offer }: { offer: Offer }) => {
  const navigate = useNavigate();
  const status   = statusConfig[offer.status];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">
            {offer.courseName}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Hash size={11} />
              {offer.courseCode}
            </span>
            <span>NRC {offer.nrc}</span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Users size={12} className="text-ucn-teal" />
              {offer.vacancies} vacante{offer.vacancies !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-ucn-teal" />
              {formatDate(offer.applicationStart)} — {formatDate(offer.applicationEnd)}
            </span>
          </div>
        </div>

        <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${status.classes}`}>
          {status.label}
        </span>
      </div>

      {/* Description preview */}
      <p className="mt-3 text-xs text-gray-500 line-clamp-2">{offer.description}</p>

      {/* Ver postulaciones */}
      <div className="mt-3 pt-3 border-t border-gray-50">
        <button
          onClick={() => navigate(`/professor/offers/${offer.id}`)}
          className="flex items-center gap-1.5 text-sm font-medium text-ucn-teal hover:text-ucn-teal-dark transition-colors"
        >
          Ver postulaciones
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const ProfessorOffersPage = () => {
  const navigate = useNavigate();
  const [offers, setOffers]   = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    offerService
      .getMyOffers()
      .then(setOffers)
      .catch(() => setError('No se pudieron cargar las ofertas.'))
      .finally(() => setLoading(false));
  }, []);

  const openCount   = offers.filter((o) => o.status === 'OPEN').length;
  const draftCount  = offers.filter((o) => o.status === 'DRAFT').length;
  const closedCount = offers.filter((o) => o.status === 'CLOSED').length;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #003057 0%, #267A8A 100%)' }}
          >
            <ClipboardList size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Ofertas</h1>
            <p className="text-sm text-gray-500">Ofertas de ayudantía creadas por ti</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/professor/courses')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:brightness-110 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #003057 0%, #267A8A 100%)' }}
        >
          <Plus size={16} />
          Nueva Oferta
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={32} className="animate-spin text-ucn-teal" />
          <p className="text-sm text-gray-400">Cargando ofertas…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-5 text-sm">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && offers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <ClipboardList size={40} strokeWidth={1.2} />
          <p className="text-base font-medium text-gray-500">Sin ofertas creadas</p>
          <p className="text-sm">Ve a "Mis Cursos" y crea tu primera oferta.</p>
          <button
            onClick={() => navigate('/professor/courses')}
            className="mt-2 px-5 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #003057 0%, #267A8A 100%)' }}
          >
            Ir a Mis Cursos
          </button>
        </div>
      )}

      {/* Summary */}
      {!loading && !error && offers.length > 0 && (
        <>
          <div className="flex flex-wrap gap-3 mb-6">
            {openCount   > 0 && <Badge label={`${openCount} Abierta${openCount   !== 1 ? 's' : ''}`} cls="bg-green-100 text-green-700" />}
            {draftCount  > 0 && <Badge label={`${draftCount} Borrador${draftCount !== 1 ? 'es' : ''}`} cls="bg-gray-100 text-gray-500" />}
            {closedCount > 0 && <Badge label={`${closedCount} Cerrada${closedCount !== 1 ? 's' : ''}`} cls="bg-red-100 text-red-700" />}
          </div>

          <div className="space-y-3">
            {offers.map((offer) => (
              <OfferRow key={offer.id} offer={offer} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Badge = ({ label, cls }: { label: string; cls: string }) => (
  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${cls}`}>{label}</span>
);

export default ProfessorOffersPage;
