import { create } from 'zustand';
import { getReportsByUser, getReportsBad, getReportsById, getReportsByField, getReportsByDevice } from '../api/reports.api';

export const useReportsStore = create((set) => ({
    reports: [],
    isLoading: false,
    error: null,

    // Obtener todos los reportes
    fetchReports: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            if (!userId) throw new Error('Usuario no identificado');
            const response = await getReportsByUser(userId);
            // Assuming response contains { data: [...] } or just [...]
            set({ reports: response.data || response, isLoading: false });
        } catch (error) {
            set({ error: error.message || 'Error al obtener reportes', isLoading: false });
        }
    },

    // Obtener reportes malos
    fetchReportsBad: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await getReportsBad();
            set({ reports: response.data || response, isLoading: false });
        } catch (error) {
            set({ error: error.message || 'Error al obtener reportes', isLoading: false });
        }
    },

    // Obtener reportes por ID
    fetchReportsById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await getReportsById(id);
            set({ reports: response.data || response, isLoading: false });
        } catch (error) {
            set({ error: error.message || 'Error al obtener reportes', isLoading: false });
        }
    },

    // Obtener reportes por campo
    fetchReportsByField: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await getReportsByField(id);
            set({ reports: response.data || response, isLoading: false });
        } catch (error) {
            set({ error: error.message || 'Error al obtener reportes', isLoading: false });
        }
    },

    // Obtener reportes por dispositivo
    fetchReportsByDevice: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await getReportsByDevice(id);
            set({ reports: response.data || response, isLoading: false });
        } catch (error) {
            set({ error: error.message || 'Error al obtener reportes', isLoading: false });
        }
    },
}));