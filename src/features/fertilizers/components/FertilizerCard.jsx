import React from 'react';
import { Card } from '../../../shared/components/ui/Card';
import { FlaskConical, AlertTriangle, ShieldCheck } from 'lucide-react';

export const FertilizerCard = ({ fertilizer }) => {
  return (
    <Card hover className="flex flex-col h-full border-t-4 border-t-emerald-500">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-slate-200">{fertilizer.name}</h3>
        <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1 border border-emerald-500/20">
          <ShieldCheck size={14} /> {fertilizer.brand}
        </span>
      </div>
      
      <p className="text-slate-400 text-sm mb-4 flex-grow whitespace-pre-wrap">
        {fertilizer.description || 'Sin descripción detallada.'}
      </p>

      <div className="space-y-2 text-sm text-slate-300 bg-slate-950/50 p-3 rounded-lg border border-white/5">
        <div className="flex justify-between items-center">
          <span className="font-medium">Composición:</span>
          <span className="text-xs bg-slate-900 px-2 py-0.5 rounded border border-white/10 shadow-sm text-slate-200">
            N: {fertilizer.nitrogenPercent || 0}% | P: {fertilizer.phosphorusPercent || 0}% | K: {fertilizer.potassiumPercent || 0}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Presentación:</span>
          <span className="capitalize text-slate-400">{fertilizer.presentationWeight ? `${fertilizer.presentationWeight} kg` : 'N/A'}</span>
        </div>
        {fertilizer.grade && (
          <div className="flex items-start gap-1 mt-2 text-xs text-blue-400 bg-blue-500/10 p-2 rounded border border-blue-500/20">
            <FlaskConical size={14} className="shrink-0 mt-0.5" />
            <span className="line-clamp-2">Grado: {fertilizer.grade}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
