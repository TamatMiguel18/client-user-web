// import { useEffect, useState } from "react";
// import { useUsuariosStore } from "../store/usersStore.js";
// import { UsuariosModal } from "./UsuariosModal.jsx";
// import { UsuariosFilter } from "./UsuariosFilter.jsx"; // Importamos el filtro

// export const Usuarios = () => {
//     const { usuarios, getUsuarios, deactivateUsuario } = useUsuariosStore();
//     const [filtered, setFiltered] = useState([]); // Nuevo estado para los resultados filtrados
//     const [isOpen, setIsOpen] = useState(false);
//     const [selected, setSelected] = useState(null);

//     useEffect(() => { 
//         getUsuarios().then(data => setFiltered(usuarios)); // Inicializamos el filtro
//     }, [usuarios]); // Escuchamos cambios en usuarios para refrescar el filtro

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h2>
//                 <button 
//                     onClick={() => { setSelected(null); setIsOpen(true); }}
//                     className="px-5 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
//                 >+ Nuevo Usuario</button>
//             </div>

//             {/* Pasamos usuarios al filtro y el resultado al setFiltered */}
//             <UsuariosFilter data={usuarios} onFilter={setFiltered} />

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {filtered.map(u => (
//                     <div key={u._id} className="bg-white p-4 rounded-xl border-l-4 border-green-500 shadow-sm">
//                         {/* ... tu renderizado de cards igual que antes ... */}
//                         <h3 className="font-bold">{u.name} {u.surname}</h3>
//                         <p className="text-sm text-gray-500">{u.email}</p>
//                         <div className="flex gap-2 mt-3">
//                             <button onClick={() => { setSelected(u); setIsOpen(true); }} className="text-xs bg-gray-100 px-3 py-1 rounded">Editar</button>
//                             <button onClick={() => deactivateUsuario(u._id)} className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded">Desactivar</button>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             <UsuariosModal isOpen={isOpen} onClose={() => setIsOpen(false)} usuario={selected} />
//         </div>
//     );
// };