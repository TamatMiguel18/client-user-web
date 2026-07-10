/**
 * @module Dashboard
 * @description Panel inicial rediseñado a "Premium Clean Tech" para una interfaz analítica y profesional.
 */
import React from 'react';
import { Map, AlertTriangle, Activity, BarChart4, TrendingUp } from 'lucide-react';

const ProgressRing = ({ value, max, colorClass, strokeColor }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const percentage = (value / max) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg className="transform -rotate-90 w-24 h-24">
        <circle cx="48" cy="48" r={radius} strokeWidth="8" fill="none" className="stroke-slate-200 dark:stroke-white/5" />
        <circle 
          cx="48" cy="48" r={radius} 
          stroke={strokeColor} 
          strokeWidth="8" 
          fill="none" 
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="font-semibold text-2xl text-slate-900 dark:text-white tracking-tight">{value}</span>
      </div>
    </div>
  );
};

const Sparkline = () => (
  <svg viewBox="0 0 200 50" className="w-full h-16 mt-4 overflow-visible">
    <defs>
      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 45 Q 15 35, 30 38 T 60 25 T 90 30 T 130 15 T 165 20 T 200 10 L 200 50 L 0 50 Z"
      fill="url(#gradient)"
    />
    <path
      d="M0 45 Q 15 35, 30 38 T 60 25 T 90 30 T 130 15 T 165 20 T 200 10"
      fill="none"
      stroke="#10B981"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Dashboard = () => {
  return (
    <div className="min-h-[85vh] bg-slate-50 dark:bg-slate-900 p-4 sm:p-8 rounded-3xl relative overflow-hidden font-sans border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-white/5 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Activity className="text-emerald-500" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
                Vista General
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                Sincronización de datos óptima
              </p>
            </div>
          </div>
        </div>

        {/* Widgets Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Widget: Parcelas */}
          <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Map size={16} className="text-emerald-500" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Territorios</span>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Parcelas Activas</p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Monitoreo</h3>
              </div>
              <ProgressRing value={12} max={15} colorClass="text-emerald-500" strokeColor="#10B981" />
            </div>
          </div>

          {/* Widget: Alertas */}
          <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle size={16} className="text-amber-500" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sistema</span>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Alertas Activas</p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Atención</h3>
              </div>
              <ProgressRing value={3} max={10} colorClass="text-amber-500" strokeColor="#F59E0B" />
            </div>
          </div>

          {/* Widget: Rendimiento (Sparkline Analítico) */}
          <div className="lg:col-span-2 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-white/5 p-6 rounded-2xl flex flex-col hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors duration-300">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <BarChart4 size={16} className="text-blue-500" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Análisis Global</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-end mt-2">
              <div className="flex items-end gap-3 mb-1">
                <h3 className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight">94<span className="text-2xl text-slate-600 dark:text-slate-400 font-medium">%</span></h3>
                <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md mb-1.5 border border-emerald-500/20">
                  <TrendingUp size={14} />
                  <span className="text-xs font-semibold">+2.4%</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Eficiencia Promedio Proyectada</p>
              
              <Sparkline />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

