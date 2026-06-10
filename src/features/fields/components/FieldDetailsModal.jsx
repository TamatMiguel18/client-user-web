import React from 'react';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { MapPin, Ruler, Layers, Activity, Droplet, Thermometer, Info } from 'lucide-react';

export const FieldDetailsModal = ({ isOpen, onClose, field }) => {
  if (!field) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles de la Parcela">
      <div className="space-y-6">
        
        {/* Encabezado */}
        <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-white/5">
          <div>
            <h3 className="text-2xl font-bold text-white">{field.name}</h3>
            <span className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${field.isActive !== false ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
              {field.isActive !== false ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Área Total</p>
            <p className="text-xl font-bold text-blue-400">{field.area} ha</p>
          </div>
        </div>

        {/* Info principal */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/30 p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <MapPin size={16} className="text-rose-400" />
              <span className="text-sm font-medium">Ubicación</span>
            </div>
            <p className="text-slate-200 font-semibold">{field.location}</p>
          </div>
          
          <div className="bg-slate-900/30 p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Layers size={16} className="text-emerald-500" />
              <span className="text-sm font-medium">Cultivo Plantado</span>
            </div>
            <p className="text-slate-200 font-semibold">{field.crop?.name || 'Suelo asignado'}</p>
          </div>
        </div>

        {/* Parámetros de Suelo (soilData) */}
        {field.soilData && (
          <div>
            <h4 className="text-sm font-bold text-emerald-400 border-b border-white/10 pb-2 mb-3 flex items-center gap-2">
              <Droplet size={16} /> Parámetros de Suelo y Riego
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-slate-500">Capacidad Campo (CC)</p>
                <p className="text-slate-200 font-medium">{field.soilData.cc || 0}%</p>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-slate-500">Pto. Marchitez (PMP)</p>
                <p className="text-slate-200 font-medium">{field.soilData.pmp || 0}%</p>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-slate-500">Zona Radicular (Zr)</p>
                <p className="text-slate-200 font-medium">{field.soilData.zr || 0} cm</p>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-slate-500">Umbral Riego (UR)</p>
                <p className="text-slate-200 font-medium">{field.soilData.ur || 0}%</p>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-slate-500">Densidad (Dap)</p>
                <p className="text-slate-200 font-medium">{field.soilData.dap || 0} g/cm³</p>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-slate-500">Infiltración (Ib)</p>
                <p className="text-slate-200 font-medium">{field.soilData.ib || 0} mm/h</p>
              </div>
            </div>
          </div>
        )}

        {/* Análisis Nutricional (soilAnalysis) */}
        {field.soilAnalysis && (
          <div>
            <h4 className="text-sm font-bold text-emerald-400 border-b border-white/10 pb-2 mb-3 flex items-center gap-2">
              <Activity size={16} /> Análisis Nutricional (NPK)
            </h4>
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-blue-900/10 p-3 rounded-lg border border-blue-500/20 text-center">
                <p className="text-xs text-blue-400 font-bold mb-1">N</p>
                <p className="text-slate-200 font-medium">{field.soilAnalysis.nitrogen || 0}</p>
              </div>
              <div className="bg-rose-900/10 p-3 rounded-lg border border-rose-500/20 text-center">
                <p className="text-xs text-rose-400 font-bold mb-1">P</p>
                <p className="text-slate-200 font-medium">{field.soilAnalysis.phosphorus || 0}</p>
              </div>
              <div className="bg-amber-900/10 p-3 rounded-lg border border-amber-500/20 text-center">
                <p className="text-xs text-amber-400 font-bold mb-1">K</p>
                <p className="text-slate-200 font-medium">{field.soilAnalysis.potassium || 0}</p>
              </div>
              <div className="bg-purple-900/10 p-3 rounded-lg border border-purple-500/20 text-center">
                <p className="text-xs text-purple-400 font-bold mb-1">pH</p>
                <p className="text-slate-200 font-medium">{field.soilAnalysis.pH || 7}</p>
              </div>
            </div>
          </div>
        )}

      </div>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={onClose} variant="ghost">Cerrar</Button>
      </div>
    </Modal>
  );
};
