
import React from 'react';
import { 
  TriangleAlert, 
  Hammer, 
  CarFront, 
  Smartphone, 
  Dog, 
  Sparkles, 
  Briefcase, 
  Search, 
  MessageSquare, 
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
  Activity,
  UserCheck
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
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format=fit=crop' 
  },
  { 
    id: 2, 
    name: 'SOS Elétrica', 
    role: 'Eletricista', 
    status: 'Resposta rápida', 
    badge: '🟢 Online', 
    badgeColor: 'bg-green-500',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=400&auto=format=fit=crop' 
  },
  { 
    id: 3, 
    name: 'Mudanças Ágil', 
    role: 'Fretes', 
    status: 'Caminhão livre', 
    badge: '🟢 Livre', 
    badgeColor: 'bg-green-500',
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=400&auto=format=fit=crop' 
  },
  { 
    id: 4, 
    name: 'Dr. Reparo', 
    role: 'Marido de Aluguel', 
    status: 'Disponível', 
    badge: '⚡ Rápido', 
    badgeColor: 'bg-blue-500',
    image: 'https://images.unsplash.com/photo-1581578731117-10d52143b0d8?q=80&w=400&auto=format=fit=crop' 
  },
];

const TRENDING_SERVICES = [
  { id: 1, name: 'Limpeza de Ar', category: 'Casa', badge: '🔥 Em alta' },
  { id: 2, name: 'Eletricista', category: 'Emergência', badge: '⚡ Rápido' },
  { id: 3, name: 'Montador', category: 'Casa', badge: '🟢 Disponível' },
  { id: 4, name: 'Fretes', category: 'Logística', badge: '🚀 Urgente' },
];

const DISCOVER_SERVICES = [
  { id: 'd1', name: 'João Eletricista', category: 'Elétrica Residencial', rating: 4.9, reviews: 124, badges: ['⚡ Rápido', 'Verificado'] },
  { id: 'd2', name: 'Maria Diarista', category: 'Limpeza e Organização', rating: 5.0, reviews: 89, badges: ['⭐ Favorito', 'Cashback'] },
  { id: 'd3', name: 'Tech Fix', category: 'Conserto Celulares', rating: 4.8, reviews: 210, badges: ['🔥 Em alta'] },
  { id: 'd4', name: 'Dr. Pet', category: 'Veterinário em Domicílio', rating: 4.9, reviews: 56, badges: ['Plantão 24h'] },
  { id: 'd5', name: 'SOS Encanador', category: 'Hidráulica', rating: 4.7, reviews: 34, badges: ['Urgente'] },
];

export const ServicesView: React.FC<ServicesViewProps> = ({ onSelectMacro, onOpenTerms, onNavigate, searchTerm = '' }) => {
  
  const filteredServices = MACRO_SERVICES.filter(service => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return service.name.toLowerCase().includes(term) || service.keywords.some(k => k.toLowerCase().includes(term));
  });

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-gray-900 font-sans animate-in fade-in duration-500 pb-32">
      
      <div className="flex flex-col gap-8">
        
        {/* 1. HERO CONVERSION CARD (TOPO) */}
        {!searchTerm && (
          <div className="px-5 pt-6">
            <div className="relative w-full rounded-[24px] bg-gradient-to-r from-[#0A46FF] to-[#0039CC] p-6 shadow-lg shadow-blue-500/20 overflow-hidden group cursor-pointer active:scale-[0.99] transition-all">
              {/* Subtle glow effect */}
              <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white leading-tight mb-2 tracking-tight font-display">
                  Precisando de um serviço agora?
                </h2>
                <p className="text-sm text-blue-100 font-medium leading-relaxed max-w-[90%] mb-6">
                  Receba até 5 orçamentos gratuitos de profissionais da Freguesia.
                </p>
                
                <button 
                  onClick={() => onSelectMacro('home', 'Casa & Reparos')} // Default CTA
                  className="w-full bg-white text-[#0A46FF] font-bold py-3.5 rounded-xl shadow-sm flex items-center justify-center gap-2 group-hover:bg-blue-50 transition-colors"
                >
                  Pedir orçamento agora
                  <ArrowRight className="w-4 h-4" strokeWidth={3} />
                </button>
                
                <div className="flex items-center justify-center gap-3 mt-4 text-[10px] text-blue-100 font-medium">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Sem compromisso</span>
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Resposta rápida</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PASSO A PASSO (CONFIANÇA) */}
        {!searchTerm && (
          <div className="px-5">
            <div className="relative pl-4 space-y-5">
              {/* Connecting Line */}
              <div className="absolute left-[23px] top-3 bottom-3 w-[2px] bg-gray-200 dark:bg-gray-700"></div>

              <div className="relative flex items-start gap-4">
                <div className="w-5 h-5 rounded-full bg-white dark:bg-gray-800 border-2 border-[#0A46FF] z-10 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-[#0A46FF] rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Escolha a categoria
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">Selecione o tipo de serviço que você precisa.</p>
                </div>
              </div>

              <div className="relative flex items-start gap-4">
                <div className="w-5 h-5 rounded-full bg-white dark:bg-gray-800 border-2 border-[#0A46FF] z-10 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-[#0A46FF] rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Descreva o pedido
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">Explique o problema e envie fotos, se quiser.</p>
                </div>
              </div>

              <div className="relative flex items-start gap-4">
                <div className="w-5 h-5 rounded-full bg-white dark:bg-gray-800 border-2 border-green-500 z-10 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Receba orçamentos
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">Profissionais da Freguesia entram em contato.</p>
                </div>
              </div>
              
              <button onClick={onOpenTerms} className="text-[10px] font-bold text-gray-400 hover:text-[#0A46FF] transition-colors pl-9">
                Ler termos de uso →
              </button>
            </div>
          </div>
        )}

        {/* 3. AGORA NA FREGUESIA - SERVIÇOS AO VIVO (STORIES 9:16) */}
        {!searchTerm && (
          <div className="pl-5">
            <div className="flex items-center gap-2 mb-3 pr-5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-gray-900 dark:text-white leading-none">
                  Agora na Freguesia
                </h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Profissionais ativos neste momento
                </p>
              </div>
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
                  <div className="absolute top-2 left-2">
                    <span className={`text-[9px] font-bold text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-md ${item.badgeColor} bg-opacity-90`}>
                      {item.badge}
                    </span>
                  </div>

                  {/* Info Bottom */}
                  <div className="absolute bottom-3 left-2 right-2 text-left">
                    <div className="flex flex-col gap-0.5 mb-2">
                      <h4 className="text-white font-bold text-xs leading-tight shadow-black drop-shadow-md">{item.name}</h4>
                      <p className="text-[10px] text-gray-300 font-medium">{item.role}</p>
                      <p className="text-[9px] text-green-300 font-bold flex items-center gap-1 mt-0.5">
                        <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></span>
                        {item.status}
                      </p>
                    </div>
                    <div className="text-[9px] font-bold text-white bg-white/20 backdrop-blur-md px-2 py-1.5 rounded-lg text-center border border-white/20 hover:bg-white/30 transition-colors">
                      Ver agora
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. O QUE VOCÊ PRECISA? (CATEGORIAS) */}
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
                    {isEmergency && (
                      <span className="block text-xs text-red-100 opacity-90 mb-2 font-medium">
                        {item.description}
                      </span>
                    )}
                    <span className={`text-[10px] font-bold flex items-center gap-1 mt-auto ${isEmergency ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`}>
                      Pedir orçamento <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. SERVIÇOS EM ALTA */}
        {!searchTerm && (
          <div className="pl-5">
            <div className="flex items-center justify-between mb-3 px-1 pr-5">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                Serviços em alta
              </h3>
              <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Profissionais disponíveis
              </span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 pr-5 no-scrollbar">
              {TRENDING_SERVICES.map((srv) => (
                <button
                  key={srv.id}
                  onClick={() => onSelectMacro('home', srv.category)}
                  className="min-w-[150px] bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-3 active:scale-95 transition-transform"
                >
                  <div className="flex justify-between items-start">
                    <div className="p-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded border border-orange-100">
                      {srv.badge}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{srv.name}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{srv.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 6. SELOS DE CONFIANÇA */}
        <div className="px-5">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Verificados</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">Profissionais checados</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ThumbsUp className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Avaliações</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">Opiniões reais</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Local</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">Atendimento no bairro</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Wallet className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Grátis</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">Para pedir orçamento</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7. CONTINUE DESCOBRINDO (LISTA) */}
        <div className="px-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Continue descobrindo 👇
          </h3>
          
          <div className="flex flex-col gap-3">
            {DISCOVER_SERVICES.map((item, i) => (
              <div 
                key={item.id}
                className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-3 relative group active:scale-[0.99] transition-transform"
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

                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.badges.map(badge => (
                      <span key={badge} className="text-[9px] bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-1.5 py-0.5 rounded border border-gray-100 dark:border-gray-600">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => onSelectMacro('pro', item.category)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#0A46FF] text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-md active:scale-95 transition-transform hover:bg-[#0039CC]"
                >
                  Pedir orçamento
                </button>
              </div>
            ))}
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
            
            {/* Decorative Shield */}
            <div className="absolute -right-6 -bottom-6 opacity-[0.05] pointer-events-none rotate-12">
               <Shield className="w-48 h-48 text-white" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
