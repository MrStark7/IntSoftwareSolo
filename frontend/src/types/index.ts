export type Role = 'STUDENT' | 'TEACHING_ASSISTANT' | 'PROFESSOR' | 'ADMIN';

// Public user shape returned by /auth/profile and /users/me.
// googleId is intentionally excluded — it never leaves the backend.
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
