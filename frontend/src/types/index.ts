export type Role = 'STUDENT' | 'TEACHING_ASSISTANT' | 'PROFESSOR' | 'ADMIN';

export interface User {
  id: string;
  googleId: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
