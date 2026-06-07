import { create } from "zustand";
import { getUserById, saveUsuario, updateUsuario, deactivateUsuario } from "../../../shared/api/api.js"; 

export const useUsuariosStore = create((set) => ({
    usuario: null,
   getUsuarioById: async (id) => {
    try {
        const response = await getUserById(id);
        // Si response.usuario tiene el objeto, asegúrate de setearlo completo
        set({ usuario: response.usuario }); 
    } catch (error) {
        console.error("Error:", error);
    }
},
    saveUsuario: async (data) => {
        return await saveUsuario(data);
    },
    updateUsuario: async (id, data) => {
        return await updateUsuario(id, data);
    },
    deactivateUsuario: async (id) => {
    const res = await fetch(`http://localhost:3002/smartgrowgt/v1/usuarios/deactivate/${id}`, { 
        method: 'PUT' 
    });
    return await res.json();
},
    activateUsuario: async (id) => {
    const res = await fetch(`http://localhost:3002/smartgrowgt/v1/usuarios/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: true })
    });
    
    if (!res.ok) throw new Error("Error en el servidor"); 
    return await res.json();
}
}));