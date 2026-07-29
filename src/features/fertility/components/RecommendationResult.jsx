import React from 'react';
import { Card } from '../../../shared/components/ui/Card';
import { Leaf, Droplet, Sprout } from 'lucide-react';

export const RecommendationResult = ({ recommendation }) => {
  if (!recommendation) return null;

  return (
    <Card className="border-t-4 border-t-emerald-500 bg-slate-900/40 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
      
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <Sprout className="text-emerald-500" size={24} />
        <h3 className="text-xl font-bold text-slate-200">Resultado de la Recomendación</h3>
      </div>
      
      <div className="space-y-4 relative z-10">
        <div className="bg-slate-950/50 p-5 rounded-2xl shadow-sm border border-white/5">
          <h4 className="font-semibold text-slate-400 flex items-center gap-2 mb-2">
            <Leaf size={18} className="text-emerald-500" />
            Fertilizante Recomendado
          </h4>
          <p className="text-xl font-bold text-emerald-400">{recommendation.fertilizante || 'No determinado'}</p>
          <p className="text-sm text-slate-500 mt-2">{recommendation.justificacion || 'Basado en los datos de tu parcela.'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950/50 p-5 rounded-2xl shadow-sm border border-white/5">
            <h4 className="font-semibold text-slate-400 mb-2">Dosis Recomendada</h4>
            <p className="text-xl font-bold text-blue-400">{recommendation.dosis || 'N/A'}</p>
          </div>
          <div className="bg-slate-950/50 p-5 rounded-2xl shadow-sm border border-white/5">
            <h4 className="font-semibold text-slate-400 mb-2 flex items-center gap-2">
              <Droplet size={18} className="text-blue-400" /> Frecuencia
            </h4>
            <p className="text-lg font-bold text-slate-300">{recommendation.frecuencia || 'N/A'}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
