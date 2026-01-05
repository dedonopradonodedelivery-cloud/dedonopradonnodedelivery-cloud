
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
  ShieldCheck,
  Clock,
  MessageSquare,
  MessageCircle,
  Phone,
  BarChart3
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { MOCK_JOBS } from '../constants';

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

const NEIGHBORHOOD_ACTIVITY = [
  "Maria pediu um Eletricista há 5 min",
  "João avaliou a Padaria Imperial",
  "3 vizinhos pediram Orçamento de Pintura",
  "Novo profissional verificado: Dra. Pet"
];

// --- EXTENDED SERVICE PROVIDER DATABASE (MOCK) ---
// Includes Premium flags, verification status, and ratings for the algorithm.
interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  badges: string[];
  response: string;
  whatsappAvailable: boolean;
  isPremium: boolean; // Flag for Ad Engine
  verified: boolean;  // Flag for Ad Engine
}

const SERVICE_PROVIDERS_POOL: ServiceProvider[] = [
  // --- PREMIUM CANDIDATES ---
  { 
    id: 'p_joao_eletr', 
    name: 'João Eletricista', 
    category: 'Elétrica Residencial', 
    rating: 4.9, 
    reviews: 124, 
    badges: ['⚡ Rápido', '🏅 Top Pro'], 
    response: '< 5 min', 
    whatsappAvailable: true,
    isPremium: true,
    verified: true
  },
  { 
    id: 'p_maria_clean', 
    name: 'Maria Diarista', 
    category: 'Limpeza e Organização', 
    rating: 5.0, 
    reviews: 89, 
    badges: ['⭐ Impecável', 'Verificado'], 
    response: '~ 15 min', 
    whatsappAvailable: true,
    isPremium: true,
    verified: true
  },
  { 
    id: 'p_tech_fix', 
    name: 'Tech Fix Freguesia', 
    category: 'Conserto Celulares', 
    rating: 4.8, 
    reviews: 210, 
    badges: ['⚡ Na Hora'], 
    response: 'Online', 
    whatsappAvailable: true,
    isPremium: true,
    verified: true
  },
  { 
    id: 'p_refrig_polar', 
    name: 'Refrigeração Polar', 
    category: 'Climatização', 
    rating: 4.7, 
    reviews: 56, 
    badges: ['❄️ Verão', 'Garantia'], 
    response: '~ 30 min', 
    whatsappAvailable: true,
    isPremium: true,
    verified: true
  },
  { 
    id: 'p_doutor_pet', 
    name: 'Dr. Pet em Casa', 
    category: 'Veterinário', 
    rating: 4.9, 
    reviews: 112, 
    badges: ['🐾 24h', 'Amoroso'], 
    response: 'Imediato', 
    whatsappAvailable: true,
    isPremium: true,
    verified: true
  },

  // --- ORGANIC CANDIDATES ---
  { 
    id: 'o_pedro_pintor', 
    name: 'Pedro Pinturas', 
    category: 'Pintura', 
    rating: 4.6, 
    reviews: 34, 
    badges: ['🎨 Detalhe'], 
    response: '~ 1h', 
    whatsappAvailable: true,
    isPremium: false,
    verified: true
  },
  { 
    id: 'o_marido_aluguel', 
    name: 'Resolve Tudo', 
    category: 'Marido de Aluguel', 
    rating: 4.5, 
    reviews: 78, 
    badges: ['🛠️ Prático'], 
    response: '~ 20 min', 
    whatsappAvailable: false, // Forces app chat
    isPremium: false,
    verified: true
  },
];

const ADS_CAP_PER_DAY = 3; // Max views per user per provider per day

export const ServicesView: React.FC<ServicesViewProps> = ({ onSelectMacro, onOpenTerms, onNavigate, searchTerm = '' }) => {
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [activityIndex, setActivityIndex] = useState(0);
  const [displayedPros, setDisplayedPros] = useState<ServiceProvider[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);

  // --- AD ENGINE LOGIC ---
  useEffect(() => {
    // 1. Get user view history from local storage
    const today = new Date().toDateString();
    
    const checkCap = (providerId: string) => {
      const key = `ad_views_${providerId}_${today}`;
      const views = parseInt(localStorage.getItem(key) || '0');
      return views < ADS_CAP_PER_DAY;
    };

    const incrementView = (providerId: string) => {
      const key = `ad_views_${providerId}_${today}`;
      const views = parseInt(localStorage.getItem(key) || '0');
      localStorage.setItem(key, (views + 1).toString());
    };

    // 2. Filter & Shuffle Premiums
    const eligiblePremiums = SERVICE_PROVIDERS_POOL.filter(
      p => p.isPremium && p.verified && p.rating >= 4.5 && checkCap(p.id)
    );

    // Shuffle (Fisher-Yates) to ensure fairness rotation
    for (let i = eligiblePremiums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [eligiblePremiums[i], eligiblePremiums[j]] = [eligiblePremiums[j], eligiblePremiums[i]];
    }

    // 3. Select up to 3 Premiums
    const selectedPremiums = eligiblePremiums.slice(0, 3);

    // 4. Record Impressions
    selectedPremiums.forEach(p => {
      incrementView(p.id);
      trackAdMetric('impression', p.id);
    });

    // 5. Fill remaining spots with Organics if needed
    let finalSelection = [...selectedPremiums];
    if (finalSelection.length < 3) {
      const organics = SERVICE_PROVIDERS_POOL
        .filter(p => !p.isPremium)
        .sort((a, b) => b.rating - a.rating) // Best rated organics first
        .slice(0, 3 - finalSelection.length);
      
      finalSelection = [...finalSelection, ...organics];
    }

    setDisplayedPros(finalSelection);

  }, []); // Run once on mount

  // --- METRICS HANDLER ---
  const trackAdMetric = async (type: 'impression' | 'click_quote' | 'click_whatsapp', providerId: string) => {
    // console.log(`[AdMetric] ${type} for provider ${providerId}`);
    
    // Simulating Database Call
    if (supabase) {
      // In a real app, this table 'ad_metrics' would exist
      /*
      await supabase.from('ad_metrics').insert({
        provider_id: providerId,
        event_type: type,
        placement: 'servicos_premium_recomendados',
        timestamp: new Date().toISOString()
      });
      */
    }
  };

  // Scroll listener for Sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        // Show sticky CTA when Hero is scrolled out of view
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

  const hasJobs = MOCK_JOBS.length > 0;

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-gray-900 font-sans animate-in fade-in duration-500 pb-36">
      
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
                {/* Invisible Onboarding Badge */}
                <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-lg mb-3 border border-white/10">
                  <Clock className="w-3 h-3 text-white" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wide">Primeira vez? Leva &lt; 1 min</span>
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
                    Pedir orçamento
                    <ArrowRight className="w-4 h-4" strokeWidth={3} />
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

        {/* 3. EDUCATION FLOW (SIMPLE) */}
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

        {/* 5. CATEGORIES & EMERGENCY */}
        <div className="px-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            O que você precisa?
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {/* JOBS ENTRY POINT (Conditional) */}
            {hasJobs && (
                <button
                  onClick={() => onNavigate('jobs_list')}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-gray-900 dark:text-white border border-blue-100 dark:border-blue-800/30 relative overflow-hidden rounded-[20px] p-4 text-left shadow-sm hover:shadow-md transition-all active:scale-[0.98] group min-h-[130px] flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm">
                    <Briefcase className="w-5 h-5" strokeWidth={2} />
                  </div>
                  
                  <div>
                    <span className="block font-bold text-base leading-tight mb-1">
                      Empregos
                    </span>
                    <span className="block text-[10px] text-gray-500 dark:text-gray-400 mb-2 font-medium">
                        Vagas no bairro
                    </span>
                    <span className="text-[10px] font-bold flex items-center gap-1 mt-auto text-blue-600 dark:text-blue-400">
                      Ver vagas <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </button>
            )}

            {filteredServices.map((item) => {
              const Icon = item.icon;
              const isEmergency = item.id === 'emergency';

              // EMERGENCY CARD (SPECIAL LAYOUT)
              if (isEmergency) {
                return (
                  <div
                    key={item.id}
                    className="col-span-2 bg-red-600 rounded-[20px] p-4 text-white shadow-lg shadow-red-500/20 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-5 h-5 text-white" strokeWidth={3} />
                          <h3 className="text-lg font-bold">Emergência</h3>
                        </div>
                        <p className="text-xs text-red-100 font-medium mb-3">Atendimento imediato • 24h</p>
                      </div>
                      <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm animate-pulse border border-white/20">
                        Plantão Ativo
                      </span>
                    </div>

                    <div className="flex gap-3 relative z-10">
                      <button 
                        onClick={() => onSelectMacro(item.id, item.name)}
                        className="flex-1 bg-white text-red-600 font-bold text-sm py-2.5 rounded-xl shadow-sm active:scale-95 transition-transform flex items-center justify-center"
                      >
                        Pedir orçamento
                      </button>
                      <button 
                        className="flex-1 border border-white/30 text-white font-medium text-xs py-2.5 rounded-xl hover:bg-white/10 active:scale-95 transition-transform flex items-center justify-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        Chamar agora (24h)
                      </button>
                    </div>
                  </div>
                );
              }

              // STANDARD CATEGORY CARD
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectMacro(item.id, item.name)}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 relative overflow-hidden rounded-[20px] p-4 text-left shadow-sm hover:shadow-md transition-all active:scale-[0.98] group min-h-[130px] flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-blue-50 dark:bg-gray-700 text-[#0A46FF] dark:text-blue-400">
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  
                  <div>
                    <span className="block font-bold text-base leading-tight mb-1">
                      {item.name}
                    </span>
                    <span className="block text-[10px] text-gray-400 dark:text-gray-500 mb-2 font-medium">
                        Orçamento grátis
                    </span>
                    <span className="text-[10px] font-bold flex items-center gap-1 mt-auto text-blue-600 dark:text-blue-400">
                      Pedir orçamento <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. RECOMMENDED PROFESSIONALS (ADS ENGINE - PREMIUM & ORGANIC MIX) */}
        <div className="px-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-2">
                  Destaques no bairro
                  <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-200">TOP</span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Profissionais verificados com alta reputação
                </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            {displayedPros.map((item, i) => (
              <div 
                key={item.id}
                className={`
                    p-4 rounded-2xl shadow-sm flex flex-col gap-3 relative group transition-all hover:shadow-md
                    ${item.isPremium 
                        ? 'bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-800/80 border border-blue-200 dark:border-blue-900/50' 
                        : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'
                    }
                `}
                onClick={() => trackAdMetric('impression', item.id)} 
              >
                {item.isPremium && (
                    <div className="absolute top-0 right-0 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[9px] font-bold px-2 py-1 rounded-bl-xl rounded-tr-xl border-l border-b border-blue-200 dark:border-blue-800/50 uppercase tracking-wide flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" /> Patrocinado
                    </div>
                )}

                <div className="flex gap-3 items-start mt-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-lg font-bold ${item.isPremium ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-700'}`}>
                    {item.name.charAt(0)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-900 dark:text-white text-base truncate pr-20">{item.name}</h4>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded border border-yellow-100 dark:border-yellow-800/30">
                            <Star className="w-2.5 h-2.5 fill-current" /> {item.rating}
                        </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                   <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md border border-green-100 dark:border-green-800">
                      <Clock className="w-3 h-3" />
                      {item.response}
                   </div>
                   {item.badges.map(badge => (
                      <span key={badge} className="text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-600">
                        {badge}
                      </span>
                   ))}
                </div>

                <div className="flex flex-col gap-2 mt-1">
                  <button 
                    onClick={() => {
                        trackAdMetric('click_quote', item.id);
                        onSelectMacro('pro', item.category);
                    }}
                    className={`w-full text-white text-sm font-bold py-3 rounded-xl shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 ${item.isPremium ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/20' : 'bg-[#0A46FF] shadow-blue-500/10'}`}
                  >
                    Pedir orçamento
                  </button>
                  
                  {item.whatsappAvailable && (
                    <button 
                      onClick={() => trackAdMetric('click_whatsapp', item.id)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors border border-transparent hover:border-green-100"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chamar no WhatsApp
                    </button>
                  )}
                </div>

                <div className="flex justify-center">
                  <p className="text-[9px] text-gray-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5" /> Contato direto, sem compromisso
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. CLOSURE BLOCK (Decision Helper) */}
        <div className="px-5 mt-4">
          <div className="bg-gray-100 dark:bg-gray-800/50 rounded-2xl p-5 text-center border border-gray-200 dark:border-gray-700">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
              Ainda não encontrou o que precisa?
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 max-w-[200px] mx-auto">
              Nós encontramos para você. É grátis e rápido.
            </p>
            <button 
              onClick={() => onSelectMacro('home', 'Geral')}
              className="w-full bg-white dark:bg-gray-800 text-[#0A46FF] text-sm font-bold border border-[#0A46FF] px-6 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm"
            >
              Pedir orçamento
            </button>
          </div>
        </div>

        {/* 8. PATROCINADOR MASTER */}
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
                Pedir orçamento
            </span>
            <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
