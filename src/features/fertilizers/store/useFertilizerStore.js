import { create } from 'zustand';
import { getFertilizers } from '../api/fertilizers.api';

export const useFertilizerStore = create((set) => ({
  fertilizers: [],
  isLoading: false,
  error: null,

  fetchFertilizers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getFertilizers();
      set({ fertilizers: response.data || response, isLoading: false });
    } catch (error) {
      set({ error: error.message || 'Error al obtener fertilizantes', isLoading: false });
    }
  },
}));
