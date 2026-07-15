import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Loader2, ThermometerSun } from 'lucide-react';
import { useAuthStore } from '../../auth/store/authStore';

export const WeatherWidget = () => {
  const { user } = useAuthStore();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState(user?.municipality || 'Tu Ubicación');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        // Intentar obtener coordenadas de la ubicación del usuario usando Open-Meteo Geocoding
        let lat = 14.6349; // Default: Ciudad de Guatemala
        let lon = -90.5069;
        
        if (user?.municipality) {
          // Si tiene aldea, buscar por aldea + municipio para mayor precisión
          const searchQuery = user.village 
            ? `${user.village}, ${user.municipality}` 
            : user.municipality;
            
          const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1&language=es&format=json`);
          const geoData = await geoRes.json();
          if (geoData.results && geoData.results.length > 0) {
            lat = geoData.results[0].latitude;
            lon = geoData.results[0].longitude;
            setLocationName(geoData.results[0].name);
          } else if (user.village) {
             // Fallback si la aldea no se encuentra, intentar solo con el municipio
             const fallbackRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(user.municipality)}&count=1&language=es&format=json`);
             const fallbackData = await fallbackRes.json();
             if (fallbackData.results && fallbackData.results.length > 0) {
                lat = fallbackData.results[0].latitude;
                lon = fallbackData.results[0].longitude;
                setLocationName(`${user.village} (${fallbackData.results[0].name})`);
             }
          }
        }

        // Obtener clima de Open-Meteo
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`);
        
        if (!weatherRes.ok) throw new Error('Error al obtener el clima');
        const data = await weatherRes.json();
        setWeatherData(data);
        setError(null);
      } catch (err) {
        console.error("Weather fetch error", err);
        setError("No se pudo cargar el clima. Revisa tu conexión.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [user]);

  // Helper para interpretar el código del clima (WMO code)
  const getWeatherInfo = (code, isDay = 1) => {
    if (code === 0) return { label: 'Despejado', icon: <Sun className="text-amber-400" size={40} /> };
    if (code >= 1 && code <= 3) return { label: 'Parcialmente Nublado', icon: <Cloud className="text-slate-400" size={40} /> };
    if (code >= 51 && code <= 67) return { label: 'Lluvia Ligera', icon: <CloudRain className="text-blue-400" size={40} /> };
    if (code >= 80 && code <= 82) return { label: 'Aguaceros', icon: <CloudRain className="text-indigo-500" size={40} /> };
    if (code >= 95) return { label: 'Tormenta', icon: <CloudRain className="text-purple-500" size={40} /> };
    return { label: 'Nublado', icon: <Cloud className="text-slate-400" size={40} /> };
  };

  if (loading) {
    return (
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center h-[300px]">
        <Loader2 className="animate-spin text-emerald-500 mb-4" size={32} />
        <p className="text-sm text-slate-500 font-medium">Buscando el cielo en tu zona...</p>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 h-[300px] flex items-center justify-center">
        <p className="text-slate-500 text-sm text-center">{error}</p>
      </div>
    );
  }

  const currentInfo = getWeatherInfo(weatherData.current.weather_code, weatherData.current.is_day);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 shadow-sm border border-blue-100 dark:border-slate-700 relative overflow-hidden transition-colors duration-300">
      
      {/* Fondo decorativo */}
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/20 dark:bg-white/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-1">{locationName}</h3>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Pronóstico Local</p>
        </div>
        <div className="p-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-white/40 dark:border-white/5">
          {currentInfo.icon}
        </div>
      </div>

      <div className="relative z-10 flex items-end gap-3 mb-8">
        <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
          {Math.round(weatherData.current.temperature_2m)}°
        </span>
        <div className="mb-2">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{currentInfo.label}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Sensación térmica ideal</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6 relative z-10">
        <div className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-2xl border border-white/50 dark:border-white/5 flex flex-col items-center justify-center text-center">
          <Droplets size={18} className="text-blue-500 mb-1" />
          <span className="text-[10px] text-slate-500 font-bold uppercase">Humedad</span>
          <span className="text-sm font-black text-slate-800 dark:text-slate-200">{weatherData.current.relative_humidity_2m}%</span>
        </div>
        <div className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-2xl border border-white/50 dark:border-white/5 flex flex-col items-center justify-center text-center">
          <Wind size={18} className="text-teal-500 mb-1" />
          <span className="text-[10px] text-slate-500 font-bold uppercase">Viento</span>
          <span className="text-sm font-black text-slate-800 dark:text-slate-200">{Math.round(weatherData.current.wind_speed_10m)} km/h</span>
        </div>
        <div className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-2xl border border-white/50 dark:border-white/5 flex flex-col items-center justify-center text-center">
          <CloudRain size={18} className="text-indigo-500 mb-1" />
          <span className="text-[10px] text-slate-500 font-bold uppercase">Lluvia</span>
          <span className="text-sm font-black text-slate-800 dark:text-slate-200">{weatherData.current.precipitation} mm</span>
        </div>
      </div>

      {/* Próximos 3 días */}
      <div className="space-y-3 relative z-10 pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Próximos días</p>
        {[1, 2, 3].map((dayIndex) => {
          const date = new Date(weatherData.daily.time[dayIndex]);
          const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(date);
          const maxT = Math.round(weatherData.daily.temperature_2m_max[dayIndex]);
          const minT = Math.round(weatherData.daily.temperature_2m_min[dayIndex]);
          const rain = weatherData.daily.precipitation_sum[dayIndex];
          
          // Icono miniatura
          const miniIcon = getWeatherInfo(weatherData.daily.weather_code[dayIndex]);

          return (
            <div key={dayIndex} className="flex justify-between items-center px-2 py-1">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-12 capitalize">{dayName}</span>
              <div className="flex items-center gap-2">
                <div className="scale-50 origin-center -mx-2">
                  {miniIcon.icon}
                </div>
                {rain > 0 && <span className="text-[10px] text-blue-500 font-bold">{rain}mm</span>}
              </div>
              <div className="flex gap-3 text-sm font-semibold w-16 justify-end">
                <span className="text-slate-400">{minT}°</span>
                <span className="text-slate-800 dark:text-slate-100">{maxT}°</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
