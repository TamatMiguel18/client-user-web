import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { useAuthStore } from '../../auth/store/authStore';
import { useDevicesStore } from '../store/devicesStore';

export const DeviceRegisterModal = ({ isOpen, onClose, isDismissible = true }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const { user } = useAuthStore();
  const { registerNewDevice } = useDevicesStore();

  useEffect(() => {
    if (isOpen) {
      reset({
        deviceId: '',
        name: '',
        description: ''
      });
    }
  }, [isOpen, reset]);

  const handleFormSubmit = async (data) => {
    const currentUserId = user?.uid || user?.id || user?._id || localStorage.getItem('userId');
    console.log('Current User ID:', currentUserId); // Debugging line
    
    if (!currentUserId) {
      toast.error('Sesión inválida');
      return;
    }

    const payload = {
      ...data,
      userId: currentUserId
    };

    const result = await registerNewDevice(payload);
    
    if (result.success) {
      toast.success(result.message || 'Dispositivo registrado con éxito');
      if (isDismissible && onClose) {
        onClose();
      }
    } else {
      toast.error(result.message || 'Error al registrar dispositivo');
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Información para el usuario nuevo */}
      {!isDismissible && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <h4 className="text-emerald-400 font-bold mb-2">¡Bienvenido a SmartGrowGT!</h4>
          <p className="text-sm text-slate-300">
            Para comenzar a utilizar la plataforma, es obligatorio que vincules tu primer dispositivo 
            (Raspberry Pi Pico W) ingresando su identificador físico.
          </p>
        </div>
      )}

      <Input
        label="ID Único del Dispositivo (Hardware ID)"
        placeholder="Ej. SG-F2D6 o SG-E6614103E735"
        {...register('deviceId', { 
          required: 'El ID del dispositivo es requerido',
          minLength: { value: 6, message: 'El ID debe tener al menos 6 caracteres' }
        })}
        error={errors.deviceId?.message}
      />

      <Input
        label="Nombre del Dispositivo / Parcela"
        placeholder="Ej. Lote Sur Principal"
        {...register('name', { 
          required: 'El nombre es requerido',
          minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres' }
        })}
        error={errors.name?.message}
      />

      <div className="w-full">
        <label className="block text-sm font-medium text-slate-300 mb-1">Descripción</label>
        <textarea
          className={`w-full px-4 py-3 bg-slate-950 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors placeholder:text-slate-600 resize-none h-24 ${
            errors.description ? 'border-rose-500/50 text-rose-200 focus:ring-rose-500/50' : 'border-slate-800 text-slate-200'
          }`}
          placeholder="Ej. Sensor de humedad y pH en cultivo de tomates"
          {...register('description', { 
            required: 'La descripción es requerida',
            minLength: { value: 10, message: 'La descripción debe tener al menos 10 caracteres' }
          })}
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-rose-400">{errors.description.message}</p>}
      </div>

      <div className="flex justify-end gap-3 mt-6 border-t border-slate-800 pt-4">
        {isDismissible && (
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {isDismissible ? 'Registrar Dispositivo' : 'Vincular y Comenzar'}
        </Button>
      </div>
    </form>
  );

  // If it's dismissible, wrap in the standard Modal
  if (isDismissible) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Registrar Dispositivo">
        {formContent}
      </Modal>
    );
  }

  // If it's NOT dismissible (Interceptor mode), render a full-screen blocking overlay
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center p-4 sm:p-6">
      {/* Dark backdrop matching the premium theme */}
      <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl" />
      
      {/* Onboarding Card */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-[3rem] bg-slate-900 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 animate-fadeIn">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="px-8 py-8 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                <rect x="9" y="9" width="6" height="6"></rect>
                <line x1="9" y1="1" x2="9" y2="4"></line>
                <line x1="15" y1="1" x2="15" y2="4"></line>
                <line x1="9" y1="20" x2="9" y2="23"></line>
                <line x1="15" y1="20" x2="15" y2="23"></line>
                <line x1="20" y1="9" x2="23" y2="9"></line>
                <line x1="20" y1="14" x2="23" y2="14"></line>
                <line x1="1" y1="9" x2="4" y2="9"></line>
                <line x1="1" y1="14" x2="4" y2="14"></line>
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white">Vincular Dispositivo</h3>
          </div>
          
          {formContent}
        </div>
      </div>
    </div>
  );
};
