import React, { useEffect, useState } from 'react';
import { useReportsStore } from '../store/useReportsStore'; // Tu store para reportes
import { ReportCard } from './ReportsCards';
import { Loader } from '../../../shared/components/ui/Loader';
import { Search, ClipboardList, AlertCircle } from 'lucide-react';
import { Input } from '../../../shared/components/ui/Input';

export const ReportsList = () => {
    // Consumimos el estado global de reportes
    const { reports, isLoading, error, fetchReports } = useReportsStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAlert, setFilterAlert] = useState('all'); // Filtro extra por estado ('all', 'bien', 'mal')

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    // Filtrado inteligente: Por nombre de cultivo y opcionalmente por tipo de alerta
    const filteredReports = reports?.filter(report => {
        const matchesSearch = report.nombreCultivo?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAlert = filterAlert === 'all' || report.alertType === filterAlert;

        return matchesSearch && matchesAlert;
    }) || [];

    if (isLoading) return <Loader />;

    if (error) {
        return (
            <div className="bg-rose-500/10 text-rose-400 p-4 rounded-xl text-center border border-rose-500/20 max-w-md mx-auto">
                <p className="font-medium">{error}</p>
                <button
                    onClick={fetchReports}
                    className="mt-2 text-sm underline hover:text-rose-300 transition-colors"
                >
                    Reintentar cargar reportes
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Encabezado e Inputs de Filtro */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-200">Historial de Reportes</h2>
                    <p className="text-slate-400 mt-1">Monitorea las lecturas de temperatura, humedad y alertas de tus dispositivos.</p>
                </div>

                {/* Barra de búsqueda y select de alertas */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    {/* Input Buscador */}
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Buscar por cultivo..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Selector de Estado (Bien/Mal) */}
                    <select
                        value={filterAlert}
                        onChange={(e) => setFilterAlert(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="bien">Estables (Bien)</option>
                        <option value="mal">Alertas (Mal)</option>
                    </select>
                </div>
            </div>

            {/* Grid de Reportes o Estado Vacío */}
            {filteredReports.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/20 rounded-xl border border-dashed border-slate-700">
                    <ClipboardList size={48} className="mx-auto text-slate-600 mb-3" />
                    <p className="text-slate-400 font-medium">No se encontraron reportes.</p>
                    {(searchTerm || filterAlert !== 'all') && (
                        <p className="text-sm text-slate-500 mt-1">Intenta ajustando los filtros de búsqueda.</p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredReports.map((report) => (
                        <ReportCard
                            key={report.id || report._id}
                            report={report}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};