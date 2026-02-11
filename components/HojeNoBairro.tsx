
import React, { useState, useEffect } from 'react';
import { CloudSun, Car, MapPin, Zap } from 'lucide-react';
import { useNeighborhood } from '../contexts/NeighborhoodContext';

export const HojeNoBairro: React.FC = () => {
  const { currentNeighborhood } = useNeighborhood();
  const [temperature, setTemperature] = useState<string>('--°C');
  const [trafficStatus, setTrafficStatus] = useState<string>('CARREGANDO');
  const [userLocation, setUserLocation] = useState<string>('');

  // 1. Lógica de Clima Real (Open-Meteo API - Gratuita/Sem Key)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Coordenadas aproximadas de Jacarepaguá
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-22.9329&longitude=-43.3456&current_weather=true'
        );
        const data = await response.json();
        if (data.current_weather) {
          setTemperature(`${Math.round(data.current_weather.temperature)}°C`);
        }
      } catch (error) {
        setTemperature('28°C'); // Fallback estático caso a API falhe
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // Atualiza a cada 10 min
    return () => clearInterval(interval);
  }, []);

  // 2. Lógica de Trânsito Dinâmica (Baseada em Horário)
  useEffect(() => {
    const getTraffic = () => {
      const hour = new Date().getHours();
      if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
        return 'INTENSO';
      } else if (hour >= 11 && hour <= 14) {
        return 'MODERADO';
      }
      return 'FLUINDO';
    };
    setTrafficStatus(getTraffic());
  }, []);

  // 3. Lógica de Bairro Dinâmico
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Em um app real, faríamos geocoding aqui. 
        // Para o MVP, validamos que a permissão existe e usamos o bairro do contexto como nome real.
        setUserLocation(currentNeighborhood === "Jacarepaguá (todos)" ? "JPA" : currentNeighborhood.toUpperCase());
      }, () => {
        setUserLocation(currentNeighborhood === "Jacarepaguá (todos)" ? "SUA REGIÃO" : currentNeighborhood.toUpperCase());
      });
    } else {
      setUserLocation(currentNeighborhood.toUpperCase());
    }
  }, [currentNeighborhood]);

  return (
    <section className="px-5 pt-4 mb-2">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-3 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-2 whitespace-nowrap overflow-x-auto no-scrollbar">
          
          {/* ITEM 1: LOCALIZAÇÃO */}
          <div className="flex items-center gap-1.5 shrink-0">
            <MapPin size={10} className="text-[#1E5BFF]" fill="currentColor" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              HOME EM <span className="text-gray-900 dark:text-white">{userLocation}</span>
            </p>
          </div>

          <span className="text-gray-200 dark:text-gray-700 font-light">/</span>

          {/* ITEM 2: CLIMA */}
          <div className="flex items-center gap-1.5 shrink-0">
            <CloudSun size={10} className="text-amber-500" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              AGORA <span className="text-gray-900 dark:text-white">{temperature}</span>
            </p>
          </div>

          <span className="text-gray-200 dark:text-gray-700 font-light">/</span>

          {/* ITEM 3: TRÂNSITO */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Car size={10} className="text-blue-500" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              TRÂNSITO <span className={trafficStatus === 'INTENSO' ? 'text-red-500' : 'text-emerald-500'}>{trafficStatus}</span>
            </p>
          </div>

        </div>
      </div>

      {/* Alerta de Utilidade sutil (Mantido porém mais compacto) */}
      <div className="mt-2 px-1 flex items-center gap-2 opacity-60">
        <Zap size={10} className="text-[#1E5BFF]" fill="currentColor" />
        <p className="text-[8px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">
          Linha Amarela sem restrições.
        </p>
      </div>
    </section>
  );
};
