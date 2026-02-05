
import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  CreditCard,
  QrCode,
  Info,
  AlertTriangle,
  Lock,
  Unlock,
  CheckSquare,
  Paintbrush,
  Image as ImageIcon,
  Upload,
  X,
  Plus,
  Send,
  User as UserIcon,
  MessageSquare,
  FileText,
  BadgeCheck,
  Building,
  Terminal,
  Layers,
  Sparkles,
  ClipboardList,
  FileArchive,
  CornerDownRight,
  ShieldAlert
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StoreBannerEditor, BannerPreview } from '@/components/StoreBannerEditor';
import { supabase } from '@/lib/supabaseClient';

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

const DISPLAY_MODES = [
  { 
    id: 'home', 
    label: 'Home', 
    icon: Home, 
    price: 49.90,
    originalPrice: 199.90,
    description: 'Exibido no carrossel da página inicial para todos os usuários.',
    whyChoose: 'Ideal para máxima visibilidade imediata.'
  },
  { 
    id: 'cat', 
    label: 'Categorias', 
    icon: LayoutGrid, 
    price: 29.90,
    originalPrice: 149.90,
    description: 'Exibido no topo das buscas por produtos ou serviços específicos.',
    whyChoose: 'Impacta o cliente no momento da decisão.'
  },
  { 
    id: 'combo', 
    label: 'Home + Categorias', 
    icon: Zap, 
    price: 69.90,
    originalPrice: 349.80,
    description: 'Destaque na página inicial e em todas as categorias.',
    whyChoose: 'Mais alcance, cliques e chances de venda.'
  },
];

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user, categoryName, viewMode, initialView = 'sales' }) => {
  const isDesigner = viewMode === 'Designer';
  
  const [view, setView] = useState<'sales' | 'creator' | 'editor' | 'pro_checkout' | 'pro_processing' | 'pro_approved' | 'pro_chat' | 'designer_workspace' | 'chat_onboarding'>('sales');
  const [selectedMode, setSelectedMode] = useState<typeof DISPLAY_MODES[0] | null>(null);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [artChoice, setArtChoice] = useState<'diy' | 'pro' | null>(null);
  const [diyFlowStep, setDiyFlowStep] = useState<'selection' | 'upload' | 'editor'>('selection');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | 'debit'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isArtSaved, setIsArtSaved] = useState(false);
  const [isEditingArt, setIsEditingArt] = useState(false);
  const [savedDesign, setSavedDesign] = useState<any>(null);
  const [merchantSubcategory, setMerchantSubcategory] = useState<string>('');
  const [editsRemaining, setEditsRemaining] = useState(2); // Limite de 2 alterações
  const [toast, setToast] = useState<{msg: string, type: 'info' | 'error' | 'designer'} | null>(null);
  
  // States para o Chat Pro
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [proChatStep, setProChatStep] = useState(0);

  // Busca subcategoria do lojista para o editor
  useEffect(() => {
    if (user && !isDesigner) {
        supabase.from('merchants').select('subcategory').eq('owner_id', user.id).maybeSingle()
            .then(({data}) => {
                if (data?.subcategory) setMerchantSubcategory(data.subcategory);
            });
    }
  }, [user, isDesigner]);

  useEffect(() => {
    if (isDesigner) {
      setView('designer_workspace');
    } else if (initialView === 'chat') {
      setView('chat_onboarding');
    }
  }, [isDesigner, initialView]);

  const dynamicPeriods = useMemo(() => {
    const now = new Date();
    const formatDate = (date: Date) => date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    const end1 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return [
      { id: 'periodo_1', label: '1 Mês (30 dias)', sub: 'Visibilidade mensal', dates: `${formatDate(now)} → ${formatDate(end1)}`, badge: 'Mais simples', days: 30, multiplier: 1 },
      { id: 'periodo_2', label: '3 Meses (90 dias)', sub: 'Pacote trimestral', dates: '90 dias', badge: 'Melhor Valor', days: 90, multiplier: 3 },
    ];
  }, []);

  const handleModeSelection = (mode: typeof DISPLAY_MODES[0]) => {
    setSelectedMode(mode);
  };

  const togglePeriod = (periodId: string) => {
    setSelectedPeriods([periodId]);
  };

  const prices = useMemo(() => {
    if (!selectedMode) return { current: 0, original: 0, isPackage: false, installments: 0, monthly: 0 };
    const hoodsMult = Math.max(1, selectedNeighborhoods.length);
    const period = dynamicPeriods.find(p => selectedPeriods.includes(p.id));
    const artExtra = artChoice === 'pro' ? 69.90 : 0;
    const basePrice = selectedMode.price;
    const current = period?.days === 90 ? (basePrice * 3 * hoodsMult) + artExtra : (basePrice * hoodsMult) + artExtra;
    return { current, isPackage: period?.days === 90, monthly: (basePrice * 3 * hoodsMult) / 3 };
  }, [selectedMode, selectedPeriods, selectedNeighborhoods, artChoice, dynamicPeriods]);

  const isCheckoutStep = !!selectedMode && selectedPeriods.length > 0 && selectedNeighborhoods.length > 0 && isArtSaved;

  const handleSaveDesign = (design: any) => {
    // Se a arte já estava salva, consome um crédito de edição
    if (isArtSaved) {
        setEditsRemaining(prev => Math.max(0, prev - 1));
    }
    setSavedDesign(design);
    setIsArtSaved(true);
    setIsEditingArt(false);
    setDiyFlowStep('editor');
  };

  const handleFooterClick = () => {
    if (!selectedMode || selectedPeriods.length === 0 || selectedNeighborhoods.length === 0 || !isArtSaved) return;
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); setIsSuccess(true); }, 2000);
  };

  if (isEditingArt) {
    return (
      <StoreBannerEditor 
        storeName={user?.user_metadata?.store_name || "Sua Loja"} 
        storeLogo={user?.user_metadata?.logo_url}
        storeSubcategory={merchantSubcategory}
        onSave={handleSaveDesign} 
        onBack={() => setIsEditingArt(false)} 
        editsRemaining={editsRemaining}
      />
    );
  }

  // --- RENDER SIMPLIFICADO DAS VENDAS ---
  if (view === 'sales') {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col">
        <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all"><ChevronLeft size={20} /></button>
            <h1 className="font-bold text-lg leading-none">Finalizar Destaque</h1>
        </header>

        <main className="flex-1 p-6 space-y-12 pb-64 max-w-md mx-auto w-full overflow-y-auto no-scrollbar">
            
            {/* 1. PREVIEW DO BANNER CONCLUÍDO */}
            {isArtSaved && savedDesign && (
              <section className="animate-in fade-in zoom-in-95 duration-500">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex flex-col">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                            <CheckCircle2 size={12} /> Banner pronto para publicar
                        </h3>
                        <p className={`text-[9px] font-bold uppercase tracking-tight mt-0.5 ${editsRemaining > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                            Edições restantes: {editsRemaining}
                        </p>
                    </div>
                    
                    {editsRemaining > 0 ? (
                        <button 
                            onClick={() => setIsEditingArt(true)} 
                            className="text-[9px] font-black uppercase text-blue-400 hover:underline bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20"
                        >
                            Editar Arte
                        </button>
                    ) : (
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-red-500 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
                            <Lock size={10} /> Edição Bloqueada
                        </div>
                    )}
                  </div>

                  <div className="w-full aspect-[16/10] bg-slate-900/40 rounded-[2.5rem] border border-emerald-500/20 shadow-2xl shadow-emerald-500/5 p-1">
                    <BannerPreview 
                      config={savedDesign} 
                      storeName={user?.user_metadata?.store_name || "Sua Loja"} 
                      storeLogo={user?.user_metadata?.logo_url} 
                    />
                  </div>

                  {editsRemaining === 0 && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 mt-2">
                          <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                          <p className="text-[10px] text-red-400 font-bold leading-relaxed uppercase">
                              Este banner já atingiu o limite de alterações após publicação. Caso precise de suporte, entre em contato.
                          </p>
                      </div>
                  )}
                </div>
              </section>
            )}

            <section className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500">1. Onde deseja aparecer?</h3>
                <div className="grid grid-cols-1 gap-4">
                    {DISPLAY_MODES.map((mode) => (
                        <button key={mode.id} onClick={() => handleModeSelection(mode)} className={`p-6 rounded-[2rem] border-2 transition-all text-left flex gap-5 ${selectedMode?.id === mode.id ? 'bg-blue-600/10 border-blue-500' : 'bg-white/5 border-white/10'}`}>
                            <div className={`p-4 rounded-2xl shrink-0 ${selectedMode?.id === mode.id ? 'bg-blue-50 text-blue-600' : 'bg-white/5 text-slate-500'}`}><mode.icon size={24} /></div>
                            <div>
                                <p className="text-sm font-black text-white uppercase">{mode.label}</p>
                                <p className="text-xl font-black text-white mt-1">R$ {mode.price.toFixed(2)} <span className="text-[10px] font-bold text-slate-500">/mês</span></p>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            <section className={`space-y-6 ${!selectedMode && 'opacity-20'}`}>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500">2. Período</h3>
                <div className="flex gap-3">
                    {dynamicPeriods.map(p => (
                        <button key={p.id} onClick={() => togglePeriod(p.id)} className={`flex-1 p-5 rounded-3xl border-2 transition-all text-left ${selectedPeriods.includes(p.id) ? 'bg-blue-600/10 border-blue-500' : 'bg-white/5 border-white/10'}`}>
                            <p className="text-[10px] font-black uppercase">{p.label}</p>
                            <p className="text-[8px] text-blue-400 font-bold mt-1 uppercase">{p.badge}</p>
                        </button>
                    ))}
                </div>
            </section>

            <section className={`space-y-6 ${selectedPeriods.length === 0 && 'opacity-20'}`}>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500">3. Bairros</h3>
                <div className="grid grid-cols-2 gap-3">
                    {NEIGHBORHOODS.slice(0, 4).map(hood => (
                        <button key={hood} onClick={() => setSelectedNeighborhoods(prev => prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood])} className={`p-4 rounded-2xl border-2 text-xs font-bold transition-all ${selectedNeighborhoods.includes(hood) ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-slate-900 border-white/5 text-slate-500'}`}>{hood}</button>
                    ))}
                </div>
            </section>

            {!isArtSaved && (
              <section className={`space-y-6 ${selectedNeighborhoods.length === 0 && 'opacity-20'}`}>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500">4. Arte</h3>
                  <button onClick={() => setIsEditingArt(true)} className={`w-full p-6 rounded-[2rem] border-2 text-left flex items-center gap-5 ${isArtSaved ? 'bg-emerald-500/10 border-emerald-500' : 'bg-white/5 border-white/10'}`}>
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400"><Paintbrush size={24} /></div>
                      <div>
                          <h4 className="font-bold text-white text-sm">{isArtSaved ? 'Arte Pronta!' : 'Criar Arte no Editor'}</h4>
                          <p className="text-[10px] text-slate-500 uppercase font-black">Toque para {isArtSaved ? 'editar' : 'começar'}</p>
                      </div>
                  </button>
              </section>
            )}
        </main>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900 border-t border-white/10 z-[100] max-w-md mx-auto">
            <button onClick={handleFooterClick} className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all ${isCheckoutStep ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 active:scale-[0.98]' : 'bg-white/5 text-slate-500 cursor-not-allowed'}`}>
                {isSubmitting ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : isCheckoutStep ? (
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] opacity-60 mb-0.5">Clique para ativar</span>
                    <span>PAGAR AGORA — R$ {prices.current.toFixed(2)}</span>
                  </div>
                ) : (
                  'Complete os passos acima'
                )}
            </button>
        </div>
      </div>
    );
  }

  return null;
};
