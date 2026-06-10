import { create } from 'zustand';
import { getAlertsByUser } from '../api/alerts.api';

const normalizeAlert = (alert) => ({
  ...alert,
  alertType: alert.alertType === 'bad' || alert.alertType === 'mal' ? 'bad' : 'good',
  source: alert.source || 'alert',
});

const sortByDateDesc = (items = []) =>
  items.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

export const useAlertStore = create((set) => ({
  alerts: [],
  isLoading: false,
  error: null,

  fetchAlerts: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      if (!userId) throw new Error('Usuario no identificado');
      const alertsResponse = await getAlertsByUser(userId);
      const alertsData = alertsResponse.data || alertsResponse || [];
      const normalizedAlerts = (alertsData || []).map(normalizeAlert);
      set({ alerts: sortByDateDesc(normalizedAlerts), isLoading: false });
    } catch (error) {
      set({ error: error.message || 'Error al obtener alertas', isLoading: false });
    }
  },
}));
