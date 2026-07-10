import React, { useEffect, useState } from 'react';
import { useFieldStore } from '../../fields/store/useFieldStore';
import { useAuthStore } from '../../auth/store/authStore';
import { getProfile } from '../../../shared/api';
import { Card } from '../../../shared/components/ui/Card';
import { CalendarClock, Map, ArrowRight, Sprout, CalendarDays, Clock, Tractor, Mail, Phone, MapPin, Briefcase, User as UserIcon } from 'lucide-react';

export const FarmerProfile = () => {
  const { fields, fetchFields, editField } = useFieldStore();
  const { user: authUser } = useAuthStore();
  const [user, setUser] = useState(authUser); // Inicializa con datos básicos

  useEffect(() => {
    fetchFields();
    
    // Fetch full profile info
    const fetchProfile = async () => {
        try {
            const res = await getProfile();
            if (res.data && res.data.success) {
                setUser(res.data.data);
            }
        } catch (e) {
            console.error("Error fetching full profile:", e);
        }
    };
    fetchProfile();
  }, [fetchFields]);

  const activeFields = fields?.filter(f => f.isActive) || [];

  const handleDateChange = async (fieldId, e) => {
    const newDate = e.target.value;
    try {
      await editField(fieldId, { plantingDate: newDate });
    } catch (error) {
      console.error("Error updating planting date", error);
    }
  };

  const calculatePhaseInfo = (field) => {
    if (!field.fertilizationPlan || !field.fertilizationPlan.cronograma_aplicacion) {
      return null;
    }

    const plan = field.fertilizationPlan.cronograma_aplicacion;
    const plantingDate = field.plantingDate ? new Date(field.plantingDate) : new Date(field.createdAt);
    const today = new Date();
    
    // Calcular días transcurridos
    const diffTime = today.getTime() - plantingDate.getTime();
    const daysElapsed = Math.floor(diffTime / (1000 * 3600 * 24));
    
    let currentPhase = null;
    let nextPhase = null;
    let daysUntilNext = 0;
    
    let cumulativeDays = 0;

    for (let i = 0; i < plan.fases.length; i++) {
        const fase = plan.fases[i];
        // Extraer número de días del string "0 a 30" -> tomamos el límite superior
        const match = fase.rango_dias.match(/a (\d+)/) || fase.rango_dias.match(/- (\d+)/);
        const limitDays = match ? parseInt(match[1]) : 30; // fallback a 30
        
        const phaseStart = cumulativeDays;
        const phaseEnd = limitDays;
        
        if (daysElapsed >= phaseStart && daysElapsed <= phaseEnd) {
            currentPhase = fase;
            if (i + 1 < plan.fases.length) {
                nextPhase = plan.fases[i + 1];
                daysUntilNext = phaseEnd - daysElapsed;
            } else {
                daysUntilNext = 0; // Es la última fase
            }
            break;
        } else if (daysElapsed < phaseStart) {
            // Aún no empieza la primera fase (ej. si sembró en el futuro)
            nextPhase = fase;
            daysUntilNext = phaseStart - daysElapsed;
            break;
        }
        
        // Si ya pasó esta fase, revisamos la siguiente
        if (i === plan.fases.length - 1 && daysElapsed > phaseEnd) {
            currentPhase = { nombre_fase: "Ciclo Finalizado" };
        }
    }

    return { daysElapsed, currentPhase, nextPhase, daysUntilNext, totalDays: plan.total_ciclo_dias };
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 dark:bg-slate-900 p-4 sm:p-8 rounded-3xl relative overflow-hidden font-sans border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* Header del Perfil y Detalles del Agricultor */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col justify-center items-center text-center gap-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md p-6 rounded-3xl border border-slate-200 dark:border-white/5 transition-colors duration-300">
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center border-4 border-emerald-500/20 shadow-inner">
              <UserIcon className="text-emerald-600 dark:text-emerald-500" size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {user?.name} {user?.surname}
              </h2>
              <p className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs mt-1">
                {user?.farmerType || 'Productor Agrícola'}
              </p>
            </div>
          </div>

          <div className="md:col-span-2 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md p-6 rounded-3xl border border-slate-200 dark:border-white/5 transition-colors duration-300 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-white/10 pb-2">Información de Contacto y Operación</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-900/50 rounded-lg text-slate-500">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Correo</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user?.email || 'No especificado'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-900/50 rounded-lg text-slate-500">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Teléfono</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user?.phone || 'No especificado'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-900/50 rounded-lg text-slate-500">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Ubicación</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">{user?.municipality}, {user?.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-900/50 rounded-lg text-slate-500">
                  <Briefcase size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Cultivo Principal</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user?.mainCrop || 'No especificado'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parcelas y Cuenta Regresiva */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <CalendarDays className="text-blue-500" /> Agenda de Fertilización
          </h3>
          
          {activeFields.length === 0 ? (
            <div className="p-8 text-center bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-white/5">
              <p className="text-slate-500">No tienes parcelas activas. Crea una para ver tu agenda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeFields.map((field) => {
                const phaseInfo = calculatePhaseInfo(field);
                const plantingDateObj = field.plantingDate ? new Date(field.plantingDate) : new Date(field.createdAt);
                const formattedDate = plantingDateObj.toISOString().split('T')[0];

                return (
                  <Card key={field._id || field.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-slate-200 dark:border-white/10 hover:shadow-lg transition-all duration-300 rounded-3xl p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl">
                          <Map className="text-emerald-600 dark:text-emerald-400" size={24} />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-slate-900 dark:text-white">{field.name}</h4>
                          <span className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">{field.crop?.name || 'Cultivo'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Día de Siembra</label>
                        <input 
                          type="date" 
                          value={formattedDate}
                          onChange={(e) => handleDateChange(field._id || field.id, e)}
                          className="text-sm bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {phaseInfo ? (
                      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200 dark:border-white/5">
                        <div className="flex justify-between items-end mb-4">
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Días desde la siembra</p>
                            <p className="text-3xl font-black text-slate-800 dark:text-slate-200">{Math.max(0, phaseInfo.daysElapsed)} <span className="text-sm text-slate-400 font-medium">/ {phaseInfo.totalDays}</span></p>
                          </div>
                          {phaseInfo.nextPhase && (
                            <div className="text-right flex flex-col items-end">
                              <span className="flex items-center gap-1 text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider bg-orange-100 dark:bg-orange-500/10 px-2 py-1 rounded-md mb-1">
                                <Clock size={12} /> Próxima Acción en
                              </span>
                              <p className="text-2xl font-black text-orange-600 dark:text-orange-400">{phaseInfo.daysUntilNext} <span className="text-sm">días</span></p>
                            </div>
                          )}
                        </div>

                        {/* Progress Bar Visual */}
                        <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full mb-6 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min(100, Math.max(0, (phaseInfo.daysElapsed / phaseInfo.totalDays) * 100))}%` }}
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex gap-3 items-start">
                            <Sprout className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                            <div>
                              <p className="text-xs text-slate-500 font-bold uppercase">Fase Actual</p>
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{phaseInfo.currentPhase?.nombre_fase || 'En espera...'}</p>
                            </div>
                          </div>
                          
                          {phaseInfo.nextPhase && (
                            <div className="flex gap-3 items-start pt-3 border-t border-slate-200 dark:border-white/5">
                              <ArrowRight className="text-orange-500 mt-0.5 shrink-0" size={18} />
                              <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Siguiente Fase: {phaseInfo.nextPhase.nombre_fase}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 whitespace-pre-wrap">{phaseInfo.nextPhase.instrucciones_agronomicas}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-50 dark:bg-amber-500/10 rounded-2xl p-5 border border-amber-200 dark:border-amber-500/20 text-center">
                        <CalendarClock className="mx-auto text-amber-500 mb-2" size={32} />
                        <p className="text-sm font-bold text-amber-800 dark:text-amber-400">Sin Plan de Fertilización</p>
                        <p className="text-xs text-amber-700 dark:text-amber-200/70 mt-1">Genera un plan con IA para activar tu agenda.</p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
