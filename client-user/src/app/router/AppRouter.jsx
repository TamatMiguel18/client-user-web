import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserLayout } from '../layout/UserLayout';
import { CropsList } from '../../features/crops/components/CropsList';
import { FertilizersList } from '../../features/fertilizers/components/FertilizersList';
import { FieldsManager } from '../../features/fields/components/FieldsManager';
import { FertilityForm } from '../../features/fertility/components/FertilityForm';
import { AlertsList } from '../../features/alerts/components/AlertsList';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        {/* Default route redirects to crops */}
        <Route index element={<Navigate to="/crops" replace />} />
        
        <Route path="crops" element={<CropsList />} />
        <Route path="fertilizers" element={<FertilizersList />} />
        <Route path="fields" element={<FieldsManager />} />
        <Route path="recommendations" element={<FertilityForm />} />
        <Route path="alerts" element={<AlertsList />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/crops" replace />} />
      </Route>
    </Routes>
  );
};
