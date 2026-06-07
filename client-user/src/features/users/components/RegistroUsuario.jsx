import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUsuario } from '../../../shared/api/api.js';

export const RegistroUsuario = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', surname: '', email: '', password: '', 
        phone: '', address: '', department: '', municipality: '', 
        farmerType: 'Pequeño productor', mainCrop: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Enviamos los datos al backend
            const response = await saveUsuario(formData);
            
            // Si el backend responde con el objeto usuario y su _id
            const newUserId = response.usuario._id;
            
            // Guardamos el ID para simular la sesión
            localStorage.setItem("userId", newUserId);
            
            alert("Usuario registrado correctamente");
            navigate("/perfil"); // Redirige al perfil para ver los datos
        } catch (err) {
            console.error("Error al registrar:", err);
            alert("Error al crear la cuenta. Verifica los campos.");
        }
    };

    return (
        <div className="p-8 bg-[#0B1120] text-white">
            <h2 className="text-2xl font-bold mb-6">Crear Cuenta</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Nombre" className="w-full p-2 bg-[#1E293B] rounded" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <input type="text" placeholder="Apellido" className="w-full p-2 bg-[#1E293B] rounded" onChange={(e) => setFormData({...formData, surname: e.target.value})} />
                <input type="email" placeholder="Email" className="w-full p-2 bg-[#1E293B] rounded" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <input type="password" placeholder="Contraseña" className="w-full p-2 bg-[#1E293B] rounded" onChange={(e) => setFormData({...formData, password: e.target.value})} />
                <input type="text" placeholder="Teléfono" className="w-full p-2 bg-[#1E293B] rounded" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                <input type="text" placeholder="Dirección" className="w-full p-2 bg-[#1E293B] rounded" onChange={(e) => setFormData({...formData, address: e.target.value})} />
                <button type="submit" className="w-full bg-green-600 p-2 rounded mt-4">Registrarse</button>
            </form>
        </div>
    );
};