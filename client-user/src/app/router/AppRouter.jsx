import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserLayout } from '../layout/UserLayout';
import { Dashboard } from '../../features/dashboard/components/Dashboard';
import { AuthPage } from '../../features/auth/pages/AuthPage';
import { useAuthStore } from '../../features/auth/store/authStore';

export const AppRouter = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />
      } />
      <Route path="/reset-password" element={<AuthPage />} />

      {/* DASHBOARD (PROTECTED) */}
      <Route path="/dashboard" element={
          isAuthenticated ? <UserLayout /> : <Navigate to="/" replace />
      }>
        <Route index element={<Dashboard />} />
      </Route>
      
      {/* CATCH ALL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
