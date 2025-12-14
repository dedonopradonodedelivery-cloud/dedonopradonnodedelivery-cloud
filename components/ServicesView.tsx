
import React, { useState, useEffect, useRef } from 'react';
import { 
  TriangleAlert, 
  Hammer, 
  CarFront, 
  Smartphone, 
  Dog, 
  Sparkles, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  Shield,
  Zap,
  Flame,
  Star,
  MapPin,
  ThumbsUp,
  ShieldCheck,
  Wallet,
  Clock,
  MessageSquare,
  Search,
  User
} from 'lucide-react';

interface ServicesViewProps {
  onSelectMacro: (id: string, name: string) => void;
  onOpenTerms: () => void;
  onNavigate: (view: string) => void;
  searchTerm?: string;
}

// --- CONFIGURATION & MOCK DATA ---

const MACRO_SERVICES = [
  { 
    id: 'emergency', 
    name: 'Emergência', 
    icon: TriangleAlert,
    description: 'Atendimento imediato • 24h',
    color: 'bg-red-600',
    textColor: 'text-white',
    keywords: ['chaveiro', 'desentupidora', 'guincho', 'eletricista', 'bombeiro', 'vazamento', '24 horas', '24h', 'urgente']
  },
  { 
    id: 'home', 
    name: 'Casa & Reparos', 
    icon: Hammer,
    color: 'bg-white dark:bg-gray-800',
    textColor: 'text-gray-900 dark:text-white',
    keywords: ['pedreiro', 'pintor', 'encanador', 'marido de aluguel', 'ar condicionado', 'marceneiro', 'serralheiro', 'obra', 'reforma', 'manutenção']
  },
  { 
    id: 'auto', 
    name: 'Auto & Veículos', 
    icon: CarFront,
    color: 'bg-white dark:bg-gray-800',
    textColor: 'text-gray-900 dark:text-white',
    keywords: ['mecânico', 'oficina', 'funilaria', 'pintura', 'borracharia', 'insulfilm', 'lavajato', 'estética automotiva', 'carro', 'moto']
  },
  { 
    id: 'tech', 
    name: 'Tecnologia', 
    icon: Smartphone,
    color: 'bg-white dark:bg-gray-800',
    textColor: 'text-gray-900 dark:text-white',
    keywords: ['celular', 'smartphone', 'computador', 'notebook', 'impressora', 'internet', 'wifi', 'câmera', 'segurança', 'iphone', 'android']
  },
  { 
    id: 'pet', 
    name: 'Pets', 
    icon: Dog,
    color: 'bg-white dark:bg-gray-800',
    textColor: 'text-gray-900 dark:text-white',
    keywords: ['veterinário', 'banho', 'tosa', 'adestramento', 'hotel', 'dog walker', 'passeador', 'gato', 'cachorro']
  },
  { 
    id: 'clean', 
    name: 'Limpeza', 
    icon: Sparkles,
    color: 'bg-white dark:bg-gray-800',
    textColor: 'text-gray-900 dark:text-white',
    keywords: ['diarista', 'faxina', 'limpeza de estofados', 'lavanderia', 'passadeira', 'dedetização', 'pós obra']
  },
  { 
    id: 'pro', 
    name: 'Consultoria', 
    icon: Briefcase,
    color: 'bg-white dark:bg-gray-800',
    textColor: 'text-gray-900 dark:text-white',
    keywords: ['advogado', 'contador', 'marketing', 'designer', 'tradutor', 'consultor', 'frete', 'mudança', 'jardinagem']
  },
];

const LIVE_STORIES = [
  { 
    id: 1, 
    name: 'Refrigeração Polar', 
    role: 'Técnico de Ar', 
    status: 'Em atendimento', 
    badge: '🔴 Agora', 
    badgeColor: 'bg-red-500',
    responseTime: '~2 min',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format=fit=crop' 
  },
  { 
    id: 2, 
    name: 'SOS Elétrica', 
    role: 'Eletricista', 
    status: 'Resposta rápida', 
    badge: '🟢 Online', 
    badgeColor: 'bg-green-500',
    responseTime: 'Imediato',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=400&auto=format=fit=crop' 
  },
  { 
    id: 3, 
    name: 'Mudanças Ágil', 
    role: 'Fretes', 
    status: 'Caminhão livre', 
    badge: '🟢 Livre', 
    badgeColor: 'bg-green-500',
    responseTime: '~10 min',
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=400&auto=format=fit=crop' 
  },
  { 
    id: 4, 
    name: 'Dr. Reparo', 
    role: 'Marido de Aluguel', 
    status: 'Disponível', 
    badge: '⚡ Rápido', 
    badgeColor: 'bg-blue-500',
    responseTime: '~5 min',
    image: 'https://images.unsplash.com/photo-1581578731117-10d52143b0d8?q=80&w=400&auto=format=fit=crop' 
  },
];

const NEIGHBORHOOD_ACTIVITY = [
  "Maria pediu um Eletricista há 5 min",
  "João avaliou a Padaria Imperial",
  "3 vizinhos pediram Orçamento de Pintura",
  "Novo profissional verificado: Dra. Pet"
];

const DISCOVER_SERVICES = [
  { id: 'd1', name: 'João Eletricista', category: 'Elétrica Residencial', rating: 4.9, reviews: 124, badges: ['⚡ Rápido', 'Verificado'], response: '< 5 min' },
  { id: 'd2', name: 'Maria Diarista', category: 'Limpeza e Organização', rating: 5.0, reviews: 89, badges: ['⭐ Favorito', 'Cashback'], response: '~ 15 min' },
  { id: 'd3', name: 'Tech Fix', category: 'Conserto Celulares', rating: 4.8, reviews: 210, badges: ['🔥 Em alta'], response: 'Online' },
];

export const ServicesView: React.FC<ServicesViewProps> = ({ onSelectMacro, onOpenTerms, onNavigate, searchTerm = '' }) => {
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [activityIndex, setActivityIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Scroll listener for Sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setShowStickyCTA(heroBottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Activity Ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % NEIGHBORHOOD_ACTIVITY.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  const filteredServices = MACRO_SERVICES.filter(service => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return service.name.toLowerCase().includes(term) || service.keywords.some(k => k.toLowerCase().includes(term));
  });

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-gray-900 font-sans animate-in fade-in duration-500 pb-32">
      
      <div className="flex flex-col gap-6">
        
        {/* 1. NEIGHBORHOOD PULSE (Social Proof) */}
        {!searchTerm && (
          <div className="px-5 pt-4 -mb-2">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 py-1.5 px-3 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 animate-in fade-in slide-in-from-bottom-1 duration-500 key={activityIndex}">
                {NEIGHBORHOOD_ACTIVITY[activityIndex]}
              </p>
            </div>
          </div>
        )}

        {/* 2. HERO CONVERSION CARD */}
        {!searchTerm && (
          <div className="px-5 pt-2" ref={heroRef}>
            <div className="relative w-full rounded-[24px] bg-gradient-to-r from-[#0A46FF] to-[#0039CC] p-6 shadow-lg shadow-blue-500/20 overflow-hidden group cursor-pointer active:scale-[0.99] transition-all">
              {/* Subtle glow effect */}
              <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10">
                {/* Onboarding Badge (Mock First Time) */}
                <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-lg mb-3 border border-white/10">
                  <Clock className="w-3 h-3 text-white" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wide">Leva menos de 1 min</span>
                </div>

                <h2 className="text-2xl font-bold text-white leading-tight mb-2 tracking-tight font-display">
                  Qual serviço você precisa?
                </h2>
                <p className="text-sm text-blue-100 font-medium leading-relaxed max-w-[90%] mb-6">
                  Receba até 5 orçamentos gratuitos de profissionais verificados da Freguesia.
                </p>
                
                <button 
                  onClick={() => onSelectMacro('home', 'Casa & Reparos')} 
                  className="w-full bg-white text-[#0A46FF] font-bold py-3.5 rounded-xl shadow-sm flex items-center justify-center gap-2 group-hover:bg-blue-50 transition-colors relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Pedir orçamento agora <ArrowRight className="w-4 h-4" strokeWidth={3} />
                  </span>
                </button>
                
                <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-blue-100 font-medium opacity-90">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Grátis</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Seguro</span>
                  <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> Rápido</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. ANTI-ANXIETY MICRO-FLOW (Horizontal) */}
        {!searchTerm && (
          <div className="px-5">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-start text-center relative">
                {/* Connecting Line */}
                <div className="absolute top-3 left-6 right-6 h-[2px] bg-gray-100 dark:bg-gray-700 -z-0"></div>
                
                <div className="flex flex-col items-center gap-2 relative z-10 flex-1">
                  <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0A46FF] flex items-center justify-center border-2 border-white dark:border-gray-800 font-bold text-xs">1</div>
                  <p className="text-[10px] font-bold text-gray-600 dark:text-gray-300 leading-tight">Descreva<br/>o pedido</p>
                </div>
                <div className="flex flex-col items-center gap-2 relative z-10 flex-1">
                  <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0A46FF] flex items-center justify-center border-2 border-white dark:border-gray-800 font-bold text-xs">2</div>
                  <p className="text-[10px] font-bold text-gray-600 dark:text-gray-300 leading-tight">Receba<br/>orçamentos</p>
                </div>
                <div className="flex flex-col items-center gap-2 relative z-10 flex-1">
                  <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0A46FF] flex items-center justify-center border-2 border-white dark:border-gray-800 font-bold text-xs">3</div>
                  <p className="text-[10px] font-bold text-gray-600 dark:text-gray-300 leading-tight">Negocie<br/>direto</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. AGORA NA FREGUESIA (URGENCY STORIES) */}
        {!searchTerm && (
          <div className="pl-5 pt-2">
            <div className="flex items-center gap-2 mb-3 pr-5">
              <h3 className="text-base font-bold text-gray-900 dark:text-white leading-none flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                Agora na Freguesia
              </h3>
              <span className="text-[10px] text-gray-400 font-medium ml-auto">
                Profissionais online
              </span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 pr-5 no-scrollbar snap-x">
              {LIVE_STORIES.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onSelectMacro('home', item.name)}
                  className="snap-center relative flex-shrink-0 w-[120px] h-[200px] rounded-2xl overflow-hidden group active:scale-95 transition-all shadow-md cursor-pointer border border-gray-100 dark:border-gray-800"
                >
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10"></div>
                  
                  {/* Badge Topo */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                    <span className={`text-[8px] font-bold text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-md ${item.badgeColor} bg-opacity-90`}>
                      {item.badge}
                    </span>
                  </div>

                  {/* Info Bottom */}
                  <div className="absolute bottom-3 left-2 right-2 text-left">
                    <div className="flex flex-col gap-0.5 mb-2">
                      <div className="flex items-center gap-1 mb-1">
                         <Clock className="w-2.5 h-2.5 text-green-400" />
                         <span className="text-[9px] text-green-300 font-bold">{item.responseTime}</span>
                      </div>
                      <h4 className="text-white font-bold text-xs leading-tight shadow-black drop-shadow-md">{item.name}</h4>
                      <p className="text-[10px] text-gray-300 font-medium">{item.role}</p>
                    </div>
                    <div className="text-[9px] font-bold text-white bg-white/20 backdrop-blur-md px-2 py-1.5 rounded-lg text-center border border-white/20 hover:bg-white/30 transition-colors">
                      Chamar no Zap
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. O QUE VOCÊ PRECISA? (CATEGORIAS) */}
        <div className="px-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            O que você precisa?
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {filteredServices.map((item) => {
              const Icon = item.icon;
              const isEmergency = item.id === 'emergency';

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectMacro(item.id, item.name)}
                  className={`
                    relative overflow-hidden rounded-[20px] p-4 text-left shadow-sm hover:shadow-md transition-all active:scale-[0.98] group min-h-[130px] flex flex-col justify-between
                    ${isEmergency 
                      ? 'col-span-2 bg-red-600 text-white border-none shadow-red-500/20 shadow-lg' 
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700'}
                  `}
                >
                  <div className="flex justify-between items-start">
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center mb-3
                      ${isEmergency ? 'bg-white/20 text-white' : 'bg-blue-50 dark:bg-gray-700 text-[#0A46FF] dark:text-blue-400'}
                    `}>
                      <Icon className="w-5 h-5" strokeWidth={isEmergency ? 2.5 : 2} />
                    </div>
                    {isEmergency && (
                      <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm animate-pulse border border-white/20">
                        Plantão 24h
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <span className={`block font-bold text-base leading-tight mb-1 ${isEmergency ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {item.name}
                    </span>
                    {isEmergency ? (
                      <span className="block text-xs text-red-100 opacity-90 mb-2 font-medium">
                        {item.description}
                      </span>
                    ) : (
                        <span className="block text-[10px] text-gray-400 dark:text-gray-500 mb-2 font-medium">
                            Orçamento grátis
                        </span>
                    )}
                    <span className={`text-[10px] font-bold flex items-center gap-1 mt-auto ${isEmergency ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`}>
                      {isEmergency ? 'Chamar Agora' : 'Pedir orçamento'} <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. CONTINUE DESCOBRINDO (LISTA) */}
        <div className="px-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Recomendados no bairro 👇
          </h3>
          
          <div className="flex flex-col gap-3">
            {DISCOVER_SERVICES.map((item, i) => (
              <div 
                key={item.id}
                onClick={() => onSelectMacro('pro', item.category)}
                className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-3 relative group active:scale-[0.99] transition-transform cursor-pointer"
              >
                <div className="w-[72px] h-[72px] bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-600 text-xl font-bold text-gray-400">
                  {item.name.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0 pr-24">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{item.name}</h4>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5 text-[10px] font-bold text-yellow-500">
                      <Star className="w-3 h-3 fill-current" /> {item.rating}
                    </div>
                    <span className="text-[10px] text-gray-400">• {item.category}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                     <div className="flex items-center gap-1 text-[9px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">
                        <Clock className="w-2.5 h-2.5" />
                        {item.response}
                     </div>
                     {item.badges.includes('Verificado') && (
                         <div className="flex items-center gap-1 text-[9px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            Verificado
                         </div>
                     )}
                  </div>
                </div>

                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#0A46FF] text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-md active:scale-95 transition-transform hover:bg-[#0039CC]"
                >
                  Orçamento
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 7. PATROCINADOR MASTER */}
        <div className="px-5">
          <div 
            onClick={() => onNavigate('patrocinador_master')}
            className="w-full rounded-[24px] relative overflow-hidden group cursor-pointer shadow-md hover:shadow-lg transition-all bg-[#0F172A]"
          >
            <div className="relative z-10 flex flex-col items-start px-6 py-6">
              <div className="flex flex-col items-start gap-2 mb-4">
                 <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">
                   Patrocinador Master
                 </span>
                 <div className="flex items-center gap-2">
                   <Shield className="w-5 h-5 text-white/40" />
                   <h3 className="text-white font-semibold text-base tracking-wide">
                     Grupo Esquematiza
                   </h3>
                 </div>
              </div>
              
              <h2 className="text-lg font-bold text-white leading-tight max-w-[90%] mb-6">
                Serviços Profissionais para Empresas e Condomínios
              </h2>
              
              <button className="bg-[#0A46FF] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-lg hover:bg-blue-600 transition-all flex items-center gap-2">
                Saiba mais
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {/* Decorative Shield */}
            <div className="absolute -right-6 -bottom-6 opacity-[0.05] pointer-events-none rotate-12">
               <Shield className="w-48 h-48 text-white" />
            </div>
          </div>
        </div>

      </div>

      {/* SMART STICKY CTA (Context Aware) */}
      <div className={`fixed bottom-[70px] left-0 right-0 px-5 z-40 transition-all duration-300 transform ${showStickyCTA ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <button 
            onClick={() => onSelectMacro('home', 'Geral')}
            className="w-full bg-[#0A46FF] text-white font-bold py-3.5 rounded-full shadow-xl shadow-blue-600/30 flex items-center justify-between px-6 active:scale-[0.98] transition-transform"
        >
            <span className="flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4 fill-white text-white" />
                Pedir orçamento rápido
            </span>
            <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
