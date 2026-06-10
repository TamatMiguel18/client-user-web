import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';

import { useCropStore } from '../../crops/store/useCropStore';
import { useAuthStore } from '../../auth/store/authStore';

export const FieldFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const { crops, fetchCrops } = useCropStore();

  // Estado para controlar la pestaña activa
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('general'); // Resetear a la primera pestaña al abrir

      reset(initialData ? {
        ...initialData,
        crop: initialData.crop?._id || initialData.crop?.id || initialData.crop || '',
        // Mapeamos los valores existentes o asignamos los defaults del esquema
        soilData: {
          cc: initialData.soilData?.cc ?? 0,
          pmp: initialData.soilData?.pmp ?? 0,
          zr: initialData.soilData?.zr ?? 0,
          ur: initialData.soilData?.ur ?? 0,
          dap: initialData.soilData?.dap ?? 0,
          ib: initialData.soilData?.ib ?? 0,
          qest: initialData.soilData?.qest ?? 0,
        },
        soilAnalysis: {
          nitrogen: initialData.soilAnalysis?.nitrogen ?? 0,
          phosphorus: initialData.soilAnalysis?.phosphorus ?? 0,
          potassium: initialData.soilAnalysis?.potassium ?? 0,
          pH: initialData.soilAnalysis?.pH ?? 7,
        }
      } : {
        name: '',
        location: '',
        area: '',
        crop: '',
        soilData: { cc: 0, pmp: 0, zr: 0, ur: 0, dap: 0, ib: 0, qest: 0 },
        soilAnalysis: { nitrogen: 0, phosphorus: 0, potassium: 0, pH: 7 }
      });
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data) => {
    // 💡 Conectamos con tu useAuthStore para obtener el ID real en lugar de harcodear un '1'
    const currentUserId = initialData?.user || useAuthStore.getState().user?.id || localStorage.getItem('userId');

    const formattedData = {
      ...data,
      area: Number(data.area),
      user: String(currentUserId), // Mongoose lo espera como String según tu esquema
      soilData: {
        cc: Number(data.soilData.cc),
        pmp: Number(data.soilData.pmp),
        zr: Number(data.soilData.zr),
        ur: Number(data.soilData.ur),
        dap: Number(data.soilData.dap),
        ib: Number(data.soilData.ib),
        qest: Number(data.soilData.qest),
      },
      soilAnalysis: {
        nitrogen: Number(data.soilAnalysis.nitrogen),
        phosphorus: Number(data.soilAnalysis.phosphorus),
        potassium: Number(data.soilAnalysis.potassium),
        pH: Number(data.soilAnalysis.pH),
      }
    };

    await onSubmit(formattedData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Editar Parcela" : "Nueva Parcela"}
    >
      {/* Sistema de Pestañas (Tabs) */}
      <div className="flex border-b border-slate-800 mb-4">
        <button
          type="button"
          className={`flex-1 py-2 text-sm font-medium border-b-2 text-center transition-colors ${activeTab === 'general'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          onClick={() => setActiveTab('general')}
        >
          Datos Generales
        </button>
        <button
          type="button"
          className={`flex-1 py-2 text-sm font-medium border-b-2 text-center transition-colors ${activeTab === 'soilData'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          onClick={() => setActiveTab('soilData')}
        >
          Parámetros de Suelo
        </button>
        <button
          type="button"
          className={`flex-1 py-2 text-sm font-medium border-b-2 text-center transition-colors ${activeTab === 'soilAnalysis'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          onClick={() => setActiveTab('soilAnalysis')}
        >
          Análisis Nutricional
        </button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">

        {/* PESTAÑA: DATOS GENERALES */}
        {activeTab === 'general' && (
          <div className="space-y-4 animate-fadeIn">
            <Input
              label="Nombre de la Parcela"
              placeholder="Ej. Lote Norte"
              {...register('name', { required: 'El nombre es requerido' })}
              error={errors.name?.message}
            />

            <Input
              label="Ubicación"
              placeholder="Ej. Coordenadas o Dirección"
              {...register('location', { required: 'La ubicación es requerida' })}
              error={errors.location?.message}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Área (ha / m²)"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('area', {
                  required: 'El área es requerida',
                  min: { value: 0.01, message: 'Mayor a 0' }
                })}
                error={errors.area?.message}
              />

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Cultivo</label>
                <select
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:outline-none"
                  {...register('crop', { required: 'Seleccione un cultivo' })}
                >
                  <option value="">Seleccione...</option>
                  {crops?.map(c => (
                    <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.crop && <p className="mt-1 text-sm text-rose-400">{errors.crop.message}</p>}
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA: PARÁMETROS TÉCNICOS (soilData) */}
        {activeTab === 'soilData' && (
          <div className="grid grid-cols-2 gap-4 animate-fadeIn">
            <Input
              label="Capacidad de Campo (CC %)"
              type="number"
              step="0.1"
              {...register('soilData.cc')}
            />
            <Input
              label="Punto Marchitez (PMP %)"
              type="number"
              step="0.1"
              {...register('soilData.pmp')}
            />
            <Input
              label="Zona Radicular (Zr cm)"
              type="number"
              step="1"
              {...register('soilData.zr')}
            />
            <Input
              label="Umbral de Riego (UR %)"
              type="number"
              step="0.1"
              {...register('soilData.ur')}
            />
            <Input
              label="Densidad Aparente (Dap g/cm³)"
              type="number"
              step="0.01"
              {...register('soilData.dap')}
            />
            <Input
              label="Infiltración Básica (Ib mm/h)"
              type="number"
              step="0.1"
              {...register('soilData.ib')}
            />
            <div className="col-span-2">
              <Input
                label="Caudal Estable (Qest L/s)"
                type="number"
                step="0.01"
                {...register('soilData.qest')}
              />
            </div>
          </div>
        )}

        {/* PESTAÑA: ANÁLISIS DE SUELO (soilAnalysis) */}
        {activeTab === 'soilAnalysis' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Nitrógeno (N)"
                type="number"
                step="0.1"
                {...register('soilAnalysis.nitrogen')}
              />
              <Input
                label="Fósforo (P)"
                type="number"
                step="0.1"
                {...register('soilAnalysis.phosphorus')}
              />
              <Input
                label="Potasio (K)"
                type="number"
                step="0.1"
                {...register('soilAnalysis.potassium')}
              />
            </div>
            <Input
              label="Potencial de Hidrógeno (pH)"
              type="number"
              step="0.1"
              placeholder="7.0"
              {...register('soilAnalysis.pH', {
                min: { value: 0, message: 'mínimo 0' },
                max: { value: 14, message: 'máximo 14' }
              })}
              error={errors.soilAnalysis?.pH?.message}
            />
          </div>
        )}

        {/* Botonera de acciones */}
        <div className="flex justify-end gap-3 mt-6 border-t border-slate-800 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={isSubmitting}>Guardar Parcela</Button>
        </div>
      </form>
    </Modal>
  );
};