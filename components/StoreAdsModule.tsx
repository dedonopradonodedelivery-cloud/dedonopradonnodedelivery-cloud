
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  ArrowRight, 
  Check, 
  Home, 
  LayoutGrid, 
  Zap, 
  MapPin, 
  Palette, 
  Rocket, 
  Loader2, 
  Target, 
  Crown, 
  Calendar, 
  CheckCircle2, 
  MessageCircle, 
  Info, 
  AlertTriangle, 
  CheckSquare, 
  Paintbrush, 
  Image as ImageIcon, 
  Upload, 
  X, 
  Plus, 
  Send, 
  User as UserIcon, 
  MessageSquare as MessageIcon, 
  FileText, 
  Sparkles, 
  ShieldCheck,
  Megaphone,
  Store as StoreIcon,
  ShoppingBag
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StoreBannerEditor } from './StoreBannerEditor';

const NEIGHBORHOODS_LIST = [
  "Freguesia", "Anil", "Pechincha", "Taquara", "Tanque", 
  "Curicica", "Parque Olímpico", "Gardênia", "Cidade de Deus"
];

const PLACEMENT_OPTIONS = [
  { 
    id: 'home', 
    label: 'Home', 
    icon: Home, 
    price: 49.90,
    description: 'Carrossel principal da página inicial',
    img: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=200&auto=format&fit=crop'
  },
  { 
    id: 'cat', 
    label: 'Categorias', 
    icon: LayoutGrid, 
    price: 29.90,
    description: 'Topo das buscas por categoria',
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=200&auto=format&fit=crop'
  },
  { 
    id: 'combo', 
    label: 'Home + Categorias', 
    icon: Zap, 
    price: 69.90,
    description: 'Máxima visibilidade em todo o app',
    img: 'https://images.unsplash.com/photo-1534452203294-49c8913721b2?q=80&w=200&auto=format&fit=crop'
  },
];

interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  categoryName?: string;
  user: User | null;
  viewMode?: string;
  initialView?: 'sales' | 'chat';
}

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user, categoryName, viewMode, initialView = 'sales' }) => {
  const isDesigner = viewMode === 'Designer';
  
  const [view, setView] = useState<'sales' | 'editor' | 'pro_chat'>('sales');
  const [selectedPlacement, setSelectedPlacement] = useState<string | null>(null);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [selectedHoods, setSelectedHoods] = useState<string[]>([]);
  const [artChoice, setArtChoice] = useState<'upload' | 'diy' | 'pro' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Datas Dinâmicas para os blocos de período
  const periodData = useMemo(() => {
    const p1Start = new Date();
    const p1End = new Date();
    p1End.setDate(p1Start.getDate() + 30);

    const p2Start = new Date(p1End);
    const p2End = new Date(p2Start);
    p2End.setDate(p2Start.getDate() + 30);

    const fmt = (d: Date) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

    return [
      { id: 'p1', label: 'Banner 1', dates: `${fmt(p1Start)} até ${fmt(p1End)}`, sub: 'Próximos 30 dias' },
      { id: 'p2', label: 'Banner 2', dates: `${fmt(p2Start)} até ${fmt(p2End)}`, sub: '30 dias subsequentes' }
    ];
  }, []);

  const handleTogglePeriod = (id: string) => {
    setSelectedPeriods(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleToggleHood = (hood: string) => {
    setSelectedHoods(prev => prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood]);
  };

  const selectAllHoods = () => {
    if (selectedHoods.length === NEIGHBORHOODS_LIST.length) setSelectedHoods([]);
    else setSelectedHoods([...NEIGHBORHOODS_LIST]);
  };

  const calculateTotal = useMemo(() => {
    if (!selectedPlacement) return 0;
    const placementObj = PLACEMENT_OPTIONS.find(p => p.id === selectedPlacement);
    if (!placementObj) return 0;

    const basePrice = placementObj.price;
    const hoodCount = Math.max(0, selectedHoods.length);
    const periodCount = Math.max(0, selectedPeriods.length);
    
    let total = basePrice * hoodCount * periodCount;
    if (artChoice === 'pro') total += 89.90;
    
    return total;
  }, [selectedPlacement, selectedHoods, selectedPeriods, artChoice]);

  if (view === 'editor') {
    return (
      <StoreBannerEditor 
        storeName={user?.user_metadata?.store_name || "Sua Loja"} 
        onSave={(design) => { setArtChoice('diy'); setView('sales'); }} 
        onBack={() => setView('sales')} 
      />
    );
  }

  if (view === 'pro_chat') {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col animate-in slide-in-from-right duration-300">
            <header className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
                <button onClick={() => setView('sales')} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl"><ChevronLeft size={20}/></button>
                <div className="flex-1">
                    <h2 className="font-bold">Chat com Designer</h2>
                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online para seu briefing</p>
                </div>
            </header>
            <main className="flex-1 p-6 flex flex-col justify-end gap-4 overflow-y-auto bg-gray-50 dark:bg-gray-950">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-800 max-w-[80%]">
                    <p className="text-sm">Olá! Sou o designer responsável pelo seu banner. Para começarmos, poderia me enviar o logo da sua loja e qual a promoção principal?</p>
                </div>
            </main>
            <footer className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-2">
                <input type="text" placeholder="Digite sua mensagem..." className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm outline-none" />
                <button className="p-3 bg-[#1E5BFF] text-white rounded-xl"><Send size={20}/></button>
            </footer>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans flex flex-col animate-in fade-in duration-500">
      
      {/* 1. TOPO DA PÁGINA */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-6 py-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-gray-900 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-black text-2xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Anunciar no Bairro</h1>
            <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Impulsione seu Negócio</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Apareça em destaque para moradores do seu bairro dentro do app. Escolha onde aparecer, por quanto tempo e como será seu banner.
        </p>
      </header>

      <main className="flex-1 p-6 space-y-12 pb-48 max-w-md mx-auto w-full">
        
        {/* 2. ONDE VOCÊ QUER APARECER */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 px-1">Onde você quer anunciar?</h3>
          <div className="grid grid-cols-1 gap-3">
            {PLACEMENT_OPTIONS.map((opt) => (
              <button 
                key={opt.id}
                onClick={() => setSelectedPlacement(opt.id)}
                className={`flex items-center p-4 rounded-3xl border-2 transition-all text-left gap-4 ${
                  selectedPlacement === opt.id ? 'bg-white dark:bg-gray-900 border-[#1E5BFF] shadow-lg' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 opacity-70'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-gray-100 dark:border-gray-800">
                  <img src={opt.img} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold text-gray-900 dark:text-white text-sm">{opt.label}</span>
                    {selectedPlacement === opt.id && <CheckCircle2 size={16} className="text-[#1E5BFF]" />}
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">{opt.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 3. PERÍODO DE EXIBIÇÃO */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 px-1">Por quanto tempo você quer anunciar?</h3>
          <div className="grid grid-cols-1 gap-3">
            {periodData.map((p) => (
              <button 
                key={p.id}
                onClick={() => handleTogglePeriod(p.id)}
                className={`p-5 rounded-3xl border-2 transition-all text-left flex justify-between items-center ${
                  selectedPeriods.includes(p.id) ? 'bg-[#1E5BFF]/5 dark:bg-blue-900/10 border-[#1E5BFF]' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'
                }`}
              >
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">{p.label}</h4>
                  <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">{p.dates}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{p.sub}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPeriods.includes(p.id) ? 'bg-[#1E5BFF] border-[#1E5BFF]' : 'border-gray-200'}`}>
                  {selectedPeriods.includes(p.id) && <Check size={14} className="text-white" strokeWidth={4} />}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 4. BAIRROS DE EXIBIÇÃO */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Bairros de exibição</h3>
            <button onClick={selectAllHoods} className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest">
              {selectedHoods.length === NEIGHBORHOODS_LIST.length ? 'Desmarcar todos' : 'Selecionar todos'}
            </button>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm grid grid-cols-2 gap-2">
            {NEIGHBORHOODS_LIST.map((hood) => (
              <button 
                key={hood}
                onClick={() => handleToggleHood(hood)}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                  selectedHoods.includes(hood) ? 'bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF]' : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${selectedHoods.includes(hood) ? 'bg-[#1E5BFF] border-[#1E5BFF]' : 'border-gray-200'}`}>
                   {selectedHoods.includes(hood) && <Check size={12} className="text-white" strokeWidth={4} />}
                </div>
                <span className="text-[11px] font-bold truncate">{hood}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 5. ESCOLHA COMO CRIAR SUA ARTE */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 px-1">Como você quer criar seu banner?</h3>
          <div className="space-y-3">
            {/* Opção 1 */}
            <button 
                onClick={() => setArtChoice('upload')}
                className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all gap-4 text-left ${artChoice === 'upload' ? 'bg-white dark:bg-gray-900 border-[#1E5BFF]' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'}`}
            >
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 shrink-0"><Upload size={18}/></div>
                <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">Usar minha arte</h4>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">Faça upload da sua imagem</p>
                </div>
            </button>

            {/* Opção 2 */}
            <button 
                onClick={() => setView('editor')}
                className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all gap-4 text-left ${artChoice === 'diy' ? 'bg-white dark:bg-gray-900 border-[#1E5BFF]' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'}`}
            >
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0"><Paintbrush size={18}/></div>
                <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">Criação personalizada</h4>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">Crie seu banner dentro do app</p>
                </div>
            </button>

            {/* Opção 3 */}
            <button 
                onClick={() => setArtChoice('pro')}
                className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all gap-4 text-left relative overflow-hidden ${artChoice === 'pro' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-500 shadow-md' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'}`}
            >
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 shrink-0"><Rocket size={18}/></div>
                <div className="flex-1">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">Criar com o time Localizei</h4>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">Criação profissional do seu banner</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-400 line-through">R$ 169,90</span>
                        <span className="text-xs font-black text-amber-600">R$ 89,90</span>
                    </div>
                </div>
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[7px] font-black px-2 py-1 uppercase tracking-tighter rounded-bl-lg">Promo de Inauguração</div>
            </button>
          </div>
        </section>

      </main>

      {/* 6. RESUMO E AÇÃO FINAL */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 z-50 max-w-md mx-auto shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-end mb-6">
            <div className="space-y-1">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Resumo do Pedido</p>
                <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                    {selectedPlacement ? `${PLACEMENT_OPTIONS.find(p => p.id === selectedPlacement)?.label}` : 'Selecione o local'} • {selectedHoods.length} bairro(s)
                </p>
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-500">
                    {selectedPeriods.length} período(s)
                </p>
            </div>
            <div className="text-right">
                <p className="text-[9px] font-black text-[#1E5BFF] uppercase tracking-widest mb-1">Total a Investir</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">R$ {calculateTotal.toFixed(2).replace('.', ',')}</p>
            </div>
        </div>

        <button 
          onClick={() => artChoice === 'pro' ? setView('pro_chat') : alert('Iniciando checkout...')}
          disabled={!selectedPlacement || selectedPeriods.length === 0 || selectedHoods.length === 0 || !artChoice}
          className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale uppercase tracking-widest text-xs"
        >
          {artChoice === 'pro' ? 'Contratar Banner e Falar com Designer' : 'Continuar / Contratar Banner'}
          <ArrowRight size={16} strokeWidth={3} />
        </button>
      </footer>
    </div>
  );
};
