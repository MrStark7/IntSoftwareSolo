import { api } from './api';
import type { Offer } from '../types';

export const offerService = {
  getAll: async (): Promise<Offer[]> => {
    const { data } = await api.get<Offer[]>('/offers');
    return data;
  },

  getOne: async (id: string): Promise<Offer> => {
    const { data } = await api.get<Offer>(`/offers/${id}`);
    return data;
  },
};
