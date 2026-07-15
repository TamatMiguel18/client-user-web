import React from 'react';
import { Card } from '../../../shared/components/ui/Card';
import { AlertTriangle, MapPin, Thermometer, Droplets } from 'lucide-react';

export const AlertCard = ({ alert, onSelect }) => {
  const isBad = alert.alertType === 'bad';

  return (
    <Card hover className="flex flex-col h-full border-t-4 rounded-2xl border-slate-200 dark:border-slate-800 hover:border-red-500/30 dark:hover:border-red-500/30 transition-all shadow-md dark:shadow-lg bg-white dark:bg-slate-900">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${isBad ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
          <AlertTriangle size={24} />
        </div>
        {isBad && (
          <span className="text-[10px] font-bold uppercase bg-red-600 px-2 py-1 rounded-full text-white">
            Crítico
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold mb-1 text-slate-800 dark:text-slate-200">
        {alert.deviceId?.deviceId || alert.deviceId?.name || 'Hardware desconocido'}
      </h3>
      <div className="flex flex-col gap-2 mb-4 text-sm text-slate-600 dark:text-slate-400">
        <p className="flex items-center gap-1">
          <MapPin size={14} /> {alert.fieldId?.name || 'Campo desconocido'}
        </p>
        {alert.createdAt && (
          <p className="flex items-center gap-1 text-slate-500 dark:text-slate-500">
            {new Date(alert.createdAt).toLocaleString('es-ES', {
              dateStyle: 'short',
              timeStyle: 'short',
            })}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-slate-50 dark:bg-black/30 p-2 rounded flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Thermometer size={14} className="text-orange-500 dark:text-orange-400" /> {alert.temperature ?? '--'}°C
        </div>
        <div className="bg-slate-50 dark:bg-black/30 p-2 rounded flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Droplets size={14} className="text-blue-500 dark:text-blue-400" /> {alert.humidity ?? '--'}%
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSelect(alert)}
        className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm font-semibold transition-all text-slate-800 dark:text-white"
      >
        Ver Detalle
      </button>
    </Card>
  );
};
