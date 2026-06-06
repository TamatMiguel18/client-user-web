import React, { useEffect, useState } from 'react';
import { useFieldStore } from '../store/useFieldStore';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Loader } from '../../../shared/components/ui/Loader';
import { FieldFormModal } from './FieldFormModal';
import { Map, MapPin, Ruler, Layers, Plus, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const FieldsManager = () => {
  const { fields, isLoading, error, fetchFields, addField, editField, removeField } = useFieldStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const activeFields = fields?.filter(f => f.estado !== false) || [];

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
    if (window.confirm('¿Estás seguro de que deseas desactivar esta parcela?')) {
      try {
        await removeField(id);
        toast.success('Parcela desactivada');
        fetchFields();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  if (isLoading && activeFields.length === 0) return <Loader />;

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

      {activeFields.length === 0 && !error ? (
        <div className="text-center py-12 bg-slate-900/20 rounded-xl border border-dashed border-slate-700">
          <Map size={48} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400 font-medium">Aún no tienes parcelas registradas.</p>
          <Button onClick={() => handleOpenModal()} variant="outline" className="mt-4">Crear mi primera parcela</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeFields.map((field) => (
            <Card key={field.id || field._id} hover className="border-t-4 border-t-emerald-500">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-200">{field.name}</h3>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleOpenModal(field)}
                    className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(field.id || field._id)}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin size={18} className="text-rose-400" />
                  <span className="text-sm">{field.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Ruler size={18} className="text-blue-400" />
                  <span className="text-sm">{field.area} hectáreas</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Layers size={18} className="text-emerald-500" />
                  <span className="text-sm">{field.crop?.name ? `Cultivo: ${field.crop.name}` : 'Suelo asignado'}</span>
                </div>
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
    </div>
  );
};
