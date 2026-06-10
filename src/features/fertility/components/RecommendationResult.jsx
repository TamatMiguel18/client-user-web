import React from 'react';
import { Card } from '../../../shared/components/ui/Card';
import { Leaf, Droplet, Sprout, AlertTriangle, ListOrdered, Scale } from 'lucide-react';

export const RecommendationResult = ({ recommendation }) => {
  // Manejar el caso donde los datos vienen anidados en .data
  const data = recommendation.data ? recommendation.data : recommendation;
  
  if (!data || !data.recommendations) return null;

  return (
    <Card className="border-t-4 border-t-emerald-500 bg-slate-900/40 relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
      
      <div className="flex flex-col h-full relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <Sprout className="text-emerald-500" size={24} />
          <h3 className="text-xl font-bold text-slate-200">Resultado de la Recomendación</h3>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          
          {data.warnings && data.warnings.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl mb-4">
              <h4 className="font-semibold text-amber-400 flex items-center gap-2 mb-2">
                <AlertTriangle size={18} /> Advertencias
              </h4>
              <ul className="text-sm text-slate-300 space-y-1">
                {data.warnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}

          {data.recommendations.map((rec, idx) => (
            <div key={idx} className="bg-slate-950/50 p-5 rounded-2xl shadow-sm border border-white/5 mb-4">
              <h4 className="font-semibold text-slate-400 flex items-center gap-2 mb-2">
                <Leaf size={18} className="text-emerald-500" />
                Fertilizante Recomendado
              </h4>
              <p className="text-xl font-bold text-emerald-400">{rec.fertilizer.name}</p>
              <p className="text-sm text-slate-400 mb-3">{rec.fertilizer.brand}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
                  <p className="text-xs text-slate-500 mb-1">Total a Aplicar</p>
                  <p className="text-lg font-bold text-blue-400">{rec.totalKg} kg</p>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
                  <p className="text-xs text-slate-500 mb-1">Sacos Necesarios</p>
                  <p className="text-lg font-bold text-slate-300">
                    {rec.bagsNeeded} <span className="text-xs font-normal">({rec.bagWeight}kg c/u)</span>
                  </p>
                </div>
              </div>
            </div>
          ))}

          {data.applicationOrder && data.applicationOrder.length > 0 && (
            <div className="bg-slate-950/50 p-5 rounded-2xl shadow-sm border border-white/5">
              <h4 className="font-semibold text-slate-400 flex items-center gap-2 mb-3">
                <ListOrdered size={18} className="text-blue-400" /> 
                Orden de Aplicación
              </h4>
              <ol className="space-y-2">
                {data.applicationOrder.map((order, i) => (
                  <li key={i} className="flex justify-between items-center bg-slate-900/50 p-2 px-3 rounded-lg border border-white/5">
                    <span className="text-slate-300 font-medium">{i + 1}. {order.nutrient}</span>
                    <span className="text-xs text-rose-400 font-bold bg-rose-400/10 px-2 py-1 rounded">Déficit: {order.deficit} kg/ha</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="bg-slate-950/50 p-5 rounded-2xl shadow-sm border border-white/5">
            <h4 className="font-semibold text-slate-400 flex items-center gap-2 mb-3">
              <Scale size={18} className="text-purple-400" /> 
              Resumen de Área
            </h4>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Terreno ingresado:</span>
              <span className="text-slate-200 font-bold">{data.terrain.area} {data.terrain.unit}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-slate-400 text-sm">Área en hectáreas:</span>
              <span className="text-slate-200 font-bold">{Number(data.terrain.areaHa).toFixed(2)} Ha</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
