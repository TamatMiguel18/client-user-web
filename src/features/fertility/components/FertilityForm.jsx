/**
 * @module FertilityForm
 * @description Ampliación del layout principal para ocupar el 100% del monitor (grid de 12 columnas), 
 * dando mayor protagonismo visual a los resultados generados por la IA.
 */
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { calculateAIRecommendation } from '../api/fertility.api';
import { RecommendationResult } from './RecommendationResult';
import { Calculator } from 'lucide-react';
import toast from 'react-hot-toast';
import { useFieldStore } from '../../fields/store/useFieldStore';
import { useFertilizerStore } from '../../fertilizers/store/useFertilizerStore';

export const FertilityForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { fields, fetchFields } = useFieldStore();
  const { fertilizers, fetchFertilizers } = useFertilizerStore();

  useEffect(() => {
    fetchFields();
    fetchFertilizers();
  }, [fetchFields, fetchFertilizers]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const payload = {
        fieldId: data.fieldId,
        // For simplicity, we calculate with all available fertilizers
        fertilizerIds: fertilizers.map(f => f._id || f.id)
      };
      
      if(payload.fertilizerIds.length === 0) {
        toast.error('No hay fertilizantes disponibles en el sistema.');
        return;
      }

      const response = await calculateAIRecommendation(payload);
      setResult(response.data || response);
      toast.success('Recomendación generada con éxito');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Error al calcular la recomendación');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-[1600px] mx-auto w-full">
      <div>
        <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-2">
          <Calculator className="text-emerald-500" />
          Cálculo de Fertilidad
        </h2>
        <p className="text-slate-400 mt-1">Seleccione la parcela para la cual desea calcular la recomendación de fertilidad.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 lg:col-start-1">
          <Card className="h-fit sticky top-24">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-emerald-400 border-b border-white/10 pb-2">Selección de Parcela</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Parcela Registrada</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:outline-none"
                  {...register('fieldId', { required: 'La parcela es requerida' })}
                >
                  <option value="">Seleccione una parcela...</option>
                  {fields?.map(f => (
                    <option key={f._id || f.id} value={f._id || f.id}>{f.name}</option>
                  ))}
                </select>
                {errors.fieldId && <p className="mt-1 text-sm text-rose-400">{errors.fieldId.message}</p>}
                <p className="mt-2 text-xs text-slate-500">
                  SmartGrow utilizará los datos de área, cultivo y análisis de suelo previamente configurados en la parcela.
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
              Calcular Recomendación
            </Button>
          </form>
        </Card>
        </div>

        <div className="lg:col-span-8">
          {result ? (
            <RecommendationResult recommendation={result} />
          ) : (
            <div className="h-full border-2 border-dashed border-white/10 rounded-[2.5rem] flex items-center justify-center p-8 text-center text-slate-500 bg-slate-900/20">
              <div>
                <Calculator size={48} className="mx-auto mb-3 opacity-20" />
                <p>Seleccione la parcela y haga clic en calcular para ver los resultados aquí.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
