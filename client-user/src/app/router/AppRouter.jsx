import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserLayout } from '../layout/UserLayout';
import { Dashboard } from '../../features/dashboard/components/Dashboard';
import { Usuarios } from '../../features/users/components/Usuarios';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="/usuarios" element={<Usuarios />} />
      </Route>
    </Routes>
  );
};
