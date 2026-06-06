import { useEffect, useState } from "react";
import { useUsuariosStore } from "../store/usersStore.js";
import { UsuariosModal } from "./UsuariosModal.jsx";
import { UsuariosFilter } from "./UsuariosFilter.jsx"; // Importamos el filtro

export const Usuarios = () => {
    const { usuarios, getUsuarios, deactivateUsuario } = useUsuariosStore();
    const [filtered, setFiltered] = useState([]); // Nuevo estado para los resultados filtrados
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    useEffect(() => { 
        getUsuarios().then(data => setFiltered(usuarios)); // Inicializamos el filtro
    }, [usuarios]); // Escuchamos cambios en usuarios para refrescar el filtro

return (
        <div className="p-8 bg-[#0B1120] min-h-screen text-white">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold">Gestión de Usuarios</h2>
                    <p className="text-gray-400 text-sm">Monitoreo de usuarios registrados</p>
                </div>
                <button 
                    onClick={() => { setSelected(null); setIsOpen(true); }}
                    className="px-6 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-bold transition shadow-lg"
                >+ Nuevo Usuario</button>
            </div>

            <UsuariosFilter data={usuarios} onFilter={setFiltered} />

            {/* Grid con tarjetas estilo Admin */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(u => (
                    <div key={u._id} className="bg-[#1E293B] p-5 rounded-2xl border border-gray-700 hover:border-[#10B981] transition-all">
                        <h3 className="font-bold text-lg">{u.name} {u.surname}</h3>
                        <p className="text-sm text-gray-400 mb-4">{u.email}</p>
                        <div className="flex gap-2">
                            <button onClick={() => { setSelected(u); setIsOpen(true); }} className="flex-1 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-bold">Editar</button>
                            <button onClick={() => deactivateUsuario(u._id)} className="flex-1 py-1.5 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-lg text-xs font-bold">Desactivar</button>
                        </div>
                    </div>
                ))}
            </div>
            <UsuariosModal isOpen={isOpen} onClose={() => setIsOpen(false)} usuario={selected} />
        </div>
    );
};