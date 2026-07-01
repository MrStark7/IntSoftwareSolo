import { api } from './api';
import type {
  Application,
  ApplicationWithAcademic,
  ApplicationWithOffer,
  OfferDetail,
} from '../types';

export const applicationService = {
  // ── Estudiante ─────────────────────────────────────────────────────────────

  getMyApplications: async (): Promise<ApplicationWithOffer[]> => {
    const { data } = await api.get<ApplicationWithOffer[]>('/applications/me');
    return data;
  },

  /** Ayudantías asignadas — solo postulaciones APPROVED del estudiante autenticado. */
  getMyAssistantships: async (): Promise<ApplicationWithOffer[]> => {
    const { data } = await api.get<ApplicationWithOffer[]>(
      '/applications/my-assistantships',
    );
    return data;
  },

  apply: async (offerId: string): Promise<{ id: string }> => {
    const { data } = await api.post<{ id: string }>('/applications', { offerId });
    return data;
  },

  getOfferDetail: async (id: string): Promise<OfferDetail> => {
    const { data } = await api.get<OfferDetail>(`/offers/${id}`);
    return data;
  },

  // ── Profesor ───────────────────────────────────────────────────────────────

  /** Devuelve las postulaciones de una oferta enriquecidas con datos académicos. */
  getOfferApplications: async (
    offerId: string,
  ): Promise<ApplicationWithAcademic[]> => {
    const { data } = await api.get<ApplicationWithAcademic[]>(
      `/offers/${offerId}/applications`,
    );
    return data;
  },

  approveApplication: async (id: string): Promise<Application> => {
    const { data } = await api.patch<Application>(`/applications/${id}/approve`);
    return data;
  },

  rejectApplication: async (id: string): Promise<Application> => {
    const { data } = await api.patch<Application>(`/applications/${id}/reject`);
    return data;
  },
};
