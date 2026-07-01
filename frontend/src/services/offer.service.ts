import { api } from './api';
import type { Offer, CreateOfferInput } from '../types';

export const offerService = {
  getAll: async (): Promise<Offer[]> => {
    const { data } = await api.get<Offer[]>('/offers');
    return data;
  },

  getOne: async (id: string): Promise<Offer> => {
    const { data } = await api.get<Offer>(`/offers/${id}`);
    return data;
  },

  getMyOffers: async (): Promise<Offer[]> => {
    const { data } = await api.get<Offer[]>('/offers/mine');
    return data;
  },

  create: async (input: CreateOfferInput): Promise<Offer> => {
    const { data } = await api.post<Offer>('/offers', input);
    return data;
  },

  update: async (id: string, input: Partial<CreateOfferInput>): Promise<Offer> => {
    const { data } = await api.patch<Offer>(`/offers/${id}`, input);
    return data;
  },

  remove: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(`/offers/${id}`);
    return data;
  },
};
