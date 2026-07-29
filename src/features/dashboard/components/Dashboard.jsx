import React from 'react';

export const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-200">Bienvenido a SmartGrowGT</h2>
        <p className="text-slate-400 mt-1">Panel principal del usuario agrícola.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-slate-300">Mis Parcelas</h3>
          <p className="text-3xl font-bold text-emerald-400 mt-2">0</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-slate-300">Alertas Activas</h3>
          <p className="text-3xl font-bold text-rose-400 mt-2">0</p>
        </div>
      </div>
    </div>
  );
};
