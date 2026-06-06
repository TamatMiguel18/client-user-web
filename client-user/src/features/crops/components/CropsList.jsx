import React, { useEffect, useState } from 'react';
import { useCropStore } from '../store/useCropStore';
import { CropCard } from './CropCard';
import { Loader } from '../../../shared/components/ui/Loader';
import { Search, Leaf } from 'lucide-react';
import { Input } from '../../../shared/components/ui/Input';

export const CropsList = () => {
  const { crops, isLoading, error, fetchCrops } = useCropStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  const filteredCrops = crops?.filter(crop => 
    crop.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) return <Loader />;
  
  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
        <p>{error}</p>
        <button 
          onClick={fetchCrops}
          className="mt-2 text-sm underline hover:text-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-200">Catálogo de Cultivos</h2>
          <p className="text-slate-400 mt-1">Explora información detallada sobre diversos cultivos.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input 
            type="text"
            placeholder="Buscar cultivo..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredCrops.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/20 rounded-xl border border-dashed border-slate-700">
          <Leaf size={48} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400 font-medium">No se encontraron cultivos.</p>
          {searchTerm && <p className="text-sm text-slate-500 mt-1">Intenta con otro término de búsqueda.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCrops.map((crop) => (
            <CropCard key={crop.id || crop._id || crop.nombre} crop={crop} />
          ))}
        </div>
      )}
    </div>
  );
};
