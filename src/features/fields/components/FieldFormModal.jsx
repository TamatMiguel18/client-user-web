import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';

import { useCropStore } from '../../crops/store/useCropStore';

export const FieldFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const { crops, fetchCrops } = useCropStore();

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  useEffect(() => {
    if (isOpen) {
      reset(initialData || {
        name: '',
        location: '',
        area: '',
        crop: ''
      });
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data) => {
    await onSubmit({
      ...data,
      area: Number(data.area)
    });
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? "Editar Parcela" : "Nueva Parcela"}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
            label="Área (ha)"
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
              {...register('crop', { required: 'Seleccione' })}
            >
              <option value="">Seleccione...</option>
              {crops?.map(c => (
                <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
              ))}
            </select>
            {errors.crop && <p className="mt-1 text-sm text-rose-400">{errors.crop.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={isSubmitting}>Guardar</Button>
        </div>
      </form>
    </Modal>
  );
};
