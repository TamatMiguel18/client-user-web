/**
 * @module Dashboard
 * @description Transformación del panel inicial hacia un "Nexus Agrícola" con indicadores holográficos 
 * (Progress Rings SVG) y simulación de gráficos de barras para maximizar el factor "WOW".
 */
import React from 'react';
import { Map, AlertTriangle, Leaf, Activity, ChevronRight, BarChart4 } from 'lucide-react';

// SVG Background Waves
const SciFiWaves = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-3xl opacity-30">
    <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-auto" preserveAspectRatio="none">
      <path fill="rgba(16, 185, 129, 0.2)" d="M0,192L48,176C96,160,192,128,288,144C384,160,480,224,576,240C672,256,768,224,864,197.3C960,171,1056,149,1152,144C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      <path fill="rgba(6, 182, 212, 0.15)" d="M0,256L60,256C120,256,240,256,360,229.3C480,203,600,149,720,138.7C840,128,960,160,1080,186.7C1200,213,1320,235,1380,245.3L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
    </svg>
  </div>
);

// Sci-Fi Progress Ring
const ProgressRing = ({ value, max, colorClass, strokeColor }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const percentage = (value / max) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg className="transform -rotate-90 w-24 h-24">
        <circle cx="48" cy="48" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
        <circle 
          cx="48" cy="48" r={radius} 
          stroke={strokeColor} 
          strokeWidth="8" 
          fill="none" 
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-out drop-shadow-[0_0_10px_${strokeColor}]`}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`font-black text-2xl ${colorClass}`}>{value}</span>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  return (
    <div className="min-h-[85vh] bg-[#070A11] p-4 sm:p-8 rounded-[3rem] relative overflow-hidden font-sans border border-white/5 shadow-2xl animate-fadeIn">
      {/* Luces Ambientales */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" />
      <SciFiWaves />

      <div className="relative z-10 max-w-[1600px] mx-auto space-y-10">
        
        {/* Header HUD */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-[#0E1525]/60 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-5">
            <div className="relative w-16 h-16 rounded-[1.5rem] bg-gradient-to-tr from-cyan-500 to-blue-600 p-[2px]">
              <div className="w-full h-full bg-[#090D17] rounded-[1.4rem] flex items-center justify-center">
                <Activity className="text-cyan-400" size={28} />
              </div>
              <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-40 rounded-full" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
                Nexus Agrícola
              </h2>
              <p className="text-[11px] text-cyan-400 font-bold tracking-widest uppercase mt-1">
                Sincronización Global: Óptima
              </p>
            </div>
          </div>
        </div>

        {/* Widgets Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Widget: Parcelas */}
          <div className="group relative bg-[#121827]/80 backdrop-blur-xl border border-white/10 p-6 rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-2xl rounded-bl-2xl overflow-hidden hover:shadow-[0_20px_50px_-15px_rgba(16,185,129,0.3)] transition-all duration-500 hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Territorios
              </span>
              <Map size={20} className="text-emerald-500 opacity-50" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Parcelas Activas</p>
                <h3 className="text-sm font-bold text-slate-300">Monitoreo 24/7</h3>
              </div>
              <ProgressRing value={0} max={10} colorClass="text-emerald-300" strokeColor="#10B981" />
            </div>
          </div>

          {/* Widget: Alertas */}
          <div className="group relative bg-[#121827]/80 backdrop-blur-xl border border-white/10 p-6 rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-2xl rounded-bl-2xl overflow-hidden hover:shadow-[0_20px_50px_-15px_rgba(244,63,94,0.3)] transition-all duration-500 hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                Sistema
              </span>
              <AlertTriangle size={20} className="text-rose-500 opacity-50" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Alertas Activas</p>
                <h3 className="text-sm font-bold text-slate-300">Requiere Atención</h3>
              </div>
              <ProgressRing value={0} max={5} colorClass="text-rose-300" strokeColor="#F43F5E" />
            </div>
          </div>

          {/* Widget: Rendimiento (Placeholder Visual) */}
          <div className="group lg:col-span-2 relative bg-[#121827]/80 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] overflow-hidden hover:shadow-[0_20px_50px_-15px_rgba(6,182,212,0.3)] transition-all duration-500 hover:-translate-y-2 flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Análisis Global
              </span>
              <BarChart4 size={20} className="text-cyan-500 opacity-50" />
            </div>
            
            <div className="flex-1 flex flex-col justify-end relative z-10">
              <div className="flex items-end gap-2 mb-2">
                <h3 className="text-4xl font-black text-white">94<span className="text-xl text-cyan-400">%</span></h3>
                <span className="text-xs font-bold text-emerald-400 mb-1">+2.4%</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Eficiencia Promedio Proyectada</p>
              
              {/* Fake Graph Lines */}
              <div className="h-12 w-full mt-4 flex items-end gap-1">
                {[40, 60, 45, 80, 55, 90, 70, 100, 85, 60, 75, 95].map((h, i) => (
                  <div key={i} className="flex-1 bg-cyan-500/20 rounded-t-sm relative group-hover:bg-cyan-500/40 transition-colors" style={{ height: `${h}%` }}>
                    <div className="absolute top-0 inset-x-0 h-1 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
