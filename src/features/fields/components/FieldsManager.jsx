/**
 * @module FieldsManager
 * @description Rediseño completo de la interfaz de gestión de parcelas con estética Sci-Fi (Dashboard futurista), 
 * utilizando SVGs nativos para anillos de progreso y ondas orgánicas animadas.
 */
import React, { useEffect, useState } from 'react';
import { useFieldStore } from '../store/useFieldStore';
import { Button } from '../../../shared/components/ui/Button';
import { Loader } from '../../../shared/components/ui/Loader';
import { FieldFormModal } from './FieldFormModal';
import { FieldDetailsModal } from './FieldDetailsModal';
import { MapPin, Plus, Trash2, Edit2, Eye, Power, Leaf } from 'lucide-react';
import toast from 'react-hot-toast';

// Componente SVG para un Anillo Circular de Estado
const StatusRing = ({ status }) => {
  const isHealthy = status === 'Saludable' || !status;
  const isWarning = status === 'En Riesgo';
  const color = isHealthy ? '#10B981' : isWarning ? '#F59E0B' : '#EF4444';
  const percentage = isHealthy ? 100 : isWarning ? 65 : 30;
  
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-20 h-20">
      {/* Background ring */}
      <svg className="transform -rotate-90 w-20 h-20">
        <circle cx="40" cy="40" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
        <circle 
          cx="40" cy="40" r={radius} 
          stroke={color} 
          strokeWidth="6" 
          fill="none" 
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-white font-black text-sm">{percentage}%</span>
      </div>
    </div>
  );
};

// Componente SVG para las Olas Orgánicas del Fondo (Dashboard vibe)
const OrganicWaves = () => (
  <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden pointer-events-none z-0 rounded-b-[3rem] opacity-40">
    <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
      <path fill="rgba(16, 185, 129, 0.15)" d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      <path fill="rgba(6, 182, 212, 0.1)" d="M0,128L60,144C120,160,240,192,360,181.3C480,171,600,117,720,106.7C840,96,960,128,1080,144C1200,160,1320,160,1380,160L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
    </svg>
  </div>
);

export const FieldsManager = () => {
  const { fields, isLoading, error, fetchFields, addField, editField, removeField, activateField } = useFieldStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [detailsField, setDetailsField] = useState(null);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const allFields = fields || [];

  const handleSaveField = async (data) => {
    try {
      if (editingField) {
        await editField(editingField.id || editingField._id, data);
        toast.success('Parcela actualizada');
      } else {
        await addField(data);
        toast.success('Parcela creada');
      }
      fetchFields();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeField(id);
      toast.success('Parcela desactivada');
      fetchFields();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateField(id);
      toast.success('Parcela activada de nuevo');
      fetchFields();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isLoading && allFields.length === 0) return <Loader />;

  return (
    <div className="min-h-screen bg-[#090D17] text-white p-4 sm:p-8 rounded-[3rem] relative overflow-hidden font-sans shadow-2xl border border-white/5">
      {/* Sci-Fi Global Backgrounds */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" />
      <OrganicWaves />

      <div className="relative z-10 max-w-[1600px] mx-auto space-y-10">
        
        {/* Header Ultra-Moderno */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white/5 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-6">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 p-[2px]">
              <div className="w-full h-full bg-[#090D17] rounded-full flex items-center justify-center">
                <Leaf className="text-emerald-400" size={28} />
              </div>
              <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-30 rounded-full" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
                Control de Parcelas
              </h2>
              <p className="text-sm text-cyan-400/80 font-semibold tracking-wide uppercase mt-1">
                Monitoreo Activo
              </p>
            </div>
          </div>

          <Button 
            onClick={() => { setEditingField(null); setIsModalOpen(true); }} 
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-extrabold px-8 py-4 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus size={20} strokeWidth={3} /> Nueva Parcela
            </span>
            <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
          </Button>
        </div>

        {/* Dashboard Grid */}
        {allFields.length === 0 ? (
          <div className="text-center py-32 relative">
            <h3 className="text-3xl font-black text-slate-200 mb-4">Sin datos de terreno</h3>
            <p className="text-slate-400 font-medium">Inicia desplegando tu primer cuadrante agrícola.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {allFields.map((field, index) => (
              <div 
                key={field._id || field.id || `field-${index}`} 
                className={`group relative bg-[#121827]/80 backdrop-blur-xl border border-white/10 p-6 flex flex-col transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.2)]
                rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-2xl rounded-bl-2xl overflow-hidden
                ${field.isActive === false ? 'opacity-50 grayscale hover:grayscale-0' : ''}`}
              >
                {/* Decoración Interna Card */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
                
                {/* Header Card */}
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Sector {index + 1}
                    </span>
                    <h3 className="text-2xl font-black text-white tracking-tight">{field.name}</h3>
                  </div>
                  
                  {/* Controles Glassmorphism */}
                  <div className="flex flex-col gap-2 bg-[#090D17]/50 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
                    <button onClick={() => { setEditingField(field); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all" title="Editar">
                      <Edit2 size={16} strokeWidth={2.5} />
                    </button>
                    {field.isActive !== false ? (
                      <button onClick={() => handleDelete(field.id || field._id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all" title="Desactivar">
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    ) : (
                      <button onClick={() => handleActivate(field.id || field._id)} className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all" title="Activar">
                        <Power size={16} strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Data Widget Area */}
                <div className="flex items-center justify-between mb-8 relative z-10 bg-black/20 rounded-[2rem] p-4 border border-white/5">
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Cultivo Activo</p>
                      <p className="text-lg font-bold text-cyan-300">{field.crop?.name || 'Suelo Virgen'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Superficie</p>
                      <p className="text-2xl font-black text-white">{field.area} <span className="text-sm font-medium text-slate-500">Ha</span></p>
                    </div>
                  </div>
                  
                  {/* Status Ring Chart */}
                  <div className="flex flex-col items-center gap-2">
                    <StatusRing status={field.healthStatus} />
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center">Índice Salud</p>
                  </div>
                </div>

                {/* Footer Card */}
                <div className="mt-auto relative z-10">
                  <div className="flex items-center gap-2 text-slate-400 mb-6 bg-white/5 p-3 rounded-xl border border-white/5">
                    <MapPin size={16} className="text-rose-400 shrink-0" />
                    <span className="text-xs font-medium truncate">{field.location}</span>
                  </div>

                  <button
                    onClick={() => setDetailsField(field)}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 hover:from-emerald-500/20 hover:to-cyan-500/20 text-emerald-400 font-bold rounded-2xl transition-all border border-emerald-500/20 group/btn"
                  >
                    <Eye size={18} />
                    <span className="tracking-wide">Analítica Completa</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <FieldFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSaveField} initialData={editingField} />
        <FieldDetailsModal isOpen={!!detailsField} onClose={() => setDetailsField(null)} field={detailsField} />
      </div>
    </div>
  );
};
