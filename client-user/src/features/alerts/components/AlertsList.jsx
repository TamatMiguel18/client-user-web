import React, { useEffect, useState } from 'react';
import { Search, RefreshCw, X, Cpu } from 'lucide-react';
import { useAlertStore } from '../store/useAlertStore';
import { AlertCard } from './AlertCard';
import { Loader } from '../../../shared/components/ui/Loader';
import { Input } from '../../../shared/components/ui/Input';

export const AlertsList = () => {
  const { alerts, isLoading, error, fetchAlerts } = useAlertStore();
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const filteredAlerts = alerts.filter((alert) => {
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch =
      alert._id?.toLowerCase().includes(searchValue) ||
      alert.deviceId?.deviceId?.toLowerCase().includes(searchValue) ||
      alert.deviceId?.name?.toLowerCase().includes(searchValue) ||
      alert.fieldId?.name?.toLowerCase().includes(searchValue) ||
      alert.description?.toLowerCase().includes(searchValue);

    const matchesType = filterType === 'all' || alert.alertType === filterType;

    return matchesSearch && matchesType;
  });

  if (isLoading) return <Loader fullScreen />;

  return (
    <div className="min-h-full bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="mb-10 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 mb-2">
            Alertas
          </h1>
          <p className="text-slate-400">Control total: Alertas de los Campos</p>
        </div>
        <button
          type="button"
          onClick={fetchAlerts}
          className="bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-all"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-500" size={18} />
          <Input
            type="text"
            placeholder="Buscar por ID, Hardware o Campo..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              filterType === 'all' ? 'bg-slate-700' : 'bg-slate-900'
            }`}
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => setFilterType('bad')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              filterType === 'bad' ? 'bg-red-900/40 text-red-400' : 'bg-slate-900'
            }`}
          >
            Alertas Malas
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
          <p>{error}</p>
          <button
            type="button"
            onClick={fetchAlerts}
            className="mt-2 text-sm underline hover:text-red-700"
          >
            Reintentar
          </button>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-10 text-center text-slate-400">
          <p className="text-lg font-semibold text-slate-200">No se encontraron alertas.</p>
          <p className="mt-2 text-sm">Prueba con otro término de búsqueda o refresca para obtener datos nuevos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlerts.map((alert) => (
            <AlertCard key={alert._id || alert.id} alert={alert} onSelect={setSelectedAlert} />
          ))}
        </div>
      )}

      {selectedAlert && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-8 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedAlert(null)}
              className="absolute top-4 right-4 text-slate-400"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Cpu className="text-red-500" /> Diagnóstico del Campo
            </h2>
            {selectedAlert.createdAt && (
              <p className="text-sm text-slate-500 mb-6">
                Fecha y hora: {new Date(selectedAlert.createdAt).toLocaleString('es-ES', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            )}

            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-xs uppercase font-bold mb-2">Descripción de la Alerta</p>
                <p className="text-sm text-slate-300 font-mono italic">"{selectedAlert.description}"</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <p className="text-slate-400 text-xs uppercase font-bold">Temperatura</p>
                  <p className="text-2xl font-bold text-orange-400">{selectedAlert.temperature}°C</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <p className="text-slate-400 text-xs uppercase font-bold">Humedad</p>
                  <p className="text-2xl font-bold text-blue-400">{selectedAlert.humidity}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
