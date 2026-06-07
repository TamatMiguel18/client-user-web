import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUsuariosStore } from "../store/usersStore.js";
import toast from 'react-hot-toast';

export const UsuariosModal = ({ isOpen, onClose, usuario }) => {
    const isEdit = !!usuario;
    const { saveUsuario, updateUsuario, getUsuarioById } = useUsuariosStore();
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => { 
        if (isOpen) reset(usuario || {}); 
    }, [isOpen, usuario, reset]);

    const onSubmit = async (data) => {
    try {
        // Asegúrate de usar usuario._id y no un valor nulo
        await updateUsuario(usuario._id, data); 
        toast.success("¡Datos guardados correctamente!");
        onClose();
        // Recargar datos para que se vea el cambio
        await getUsuarioById(usuario._id); 
    } catch (error) {
        console.error(error);
        toast.error("Error al guardar los cambios");
    }
}

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            {/* AQUÍ ESTABA EL ERROR: Necesitas el <form> y los botones */}
            <form onSubmit={handleSubmit(onSubmit)} className="bg-[#1E293B] p-8 rounded-2xl border border-gray-700 w-full max-w-lg space-y-4">
                <h3 className="font-bold text-xl text-white">{isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>

                <div className="grid grid-cols-2 gap-4">
                    <input {...register("name", { required: true })} placeholder="Nombre" className="p-3 bg-[#0B1120] border border-gray-600 rounded-lg text-white" />
                    <input {...register("surname", { required: true })} placeholder="Apellido" className="p-3 bg-[#0B1120] border border-gray-600 rounded-lg text-white" />
                    <input {...register("email", { required: true })} placeholder="Email" type="email" className="p-3 bg-[#0B1120] border border-gray-600 rounded-lg text-white" />
                    <input {...register("password", { required: true })} placeholder="Contraseña" type="password" className="p-3 bg-[#0B1120] border border-gray-600 rounded-lg text-white" />
                    <input {...register("phone", { required: true })} placeholder="Teléfono" className="p-3 bg-[#0B1120] border border-gray-600 rounded-lg text-white" />
                    <input {...register("address", { required: true })} placeholder="Dirección" className="p-3 bg-[#0B1120] border border-gray-600 rounded-lg text-white" />
                    <input {...register("department", { required: true })} placeholder="Departamento" className="p-3 bg-[#0B1120] border border-gray-600 rounded-lg text-white" />
                    <input {...register("municipality", { required: true })} placeholder="Municipio" className="p-3 bg-[#0B1120] border border-gray-600 rounded-lg text-white" />
                    <select {...register("farmerType", { required: true })} className="p-3 bg-[#0B1120] border border-gray-600 rounded-lg text-white">
                        <option value="Pequeño productor">Pequeño productor</option>
                        <option value="Mediano productor">Mediano productor</option>
                        <option value="Cooperativa">Cooperativa</option>
                        <option value="Empresa agrícola">Empresa agrícola</option>
                    </select>
                    <input {...register("mainCrop", { required: true })} placeholder="Cultivo Principal" className="p-3 bg-[#0B1120] border border-gray-600 rounded-lg text-white" />
                </div>

                <div className="flex gap-3 mt-6">
                    <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-700 text-white rounded-lg font-bold">Cancelar</button>
                    <button type="submit" className="flex-1 py-3 bg-[#10B981] text-white rounded-lg font-bold">Guardar</button>
                </div>
            </form>
        </div>
    );
};