import { useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import DashboardLayout from './layouts/DashboardLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import OffersPage from './pages/OffersPage';
import OfferDetailPage from './pages/OfferDetailPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ProfessorCoursesPage from './pages/ProfessorCoursesPage';
import ProfessorOffersPage from './pages/ProfessorOffersPage';
import ProfessorOfferDetailPage from './pages/ProfessorOfferDetailPage';
import CreateOfferPage from './pages/CreateOfferPage';
import StudentAssistantshipsPage from './pages/StudentAssistantshipsPage';
import NotificationsPage from './pages/NotificationsPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  const initialize = useAuthStore((s) => s.initialize);

  // Stable reference — only runs once on mount
  const stableInit = useCallback(() => {
    initialize();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    stableInit();
  }, [stableInit]);

  return (
    <Routes>
      {/* Public-only routes (redirect to /home if already authenticated) */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* OAuth callback — must be outside PublicRoute to avoid redirect loop */}
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* Protected routes wrapped in the sidebar layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Student routes */}
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/offers/:id" element={<OfferDetailPage />} />
          <Route path="/my-applications" element={<MyApplicationsPage />} />
          <Route path="/student/assistantships" element={<StudentAssistantshipsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* Professor routes */}
          <Route path="/professor/courses" element={<ProfessorCoursesPage />} />
          <Route path="/professor/offers" element={<ProfessorOffersPage />} />
          <Route path="/professor/offers/:id" element={<ProfessorOfferDetailPage />} />
          <Route path="/professor/create-offer" element={<CreateOfferPage />} />
        </Route>
      </Route>

      {/* Convenience redirects */}
      <Route path="/dashboard" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
