import React from 'react';
import { Card } from '../../../shared/components/ui/Card';
import { Droplet, ThermometerSun, Leaf } from 'lucide-react';

export const ReportCard = ({ report }) => {
    // Desestructuramos los datos del reporte (vienen de tu esquema de Mongoose)
    const { nombreCultivo, humidity, temperature, alertType, createdAt } = report;

    // Formateamos la fecha de creación de manera limpia (ej: "06 jun, 14:00")
    const fechaFormateada = createdAt
        ? new Date(createdAt).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        })
        : '';

    // Configuración visual según el tipo de alerta ('bien' o 'mal')
    const esEstadoCorrecto = alertType === 'bien';
    const estadoEstilos = esEstadoCorrecto
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        : 'bg-rose-500/10 text-rose-400 border-rose-500/20';

    return (
        <div className="w-full max-w-sm">
            <Card hover>
                {/* Encabezado: Nombre del Cultivo y Estado */}
                <div className='flex justify-between items-center mb-5'>
                    <div className='flex items-center gap-2'>
                        <Leaf className='w-5 h-5 text-emerald-400' />
                        <h3 className='text-xl font-bold text-slate-200 capitalize'>
                            {nombreCultivo || 'Cultivo de prueba'}
                        </h3>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${estadoEstilos}`}>
                        {esEstadoCorrecto ? 'Estable' : 'Alerta'}
                    </span>
                </div>

                {/* Métricas principales: Temperatura y Humedad */}
                <div className='grid grid-cols-2 gap-4 mb-4'>
                    {/* Sección Temperatura */}
                    <div className='flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50'>
                        <div className='p-2 bg-orange-500/10 text-orange-400 rounded-lg'>
                            <ThermometerSun className='w-5 h-5' />
                        </div>
                        <div>
                            <p className='text-xs text-slate-400 font-medium'>Temperatura</p>
                            <p className='text-lg font-semibold text-slate-200'>{temperature}°C</p>
                        </div>
                    </div>

                    {/* Sección Humedad */}
                    <div className='flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50'>
                        <div className='p-2 bg-blue-500/10 text-blue-400 rounded-lg'>
                            <Droplet className='w-5 h-5' />
                        </div>
                        <div>
                            <p className='text-xs text-slate-400 font-medium'>Humedad</p>
                            <p className='text-lg font-semibold text-slate-200'>{humidity}%</p>
                        </div>
                    </div>
                </div>

                {/* Pie de tarjeta: Fecha del reporte */}
                {fechaFormateada && (
                    <div className='text-right border-t border-slate-800 pt-3'>
                        <span className='text-xs text-slate-500 font-medium'>{fechaFormateada}</span>
                    </div>
                )}
            </Card>
        </div>
    );
}