import { api } from './api';
import { User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const authService = {
  loginWithGoogle: () => {
    window.location.href = `${API_URL}/auth/google`;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },
};
