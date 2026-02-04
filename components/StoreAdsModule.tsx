
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  Home, 
  LayoutGrid, 
  Zap, 
  MapPin, 
  Palette, 
  Rocket,
  Loader2,
  CheckCircle2,
  QrCode,
  Paintbrush,
  Upload,
  Calendar,
  Award,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StoreBannerEditor } from '@/components/StoreBannerEditor';

interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
  user: User | null;
  categoryName?: string;
  viewMode?: string;
  initialView?: 'sales' | 'chat';
}

const NEIGHBORHOODS = [
  "Freguesia", "Pechincha", "Anil", "Taquara", "Tanque", 
  "Curicica", "Parque Olímpico", "Gardênia", "Cidade de Deus"
];

const DURATION_OPTIONS = [
  { months: 1, label: '1 mês' },
  { months: 2, label: '2 meses' },
  { months: 3, label: '3 meses' },
  { months: 4, label: '4 meses' },
  { months: 5, label: '5 meses' },
  { months: 6, label: '6 meses' },
];

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user, initialView = 'sales' }) => {
  const [view, setView] = useState<'sales' | 'payment' | 'chat'>('sales');
  const [isEditingArt, setIsEditingArt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Estados do Pedido ---
  const [placement, setPlacement] = useState<{home: boolean, cat: boolean}>({ home: false, cat: false });
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [artChoice, setArtChoice] = useState<'my_art' | 'editor' | 'pro' | null>(null);
  const [uploadedBanner, setUploadedBanner] = useState<string | null>(null);

  // Refs para automações de UX
  const step2Ref = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialView === 'chat') setView('chat');
  }, [initialView]);

  // --- Precificação Original ---
  const PRICES = {
    HOME: 69.90,
    CAT: 29.90,
    COMBO: 89.90,
    PRO_ART: 69.90
  };

  // Helper para calcular datas por opção
  const getDatesForDuration = (months: number) => {
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + (months * 30));
    
    const fmt = (d: Date) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return `${fmt(start)} → ${fmt(end)}`;
  };

  const summary = useMemo(() => {
    let basePrice = 0;
    if (placement.home && placement.cat) basePrice = PRICES.COMBO;
    else if (placement.home) basePrice = PRICES.HOME;
    else if (placement.cat) basePrice = PRICES.CAT;

    const hoodsCount = selectedNeighborhoods.length;
    const subtotal = (basePrice * hoodsCount) * selectedDuration;
    const artExtra = artChoice === 'pro' ? PRICES.PRO_ART : 0;
    const total = subtotal + artExtra;

    return {
      basePrice,
      hoodsCount,
      subtotal,
      artExtra,
      total,
      placementLabel: placement.home && placement.cat ? 'Home + Categorias' : placement.home ? 'Página Inicial' : placement.cat ? 'Categorias' : 'Não selecionado'
    };
  }, [placement, selectedNeighborhoods, selectedDuration, artChoice]);

  const handlePlacementSelection = (choice: {home: boolean, cat: boolean}) => {
    setPlacement(choice);
    // UX: Auto-avanço para o Passo 2 com scroll suave
    setTimeout(() => {
      step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const toggleHood = (hood: string) => {
    if (hood === 'Todos') {
      setSelectedNeighborhoods(selectedNeighborhoods.length === NEIGHBORHOODS.length ? [] : [...NEIGHBORHOODS]);
    } else {
      setSelectedNeighborhoods(prev => prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedBanner(event.target?.result as string);
        setArtChoice('my_art');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    if (!placement.home && !placement.cat) return alert("Selecione onde o anúncio deve aparecer.");
    if (selectedNeighborhoods.length === 0) return alert("Selecione pelo menos um bairro.");
    if (!artChoice) return alert("Escolha uma opção de arte.");
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setView('payment');
      window.scrollTo(0, 0);
    }, 1000);
  };

  const handleFinish = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Pedido realizado com sucesso! Aguardando processamento.");
      onBack();
    }, 2000);
  };

  if (isEditingArt) {
    return <StoreBannerEditor storeName={user?.user_metadata?.store_name || "Sua Loja"} onSave={() => { setIsEditingArt(false); setArtChoice('editor'); }} onBack={() => setIsEditingArt(false)} />;
  }

  if (view === 'payment') {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col animate-in slide-in-from-right duration-300">
        <header className="p-6 border-b border-white/5 flex items-center gap-4 sticky top-0 bg-slate-950/80 backdrop-blur-md z-50">
          <button onClick={() => setView('sales')} className="p-2 bg-white/5 rounded-xl"><ChevronLeft size={20}/></button>
          <h1 className="font-bold text-lg">Finalizar Pagamento</h1>
        </header>
        <main className="p-6 space-y-8 flex-1">
          <div className="bg-slate-900 rounded-[2rem] p-8 border border-white/10 shadow-2xl">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Resumo da Campanha</h3>
              <div className="space-y-4">
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Posicionamento:</span><span className="font-bold">{summary.placementLabel}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Bairros:</span><span className="font-bold">{summary.hoodsCount} selecionado(s)</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Duração:</span><span className="font-bold text-blue-400">{selectedDuration} mês(es)</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Arte:</span><span className="font-bold">{artChoice === 'pro' ? 'Time Localizei' : artChoice === 'editor' ? 'Personalizada' : 'Própria'}</span></div>
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="font-black text-white uppercase text-xs">Total a Pagar</span>
                    <span className="text-3xl font-black text-emerald-400">R$ {summary.total.toFixed(2).replace('.', ',')}</span>
                  </div>
              </div>
          </div>
          <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Forma de Pagamento</p>
              <button className="w-full p-5 rounded-2xl bg-white/5 border-2 border-blue-500 flex items-center justify-between">
                <div className="flex items-center gap-4"><QrCode size={20} className="text-blue-400"/><span className="font-bold text-sm">PIX (Imediato)</span></div>
                <CheckCircle2 size={18} className="text-blue-500" />
              </button>
          </div>
        </main>
        <footer className="p-6 bg-slate-950 border-t border-white/10 pb-32">
          <button onClick={handleFinish} disabled={isSubmitting} className="w-full py-5 bg-[#1E5BFF] text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirmar e Publicar'}
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex flex-col overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"><ChevronLeft size={20} /></button>
        <div>
          <h1 className="font-bold text-lg leading-none">Anunciar no Bairro</h1>
          <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">Configuração de Campanha</p>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-16 pb-96 max-w-md mx-auto w-full">
        
        {/* 1. ONDE APARECER */}
        <section className="space-y-8">
          <div className="px-1 space-y-6 text-center">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight">
                Domine a atenção do seu bairro
              </h3>
              <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-xs mx-auto">
                Coloque sua loja no topo do app e seja a primeira escolha de quem mora e compra perto de você.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/30 p-6 rounded-[2.5rem] text-left relative overflow-hidden shadow-2xl shadow-blue-900/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20">
                  <Award className="w-6 h-6 text-amber-400" />
                </div>
                <h4 className="text-xs font-black text-white uppercase tracking-tight">Fundador Apoiador do Localizei JPA</h4>
              </div>
              <div className="space-y-4">
                <p className="text-[11px] text-slate-200 leading-relaxed font-bold">
                  Ao anunciar no mês de inauguração, sua loja recebe o selo de <span className="text-amber-400 uppercase">Fundador Apoiador</span> no perfil.
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  🔒 Além disso, você garante este valor com desconto durante todo o primeiro ano, pagando mês a mês.
                </p>
                <p className="text-[9px] text-slate-500 italic leading-relaxed pt-2 border-t border-white/5">
                  Após o lançamento, novos anunciantes entram com o preço normal, que pode ser ativado a qualquer momento.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
              {/* HOME */}
              <button 
                onClick={() => handlePlacementSelection({ home: true, cat: false })} 
                className={`flex items-start text-left p-6 rounded-[2.5rem] border-2 transition-all gap-5 ${placement.home && !placement.cat ? 'bg-blue-600/10 border-blue-500 shadow-lg' : 'bg-white/5 border-white/10'}`}
              >
                <div className={`p-4 rounded-2xl shrink-0 ${placement.home && !placement.cat ? 'bg-blue-50 text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}><Home size={28} /></div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-white uppercase tracking-tight">Home</p>
                      <span className="text-[7px] font-black bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30 uppercase tracking-widest">Fundador Protegido</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-500 line-through font-bold">R$ 199,90/mês</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-white">R$ 69,90</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">/mês</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">Economize R$ 130,00</span>
                      <span className="text-[8px] font-black text-blue-400 uppercase">65% OFF</span>
                    </div>
                    <p className="text-[7px] text-emerald-400 font-bold uppercase mt-2">Preço garantido por 12 meses</p>
                </div>
              </button>

              {/* SUBCATEGORIAS */}
              <button 
                onClick={() => handlePlacementSelection({ home: false, cat: true })} 
                className={`flex items-start text-left p-6 rounded-[2.5rem] border-2 transition-all gap-5 ${!placement.home && placement.cat ? 'bg-blue-600/10 border-blue-500 shadow-lg' : 'bg-white/5 border-white/10'}`}
              >
                <div className={`p-4 rounded-2xl shrink-0 ${!placement.home && placement.cat ? 'bg-blue-50 text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}><LayoutGrid size={28} /></div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-white uppercase tracking-tight">Subcategorias</p>
                      <span className="text-[7px] font-black bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30 uppercase tracking-widest">Fundador Protegido</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-500 line-through font-bold">R$ 159,90/mês</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-white">R$ 29,90</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">/mês</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">Economize R$ 130,00</span>
                      <span className="text-[8px] font-black text-blue-400 uppercase">81% OFF</span>
                    </div>
                    <p className="text-[7px] text-emerald-400 font-bold uppercase mt-2">Preço garantido por 12 meses</p>
                </div>
              </button>

              {/* COMBO */}
              <button 
                onClick={() => handlePlacementSelection({ home: true, cat: true })} 
                className={`relative flex items-start text-left p-6 rounded-[2.5rem] border-2 transition-all gap-5 ${placement.home && placement.cat ? 'bg-blue-600/10 border-blue-500 shadow-lg' : 'bg-white/5 border-white/10'}`}
              >
                <div className="absolute -top-3 right-6 bg-amber-400 text-slate-950 text-[8px] font-black px-2 py-0.5 rounded uppercase shadow-lg border border-amber-300">Maior visibilidade</div>
                <div className={`p-4 rounded-2xl shrink-0 ${placement.home && placement.cat ? 'bg-blue-50 text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}><Zap size={28} /></div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-white uppercase tracking-tight">Home + Subcategorias</p>
                      <span className="text-[7px] font-black bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30 uppercase tracking-widest">Fundador Protegido</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-500 line-through font-bold">R$ 359,80/mês</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-white">R$ 89,90</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">/mês</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">Economize R$ 269,90</span>
                      <span className="text-[8px] font-black text-blue-400 uppercase">75% OFF</span>
                    </div>
                    <p className="text-[7px] text-emerald-400 font-bold uppercase mt-2">Preço garantido por 12 meses</p>
                </div>
              </button>
          </div>
        </section>

        {/* 2. QUAIS BAIRROS */}
        <section ref={step2Ref} className="space-y-6 scroll-mt-24">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1">
            <MapPin size={14} /> 2. Quais bairros?
          </h3>
          <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => toggleHood('Todos')}
                className={`col-span-2 p-4 rounded-2xl border-2 font-black uppercase text-xs flex items-center justify-center gap-2 transition-all ${selectedNeighborhoods.length === NEIGHBORHOODS.length ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
              >
                {selectedNeighborhoods.length === NEIGHBORHOODS.length ? <CheckCircle2 size={16}/> : <LayoutGrid size={16}/>}
                Todos os bairros (9 unidades)
              </button>
              {NEIGHBORHOODS.map(hood => (
                  <button 
                    key={hood}
                    onClick={() => toggleHood(hood)}
                    className={`p-4 rounded-2xl border-2 text-[10px] font-bold uppercase transition-all ${selectedNeighborhoods.includes(hood) ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-slate-500'}`}
                  >
                    {hood}
                  </button>
              ))}
          </div>
        </section>

        {/* 3. TEMPO DE EXIBIÇÃO */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
                <Calendar size={14} /> 3. Escolha o tempo de exibição
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
              {DURATION_OPTIONS.map(opt => (
                  <button 
                    key={opt.months}
                    onClick={() => setSelectedDuration(opt.months)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${selectedDuration === opt.months ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-500'}`}
                  >
                      <span className="text-xs font-black uppercase tracking-tighter leading-none">{opt.label}</span>
                      <span className={`text-[7px] font-bold mt-2 uppercase tracking-tighter whitespace-nowrap ${selectedDuration === opt.months ? 'text-blue-100' : 'text-slate-600'}`}>
                          {getDatesForDuration(opt.months)}
                      </span>
                  </button>
              ))}
          </div>
        </section>

        {/* 4. ESCOLHA DO BANNER */}
        <section className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1">
            <Palette size={14} /> 4. Escolha seu Banner
          </h3>
          <div className="space-y-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full p-6 rounded-[2rem] border-2 text-left flex items-center gap-5 transition-all ${artChoice === 'my_art' ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-white/5 border-white/10'}`}
              >
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                    {uploadedBanner ? <img src={uploadedBanner} className="w-full h-full object-cover rounded-lg" /> : <Upload size={24} />}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-white text-sm truncate">{uploadedBanner ? 'Banner selecionado' : 'Usar meu banner'}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">{uploadedBanner ? 'Toque para trocar o arquivo' : 'Galeria (Mobile) / Explorador (PC)'}</p>
                </div>
                {uploadedBanner && <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />}
              </button>

              <button 
                onClick={() => setIsEditingArt(true)}
                className={`w-full p-6 rounded-[2rem] border-2 text-left flex items-center gap-5 transition-all ${artChoice === 'editor' ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-white/5 border-white/10'}`}
              >
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400"><Paintbrush size={24} /></div>
                <div>
                  <h4 className="font-bold text-white text-sm">Criar banner personalizado</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Use nosso editor automático.</p>
                </div>
              </button>

              <button 
                onClick={() => setArtChoice('pro')}
                className={`relative w-full p-6 rounded-[2rem] border-2 text-left flex items-center gap-5 transition-all ${artChoice === 'pro' ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-white/5 border-white/10'}`}
              >
                <div className="absolute top-4 right-6 text-[8px] font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 uppercase tracking-widest">Recomendado</div>
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400"><Rocket size={24} /></div>
                <div>
                  <h4 className="font-bold text-white text-sm">Fazer com time Localizei</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Nossos designers criam para você (+R$ 69,90).</p>
                </div>
              </button>
          </div>
        </section>

      </main>

      {/* 5. PRÉVIA DO PEDIDO (FIXA) */}
      {/* Ajustado fixed bottom e paddings para respeitar a BottomNav do App.tsx */}
      <div className="fixed bottom-[90px] left-0 right-0 p-6 bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 z-[100] max-w-md mx-auto shadow-[0_-20px_40px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom duration-500 rounded-t-[2.5rem]">
        
        <div className="mb-4 flex flex-col gap-3 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl">
                <CheckCircle2 size={12} className="text-blue-400" />
                <p className="text-[9px] font-bold text-blue-300 uppercase tracking-tight">
                    ✅ Valor promocional garantido por 12 meses para apoiadores iniciais.
                </p>
            </div>
            
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Resumo em tempo real</p>
                    <p className="text-xs font-bold text-slate-300">Plano: <span className="text-white">{summary.placementLabel}</span></p>
                    <p className="text-xs font-bold text-slate-300">Tempo: <span className="text-white">{selectedDuration} meses / {summary.hoodsCount} bairros</span></p>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Total da Campanha</p>
                    <p className="text-2xl font-black text-emerald-400 tracking-tighter leading-none">
                        R$ {summary.total.toFixed(2).replace('.', ',')}
                    </p>
                </div>
            </div>
        </div>

        <button 
          onClick={handleContinue} 
          disabled={isSubmitting} 
          className={`w-full py-5 rounded-[2rem] shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
            (placement.home || placement.cat) && selectedNeighborhoods.length > 0 && artChoice ? 'bg-[#1E5BFF] text-white hover:bg-blue-600' : 'bg-white/5 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Continuar para Pagamento <ArrowRight size={18} /></>}
        </button>
      </div>

    </div>
  );
};
