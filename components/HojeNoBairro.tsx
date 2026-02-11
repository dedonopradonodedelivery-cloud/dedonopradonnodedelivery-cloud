
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  ChevronRight,
  Sun
} from 'lucide-react';
import { useNeighborhood } from '../contexts/NeighborhoodContext';

export const HojeNoBairro: React.FC = () => {
  const { currentNeighborhood } = useNeighborhood();
  const [temperature, setTemperature] = useState<string>('--°C');
  const [conditionText, setConditionText] = useState<string>('CARREGANDO');
  const [trafficStatus, setTrafficStatus] = useState<{label: string, color: string}>({label: 'FLUINDO', color: 'bg-emerald-500'});

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
          if (code === 0) setConditionText('ENSOLARADO');
          else if (code >= 1 && code <= 3) setConditionText('NUBLADO');
          else if (code >= 51) setConditionText('CHUVOSO');
          else setConditionText('PARCIAL');
        }
      } catch (error) {
        setTemperature('27°C');
        setConditionText('ENSOLARADO');
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
        return { label: 'INTENSO', color: 'bg-red-500' };
      } else if (hour >= 11 && hour <= 14) {
        return { label: 'MODERADO', color: 'bg-amber-500' };
      }
      return { label: 'FLUINDO', color: 'bg-emerald-500' };
    };
    setTrafficStatus(getTraffic());
  }, []);

  return (
    <section className="px-5 pt-6 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* TÍTULO DA SEÇÃO */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
          Hoje no bairro
        </h2>
        <div className="flex items-center gap-1.5">
           <Sun size={14} className="text-amber-500 fill-amber-500" />
           <span className="text-sm font-black text-gray-900 dark:text-white">{temperature}</span>
        </div>
      </div>

      {/* NÍVEL 1: INFORMAÇÕES CONTEXTUAIS EM LINHA */}
      <div className="bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl p-3 mb-2 border border-gray-100 dark:border-gray-800 flex items-center justify-between overflow-x-auto no-scrollbar whitespace-nowrap gap-4 shadow-inner">
        <div className="flex items-center gap-2">
            <MapPin size={12} className="text-[#1E5BFF]" fill="currentColor" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                {currentNeighborhood === "Jacarepaguá (todos)" ? "JPA" : currentNeighborhood.toUpperCase()}
            </p>
        </div>

        <span className="text-gray-200 dark:text-gray-800">/</span>

        <div className="flex items-center gap-2">
            <p className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest leading-none">
                {conditionText}
            </p>
        </div>

        <span className="text-gray-200 dark:text-gray-800">/</span>

        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${trafficStatus.color} shadow-sm animate-pulse`}></div>
            <p className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest leading-none">
                TRÂNSITO {trafficStatus.label}
            </p>
            <ChevronRight size={10} className="text-gray-300" />
        </div>
      </div>
    </section>
  );
};
