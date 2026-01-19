
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Zap, Wrench, Hammer, PaintRoller, User, Car, Droplet, Key, Truck, Shield, Smartphone, Laptop, Wifi, Dog, Scissors, Sparkles, Briefcase, Scale, Calculator, PenTool, Truck as TruckIcon, Flower, Search, Star, ShieldCheck, Rocket } from 'lucide-react';
import { MOCK_BANNER_CAMPAIGNS } from '../constants';
import { BannerCampaign } from '../types';

interface SubcategoriesViewProps {
  macroId: string;
  macroName: string;
  onBack: () => void;
  onSelectSubcategory: (subName: string) => void;
}

// Icon mapper for dynamic icons in banners
const IconMapper: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const icons: any = {
    Key: Key,
    PaintRoller: PaintRoller,
    Scissors: Scissors,
    ShieldCheck: ShieldCheck,
    Rocket: Rocket,
    Zap: Zap,
    Hammer: Hammer,
    User: User,
    Car: Car,
    Droplet: Droplet,
    Truck: Truck,
    Shield: Shield,
    Smartphone: Smartphone,
    Laptop: Laptop,
    Wifi: Wifi,
    Dog: Dog,
    Briefcase: Briefcase,
    Scale: Scale,
    Calculator: Calculator,
    PenTool: PenTool,
    TruckIcon: TruckIcon,
    Flower: Flower,
    Search: Search,
    Star: Star,
  };
  const Icon = icons[name] || Star;
  return <Icon className={className} />;
};

const SubcategoryCarousel: React.FC<{ macroId: string }> = ({ macroId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter banners relevant to this category (or global ones if we had them)
  const banners = useMemo(() => {
    return MOCK_BANNER_CAMPAIGNS.filter(
      (b) => (b.categoryTarget === macroId || b.categoryTarget === 'all') && b.status === 'active'
    );
  }, [macroId]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="px-5 mb-6">
      <div className="relative h-32 w-full overflow-hidden rounded-[2rem] shadow-lg bg-gray-100 dark:bg-gray-800">
        {banners.map((banner, index) => {
          // Template Logic
          const isModern = banner.templateId === 'modern';
          const isBold = banner.templateId === 'bold';
          const isMinimal = banner.templateId === 'minimal';

          return (
            <div
              key={banner.id}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out flex items-center px-6 gap-5 ${
                index === currentIndex 
                  ? 'opacity-100 translate-x-0' 
                  : index < currentIndex 
                    ? 'opacity-0 -translate-x-full' 
                    : 'opacity-0 translate-x-full'
              } ${banner.content.bgColor}`}
            >
              {isModern && (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/10 text-white">
                    <IconMapper name={banner.content.iconName} className="w-8 h-8" />
                  </div>
                  <div className={banner.content.textColor}>
                    <h3 className="font-black text-lg uppercase tracking-tight leading-tight">{banner.content.title}</h3>
                    <p className="text-xs font-medium opacity-80">{banner.content.subtitle}</p>
                  </div>
                </>
              )}

              {isBold && (
                <div className={`w-full flex flex-col items-center justify-center text-center ${banner.content.textColor}`}>
                   <h3 className="font-black text-2xl uppercase tracking-tighter leading-none mb-1">{banner.content.title}</h3>
                   <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                      <IconMapper name={banner.content.iconName} className="w-4 h-4" />
                      <p className="text-xs font-bold uppercase tracking-widest">{banner.content.subtitle}</p>
                   </div>
                </div>
              )}

              {isMinimal && (
                <div className={`w-full flex items-center justify-between ${banner.content.textColor}`}>
                   <div>
                      <h3 className="font-bold text-xl tracking-tight leading-tight">{banner.content.title}</h3>
                      <p className="text-xs opacity-70 mt-1">{banner.content.subtitle}</p>
                   </div>
                   <IconMapper name={banner.content.iconName} className="w-10 h-10 opacity-80" />
                </div>
              )}
            </div>
          );
        })}
        
        {/* Indicadores */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {banners.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-white' : 'w-1 bg-white/40'}`} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Static Data for Subcategories
const SUBCATEGORIES_DATA: Record<string, { name: string; icon: React.ElementType }[]> = {
  'emergency': [
    { name: 'Chaveiro 24h', icon: Key },
    { name: 'Desentupidora', icon: Droplet },
    { name: 'Guincho', icon: Truck },
    { name: 'Eletricista 24h', icon: Zap },
    { name: 'Bombeiro Hidráulico', icon: Wrench },
    { name: 'Vidraceiro Urgente', icon: Shield },
  ],
  'home': [
    { name: 'Eletricista', icon: Zap },
    { name: 'Encanador', icon: Droplet },
    { name: 'Pedreiro', icon: Hammer },
    { name: 'Pintor', icon: PaintRoller },
    { name: 'Marido de Aluguel', icon: User },
    { name: 'Ar Condicionado', icon: Wrench },
    { name: 'Marceneiro', icon: Hammer },
    { name: 'Serralheiro', icon: Key },
  ],
  'auto': [
    { name: 'Mecânico', icon: Wrench },
    { name: 'Funilaria e Pintura', icon: PaintRoller },
    { name: 'Auto Elétrica', icon: Zap },
    { name: 'Guincho', icon: Truck },
    { name: 'Borracharia', icon: Car },
    { name: 'Estética Automotiva', icon: Sparkles },
    { name: 'Insulfilm', icon: Shield },
  ],
  'tech': [
    { name: 'Conserto de Celular', icon: Smartphone },
    { name: 'Informática', icon: Laptop },
    { name: 'Internet e Redes', icon: Wifi },
    { name: 'Câmeras de Segurança', icon: Shield },
    { name: 'Impressoras', icon: Wrench },
  ],
  'pet': [
    { name: 'Banho e Tosa', icon: Scissors },
    { name: 'Veterinário', icon: Dog },
    { name: 'Passeador (Dog Walker)', icon: User },
    { name: 'Adestramento', icon: Sparkles },
    { name: 'Hotelzinho', icon: Dog },
  ],
  'clean': [
    { name: 'Diarista', icon: Sparkles },
    { name: 'Limpeza de Estofados', icon: User },
    { name: 'Dedetização', icon: Shield },
    { name: 'Limpeza Pós-obra', icon: Hammer },
    { name: 'Lavanderia', icon: Droplet },
  ],
  'pro': [
    { name: 'Advogado', icon: Scale },
    { name: 'Contador', icon: Calculator },
    { name: 'Designer Gráfico', icon: PenTool },
    { name: 'Consultor', icon: Briefcase },
    { name: 'Tradutor', icon: PenTool },
  ],
  'other': [
    { name: 'Fretes e Mudanças', icon: TruckIcon },
    { name: 'Jardinagem', icon: Flower },
    { name: 'Costureira', icon: Scissors },
    { name: 'Sapateiro', icon: Hammer },
    { name: 'Outros', icon: Search },
  ],
};

export const SubcategoriesView: React.FC<SubcategoriesViewProps> = ({ macroId, macroName, onBack, onSelectSubcategory }) => {
  const items = SUBCATEGORIES_DATA[macroId] || SUBCATEGORIES_DATA['other'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 px-5 pt-8 pb-6 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10 flex items-center gap-4 mb-4">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-white" />
        </button>
        <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display leading-tight">
              {macroName}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Escolha o tipo de serviço que você precisa
            </p>
        </div>
      </div>

      {/* Carrossel de Banners (Dinâmico) */}
      <SubcategoryCarousel macroId={macroId} />

      {/* Content Grid */}
      <div className="px-5">
        <div className="grid grid-cols-2 gap-4">
          {items.map((sub, idx) => {
            const Icon = sub.icon;
            return (
              <button 
                key={idx}
                onClick={() => onSelectSubcategory(sub.name)}
                className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-all active:scale-[0.98] min-h-[120px] group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1E5BFF] group-hover:bg-blue-100 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-bold text-gray-700 dark:text-gray-200 text-xs text-center leading-tight uppercase tracking-tight">
                  {sub.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
