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
import { MapPin, Plus, Trash2, Edit2, Eye, Power, Leaf, CloudSun, Droplets, Wind, Thermometer } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Skeleton } from '../../../shared/components/ui/Skeleton';

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

import { getProfile } from '../../../shared/api';
import axios from 'axios';

export const FieldsManager = () => {
  const { fields, isLoading, error, fetchFields, addField, editField, removeField, activateField } = useFieldStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [detailsField, setDetailsField] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetchFields();

    const fetchWeather = async () => {
      try {
        const res = await getProfile();
        if (res.data?.data?.municipality) {
          const municipality = res.data.data.municipality;
          const geoRes = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${municipality}&count=1&language=es&format=json`);
          
          if (geoRes.data?.results?.length > 0) {
            const { latitude, longitude } = geoRes.data.results[0];
            const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m,precipitation_probability`);
            
            const current = weatherRes.data.current_weather;
            const currentHour = new Date().getHours();
            const humidity = weatherRes.data.hourly?.relative_humidity_2m?.[currentHour] || 65;
            const rainProb = weatherRes.data.hourly?.precipitation_probability?.[currentHour] || 0;
            
            setWeather({
              temp: current.temperature,
              wind: current.windspeed,
              humidity: humidity,
              rain: rainProb,
              location: municipality
            });
          }
        }
      } catch(e) {
        console.error("Error fetching weather", e);
      }
    };
    fetchWeather();
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-white p-4 sm:p-8 rounded-[3rem] relative overflow-hidden font-sans shadow-2xl border border-slate-200 dark:border-white/5 transition-colors duration-300">
      {/* Sci-Fi Global Backgrounds */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" />
      <OrganicWaves />

      <div className="relative z-10 max-w-[1600px] mx-auto space-y-10">
        
        {/* Header Ultra-Moderno */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white/40 dark:bg-white/5 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-colors duration-300">
          <div className="flex items-center gap-6">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 p-[2px]">
              <div className="w-full h-full bg-slate-50 dark:bg-[#090D17] rounded-full flex items-center justify-center">
                <Leaf className="text-emerald-400" size={28} />
              </div>
              <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-30 rounded-full" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 tracking-tight">
                Control de Parcelas
              </h2>
              <p className="text-sm text-cyan-700 dark:text-cyan-400/80 font-semibold tracking-wide uppercase mt-1">
                Monitoreo Activo
              </p>
            </div>
          </div>

          <Button 
            onClick={() => { setEditingField(null); setIsModalOpen(true); }} 
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white dark:text-slate-900 font-extrabold px-8 py-4 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus size={20} strokeWidth={3} /> Nueva Parcela
            </span>
            <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
          </Button>
        </div>

        {/* Resumen Agrometeorológico del Agricultor */}
        <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <CloudSun className="text-amber-500" size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Condiciones Actuales</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {weather ? `Clima en ${weather.location}` : 'Pronóstico local estimado para tus terrenos'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto flex-grow justify-end max-w-2xl">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-3">
              <Thermometer className="text-rose-500" size={20} />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Temperatura</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {weather ? `${weather.temp}°C` : '26°C'}
                </p>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-3">
              <Droplets className="text-blue-500" size={20} />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Humedad</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {weather ? `${weather.humidity}%` : '65%'}
                </p>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-3">
              <Wind className="text-cyan-500" size={20} />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Viento</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {weather ? `${weather.wind} km/h` : '12 km/h'}
                </p>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-3">
              <CloudSun className="text-amber-500" size={20} />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Lluvia</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {weather ? `${weather.rain}%` : '10%'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        {isLoading && allFields.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-[350px] w-full rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-2xl rounded-bl-2xl" />
            ))}
          </div>
        ) : allFields.length === 0 ? (
          <div className="text-center py-32 relative animate-fadeIn">
            <h3 className="text-3xl font-black text-slate-900 dark:text-slate-200 mb-4">Sin datos de terreno</h3>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Inicia desplegando tu primer cuadrante agrícola.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {allFields.map((field, index) => (
              <motion.div 
                variants={itemVariants}
                key={field._id || field.id || `field-${index}`} 
                className={`group relative bg-white/80 dark:bg-[#121827]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-6 flex flex-col transition-colors duration-700 hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.2)]
                rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-2xl rounded-bl-2xl overflow-hidden
                ${field.isActive === false ? 'opacity-50 grayscale hover:grayscale-0' : ''}`}
              >
                {/* Decoración Interna Card */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
                
                {/* Header Card */}
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                      Sector {index + 1}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{field.name}</h3>
                  </div>
                  
                  {/* Controles Glassmorphism */}
                  <div className="flex flex-col gap-2 bg-slate-100/80 dark:bg-[#090D17]/50 p-2 rounded-2xl border border-slate-200 dark:border-white/5 backdrop-blur-md">
                    <button onClick={() => { setEditingField(field); setIsModalOpen(true); }} className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all" title="Editar">
                      <Edit2 size={16} strokeWidth={2.5} />
                    </button>
                    {field.isActive !== false ? (
                      <button onClick={() => handleDelete(field.id || field._id)} className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/10 rounded-xl transition-all" title="Desactivar">
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    ) : (
                      <button onClick={() => handleActivate(field.id || field._id)} className="p-2 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 rounded-xl transition-all" title="Activar">
                        <Power size={16} strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Data Widget Area */}
                <div className="flex items-center justify-between mb-8 relative z-10 bg-slate-50/80 dark:bg-black/20 rounded-[2rem] p-4 border border-slate-200 dark:border-white/5">
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Cultivo Activo</p>
                      <p className="text-lg font-bold text-cyan-700 dark:text-cyan-300">{field.crop?.name || 'Suelo Virgen'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Superficie</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{field.area} <span className="text-sm font-medium text-slate-500">Ha</span></p>
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
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-6 bg-slate-100 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/5">
                    <MapPin size={16} className="text-rose-500 dark:text-rose-400 shrink-0" />
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
              </motion.div>
            ))}
          </motion.div>
        )}

        <FieldFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSaveField} initialData={editingField} />
        <FieldDetailsModal isOpen={!!detailsField} onClose={() => setDetailsField(null)} field={detailsField} />
      </div>
    </div>
  );
};
