import { api } from './api';
import { User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export type DemoUserType = 'professor' | 'student';

export interface DemoLoginResponse {
  token: string;
  user: User;
}

export const authService = {
  loginWithGoogle: () => {
    window.location.href = `${API_URL}/auth/google`;
  },

  /**
   * Demo Login — solo disponible cuando VITE_DEMO_MODE=true (desarrollo).
   * Llama a POST /auth/demo-login y devuelve el token JWT.
   * El token se almacena exactamente igual que en el flujo de Google OAuth.
   */
  demoLogin: async (type: DemoUserType): Promise<DemoLoginResponse> => {
    const response = await api.post<DemoLoginResponse>('/auth/demo-login', { type });
    return response.data;
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
