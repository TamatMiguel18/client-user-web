/**
 * @module CropCard
 * @description Rediseño de la tarjeta con formas orgánicas asimétricas, grid interno de métricas en cápsulas
 * de alto contraste y logs tipo consola para la descripción.
 */
import React from 'react';
import { Droplet, ThermometerSun, Leaf, Activity, Sun, TestTube2, AlignLeft } from 'lucide-react';

export const CropCard = ({ crop }) => {
  return (
    <div className={`group relative bg-[#121827]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl flex flex-col h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.2)]`}>
      
      {/* Decoraciones de la tarjeta */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity rounded-t-[2rem]" />
      <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />

      {/* Header Card */}
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-100 mb-2 tracking-tight group-hover:text-emerald-400 transition-colors capitalize line-clamp-1">{crop.name}</h3>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            Genoma Aprobado
          </span>
        </div>
      </div>

      {/* Contenido de la Tarjeta (Grid de datos) */}
      <div className="relative z-10 grid grid-cols-2 gap-3 mb-6 flex-grow">
        
        {/* Temperatura Ideal */}
        <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-1.5">
            <ThermometerSun size={14} className="text-amber-500" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Temperatura</span>
          </div>
          <span className="text-sm font-bold text-slate-200 truncate">
            {crop.minimumTemperature}°C a {crop.maximiumTemperature}°C
          </span>
        </div>

        {/* Nivel de pH */}
        <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-1.5">
            <TestTube2 size={14} className="text-purple-400" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Nivel pH</span>
          </div>
          <span className="text-sm font-bold text-slate-200">
            {crop.idealPH?.min || 6} - {crop.idealPH?.max || 7}
          </span>
        </div>

        {/* Requisito de Sol (Ancho Completo) */}
        <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5 flex flex-col justify-center col-span-2">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sun size={14} className="text-yellow-400" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Exposición Solar</span>
          </div>
          <span className="text-sm font-medium text-slate-300 truncate">
            {crop.sunlightRequirement || 'Exposición Media Requerida'}
          </span>
        </div>

        {/* Ciclos (Ancho Completo) */}
        <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5 flex items-center justify-between col-span-2">
          <div className="flex flex-col gap-1 w-1/2 border-r border-white/5">
            <div className="flex items-center gap-2">
              <Droplet size={14} className="text-blue-400" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Riego</span>
            </div>
            <span className="text-sm font-bold text-slate-200">Cada {crop.irrigationPeriod} d.</span>
          </div>
          <div className="flex flex-col gap-1 w-1/2 pl-3">
            <div className="flex items-center gap-2">
              <Leaf size={14} className="text-emerald-500" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Cosecha</span>
            </div>
            <span className="text-sm font-bold text-slate-200">{crop.growthDays} d.</span>
          </div>
        </div>
      </div>

      {/* Descripción inferior tipo consola */}
      <div className="relative z-10 pt-4 border-t border-white/5 mt-auto">
        <div className="flex gap-2 items-start bg-slate-950/50 p-3 rounded-xl border border-white/5">
          <AlignLeft size={16} className="text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 font-mono">
            {crop.description || 'Sin datos botánicos adicionales.'}
          </p>
        </div>
      </div>
    </div>
  );
};
