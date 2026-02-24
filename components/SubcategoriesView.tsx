import React, { useState, useEffect } from 'react';
import { ChevronLeft, Zap, Wrench, Hammer, PaintRoller, User, Car, Droplet, Key, Truck, Shield, Smartphone, Laptop, Wifi, Dog, Scissors, Sparkles, Briefcase, Scale, Calculator, PenTool, Truck as TruckIcon, Flower, Search, Star, ShieldCheck, Rocket } from 'lucide-react';

interface SubcategoriesViewProps {
  macroId: string;
  macroName: string;
  onBack: () => void;
  onSelectSubcategory: (subName: string) => void;
}

// Banners Mock para o topo
const SUB_BANNERS = [
  {
    id: 1,
    title: "Profissionais Verificados",
    subtitle: "Segurança total para sua casa",
    icon: <ShieldCheck className="w-8 h-8 text-white" />,
    color: "bg-blue-600"
  },
  {
    id: 2,
    title: "Orçamentos Gratuitos",
    subtitle: "Receba até 5 propostas rápidas",
    icon: <Rocket className="w-8 h-8 text-white" />,
    color: "bg-brand-blue"
  },
  {
    id: 3,
    title: "Atendimento 24h",
    subtitle: "Para emergências em Jacarepaguá",
    icon: <Zap className="w-8 h-8 text-white" />,
    color: "bg-indigo-600"
  }
];

const SubcategoryCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SUB_BANNERS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-5 mb-6">
      <div className="relative aspect-[7/6] w-full overflow-hidden rounded-[32px] shadow-lg">
        {SUB_BANNERS.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out flex flex-col items-center justify-center text-center px-6 gap-5 ${
              index === currentIndex 
                ? 'opacity-100 translate-x-0' 
                : index < currentIndex 
                  ? 'opacity-0 -translate-x-full' 
                  : 'opacity-0 translate-x-full'
            } ${banner.color}`}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/10 shadow-lg">
              {banner.icon}
            </div>
            <div className="text-white">
              <h3 className="font-black text-xl uppercase tracking-tight leading-tight mb-2">{banner.title}</h3>
              <p className="text-sm font-medium text-white/80">{banner.subtitle}</p>
            </div>
          </div>
        ))}
        
        {/* Indicadores */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-1.5 z-10">
          {SUB_BANNERS.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-white' : 'w-1 bg-white/40'}`} 
            />
          ))}
        </div>
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
    <div className="flex flex-col bg-brand-blue w-full max-w-md mx-auto min-h-screen animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="bg-brand-blue px-5 pt-8 pb-6 border-b border-white/10 sticky top-0 z-50 flex items-center gap-4 mb-4">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <div>
            <h1 className="text-xl font-bold text-white font-display leading-tight">
              {macroName}
            </h1>
            <p className="text-xs text-blue-100">
              Escolha o tipo de serviço que você precisa
            </p>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-950 rounded-t-[3.5rem] -mt-8 pb-32 relative z-40 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
        <main className="p-6 pt-12 space-y-10">
          {/* Carrossel de Banners */}
          <SubcategoryCarousel />

          {/* Content Grid */}
          <div className="px-1">
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
        </main>
      </div>

    </div>
  );
};