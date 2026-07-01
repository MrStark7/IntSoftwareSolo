import { api } from './api';
import type { ApplicationWithOffer, OfferDetail } from '../types';

export const applicationService = {
  getMyApplications: async (): Promise<ApplicationWithOffer[]> => {
    const { data } = await api.get<ApplicationWithOffer[]>('/applications/me');
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
};
