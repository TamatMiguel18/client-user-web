import { useState, useEffect } from "react";
import { useUsuariosStore } from "../store/usersStore.js";
import { UsuariosModal } from "./UsuariosModal.jsx";
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export const PerfilUsuario = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Importamos todo lo necesario AQUÍ, dentro del componente
    const { usuario, getUsuarioById, deactivateUsuario, activateUsuario } = useUsuariosStore();

    useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) {
        getUsuarioById(id).catch(() => {
            console.log("El usuario no pudo ser cargado, posiblemente esté desactivado.");
        });
    }
}, [getUsuarioById]);

    const handleToggleStatus = async () => {
        const isDeactivating = usuario.isActive;
        
        const result = await Swal.fire({
            title: `¿Estás seguro?`,
            text: isDeactivating ? "Tu perfil será desactivado." : "Tu perfil será reactivado.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: isDeactivating ? '#EF4444' : '#10B981',
            cancelButtonColor: '#4B5563',
            background: '#1E293B',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                if (isDeactivating) {
                    await deactivateUsuario(usuario._id);
                    toast.success("Cuenta desactivada");
                } else {
                    await activateUsuario(usuario._id);
                    toast.success("Cuenta reactivada");
                }
                // Vuelve a cargar el perfil actualizado del servidor
                await getUsuarioById(usuario._id);
            } catch (error) {
                // Si falla porque el usuario ya no es 'visible' en el GET, 
                // podrías simplemente recargar la página o redirigir
                window.location.reload();
            }
        }
    };

    return (
        <div className="p-8 text-white min-h-screen bg-[#0B1120]">
            <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>
            
            {/* Contenedor de botones */}
            <div className="flex gap-4 mb-6">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#10B981] hover:bg-[#059669] px-6 py-2 rounded-xl font-bold"
                >
                    Editar Perfil
                </button>

                {usuario && (
                    <button 
                        onClick={handleToggleStatus}
                        className={`${usuario.isActive ? 'bg-red-600' : 'bg-blue-600'} px-6 py-2 rounded-xl font-bold`}
                    >
                        {usuario.isActive ? "Desactivar Cuenta" : "Reactivar Cuenta"}
                    </button>
                )}
            </div>

            {/* AQUÍ ES DONDE FALTABA EL BLOQUE DE DATOS */}
            {usuario ? (
                <div className="bg-[#1E293B] border border-gray-700 p-8 rounded-3xl shadow-2xl max-w-2xl">
                    <div className="flex items-center gap-6 mb-8">
                        {/* Avatar */}
                        <div className="w-20 h-20 bg-[#10B981]/20 text-[#10B981] flex items-center justify-center rounded-full text-3xl font-bold border border-[#10B981]/30">
                            {usuario.name?.charAt(0)}{usuario.surname?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{usuario.name} {usuario.surname}</h2>
                            <p className="text-[#10B981] font-medium">{usuario.farmerType}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${usuario.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {usuario.isActive ? "Activo" : "Desactivado"}
                            </span>
                        </div>
                    </div>

                    {/* Grid de detalles */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-gray-400 text-sm">Email</p>
                            <p className="text-white font-medium">{usuario.email}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Teléfono</p>
                            <p className="text-white font-medium">{usuario.phone}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Dirección</p>
                            <p className="text-white font-medium">{usuario.address}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Municipio</p>
                            <p className="text-white font-medium">{usuario.municipality}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Departamento</p>
                            <p className="text-white font-medium">{usuario.department}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Cultivo Principal</p>
                            <p className="text-white font-medium">{usuario.mainCrop}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-gray-400">Cargando información...</p>
            )}

            {isModalOpen && (
                <UsuariosModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    usuario={usuario}
                />
            )}
        </div>
    );
};