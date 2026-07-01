import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Hash,
  Users,
  Calendar,
  FileText,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { offerService } from '../services/offer.service';
import type { TeacherCourse, OfferStatus } from '../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const today = () => new Date().toISOString().split('T')[0];

// ─── Page ─────────────────────────────────────────────────────────────────────

const CreateOfferPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const course    = location.state?.course as TeacherCourse | undefined;

  // Si no llegó con un curso redirige a la lista
  if (!course) {
    navigate('/professor/courses', { replace: true });
    return null;
  }

  const [form, setForm] = useState({
    vacancies:        1,
    description:      '',
    applicationStart: today(),
    applicationEnd:   '',
    status:           'OPEN' as OfferStatus,
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // ── Validation ────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const e: Record<string, string> = {};

    if (form.vacancies < 1) {
      e.vacancies = 'Las vacantes deben ser mayores que cero.';
    }
    if (form.description.trim().length < 10) {
      e.description = 'La descripción debe tener al menos 10 caracteres.';
    }
    if (!form.applicationStart) {
      e.applicationStart = 'La fecha de inicio es obligatoria.';
    }
    if (!form.applicationEnd) {
      e.applicationEnd = 'La fecha de término es obligatoria.';
    } else if (
      form.applicationStart &&
      new Date(form.applicationEnd) <= new Date(form.applicationStart)
    ) {
      e.applicationEnd = 'La fecha de término debe ser posterior a la fecha de inicio.';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await offerService.create({
        courseCode:       course.codigo,
        nrc:              course.nrc,
        vacancies:        form.vacancies,
        description:      form.description.trim(),
        applicationStart: form.applicationStart,
        applicationEnd:   form.applicationEnd,
        status:           form.status,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setServerError(
        axiosErr?.response?.data?.message ??
        'Ocurrió un error al crear la oferta. Intenta de nuevo.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success state ─────────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="max-w-lg mx-auto animate-fade-in flex flex-col items-center justify-center py-20 gap-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #003057 0%, #267A8A 100%)' }}
        >
          <CheckCircle2 size={32} className="text-white" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-1">¡Oferta creada!</h2>
          <p className="text-sm text-gray-500">
            La oferta para <strong>{course.asignatura}</strong> fue publicada correctamente.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/professor/courses')}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
          >
            Volver a Mis Cursos
          </button>
          <button
            onClick={() => navigate('/professor/offers')}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #003057 0%, #267A8A 100%)' }}
          >
            Ver Mis Ofertas
          </button>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate('/professor/courses')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Volver a Mis Cursos
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Crear Oferta de Ayudantía</h1>
        <p className="text-sm text-gray-500 mt-1">
          Completa los detalles para publicar la oferta.
        </p>
      </div>

      {/* Course info (read-only) */}
      <div className="bg-ucn-teal-light rounded-xl border border-ucn-teal/20 p-5 mb-6">
        <p className="text-xs font-semibold text-ucn-teal-dark uppercase tracking-wide mb-3">
          Curso seleccionado · No editable
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <BookOpen size={15} className="text-ucn-teal mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Asignatura</p>
              <p className="font-semibold text-gray-900">{course.asignatura}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Hash size={15} className="text-ucn-teal mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Código</p>
              <p className="font-semibold text-gray-900">{course.codigo}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Hash size={15} className="text-ucn-teal mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">NRC</p>
              <p className="font-semibold text-gray-900">{course.nrc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        {/* Server error */}
        {serverError && (
          <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm p-4">
            {serverError}
          </div>
        )}

        {/* Vacantes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <Users size={14} className="inline mr-1.5 text-ucn-teal" />
            Vacantes
          </label>
          <input
            type="number"
            min={1}
            value={form.vacancies}
            onChange={(e) => setForm({ ...form, vacancies: Number(e.target.value) })}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ucn-teal/40 transition
              ${errors.vacancies ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
          />
          {errors.vacancies && (
            <p className="text-xs text-red-500 mt-1">{errors.vacancies}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <FileText size={14} className="inline mr-1.5 text-ucn-teal" />
            Descripción
          </label>
          <textarea
            rows={4}
            placeholder="Describe las responsabilidades del ayudante, requisitos especiales, horario tentativo, etc."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ucn-teal/40 transition resize-none
              ${errors.description ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Calendar size={14} className="inline mr-1.5 text-ucn-teal" />
              Fecha de inicio
            </label>
            <input
              type="date"
              value={form.applicationStart}
              onChange={(e) => setForm({ ...form, applicationStart: e.target.value })}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ucn-teal/40 transition
                ${errors.applicationStart ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.applicationStart && (
              <p className="text-xs text-red-500 mt-1">{errors.applicationStart}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Calendar size={14} className="inline mr-1.5 text-ucn-teal" />
              Fecha de término
            </label>
            <input
              type="date"
              value={form.applicationEnd}
              onChange={(e) => setForm({ ...form, applicationEnd: e.target.value })}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ucn-teal/40 transition
                ${errors.applicationEnd ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.applicationEnd && (
              <p className="text-xs text-red-500 mt-1">{errors.applicationEnd}</p>
            )}
          </div>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Estado inicial
          </label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as OfferStatus })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ucn-teal/40 transition bg-white"
          >
            <option value="OPEN">Abierta — visible para estudiantes</option>
            <option value="DRAFT">Borrador — no visible aún</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-50">
          <button
            type="button"
            onClick={() => navigate('/professor/courses')}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #003057 0%, #267A8A 100%)' }}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Publicando…
              </>
            ) : (
              'Publicar Oferta'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOfferPage;
