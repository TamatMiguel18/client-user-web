import { useState } from "react";

export const UsuariosFilter = ({ data, onFilter }) => {
    const [search, setSearch] = useState("");

    const handleSearch = (value) => {
        setSearch(value);
        const filtered = data.filter((u) => 
            u.name.toLowerCase().includes(value.toLowerCase()) || 
            u.surname.toLowerCase().includes(value.toLowerCase()) ||
            u.email.toLowerCase().includes(value.toLowerCase())
        );
        onFilter(filtered);
    };

    return (
        <div className="mb-8">
            <input
                type="text"
                placeholder="Buscar por ID o Nombre..."
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full p-4 bg-[#1E293B] border border-gray-700 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none text-white placeholder-gray-500"
            />
        </div>
    );
};