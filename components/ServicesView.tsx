
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
    keywords: ['mecânico', 'funilaria', 'pintura', 'auto elétrica', 'guincho', 'borracharia', 'lavagem']
  },
  { 
    id: 'tech', 
    name: 'Tecnologia', 
    icon: Smartphone,
    color: 'bg-white dark:bg-gray-800',
    textColor: 'text-gray-900 dark:text-white',
    keywords: ['celular', 'informática', 'computador', 'internet', 'segurança', 'manutenção', 'redes']
  },
  { 
    id: 'pet', 
    name: 'Serviços Pet', 
    icon: Dog,
    color: 'bg-white dark:bg-gray-800',
    textColor: 'text-gray-900 dark:text-white',
    keywords: ['veterinário', 'banho e tosa', 'passeador', 'adestramento', 'hospedagem']
  },
  { 
    id: 'clean', 
    name: 'Limpeza & Diaristas', 
    icon: Sparkles,
    color: 'bg-white dark:bg-gray-800',
    textColor: 'text-gray-900 dark:text-white',
    keywords: ['diarista', 'faxina', 'pós-obra', 'dedetização', 'higienização', 'lavanderia']
  },
  { 
    id: 'pro', 
    name: 'Serviços Profissionais', 
    icon: Briefcase,
    color: 'bg-white dark:bg-gray-800',
    textColor: 'text-gray-900 dark:text-white',
    keywords: ['advogado', 'contador', 'consultor', 'designer', 'marketing', 'arquiteto', 'engenheiro']
  },
];

const PROMO_BANNER = {
  id: 'pro-promo-1',
  title: 'Anuncie aqui e seja visto!',
  subtitle: 'Apareça para clientes buscando seu serviço na Freguesia.',
  buttonText: 'Quero aparecer no app',
  buttonLink: 'store_ads_module',
  image: 'https://images.unsplash.com/photo-1543286392-e42218086a92?q=80&w=800&auto=format&fit=crop',
};

// --- COMPONENTES AUXILIARES ---

// Card para cada macro serviço
const MacroServiceCard: React.FC<{ 
  service: typeof MACRO_SERVICES[0]; 
  onClick: (id: string, name: string) => void;
}> = ({ service, onClick }) => {
  const Icon = service.icon;
  const isRed = service.id === 'emergency';
  return (
    <button 
      onClick={() => onClick(service.id, service.name)}
      className={`relative rounded-[2rem] p-5 border-2 transition-all text-left group overflow-hidden ${
        isRed 
          ? 'bg-red-500 border-red-600 shadow-lg text-white' 
          : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white'
      }`}
    >
      {isRed && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      )}
      <div className="flex items-center gap-4 relative z-10">
        <div className={`w-12 h-12 rounded-2xl ${service.color} ${service.textColor} flex items-center justify-center shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className={`font-bold text-lg leading-tight group-hover:underline ${service.textColor}`}>{service.name}</h3>
          <p className={`text-xs mt-1 ${service.textColor === 'text-white' ? 'opacity-80' : 'text-gray-500 dark:text-gray-400'}`}>
            {service.description}
          </p>
        </div>
      </div>
      <ArrowRight className={`absolute bottom-5 right-5 w-5 h-5 ${service.textColor === 'text-white' ? 'text-white/50' : 'text-gray-300'} group-hover:text-[#1E5BFF] transition-colors`} />
    </button>
  );
};

const PromotionBanner: React.FC<{ banner: typeof PROMO_BANNER; onNavigate: (view: string) => void }> = ({ banner, onNavigate }) => {
  return (
    <div 
      onClick={() => onNavigate(banner.buttonLink)}
      className="w-full aspect-[3/1.5] rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden shadow-lg border border-white/10 cursor-pointer active:scale-[0.98] transition-all group"
    >
      <img src={banner.image} alt="Promotion" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity" />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-800/80 via-blue-800/40 to-transparent"></div>
      <div className="relative z-10 p-5 flex flex-col justify-end h-full">
        <h3 className="text-white font-black text-lg leading-tight mb-2 max-w-[80%]">{banner.title}</h3>
        <button className="w-fit px-4 py-2 bg-white text-blue-700 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md group-hover:scale-105 transition-transform">
          {banner.buttonText} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const JobCard: React.FC<{ job: typeof MOCK_JOBS[0] }> = ({ job }) => (
  <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.99] transition-transform">
    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center shrink-0">
      <Briefcase className="w-6 h-6 text-[#1E5BFF]" />
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-gray-900 dark:text-white text-sm">{job.role}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">{job.company} • {job.neighborhood}</p>
    </div>
    <ArrowRight className="w-5 h-5 text-gray-300" />
  </div>
);


// --- COMPONENTE PRINCIPAL (ServicesView) ---

export const ServicesView: React.FC<ServicesViewProps> = ({ onSelectMacro, onOpenTerms, onNavigate, searchTerm }) => {
  const filteredMacros = useMemo(() => {
    if (!searchTerm) return MACRO_SERVICES;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return MACRO_SERVICES.filter(service => 
      service.name.toLowerCase().includes(lowerCaseSearch) ||
      service.keywords.some(keyword => lowerCaseSearch.includes(keyword))
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans pb-24 animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 pt-8 pb-6 flex items-center gap-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Serviços Locais</h1>
      </div>

      <div className="p-5 space-y-8">
        {searchTerm ? (
            <div className="space-y-4">
                {filteredMacros.length > 0 ? filteredMacros.map(service => (
                    <MacroServiceCard key={service.id} service={service} onClick={onSelectMacro} />
                )) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500">Nenhum serviço encontrado para "{searchTerm}".</p>
                    </div>
                )}
            </div>
        ) : (
            <>
                <section className="grid grid-cols-1 gap-4">
                    {MACRO_SERVICES.map((service) => (
                        <MacroServiceCard key={service.id} service={service} onClick={onSelectMacro} />
                    ))}
                </section>

                <section>
                    <PromotionBanner banner={PROMO_BANNER} onNavigate={onNavigate} />
                </section>

                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Vagas de Emprego</h2>
                        <button onClick={() => onNavigate('jobs_list')} className="text-sm font-bold text-[#1E5BFF]">Ver todas</button>
                    </div>
                    <div className="grid gap-3">
                        {MOCK_JOBS.slice(0, 2).map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                </section>
                
                <section className="text-center mt-10">
                    <button onClick={onOpenTerms} className="text-sm text-gray-500 underline">Termos de Uso para Orçamentos</button>
                </section>
            </>
        )}
      </div>
    </div>
  );
};
