import { useUsuariosStore } from "../store/usersStore";

export const useSaveUsuario = () => {
    const createUsuario = useUsuariosStore((state) => state.saveUsuario);
    const updateUsuario = useUsuariosStore((state) => state.updateUsuario);

    const saveUsuario = async (data, usuarioId = null) => {
        try {
            if (usuarioId) {
                return await updateUsuario(usuarioId, data);
            } else {
                return await createUsuario(data);
            }
        } catch (error) {
            console.error("Error al procesar el usuario:", error);
            throw error;
        }
    };

    return { saveUsuario };
};