import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { calculateRecommendation } from '../api/fertility.api';
import { RecommendationResult } from './RecommendationResult';
import { Calculator } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCropStore } from '../../crops/store/useCropStore';
import { useFertilizerStore } from '../../fertilizers/store/useFertilizerStore';

export const FertilityForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { crops, fetchCrops } = useCropStore();
  const { fertilizers, fetchFertilizers } = useFertilizerStore();

  useEffect(() => {
    fetchCrops();
    fetchFertilizers();
  }, [fetchCrops, fetchFertilizers]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const payload = {
        cropId: data.cropId,
        terrainArea: Number(data.terrainArea),
        areaUnit: data.areaUnit,
        soilAnalysis: {
          nitrogen: Number(data.nitrogen),
          phosphorus: Number(data.phosphorus),
          potassium: Number(data.potassium),
          pH: Number(data.pH)
        },
        // For simplicity, we calculate with all available fertilizers
        fertilizerIds: fertilizers.map(f => f._id || f.id)
      };
      
      if(payload.fertilizerIds.length === 0) {
        toast.error('No hay fertilizantes disponibles en el sistema.');
        return;
      }

      const response = await calculateRecommendation(payload);
      setResult(response.data || response);
      toast.success('Recomendación generada con éxito');
    } catch (error) {
      toast.error(error.message || 'Error al calcular la recomendación');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-2">
          <Calculator className="text-emerald-500" />
          Cálculo de Fertilidad
        </h2>
        <p className="text-slate-400 mt-1">Ingresa los datos de tu parcela, cultivo y análisis de suelo para obtener una recomendación precisa.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-emerald-400 border-b border-white/10 pb-2">Datos Básicos</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Cultivo a plantar</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:outline-none"
                  {...register('cropId', { required: 'El cultivo es requerido' })}
                >
                  <option value="">Seleccione un cultivo...</option>
                  {crops?.map(c => (
                    <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.cropId && <p className="mt-1 text-sm text-rose-400">{errors.cropId.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Área"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('terrainArea', { 
                    required: 'El área es requerida',
                    min: { value: 0.01, message: 'Debe ser mayor a 0' }
                  })}
                  error={errors.terrainArea?.message}
                />
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Unidad</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:outline-none"
                    {...register('areaUnit', { required: 'Seleccione unidad' })}
                    defaultValue="hectareas"
                  >
                    <option value="hectareas">Hectáreas</option>
                    <option value="m2">Metros Cuadrados (m²)</option>
                    <option value="cuerdas">Cuerdas</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-semibold text-emerald-400 border-b border-white/10 pb-2">Análisis de Suelo (Opcional)</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Nitrógeno (N)"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  defaultValue="0"
                  {...register('nitrogen')}
                />
                <Input 
                  label="Fósforo (P)"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  defaultValue="0"
                  {...register('phosphorus')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Potasio (K)"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  defaultValue="0"
                  {...register('potassium')}
                />
                <Input 
                  label="pH del Suelo"
                  type="number"
                  step="0.1"
                  placeholder="7.0"
                  defaultValue="7.0"
                  {...register('pH', { 
                    min: { value: 0, message: 'pH inválido' },
                    max: { value: 14, message: 'pH inválido' }
                  })}
                  error={errors.pH?.message}
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
              Calcular Recomendación
            </Button>
          </form>
        </Card>

        <div>
          {result ? (
            <RecommendationResult recommendation={result} />
          ) : (
            <div className="h-full border-2 border-dashed border-white/10 rounded-[2.5rem] flex items-center justify-center p-8 text-center text-slate-500 bg-slate-900/20">
              <div>
                <Calculator size={48} className="mx-auto mb-3 opacity-20" />
                <p>Llena el formulario y haz clic en calcular para ver los resultados aquí.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
