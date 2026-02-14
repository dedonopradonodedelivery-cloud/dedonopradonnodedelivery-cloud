
import React, { useMemo, useState, useEffect } from "react";
import { Store, Classified, Job } from "@/types";
import {
  MapPin,
  Sparkles,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  Flame,
  MessageSquare,
  Repeat,
  Search,
  Users,
  Calendar,
  Dog,
  Gift,
  Briefcase,
  ChevronRight
} from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MOCK_CLASSIFIEDS, MOCK_JOBS } from "@/constants";

// --- MOCK DATA & TYPES ---

interface EventItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  date: string;
}
interface SpecialistItem {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  neighborhood: string;
}

type FeedItem = 
  | { type: 'trade'; data: Classified }
  | { type: 'lost_found'; data: Classified }
  | { type: 'event'; data: EventItem }
  | { type: 'specialist'; data: SpecialistItem }
  | { type: 'opportunity'; data: Job };

const MOCK_EVENTS: EventItem[] = [
  { id: 'ev1', title: 'Música ao Vivo no Bar do Zé', subtitle: 'Noite de MPB a partir das 20h', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600', date: 'SEX, 24 NOV' },
  { id: 'ev2', title: 'Feira de Artesanato Local', subtitle: 'Apoie os artesãos do bairro na praça', image: 'https://images.unsplash.com/photo-1541948159363-c7a6f7ab3521?q=80&w=600', date: 'SÁB, 25 NOV' },
];

const MOCK_SPECIALISTS: SpecialistItem[] = [
  { id: 'sp1', name: 'Dr. Ricardo Alves', specialty: 'Cardiologista', avatar: 'https://i.pravatar.cc/150?u=doc1', neighborhood: 'Freguesia' },
  { id: 'sp2', name: 'Juliana Costa', specialty: 'Advogada de Família', avatar: 'https://i.pravatar.cc/150?u=adv1', neighborhood: 'Taquara' },
  { id: 'sp3', name: 'Marcos Oliveira', specialty: 'Personal Trainer', avatar: 'https://i.pravatar.cc/150?u=trainer1', neighborhood: 'Pechincha' },
];

const MOCK_DYNAMIC_FEED: FeedItem[] = [
  ...MOCK_EVENTS.map(e => ({ type: 'event' as const, data: e })),
  ...MOCK_SPECIALISTS.map(s => ({ type: 'specialist' as const, data: s })),
  ...MOCK_CLASSIFIEDS.filter(c => c.acceptsTrade).slice(0,2).map(c => ({ type: 'trade' as const, data: c })),
  ...MOCK_CLASSIFIEDS.filter(c => c.category === 'Achados e Perdidos' || c.category === 'Adoção de pets').slice(0,2).map(c => ({ type: 'lost_found' as const, data: c })),
  ...MOCK_JOBS.slice(0,2).map(j => ({ type: 'opportunity' as const, data: j })),
];


const MOCK_PULSE_ITEMS = [
  { id: 'p1', icon: Flame, title: 'Bairro movimentado!', subtitle: 'Descubra o que está em alta agora', color: 'text-rose-400', bg: 'from-rose-500/20 to-transparent' },
  { id: 'p2', icon: MessageSquare, title: 'JPA está conversando', subtitle: 'Veja os novos posts da comunidade', color: 'text-sky-400', bg: 'from-sky-500/20 to-transparent' },
  { id: 'p3', icon: Repeat, title: 'Trocas em alta', subtitle: 'Novos itens no Troca-Troca', color: 'text-purple-400', bg: 'from-purple-500/20 to-transparent' },
  { id: 'p4', icon: Search, title: 'Um pet foi encontrado', subtitle: 'Ajude um vizinho a encontrar seu amigo', color: 'text-amber-400', bg: 'from-amber-500/20 to-transparent' },
];


// --- UTILS & PROPS ---

type ExploreViewProps = {
  stores: Store[];
  onStoreClick: (store: Store) => void;
  onNavigate: (view: string, data?: any) => void;
};


// --- CARD COMPONENTS ---

const SectionHeader: React.FC<{ icon: React.ElementType; title: string; subtitle: string; onSeeMore?: () => void }> = ({ icon: Icon, title, subtitle, onSeeMore }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-900 dark:text-white shadow-sm border border-gray-100 dark:border-gray-800">
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-1">{title}</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>
      {onSeeMore && <button onClick={onSeeMore} className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest hover:underline active:opacity-60">Ver mais</button>}
    </div>
);

const PulseCard: React.FC<{ item: typeof MOCK_PULSE_ITEMS[0]; onClick: () => void }> = ({ item, onClick }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className="relative w-44 h-48 flex-shrink-0 snap-start bg-slate-900 rounded-[2rem] overflow-hidden group cursor-pointer transition-all active:scale-95 border border-white/10"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${item.bg} opacity-30 group-hover:opacity-60 transition-opacity`}></div>
      <div className="p-4 flex flex-col justify-between h-full">
        <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10 ${item.color}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <div className="text-left mt-4">
          <h4 className="font-bold text-sm text-white leading-tight">{item.title}</h4>
          <p className="text-[10px] text-slate-400 mt-1">{item.subtitle}</p>
        </div>
      </div>
    </button>
  );
};

const ActivityIndicators: React.FC = () => {
  const indicators = [
    { text: 'Bairro quente', icon: Flame, color: 'text-rose-500', bg: 'bg-rose-50/70 dark:bg-rose-900/20', border: 'border-rose-100 dark:border-rose-800/50' },
    { text: 'Alta interação', icon: MessageSquare, color: 'text-sky-500', bg: 'bg-sky-50/70 dark:bg-sky-900/20', border: 'border-sky-100 dark:border-sky-800/50' },
    { text: 'Muitas novidades', icon: Sparkles, color: 'text-emerald-500', bg: 'bg-emerald-50/70 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800/50' },
  ];

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      {indicators.map((item, index) => (
        <div key={index} className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full ${item.bg} border ${item.border} shadow-sm`}>
          <item.icon size={12} strokeWidth={2.5} className={item.color} />
          <span className={`text-[8px] font-black uppercase tracking-widest ${item.color}`}>{item.text}</span>
        </div>
      ))}
    </div>
  );
};

const NeighborhoodPulse: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="space-y-4">
      <SectionHeader icon={TrendingUp} title="Pulso do Bairro" subtitle="O que está acontecendo agora" />
      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x -mx-6 px-6 pb-2">
        {MOCK_PULSE_ITEMS.map((item) => (
          <PulseCard key={item.id} item={item} onClick={() => onNavigate('home')} />
        ))}
      </div>
      <ActivityIndicators />
    </div>
  );
};

const EventCard: React.FC<{ item: EventItem; onClick: () => void }> = ({ item, onClick }) => (
    <button onClick={onClick} className="w-full bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 group active:scale-[0.99] transition-transform">
        <div className="relative h-40">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-xl text-center backdrop-blur-md border border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none block">{item.date.split(',')[0]}</span>
                <span className="text-xl font-black leading-none block">{item.date.split(',')[1]?.trim().split(' ')[1]}</span>
            </div>
        </div>
        <div className="p-5">
            <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Evento Local</span>
            <h3 className="font-bold text-gray-900 dark:text-white mt-1 leading-tight">{item.title}</h3>
        </div>
    </button>
);

const SpecialistCard: React.FC<{ item: SpecialistItem; onClick: () => void }> = ({ item, onClick }) => (
    <button onClick={onClick} className="w-full bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 group active:scale-[0.99] transition-transform">
        <img src={item.avatar} alt={item.name} className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg" />
        <div className="flex-1 text-left">
            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Especialista</span>
            <h3 className="font-bold text-gray-900 dark:text-white mt-0.5">{item.name}</h3>
            <p className="text-xs text-gray-500 font-medium">{item.specialty}</p>
        </div>
        <ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
    </button>
);

const LostAndFoundCard: React.FC<{ item: Classified; onClick: () => void }> = ({ item, onClick }) => (
    <button onClick={onClick} className="w-full bg-gradient-to-br from-amber-500 to-yellow-500 text-white p-6 rounded-3xl shadow-lg group active:scale-[0.99] transition-transform flex items-center gap-5">
      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20"><Search size={24} /></div>
      <div className="text-left">
        <span className="text-[9px] font-black uppercase tracking-widest">{item.category === 'Adoção de pets' ? 'Adoção Urgente' : 'Achados & Perdidos'}</span>
        <h3 className="font-bold mt-0.5 leading-tight">{item.title}</h3>
      </div>
    </button>
);

const OpportunityCard: React.FC<{ item: Job; onClick: () => void }> = ({ item, onClick }) => (
    <button onClick={onClick} className="w-full bg-slate-900 text-white p-6 rounded-3xl shadow-lg group active:scale-[0.99] transition-transform text-left border border-white/10">
        <div className="flex items-start justify-between">
            <div>
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Oportunidade</span>
                <h3 className="font-bold mt-1 text-lg leading-tight">{item.role}</h3>
                <p className="text-sm text-slate-400 font-medium">{item.company}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10"><Briefcase size={20} /></div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 text-xs font-bold text-slate-400 flex justify-between">
            <span>{item.neighborhood}</span>
            <span>{item.type}</span>
        </div>
    </button>
);

// --- MAIN EXPLORE VIEW ---

export const ExploreView: React.FC<ExploreViewProps> = ({ stores, onStoreClick, onNavigate }) => {

  const dynamicFeed = useMemo(() => {
    // Shuffle on mount to feel dynamic
    return [...MOCK_DYNAMIC_FEED].sort(() => Math.random() - 0.5);
  }, []);

  const renderFeedItem = (item: FeedItem, index: number) => {
    switch (item.type) {
        case 'event':
            return <EventCard key={`feed-${index}`} item={item.data} onClick={() => onNavigate('home')} />;
        case 'specialist':
            return <SpecialistCard key={`feed-${index}`} item={item.data} onClick={() => onNavigate('home')} />;
        case 'lost_found':
            return <LostAndFoundCard key={`feed-${index}`} item={item.data} onClick={() => onNavigate('classified_detail', { item: item.data })} />;
        case 'opportunity':
            return <OpportunityCard key={`feed-${index}`} item={item.data} onClick={() => onNavigate('job_detail', { job: item.data })} />;
        case 'trade':
            // O card de troca pode ser mais complexo, por simplicidade usamos um card de oportunidade.
             return <OpportunityCard key={`feed-${index}`} item={{...item.data, role: item.data.title, company: 'Troca-Troca'} as any} onClick={() => onNavigate('desapega')} />;
        default:
            return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24 animate-in fade-in duration-500">
      <div className="p-6 space-y-12">
        <NeighborhoodPulse onNavigate={onNavigate} />
        
        <div className="space-y-6">
            <SectionHeader icon={Sparkles} title="Para Você Descobrir" subtitle="Um feed de novidades do bairro" />
            <div className="space-y-6">
                {dynamicFeed.map(renderFeedItem)}
            </div>
        </div>
      </div>
    </div>
  );
};
