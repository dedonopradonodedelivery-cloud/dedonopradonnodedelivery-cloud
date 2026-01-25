
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  Check, 
  Home, 
  LayoutGrid, 
  Zap, 
  MapPin, 
  Rocket,
  Loader2,
  Calendar,
  CheckCircle2,
  Upload,
  Paintbrush,
  Sparkles,
  ShieldCheck,
  Megaphone,
  X,
  ImageIcon,
  CreditCard
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StoreBannerEditor } from '@/components/StoreBannerEditor';

interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  user: User | null;
  categoryName?: string;
  viewMode?: string;
  initialView?: 'sales' | 'chat';
}

const NEIGHBORHOODS_LIST = [
  "Freguesia", "Anil", "Pechincha", "Taquara", "Tanque", 
  "Curicica", "Parque Olímpico", "Gardênia", "Cidade de Deus"
];

const PLACEMENT_OPTIONS = [
  { id: 'home', label: 'Banner na Home', icon: Home, price: 39.90, originalPrice: 199.90, description: 'Maior destaque do app. Ideal para visibilidade máxima no bairro.' },
  { id: 'cat', label: 'Banner na Categoria', icon: LayoutGrid, price: 19.90, originalPrice: 149.90, description: 'Destaque sua loja dentro da categoria onde seus clientes procuram.' },
  { id: 'sub', label: 'Banner na Subcategoria', icon: Zap, price: 9.90, originalPrice: 99.90, description: 'Apareça quando o cliente busca exatamente o que você vende.' },
];

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user, categoryName, viewMode, initialView = 'sales' }) => {
  const [view, setView] = useState<'sales' | 'editor' | 'pro_checkout' | 'pro_processing' | 'pro_approved' | 'pro_chat'>('sales');
  const [selectedPlacement, setSelectedPlacement] = useState<string | null>(null);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [selectedHoods, setSelectedHoods] = useState<string[]>([]);
  const [artChoice, setArtChoice] = useState<'upload' | 'diy' | 'pro' | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs
  const periodRef = useRef<HTMLDivElement>(null);
  const neighborhoodsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setArtChoice('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const dynamicPeriods = useMemo(() => {
    const now = new Date();
    const formatDate = (date: Date) => date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    
    const end1 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const end3 = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    return [
      { id: '1m', label: '1 Mês', dates: `${formatDate(now)} a ${formatDate(end1)}`, multiplier: 1 },
      { id: '3m', label: '3 Meses', dates: `${formatDate(now)} a ${formatDate(end3)}`, multiplier: 3, promo: true },
    ];
  }, []);

  const calculateTotal = useMemo(() => {
    if (!selectedPlacement) return 0;
    const placement = PLACEMENT_OPTIONS.find(p => p.id === selectedPlacement);
    if (!placement) return 0;

    const basePrice = placement.price;
    const hoodCount = Math.max(0, selectedHoods.length);
    
    let total = 0;
    selectedPeriods.forEach(pId => {
      const p = dynamicPeriods.find(period => period.id === pId);
      if (p) total += (basePrice * p.multiplier * (hoodCount || 1));
    });

    if (artChoice === 'pro') total += 149.90;
    
    return total;
  }, [selectedPlacement, selectedPeriods, selectedHoods, artChoice, dynamicPeriods]);

  const handleSelectPlacement = (id: string) => {
    setSelectedPlacement(id);
    scrollTo(periodRef);
  };

  const togglePeriod = (id: string) => {
    setSelectedPeriods(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    if (selectedPeriods.length === 0) scrollTo(neighborhoodsRef);
  };

  const toggleHood = (hood: string) => {
    setSelectedHoods(prev => prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood]);
  };

  const handleSelectAllHoods = () => {
    if (selectedHoods.length === NEIGHBORHOODS_LIST.length) setSelectedHoods([]);
    else setSelectedHoods([...NEIGHBORHOODS_LIST]);
  };

  const handleConfirmPayment = () => {
    setView('pro_processing');
    setTimeout(() => {
        setView('pro_approved');
    }, 2000);
  };

  if (view === 'editor') {
    return (
      <StoreBannerEditor 
        storeName={user?.user_metadata?.store_name || "Sua Loja"} 
        onSave={() => { setArtChoice('diy'); setView('sales'); }} 
        onBack={() => setView('sales')} 
      />
    );
  }

  if (view === 'pro_checkout') {
    return (
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 flex flex-col animate-in slide-in-from-right duration-300">
        <header className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4 bg-white dark:bg-gray-900">
          <button onClick={() => setView('sales')} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl"><ChevronLeft size={20}/></button>
          <h2 className="font-bold">Checkout Seguro</h2>
        </header>
        <main className="flex-1 p-6 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
             <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Resumo do Investimento</h3>
             <div className="flex justify-between text-sm">
                <span className="text-gray-600">Investimento em Banners</span>
                <span className="font-bold">R$ {(calculateTotal - (artChoice === 'pro' ? 149.90 : 0)).toFixed(2).replace('.', ',')}</span>
             </div>
             <div className="flex justify-between text-sm text-amber-600">
                <span className="font-bold">Criação com Time Localizei JPA</span>
                <span className="font-black">+ R$ 149,90</span>
             </div>
             <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">Total a Pagar</span>
                <span className="text-2xl font-black text-[#1E5BFF]">R$ {calculateTotal.toFixed(2).replace('.', ',')}</span>
             </div>
          </div>

          <div className="space-y-3">
             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Forma de Pagamento</p>
             <button className="w-full flex items-center justify-between p-5 bg-white dark:bg-gray-900 rounded-2xl border-2 border-[#1E5BFF] shadow-sm">
                <div className="flex items-center gap-3">
                    <CreditCard className="text-[#1E5BFF]" />
                    <span className="font-bold">Cartão de Crédito</span>
                </div>
                <CheckCircle2 size={18} className="text-[#1E5BFF]" />
             </button>
             <p className="text-[10px] text-gray-400 text-center">Ambiente seguro criptografado</p>
          </div>
        </main>
        <footer className="p-6">
            <button 
                onClick={handleConfirmPayment}
                className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-2xl shadow-xl active:scale-[0.98] transition-all"
            >
                Confirmar Pagamento
            </button>
        </footer>
      </div>
    );
  }

  if (view === 'pro_processing') {
    return (
        <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <Loader2 className="w-12 h-12 text-[#1E5BFF] animate-spin mb-6" />
            <h2 className="text-xl font-bold">Processando seu pedido...</h2>
            <p className="text-gray-500 text-sm mt-2">Estamos validando os dados do pagamento.</p>
        </div>
    );
  }

  if (view === 'pro_approved') {
    return (
        <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 mb-8">
                <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Pagamento Confirmado!</h2>
            <p className="text-gray-500 text-sm max-w-xs mb-10">
                Agora você pode falar com nosso time de designers para criar seu banner personalizado.
            </p>
            <button 
                onClick={() => setView('pro_chat')}
                className="w-full max-w-sm bg-[#1E5BFF] text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 animate-bounce"
            >
                Falar com o designer
                <ArrowRight size={20} />
            </button>
        </div>
    );
  }

  if (view === 'pro_chat') {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col animate-in slide-in-from-bottom duration-300">
            <header className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
                <button onClick={() => setView('sales')} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl"><ChevronLeft size={20}/></button>
                <div className="flex-1">
                    <h2 className="font-bold">Chat com Designer</h2>
                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online agora</p>
                </div>
            </header>
            <main className="flex-1 p-6 flex flex-col justify-end gap-4 overflow-y-auto bg-gray-50 dark:bg-gray-950">
                <div className="bg-[#1E5BFF] text-white p-4 rounded-2xl rounded-bl-none shadow-sm max-w-[80%]">
                    <p className="text-sm">Olá! Sou o designer da Localizei. Vi que você contratou a criação profissional. Vamos começar?</p>
                </div>
            </main>
            <footer className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-2">
                <input type="text" placeholder="Digite sua mensagem..." className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm outline-none" />
                <button className="p-3 bg-[#1E5BFF] text-white rounded-xl"><ArrowRight size={20}/></button>
            </footer>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-64">
      
      {/* 1. TOPO DA PÁGINA (PITCH) */}
      <header className="bg-white dark:bg-gray-900 px-6 pt-12 pb-8 border-b border-gray-100 dark:border-gray-800 rounded-b-[3rem] shadow-sm">
        <button onClick={onBack} className="mb-6 p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 transition-colors">
          <ChevronLeft size={20} />
        </button>
        
        <div className="space-y-3">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Anunciar no Bairro</h1>
            <h2 className="text-lg font-bold text-[#1E5BFF] leading-tight">Destaque sua loja com banners exibidos para moradores do seu bairro, dentro do app.</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Apareça em locais estratégicos como Home, Categorias e Subcategorias.
              Mais visibilidade, mais visitas e mais chances de vender — todos os dias.
            </p>
        </div>
      </header>

      <div className="p-6 space-y-12">
        
        {/* 2. ONDE VOCÊ QUER ANUNCIAR? */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 px-1">Onde você quer anunciar?</h3>
          <div className="grid grid-cols-3 gap-2">
            {PLACEMENT_OPTIONS.map((opt) => (
              <button 
                key={opt.id}
                onClick={() => handleSelectPlacement(opt.id)}
                className={`relative p-3 rounded-2xl border-2 transition-all text-center flex flex-col items-center justify-between h-52 ${
                  selectedPlacement === opt.id 
                  ? 'bg-[#1E5BFF]/5 border-[#1E5BFF] text-[#1E5BFF] shadow-md' 
                  : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400'
                }`}
              >
                <opt.icon size={22} className={selectedPlacement === opt.id ? 'text-[#1E5BFF]' : 'text-gray-300'} />
                
                <p className="font-black uppercase text-[9px] tracking-tight leading-tight mt-2 h-8 flex items-center justify-center">{opt.label}</p>
                
                <div className="mt-auto pt-2 flex flex-col items-center">
                    <span className="text-[8px] line-through opacity-50 block">R$ {opt.originalPrice.toFixed(2).replace('.', ',')}</span>
                    <span className={`text-xs font-black block mt-0.5 ${selectedPlacement === opt.id ? 'text-[#1E5BFF]' : 'text-gray-700 dark:text-gray-200'}`}>
                        R$ {opt.price.toFixed(2).replace('.', ',')}
                    </span>
                </div>

                {selectedPlacement === opt.id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 size={14} className="text-[#1E5BFF]" />
                  </div>
                )}
              </button>
            ))}
          </div>
          {selectedPlacement && (
              <p className="text-[10px] text-gray-400 font-medium px-1 text-center animate-in fade-in">
                  {PLACEMENT_OPTIONS.find(p => p.id === selectedPlacement)?.description}
              </p>
          )}
        </section>

        {/* 3. POR QUANTO TEMPO? */}
        <section ref={periodRef} className={`space-y-4 transition-all duration-500 ${!selectedPlacement ? 'opacity-30 blur-[1px] pointer-events-none' : ''}`}>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 px-1">Por quanto tempo você quer anunciar?</h3>
          <div className="flex gap-3">
            {dynamicPeriods.map((p) => (
              <button 
                key={p.id} 
                onClick={() => togglePeriod(p.id)}
                className={`flex-1 p-5 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden ${
                  selectedPeriods.includes(p.id) ? 'bg-white dark:bg-gray-900 border-[#1E5BFF] shadow-md text-[#1E5BFF]' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400'
                }`}
              >
                {p.promo && <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[7px] font-black px-2 py-1 uppercase tracking-tighter rounded-bl-lg">Promo</div>}
                <p className={`font-black text-sm uppercase tracking-tighter ${selectedPeriods.includes(p.id) ? 'text-[#1E5BFF]' : ''}`}>{p.label}</p>
                <p className="text-[9px] font-bold opacity-60 mt-1 uppercase tracking-widest">{p.dates}</p>
              </button>
            ))}
          </div>
        </section>

        {/* 4. BAIRROS DE EXIBIÇÃO */}
        <section ref={neighborhoodsRef} className={`space-y-4 transition-all duration-500 ${selectedPeriods.length === 0 ? 'opacity-30 blur-[1px] pointer-events-none' : ''}`}>
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Bairros de exibição</h3>
            <button onClick={handleSelectAllHoods} className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest bg-[#1E5BFF]/10 px-3 py-1.5 rounded-xl border border-[#1E5BFF]/20">
              {selectedHoods.length === NEIGHBORHOODS_LIST.length ? 'Limpar' : 'Todos'}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide px-1">O banner será exibido apenas nos bairros selecionados.</p>
          <div className="flex flex-wrap gap-2">
            {NEIGHBORHOODS_LIST.map((hood) => (
              <button 
                key={hood}
                onClick={() => toggleHood(hood)}
                className={`px-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                  selectedHoods.includes(hood) ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-md' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-500'
                }`}
              >
                {hood}
              </button>
            ))}
          </div>
        </section>

        {/* 6. COMO VOCÊ QUER CRIAR SEU BANNER? */}
        <section className={`space-y-4 transition-all duration-500 ${selectedHoods.length === 0 ? 'opacity-30 blur-[1px] pointer-events-none' : ''}`}>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 px-1">Como você quer criar seu banner?</h3>
          <div className="space-y-3">
            {/* INPUT DE ARQUIVO OCULTO */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />

            <button 
                onClick={triggerUpload}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${artChoice === 'upload' ? 'bg-white dark:bg-gray-900 border-[#1E5BFF] shadow-md' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${artChoice === 'upload' ? 'bg-[#1E5BFF]/10 text-[#1E5BFF]' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'}`}>
                      {uploadedImage ? <img src={uploadedImage} className="w-full h-full object-cover rounded-lg" alt="Preview" /> : <Upload size={18}/>}
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-bold uppercase tracking-tight ${artChoice === 'upload' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Usar minha arte</p>
                      <p className="text-[9px] text-emerald-500 font-bold uppercase">{uploadedImage ? 'Imagem selecionada' : 'Sem custo adicional'}</p>
                    </div>
                </div>
                {artChoice === 'upload' && <CheckCircle2 size={18} className="text-[#1E5BFF]" />}
            </button>

            <button 
                onClick={() => setView('editor')}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${artChoice === 'diy' ? 'bg-white dark:bg-gray-900 border-[#1E5BFF] shadow-md' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 opacity-60 grayscale'}`}
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600"><Paintbrush size={18}/></div>
                    <p className={`text-sm font-bold uppercase tracking-tight ${artChoice === 'diy' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Criação personalizada (Opcional)</p>
                </div>
                {artChoice === 'diy' && <CheckCircle2 size={18} className="text-[#1E5BFF]" />}
            </button>

            <button 
                onClick={() => setArtChoice('pro')}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all relative overflow-hidden ${artChoice === 'pro' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-500 shadow-md' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'}`}
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600"><Rocket size={18}/></div>
                    <div className="text-left">
                        <p className={`text-sm font-bold uppercase tracking-tight ${artChoice === 'pro' ? 'text-amber-900 dark:text-amber-100' : 'text-gray-500'}`}>Criar com o time Localizei JPA</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-black text-amber-600">R$ 149,90</span>
                        </div>
                    </div>
                </div>
                {artChoice === 'pro' && <CheckCircle2 size={18} className="text-amber-500" />}
            </button>
            {artChoice === 'pro' && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium px-4 py-2 bg-amber-50 dark:bg-amber-900/10 rounded-xl animate-in fade-in">
                    Banner criado por nossa equipe. Ideal para quem quer um visual profissional.
                </p>
            )}
          </div>
        </section>

      </div>

      {/* 7. RESUMO E AÇÃO FINAL (FIXO ACIMA DA BOTTOM NAV) */}
      <footer className="fixed bottom-[80px] left-0 right-0 p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-50 max-w-md mx-auto shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-end mb-6">
            <div className="space-y-1">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Resumo do Pedido</p>
                <div className="flex flex-wrap gap-x-2 text-[11px] font-bold text-gray-700 dark:text-gray-200">
                    <span>{selectedPlacement ? PLACEMENT_OPTIONS.find(p => p.id === selectedPlacement)?.label : 'Selecione o local'}</span>
                    <span className="text-gray-300">•</span>
                    <span>{selectedPeriods.length > 0 ? `${selectedPeriods.length} período(s)` : 'Aguardando'}</span>
                </div>
                <p className="text-[11px] font-bold text-gray-400">{selectedHoods.length} bairro(s) escolhido(s)</p>
            </div>
            <div className="text-right">
                <p className="text-[9px] font-black text-[#1E5BFF] uppercase tracking-widest mb-1">Total a Investir</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">R$ {calculateTotal.toFixed(2).replace('.', ',')}</p>
            </div>
        </div>

        <button 
          onClick={() => artChoice === 'pro' ? setView('pro_checkout') : alert('Iniciando Pagamento...')}
          disabled={!selectedPlacement || selectedPeriods.length === 0 || selectedHoods.length === 0 || !artChoice}
          className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale uppercase tracking-widest text-xs"
        >
          Pagar anúncio
          <ArrowRight size={16} strokeWidth={3} />
        </button>
      </footer>
    </div>
  );
};
