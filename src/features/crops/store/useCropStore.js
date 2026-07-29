import { create } from 'zustand';
import { getCrops } from '../api/crops.api';

export const useCropStore = create((set) => ({
  crops: [],
  isLoading: false,
  error: null,

  fetchCrops: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getCrops();
      // Assuming response contains { data: [...] } or just [...]
      set({ crops: response.data || response, isLoading: false });
    } catch (error) {
      set({ error: error.message || 'Error al obtener cultivos', isLoading: false });
    }
  },
}));
