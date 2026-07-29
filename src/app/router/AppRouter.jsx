import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserLayout } from '../layout/UserLayout';
import { CropsList } from '../../features/crops/components/CropsList';
import { FertilizersList } from '../../features/fertilizers/components/FertilizersList';
import { FieldsManager } from '../../features/fields/components/FieldsManager';
import { FertilityForm } from '../../features/fertility/components/FertilityForm';
import { ProductsList } from '../../features/products/components/ProductsList';
import { VerifyEmail } from '../../features/auth/pages/VerifyEmail';
import { AuthPage } from '../../features/auth/pages/AuthPage';
import { ReportsList } from '../../features/reports/components/Reports';
import { AlertsList } from '../../features/alerts/components/AlertsList';
import { FarmerProfile } from '../../features/profile/components/FarmerProfile';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route path="/" element={<UserLayout />}>
        {/* Default route redirects to crops */}
        <Route index element={<Navigate to="/fields" replace />} />

        <Route path="fields" element={<FieldsManager />} />
        <Route index element={<Navigate to="/crops" replace />} />

        <Route path="crops" element={<CropsList />} />
        <Route path="fertilizers" element={<FertilizersList />} />
        <Route path="recommendations" element={<FertilityForm />} />
        <Route path="products" element={<ProductsList />} />

        <Route path="reports" element={<ReportsList />} />
        <Route path="alerts" element={<AlertsList />} />
        <Route path="profile" element={<FarmerProfile />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/fields" replace />} />
      </Route>
    </Routes>
  );
};
