import React from 'react';
import { Card } from '../../../shared/components/ui/Card';
import { Droplet, ThermometerSun, Leaf } from 'lucide-react';

export const CropCard = ({ crop }) => {
  return (
    <Card hover className="flex flex-col h-full border-t-4 border-t-emerald-500">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-slate-200 capitalize">{crop.name}</h3>
        <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          Sol: {crop.sunlightRequirement || 'Medio'}
        </span>
      </div>
      
      <p className="text-slate-400 text-sm mb-4 flex-grow line-clamp-3">
        {crop.description || 'Sin descripción disponible.'}
      </p>

      <div className="grid grid-cols-2 gap-2 text-sm text-slate-300 bg-slate-950/50 rounded-lg p-3 border border-white/5">
        <div className="flex items-center gap-1.5">
          <ThermometerSun size={16} className="text-rose-400" />
          <span className="truncate">
            {crop.minimumTemperature} - {crop.maximiumTemperature}°C
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Leaf size={16} className="text-emerald-400" />
          <span className="truncate">
            pH: {crop.idealPH?.min || 6} - {crop.idealPH?.max || 7}
          </span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2 mt-1">
          <Droplet size={16} className="text-blue-500" />
          <span className="truncate text-xs">Riego: cada {crop.irrigationPeriod} días | Crecimiento: {crop.growthDays} días</span>
        </div>
      </div>
    </Card>
  );
};
