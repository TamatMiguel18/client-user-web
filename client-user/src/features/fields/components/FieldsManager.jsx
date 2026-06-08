import React, { useEffect, useState } from 'react';
import { useFieldStore } from '../store/useFieldStore';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Loader } from '../../../shared/components/ui/Loader';
import { FieldFormModal } from './FieldFormModal';
import { FieldDetailsModal } from './FieldDetailsModal';
import { Map, MapPin, Ruler, Layers, Plus, Trash2, Edit2, Eye, Power } from 'lucide-react';
import toast from 'react-hot-toast';

export const FieldsManager = () => {
  const { fields, isLoading, error, fetchFields, addField, editField, removeField, activateField } = useFieldStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [detailsField, setDetailsField] = useState(null);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  // Mostrar todos los campos, sin importar si están activos o no
  const allFields = fields || [];

  const handleOpenModal = (field = null) => {
    setEditingField(field);
    setIsModalOpen(true);
  };

  const handleSaveField = async (data) => {
    try {
      if (editingField) {
        await editField(editingField.id || editingField._id, data);
        toast.success('Parcela actualizada');
      } else {
        await addField(data);
        toast.success('Parcela creada');
      }
      fetchFields(); // Refresh
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeField(id);
      toast.success('Parcela desactivada');
      fetchFields();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateField(id);
      toast.success('Parcela activada de nuevo');
      fetchFields();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isLoading && allFields.length === 0) return <Loader />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-2">
            <Map className="text-emerald-500" />
            Mis Parcelas
          </h2>
          <p className="text-slate-400 mt-1">Administra tus áreas de cultivo.</p>
        </div>

        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={18} /> Nueva Parcela
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
          <p>{error}</p>
          <button onClick={fetchFields} className="mt-2 text-sm underline">Reintentar</button>
        </div>
      )}

      {allFields.length === 0 && !error ? (
        <div className="text-center py-12 bg-slate-900/20 rounded-xl border border-dashed border-slate-700">
          <Map size={48} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400 font-medium">Aún no tienes parcelas registradas.</p>
          <Button onClick={() => handleOpenModal()} variant="outline" className="mt-4">Crear mi primera parcela</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {allFields.map((field) => (
            <Card key={field.id || field._id} hover className={`border-t-4 border-t-emerald-500 flex flex-col h-full transition-all duration-300 ${field.isActive === false ? 'opacity-60 grayscale-[0.8] hover:grayscale-0 hover:opacity-100' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-200">{field.name}</h3>
                  <span className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${field.isActive !== false ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                    {field.isActive !== false ? 'Estado: Activo' : 'Estado: Inactivo'}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenModal(field)}
                    className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  {field.isActive !== false ? (
                    <button
                      onClick={() => handleDelete(field.id || field._id)}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                      title="Desactivar Parcela"
                    >
                      <Trash2 size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivate(field.id || field._id)}
                      className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
                      title="Activar Parcela"
                    >
                      <Power size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3 flex-grow mb-5">
                <div className="flex items-center gap-2 text-slate-400">
                  <Layers size={18} className="text-emerald-500" />
                  <span className="text-sm font-medium text-slate-300">
                    Cultivo: <span className="text-emerald-400 font-bold">{field.crop?.name || 'Suelo asignado'}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Ruler size={18} className="text-blue-400" />
                  <span className="text-sm">{field.area} hectáreas</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin size={18} className="text-rose-400" />
                  <span className="text-sm truncate" title={field.location}>{field.location}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 mt-auto">
                <button
                  onClick={() => setDetailsField(field)}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-emerald-400 bg-slate-900/50 hover:bg-emerald-500/10 py-2.5 rounded-xl transition-all border border-transparent hover:border-emerald-500/20"
                >
                  <Eye size={16} /> Ver Detalles Completos
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <FieldFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveField}
        initialData={editingField}
      />

      <FieldDetailsModal
        isOpen={!!detailsField}
        onClose={() => setDetailsField(null)}
        field={detailsField}
      />
    </div>
  );
};
