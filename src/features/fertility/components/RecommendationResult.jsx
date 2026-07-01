/**
 * @module RecommendationResult
 * @description Rediseño de resultados IA con interfaz Glassmorphism, widgets compactos, y cronograma vertical 
 * para optimizar la legibilidad y el uso de la pantalla manteniendo un estilo vanguardista.
 */
import React from 'react';
import { Card } from '../../../shared/components/ui/Card';
import { Bot, Droplet, AlertTriangle, CalendarClock, Leaf, CheckCircle2, FlaskConical, ChevronRight } from 'lucide-react';

export const RecommendationResult = ({ recommendation }) => {
  const data = recommendation.data ? recommendation.data : recommendation;
  if (!data || !data.resumen_diagnostico) return null;
  const { resumen_diagnostico, seleccion_fertilizantes, cronograma_aplicacion, configuracion_riego_sugerido } = data;

  return (
    <Card className="border-0 bg-slate-900/80 backdrop-blur-2xl relative overflow-hidden h-full flex flex-col shadow-2xl p-0">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Sticky Header */}
      <div className="flex flex-wrap items-center justify-between p-5 border-b border-white/10 bg-slate-950/60 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl text-slate-900 shadow-lg shadow-emerald-500/20">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-100 tracking-wide">Plan Agronómico SmartGroW</h3>
            <p className="text-xs text-emerald-400 font-medium">Generado exitosamente por SmartGroW</p>
          </div>
        </div>
        
        {/* Riego Mini-Widget */}
        <div className="flex items-center gap-4 bg-slate-900/80 border border-blue-500/30 rounded-xl px-4 py-2 mt-4 sm:mt-0 w-full sm:w-auto shadow-inner">
          <div className="flex items-center gap-2 border-r border-white/10 pr-4">
            <Droplet size={18} className="text-cyan-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-cyan-400/80 uppercase tracking-wider">Lámina</span>
              <span className="text-sm font-bold text-slate-200">{configuracion_riego_sugerido.lamina_disponible_mm} mm</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarClock size={18} className="text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-blue-400/80 uppercase tracking-wider">{configuracion_riego_sugerido.frecuencia_estimada}</span>
              <span className="text-sm font-bold text-slate-200">{configuracion_riego_sugerido.tiempo_riego_minutos_por_sesion} min</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar relative z-10 space-y-6">
        
        {/* Sección: Diagnóstico */}
        <div className="bg-slate-950/40 rounded-2xl p-5 border border-white/5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <FlaskConical size={18} className="text-indigo-400" />
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Análisis del Suelo</h4>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            {resumen_diagnostico.evaluacion_suelo}
          </p>
          {resumen_diagnostico.alerta_ph && (
            <div className="mt-4 bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-amber-500 p-3 rounded-r-xl flex gap-3 items-start">
              <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-amber-200/90 leading-relaxed">{resumen_diagnostico.alerta_ph}</p>
            </div>
          )}
        </div>

        {/* Sección: Fertilizantes */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Selección Inteligente</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {seleccion_fertilizantes.map((fert, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded-xl p-4 border border-emerald-500/20 hover:bg-emerald-500/5 transition-colors">
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-2">
                  <Leaf size={14} /> {fert.nombre}
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">{fert.razon_seleccion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sección: Cronograma */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <CalendarClock size={18} className="text-orange-400" />
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Cronograma de Fases</h4>
            </div>
            <span className="text-xs font-bold text-orange-300 bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/30">
              Ciclo: {cronograma_aplicacion.total_ciclo_dias} días
            </span>
          </div>

          <div className="space-y-4">
            {cronograma_aplicacion.fases.map((fase, idx) => (
              <div key={idx} className="bg-slate-950/50 rounded-2xl border border-white/10 overflow-hidden relative group">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-500 to-emerald-500" />
                
                <div className="p-4 sm:p-5 pl-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                    <h5 className="text-base font-bold text-slate-100">{fase.nombre_fase}</h5>
                    <span className="text-xs font-bold text-orange-400 bg-orange-400/10 px-2.5 py-1 rounded-lg w-fit">
                      Días: {fase.rango_dias}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {fase.fertilizantes_a_aplicar.map((f, i) => (
                      <div key={i} className="bg-slate-900/60 rounded-xl p-3 border border-white/5 flex flex-col justify-between">
                        <span className="text-sm font-bold text-emerald-400 mb-2">{f.nombre}</span>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-300 font-medium">{f.cantidad_kg_total_fase} kg</span>
                          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-bold">
                            {f.cantidad_sacos_fase} sacos
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-900/30 rounded-xl p-3 border border-white/5 flex gap-2 items-start mt-2">
                    <ChevronRight size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {fase.instrucciones_agronomicas}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Card>
  );
};
