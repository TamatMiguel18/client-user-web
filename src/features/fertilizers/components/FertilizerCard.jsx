import React from 'react';
import { Card } from '../../../shared/components/ui/Card';
import { FlaskConical, ShieldCheck, Image as ImageIcon } from 'lucide-react';

export const FertilizerCard = ({ fertilizer }) => {
  const hasImage = fertilizer.image && fertilizer.image !== '';

  return (
    <Card 
      hover 
      className="group relative flex flex-col h-full overflow-hidden border border-slate-800/50 bg-slate-900/40 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
    >
      {/* Image Section */}
      <div className="relative w-full h-48 sm:h-56 bg-slate-950 overflow-hidden">
        {hasImage ? (
          <img 
            src={fertilizer.image} 
            alt={fertilizer.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback Icon if no image or image fails to load */}
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-700 ${hasImage ? 'hidden' : 'flex'}`}
        >
          <ImageIcon size={48} className="mb-2 opacity-50" />
          <span className="text-sm font-medium opacity-50">Sin Imagen</span>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent pointer-events-none" />
        
        {/* Badges positioned over the image */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          <span className="bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-500/30 flex items-center gap-1.5 shadow-lg">
            <ShieldCheck size={14} /> {fertilizer.brand}
          </span>
          {fertilizer.grade && (
            <span className="bg-slate-900/60 backdrop-blur-md text-blue-300 text-xs font-bold px-2.5 py-1 rounded-md border border-blue-500/30 flex items-center gap-1.5 shadow-lg">
              <FlaskConical size={14} /> {fertilizer.grade}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-5">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors duration-300">
          {fertilizer.name}
        </h3>
        
        <p className="text-slate-400 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
          {fertilizer.description || 'Sin descripción detallada disponible para este producto.'}
        </p>

        {/* Technical Specs Footer */}
        <div className="mt-auto space-y-3 pt-4 border-t border-slate-800/60">
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-2 rounded-lg bg-slate-950/50 border border-slate-800/50 shadow-inner">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">N</span>
              <span className="text-emerald-400 font-mono font-bold">{fertilizer.nitrogenPercent || 0}%</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-slate-950/50 border border-slate-800/50 shadow-inner">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">P</span>
              <span className="text-blue-400 font-mono font-bold">{fertilizer.phosphorusPercent || 0}%</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-slate-950/50 border border-slate-800/50 shadow-inner">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">K</span>
              <span className="text-amber-400 font-mono font-bold">{fertilizer.potassiumPercent || 0}%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center bg-slate-950/30 p-2.5 rounded-lg border border-slate-800/40">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Presentación</span>
            <span className="text-sm font-bold text-slate-200">
              {fertilizer.presentationWeight ? `${fertilizer.presentationWeight} kg` : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
