import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Users, Calendar, BookOpen, ChevronRight, Loader2 } from 'lucide-react';
import { offerService } from '../services/offer.service';
import type { Offer, OfferStatus } from '../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── Offer Card ───────────────────────────────────────────────────────────────

const OfferCard = ({ offer }: { offer: Offer }) => {
  const navigate = useNavigate();
  const status   = statusConfig[offer.status];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base leading-tight truncate">
            {offer.courseName}
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">
            {offer.courseCode} · NRC {offer.nrc}
          </p>
        </div>
        <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${status.classes}`}>
          {status.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
        {offer.description}
      </p>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <BookOpen size={13} className="text-ucn-teal flex-shrink-0" />
          <span className="truncate">{offer.professorName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users size={13} className="text-ucn-teal flex-shrink-0" />
          <span>{offer.vacancies} vacante{offer.vacancies !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2">
          <Calendar size={13} className="text-ucn-teal flex-shrink-0" />
          <span>
            {formatDate(offer.applicationStart)} — {formatDate(offer.applicationEnd)}
          </span>
        </div>
      </div>

      {/* Action */}
      <div className="pt-1 border-t border-gray-50">
        <button
          className="flex items-center gap-1.5 text-sm font-medium text-ucn-teal hover:text-ucn-teal-dark transition-colors"
          onClick={() => navigate(`/offers/${offer.id}`)}
        >
          Ver detalle
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const OffersPage = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    offerService
      .getAll()
      .then(setOffers)
      .catch(() => setError('No se pudieron cargar las ofertas. Intenta de nuevo.'))
      .finally(() => setLoading(false));
  }, []);

  const openOffers  = offers.filter((o) => o.status === 'OPEN');
  const otherOffers = offers.filter((o) => o.status !== 'OPEN');

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #003057 0%, #267A8A 100%)' }}>
            <ClipboardList size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ofertas de Ayudantía</h1>
            <p className="text-sm text-gray-500">Revisa las oportunidades disponibles para este período</p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <Loader2 size={32} className="animate-spin text-ucn-teal" />
          <p className="text-sm">Cargando ofertas…</p>
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
          <p className="text-base font-medium text-gray-500">No hay ofertas disponibles</p>
          <p className="text-sm">Los profesores publicarán nuevas oportunidades pronto.</p>
        </div>
      )}

      {/* Open offers */}
      {!loading && !error && openOffers.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Disponibles ({openOffers.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      )}

      {/* Other offers */}
      {!loading && !error && otherOffers.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Otras ofertas ({otherOffers.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default OffersPage;
