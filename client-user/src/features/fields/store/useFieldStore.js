import { create } from 'zustand';
import { getFieldsByUser, createField, updateField, deactivateField } from '../api/fields.api';
import { useAuthStore } from '../../auth/store/authStore';

export const useFieldStore = create((set, get) => ({
  fields: [],
  isLoading: false,
  error: null,

  fetchFields: async () => {
    set({ isLoading: true, error: null, fields: [] });
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) throw new Error("Usuario no autenticado");

      const response = await getFieldsByUser(userId);
      let fieldsArray = [];
      if (Array.isArray(response)) {
        fieldsArray = response;
      } else if (response && Array.isArray(response.data)) {
        fieldsArray = response.data;
      } else if (response && response.fields && Array.isArray(response.fields)) {
        fieldsArray = response.fields;
      }

      set({ fields: fieldsArray, isLoading: false });
    } catch (error) {
      set({ error: error.message || 'Error al obtener parcelas', isLoading: false });
    }
  },

  addField: async (data) => {
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) throw new Error("Usuario no autenticado");

      const response = await createField({ ...data, user: userId });
      const newField = response.data?.field || response.data || response;
      set((state) => ({ fields: [...state.fields, newField] }));
      return newField;
    } catch (error) {
      throw new Error(error.message || 'Error al crear parcela');
    }
  },

  editField: async (id, data) => {
    try {
      const response = await updateField(id, data);
      const updatedField = response.data?.updatedField || response.data || response;
      set((state) => ({
        fields: state.fields.map(f => f.id === id || f._id === id ? updatedField : f)
      }));
      return updatedField;
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar parcela');
    }
  },

  removeField: async (id) => {
    try {
      await deactivateField(id);
      set((state) => ({
        fields: state.fields.map(f => f.id === id || f._id === id ? { ...f, estado: false, isActive: false } : f)
      }));
    } catch (error) {
      throw new Error(error.message || 'Error al desactivar parcela');
    }
  },

  activateField: async (id) => {
    try {
      const { activateField: activateApi } = await import('../api/fields.api');
      await activateApi(id);
      set((state) => ({
        fields: state.fields.map(f => f.id === id || f._id === id ? { ...f, estado: true, isActive: true } : f)
      }));
    } catch (error) {
      throw new Error(error.message || 'Error al activar parcela');
    }
  }
}));
