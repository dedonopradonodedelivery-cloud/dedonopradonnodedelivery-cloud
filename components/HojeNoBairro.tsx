
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Sun,
  Cloud,
  CloudRain,
  Navigation2
} from 'lucide-react';
import { useNeighborhood } from '../contexts/NeighborhoodContext';

export const HojeNoBairro: React.FC = () => {
  const { currentNeighborhood } = useNeighborhood();
  const [temperature, setTemperature] = useState<string>('--°C');
  const [conditionText, setConditionText] = useState<string>('Carregando');
  const [trafficStatus, setTrafficStatus] = useState<{label: string, color: string}>({label: 'Fluindo', color: 'bg-emerald-500'});

  // 1. Lógica de Clima Real (Open-Meteo API)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-22.9329&longitude=-43.3456&current_weather=true'
        );
        const data = await response.json();
        if (data.current_weather) {
          setTemperature(`${Math.round(data.current_weather.temperature)}°C`);
          
          const code = data.current_weather.weathercode;
          if (code === 0) setConditionText('Ensolarado');
          else if (code >= 1 && code <= 3) setConditionText('Nublado');
          else if (code >= 51) setConditionText('Chuvoso');
          else setConditionText('Parcial');
        }
      } catch (error) {
        setTemperature('27°C');
        setConditionText('Ensolarado');
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); 
    return () => clearInterval(interval);
  }, []);

  // 2. Lógica de Trânsito Dinâmica (Baseada em Horário)
  useEffect(() => {
    const getTraffic = () => {
      const hour = new Date().getHours();
      if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
        return { label: 'Intenso', color: 'bg-red-500' };
      } else if (hour >= 11 && hour <= 14) {
        return { label: 'Moderado', color: 'bg-amber-500' };
      }
      return { label: 'Fluindo', color: 'bg-emerald-500' };
    };
    setTrafficStatus(getTraffic());
  }, []);

  const getConditionIcon = () => {
    if (conditionText === 'Nublado') return <Cloud size={12} className="text-gray-400" />;
    if (conditionText === 'Chuvoso') return <CloudRain size={12} className="text-blue-400" />;
    return <Sun size={12} className="text-amber-500" />;
  };

  return (
    <section className="px-5 pt-6 animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="bg-gray-50/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-3 border border-gray-100 dark:border-gray-800 flex items-center justify-center gap-3 overflow-x-auto no-scrollbar shadow-sm">
        
        {/* Localização */}
        <div className="flex items-center gap-1.5 shrink-0">
            <MapPin size={12} className="text-[#1E5BFF]" fill="currentColor" />
            <span className="text-[11px] font-bold text-gray-900 dark:text-white">
                {currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}
            </span>
        </div>

        <span className="text-gray-300 dark:text-gray-700 font-light">•</span>

        {/* Clima */}
        <div className="flex items-center gap-1.5 shrink-0">
            {getConditionIcon()}
            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">
                {conditionText}
            </span>
        </div>

        <span className="text-gray-300 dark:text-gray-700 font-light">•</span>

        {/* Trânsito */}
        <div className="flex items-center gap-1.5 shrink-0">
            <div className={`w-1.5 h-1.5 rounded-full ${trafficStatus.color} shadow-[0_0_8px_rgba(0,0,0,0.1)]`}></div>
            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">
                Trânsito {trafficStatus.label}
            </span>
        </div>

        <span className="text-gray-300 dark:text-gray-700 font-light">•</span>

        {/* Temperatura */}
        <div className="flex items-center gap-1 shrink-0">
            <span className="text-[11px] font-black text-gray-900 dark:text-white">
                {temperature}
            </span>
        </div>

      </div>
    </section>
  );
};
