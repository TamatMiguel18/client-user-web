import { create } from 'zustand';
import { getFieldsByUser, createField, updateField, deactivateField } from '../api/fields.api';

// For demonstration, we'll use a valid MongoDB ObjectId hex string until auth is implemented.
const MOCK_USER_ID = "64c123456789012345678901";

export const useFieldStore = create((set, get) => ({
  fields: [],
  isLoading: false,
  error: null,

  fetchFields: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getFieldsByUser(MOCK_USER_ID);
      set({ fields: response.data || response, isLoading: false });
    } catch (error) {
      set({ error: error.message || 'Error al obtener parcelas', isLoading: false });
    }
  },

  addField: async (data) => {
    try {
      const response = await createField({ ...data, usuario: MOCK_USER_ID });
      const newField = response.data || response;
      set((state) => ({ fields: [...state.fields, newField] }));
      return newField;
    } catch (error) {
      throw new Error(error.message || 'Error al crear parcela');
    }
  },

  editField: async (id, data) => {
    try {
      const response = await updateField(id, data);
      const updatedField = response.data || response;
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
        fields: state.fields.map(f => f.id === id || f._id === id ? { ...f, estado: false } : f)
      }));
    } catch (error) {
      throw new Error(error.message || 'Error al desactivar parcela');
    }
  }
}));
