import { create } from "zustand";
import { getUsuarios, saveUsuario, updateUsuario, deactivateUsuario } from "../../../shared/api/api.js";

export const useUsuariosStore = create((set, get) => ({
    usuarios: [],
    loading: false,
    error: null,

    getUsuarios: async () => {
        try {
            set({ loading: true, error: null });
            const data = await getUsuarios();
            set({ usuarios: data.usuarios, loading: false });
        } catch (err) {
            set({ loading: false, error: err.message || "Error al obtener usuarios" });
        }
    },

    saveUsuario: async (data) => {
        try {
            set({ loading: true });
            const res = await saveUsuario(data);
            set((state) => ({
                usuarios: [res.usuario, ...state.usuarios],
                loading: false
            }));
            return res;
        } catch (err) {
            set({ loading: false, error: err.message });
            throw err;
        }
    },

    updateUsuario: async (id, data) => {
        try {
            set({ loading: true });
            const res = await updateUsuario(id, data);
            set((state) => ({
                usuarios: state.usuarios.map((u) => u._id === id ? res.user : u),
                loading: false
            }));
            return res;
        } catch (err) {
            set({ loading: false, error: err.message });
            throw err;
        }
    },

    deactivateUsuario: async (id) => {
        try {
            set({ loading: true });
            await deactivateUsuario(id);
            set((state) => ({
                usuarios: state.usuarios.map((u) => u._id === id ? { ...u, isActive: false } : u),
                loading: false
            }));
        } catch (err) {
            set({ loading: false, error: err.message });
        }
    }
}));