import React, { useEffect, useState } from 'react';
import { useFertilizerStore } from '../store/useFertilizerStore';
import { FertilizerCard } from './FertilizerCard';
import { Loader } from '../../../shared/components/ui/Loader';
import { Search, FlaskConical } from 'lucide-react';
import { Input } from '../../../shared/components/ui/Input';

export const FertilizersList = () => {
  const { fertilizers, isLoading, error, fetchFertilizers } = useFertilizerStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFertilizers();
  }, [fetchFertilizers]);

  const filteredFertilizers = fertilizers?.filter(f => 
    f.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) return <Loader />;
  
  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
        <p>{error}</p>
        <button onClick={fetchFertilizers} className="mt-2 text-sm underline hover:text-red-700">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-2">
            <FlaskConical className="text-emerald-500" />
            Fertilizantes Disponibles
          </h2>
          <p className="text-slate-400 mt-1">Encuentra el fertilizante adecuado para tus cultivos.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input 
            type="text"
            placeholder="Buscar fertilizante..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredFertilizers.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/20 rounded-xl border border-dashed border-slate-700">
          <FlaskConical size={48} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400 font-medium">No se encontraron fertilizantes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFertilizers.map((fertilizer) => (
            <FertilizerCard key={fertilizer.id || fertilizer._id || fertilizer.nombre} fertilizer={fertilizer} />
          ))}
        </div>
      )}
    </div>
  );
};
