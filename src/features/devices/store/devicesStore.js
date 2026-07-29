import { create } from 'zustand';
import { getDevicesByUser, registerDevice } from '../../../shared/api';

export const useDevicesStore = create((set, get) => ({
  devices: [],
  loading: false,
  hasFetched: false,
  error: null,

  fetchUserDevices: async (userId) => {
    if (!userId) return;
    set({ loading: true, error: null });
    try {
      const response = await getDevicesByUser(userId);
      if (response && response.success) {
        set({ devices: response.devices || [], hasFetched: true, loading: false });
      } else {
        set({ error: "Error al obtener dispositivos", loading: false });
      }
    } catch (error) {
      set({ error: error.message || "Error al obtener dispositivos", loading: false });
    }
  },

  registerNewDevice: async (deviceData) => {
    set({ loading: true, error: null });
    try {
      const response = await registerDevice(deviceData);
      if (response && response.success) {
        // Refetch devices after successful registration to keep state updated
        await get().fetchUserDevices(deviceData.userId);
        return { success: true, message: response.message };
      } else {
        const errorMsg = response.message || "Error al registrar dispositivo";
        set({ error: errorMsg, loading: false });
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Error al registrar dispositivo";
      set({ error: errorMsg, loading: false });
      return { success: false, message: errorMsg };
    }
  },

  resetStore: () => {
    set({ devices: [], loading: false, hasFetched: false, error: null });
  }
}));
