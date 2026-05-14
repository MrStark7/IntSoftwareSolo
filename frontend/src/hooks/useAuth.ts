import { useAuthStore } from '../store/auth.store';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, logout, fetchUser } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    logout,
    fetchUser,
  };
};
