import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUsuariosStore } from "../store/usersStore.js";
import { useSaveUsuario } from "../hook/useSaveUsuarios.js";

export const UsuariosModal = ({ isOpen, onClose, usuario }) => {
    const isEdit = !!usuario;
    const { saveUsuario } = useSaveUsuario();
    const { getUsuarios } = useUsuariosStore();
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => { 
        if (isOpen) reset(usuario || {}); 
    }, [isOpen, usuario, reset]);

    const onSubmit = async (data) => {
        await saveUsuario(data, usuario?._id);
        await getUsuarios();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-[#1E293B] p-8 rounded-2xl border border-gray-700 w-full max-w-lg space-y-4">
                <h3 className="font-bold text-xl text-white">{isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>

                <div className="grid grid-cols-2 gap-4">
                    {/* Aplica la misma clase de estilo a todos los inputs */}
                    <input {...register("name")} placeholder="Nombre" className="p-3 bg-[#0B1120] border border-gray-600 rounded-lg text-white" />
                    <input {...register("surname")} placeholder="Apellido" className="p-3 bg-[#0B1120] border border-gray-600 rounded-lg text-white" />
                    {/* ... resto de inputs igual ... */}
                </div>

                <div className="flex gap-3 mt-6">
                    <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-700 text-white rounded-lg font-bold">Cancelar</button>
                    <button type="submit" className="flex-1 py-3 bg-[#10B981] text-white rounded-lg font-bold">Guardar</button>
                </div>
            </form>
        </div>
    );
};