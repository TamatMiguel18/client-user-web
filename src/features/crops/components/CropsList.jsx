/**
 * @module CropsList
 * @description Rediseño de la vista del catálogo de cultivos con estilo de "Base de Datos Botánica",
 * implementando inputs de búsqueda cristalizados y orbes lumínicos decorativos de fondo.
 */
import React, { useEffect, useState } from 'react';
import { useCropStore } from '../store/useCropStore';
import { CropCard } from './CropCard';
import { Loader } from '../../../shared/components/ui/Loader';
import { Search, Leaf, Sprout } from 'lucide-react';
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
      <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-3xl text-center max-w-lg mx-auto mt-20 backdrop-blur-xl">
        <p className="font-bold">{error}</p>
        <button 
          onClick={fetchCrops}
          className="mt-4 bg-rose-500/20 px-6 py-2 rounded-full font-bold hover:bg-rose-500/30 transition-colors"
        >
          Reintentar Conexión
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070A11] text-slate-900 dark:text-white p-4 sm:p-8 rounded-[3rem] relative overflow-hidden font-sans border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-2xl animate-fadeIn">
      {/* Sci-Fi Global Backgrounds */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-emerald-900/10 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] mx-auto space-y-10">
        
        {/* Header Ultra-Moderno */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-white/5 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-5">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-emerald-400 to-green-500 p-[2px]">
              <div className="w-full h-full bg-[#090D17] rounded-[1.4rem] flex items-center justify-center">
                <Sprout className="text-emerald-400" size={28} />
              </div>
              <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-30 rounded-full" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 tracking-tight">
                Base de Datos Botánica
              </h2>
              <p className="text-[11px] text-emerald-400/80 font-bold tracking-widest uppercase mt-1">
                Catálogo Genético de Cultivos
              </p>
            </div>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-white dark:bg-[#090D17]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-full overflow-hidden focus-within:border-emerald-500/50 transition-colors shadow-sm">
              <div className="pl-5">
                <Search size={18} className="text-emerald-500" />
              </div>
              <Input 
                type="text"
                placeholder="Escanear base de datos..."
                className="w-full bg-transparent border-0 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 py-4 pl-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filteredCrops.length === 0 ? (
          <div className="text-center py-32 relative bg-white/50 dark:bg-[#121827]/40 backdrop-blur-md rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] dark:opacity-5 pointer-events-none rounded-[3rem]" />
            <div className="relative z-10">
              <Leaf size={64} className="mx-auto text-slate-400 dark:text-slate-700 mb-6" />
              <h3 className="text-3xl font-black text-slate-800 dark:text-slate-200 mb-2">No se encontraron genotipos</h3>
              {searchTerm && <p className="text-slate-500 dark:text-slate-400 font-medium">No hay coincidencias para "{searchTerm}" en la base de datos central.</p>}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCrops.map((crop) => (
              <CropCard key={crop.id || crop._id || crop.nombre} crop={crop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
