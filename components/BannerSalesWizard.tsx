import React, { useState, useMemo, useRef } from 'react';
import { 
  ChevronLeft, ArrowRight, Home, LayoutGrid, Zap, MapPin, 
  Upload, Paintbrush, Sparkles, Check, Crown, Info, 
  AlertTriangle, Image as ImageIcon, Type, AlignLeft, 
  AlignCenter, AlignRight, Maximize, Palette, CheckCircle2,
  Store as StoreIcon, CreditCard, QrCode, Copy, Loader2,
  MessageCircle, ShieldCheck
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StoreBannerEditor } from './StoreBannerEditor';

interface BannerSalesWizardProps {
  user: User | null;
  onBack: () => void;
  onNavigate: (view: string, initialView?: string) => void;
}

type PlacementMode = 'HOME' | 'CAT' | 'COMBO';
type ArtType = 'MY_ART' | 'EDITOR' | 'PRO';
type WizardView = 'steps' | 'payment' | 'success';

const BAIRROS = [
  "Taquara", "Freguesia", "Pechincha", "Curicica", "Anil", 
  "Tanque", "Praça Seca", "Gardênia Azul", "Cidade de Deus"
];

export const BannerSalesWizard: React.FC<BannerSalesWizardProps> = ({ user, onBack, onNavigate }) => {
  const [view, setView] = useState<WizardView>('steps');
  const [step, setStep] = useState<number>(1); // Estado restaurado para controle de progresso inicial
  const [paymentTab, setPaymentTab] = useState<'pix' | 'card'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // States do Pedido
  const [placement, setPlacement] = useState<PlacementMode | null>(null);
  const [selectedHoods, setSelectedHoods] = useState<string[]>([]);
  const [artType, setArtType] = useState<ArtType | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [editorDesign, setEditorDesign] = useState<any>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const prices = { HOME: 69.90, CAT: 49.90, COMBO: 99.90 };
  const proArtPrice = 89.90;

  const summary = useMemo(() => {
    if (!placement) return { base: 0, hoods: 0, discount: 0, total: 0, percent: 0 };
    
    const base = prices[placement];
    const numHoods = selectedHoods.length;
    let subtotal = base * numHoods;
    let discountPercent = 0;

    if (numHoods >= 9) discountPercent = 0.10;
    else if (numHoods >= 5) discountPercent = 0.05;

    const discountAmount = subtotal * discountPercent;
    let total = subtotal - discountAmount;

    if (artType === 'PRO') total += proArtPrice;

    return {
      base,
      hoods: numHoods,
      discount: discountAmount,
      total,
      percent: discountPercent * 100
    };
  }, [placement, selectedHoods, artType]);

  const toggleHood = (hood: string) => {
    if (hood === 'Todos') {
      setSelectedHoods(selectedHoods.length === BAIRROS.length ? [] : [...BAIRROS]);
      return;
    }
    setSelectedHoods(prev => 
      prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setArtType('MY_ART');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditorSave = (design: any) => {
    setEditorDesign(design);
    setArtType('EDITOR');
    setIsEditorOpen(false);
  };

  const handleGoToPayment = () => {
    if (!placement) return alert('Selecione onde quer aparecer.');
    if (selectedHoods.length === 0) return alert('Selecione pelo menos um bairro.');
    if (!artType) return alert('Escolha como será a sua arte.');
    if (artType === 'MY_ART' && !uploadedImage) return alert('Por favor, anexe sua arte.');
    if (artType === 'EDITOR' && !editorDesign) return alert('Por favor, complete sua arte no editor.');
    
    setView('payment');
    window.scrollTo(0, 0);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setView('success');
      
      // Regra especial: Redirecionar para chat se for time Localizei
      if (artType === 'PRO') {
        setTimeout(() => {
          onNavigate('store_ads_module', 'chat');
        }, 2000);
      }
    }, 2000);
  };

  if (isEditorOpen) {
    return (
      <StoreBannerEditor 
        storeName={user?.user_metadata?.store_name || "Sua Loja"}
        storeLogo={user?.user_metadata?.logo_url}
        onBack={() => setIsEditorOpen(false)}
        onSave={handleEditorSave}
      />
    );
  }

  if (view === 'success') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-8 text-emerald-600">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">Pagamento aprovado!</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-12">
          Seu destaque foi ativado. Em instantes você verá sua marca nos espaços selecionados.
        </p>
        
        {artType === 'PRO' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/30 mb-8 animate-pulse">
            <p className="text-xs text-blue-700 dark:text-blue-300 font-bold uppercase">Conectando ao time de design...</p>
          </div>
        )}

        <div className="w-full space-y-4">
          <button onClick={() => onNavigate('home')} className="w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-xl uppercase tracking-widest text-xs">Ver meu destaque</button>
          <button onClick={() => onNavigate('home')} className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Voltar para início</button>
        </div>
      </div>
    );
  }

  if (view === 'payment') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col animate-in slide-in-from-right duration-300">
        <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3">
          <button onClick={() => setView('steps')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <ChevronLeft className="w-6 h-6 dark:text-white" />
          </button>
          <h1 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">Finalizar Pagamento</h1>
        </header>

        <main className="p-6 space-y-8 flex-1">
          <section className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Resumo do Pedido</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Destaque</span><span className="font-bold dark:text-white">{placement === 'HOME' ? 'Página Inicial' : placement === 'CAT' ? 'Categorias' : 'Combo Total'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Bairros</span><span className="font-bold dark:text-white">{selectedHoods.length} selecionado(s)</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Arte</span><span className="font-bold dark:text-white">{artType === 'MY_ART' ? 'Própria' : artType === 'EDITOR' ? 'Editor' : 'Time Localizei'}</span></div>
              <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white">Total</span>
                <span className="text-2xl font-black text-emerald-600">R$ {summary.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </section>

          <section className="space-y-4">
             <div className="flex gap-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-2xl">
                <button onClick={() => setPaymentTab('pix')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${paymentTab === 'pix' ? 'bg-[#1E5BFF] text-white shadow-lg' : 'text-slate-500'}`}>PIX</button>
                <button onClick={() => setPaymentTab('card')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${paymentTab === 'card' ? 'bg-[#1E5BFF] text-white shadow-lg' : 'text-slate-500'}`}>Cartão</button>
             </div>

             {paymentTab === 'pix' ? (
               <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center space-y-6">
                  <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                    <QrCode size={180} className="text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase">Código Pix Copia e Cola</p>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 w-full font-mono text-[10px] break-all">
                      00020126330014BR.GOV.BCB.PIX011112345678901520400005303986540569.905802BR5920LOCALIZEI6009RJ62070503***6304E2D1
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-[#1E5BFF] font-black uppercase text-[10px] tracking-widest"><Copy size={14}/> Copiar código PIX</button>
               </div>
             ) : (
               <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Número do Cartão</label>
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Validade</label>
                      <input type="text" placeholder="MM/AA" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm font-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">CVV</label>
                      <input type="text" placeholder="123" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm font-bold" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nome no Cartão</label>
                    <input type="text" placeholder="Como está impresso" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm font-bold" />
                  </div>
               </div>
             )}
          </section>
        </main>

        <footer className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
           <button 
             onClick={handleConfirmPayment}
             disabled={isProcessing}
             className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 uppercase tracking-widest text-sm disabled:opacity-50"
           >
             {isProcessing ? <Loader2 className="animate-spin" /> : <><ShieldCheck size={20}/> Confirmar Pagamento</>}
           </button>
        </footer>
      </div>
    );
  }

  const handleHeaderBack = () => {
    if (view === 'payment') setView('steps');
    else onBack();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col animate-in fade-in duration-500">
      
      {/* 1. HEADER SIMPLIFICADO */}
      <div className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="p-4 flex items-center gap-3">
          <button onClick={handleHeaderBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 dark:text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Anunciar no Bairro</h1>
            <p className="text-[10px] text-blue-500 font-bold uppercase mt-1">Configuração de Destaque</p>
          </div>
        </div>
      </div>

      {/* 2. CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-6 space-y-12 pb-64">
        <header className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tighter">
            Seja visto exatamente por quem compra no seu bairro
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Escolha onde aparecer, personalize seu banner e conquiste mais clientes locais.
          </p>
        </header>

        {/* PASSO 1: POSICIONAMENTO — INTERATIVIDADE CORRIGIDA (RADIO GROUP) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">1</div>
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Onde você quer aparecer?</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'HOME', label: 'Home', price: 'R$ 69,90', old: 'R$ 129,90', icon: <Home size={20}/>, desc: 'Visibilidade máxima' },
              { id: 'CAT', label: 'Categorias', price: 'R$ 49,90', old: 'R$ 89,90', icon: <LayoutGrid size={20}/>, desc: 'Foco na busca' },
              { id: 'COMBO', label: 'Home + Cat', price: 'R$ 99,90', old: 'R$ 219,80', icon: <Zap size={20}/>, desc: 'Combo Vantagem', popular: true }
            ].map(opt => (
              <button 
                key={opt.id}
                onClick={() => { 
                  setPlacement(opt.id as PlacementMode); 
                  if (step === 1) setStep(2); 
                }}
                className={`relative flex flex-col items-center p-4 rounded-3xl border-2 transition-all text-center gap-2 active:scale-95 ${placement === opt.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
              >
                {opt.popular && <span className="absolute -top-3 bg-amber-500 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">Mais vendido</span>}
                <div className={`${placement === opt.id ? 'text-blue-600' : 'text-slate-400'}`}>{opt.icon}</div>
                <span className="text-[10px] font-black uppercase text-slate-900 dark:text-white">{opt.label}</span>
                <div>
                  <p className="text-[8px] text-slate-400 line-through leading-none">{opt.old}</p>
                  <p className="text-xs font-black text-slate-900 dark:text-white leading-none mt-1">{opt.price}</p>
                </div>
              </button>
            ))}
          </div>
          <p className="text-center text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-4">
              Promoção de inauguração por tempo indeterminado.
          </p>
        </section>

        {/* PASSO 2: BAIRROS */}
        <section className={`space-y-6 ${!placement ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">2</div>
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Em quais bairros você quer aparecer?</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => toggleHood('Todos')}
              className={`col-span-2 p-4 rounded-2xl border-2 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${selectedHoods.length === BAIRROS.length ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-200 dark:border-slate-800 text-slate-500'}`}
            >
              {selectedHoods.length === BAIRROS.length ? <CheckCircle2 className="w-4 h-4"/> : <Sparkles className="w-4 h-4"/>}
              Todos os bairros (10% OFF)
            </button>
            {BAIRROS.map(hood => (
              <button 
                key={hood}
                onClick={() => toggleHood(hood)}
                className={`p-4 rounded-2xl border-2 text-[10px] font-bold uppercase transition-all active:scale-95 ${selectedHoods.includes(hood) ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400'}`}
              >
                {hood}
              </button>
            ))}
          </div>
        </section>

        {/* PASSO 3: ARTE — CORRIGIDO */}
        <section className={`space-y-8 ${selectedHoods.length === 0 ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">3</div>
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Escolha sua arte</h3>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full text-left p-6 rounded-3xl border-2 transition-all active:scale-[0.98] ${artType === 'MY_ART' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600"><Upload size={24}/></div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase">Usar minha própria arte</h4>
                  <p className="text-xs text-slate-500">Sem custo adicional</p>
                </div>
                {uploadedImage && <CheckCircle2 className="text-emerald-500" size={20} />}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              {uploadedImage && (
                <div className="mt-4 aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <img src={uploadedImage} className="w-full h-full object-cover" alt="Sua arte" />
                </div>
              )}
            </button>

            <button 
              onClick={() => setIsEditorOpen(true)}
              className={`w-full text-left p-6 rounded-3xl border-2 transition-all active:scale-[0.98] ${artType === 'EDITOR' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl text-purple-600"><Paintbrush size={24}/></div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase">Personalizar no Editor</h4>
                  <p className="text-xs text-slate-500">Crie seu banner em segundos</p>
                </div>
                {editorDesign && <CheckCircle2 className="text-emerald-500" size={20} />}
              </div>
            </button>

            <button 
              onClick={() => setArtType('PRO')}
              className={`w-full text-left p-6 rounded-3xl border-2 transition-all relative overflow-hidden active:scale-[0.98] ${artType === 'PRO' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
            >
              <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">Recomendado</div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-amber-600"><Crown size={24}/></div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase">Design com Time Localizei</h4>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <p className="text-[10px] text-slate-400 line-through font-bold">R$ 149,90</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase">R$ 89,90</p>
                  </div>
                </div>
                {artType === 'PRO' && <CheckCircle2 className="text-amber-500" size={20} />}
              </div>
            </button>
          </div>
        </section>

        <section className="pt-8 space-y-6">
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/30">
               <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
               <p className="text-[10px] text-amber-800 dark:text-amber-200 font-bold uppercase leading-tight">
                 Apenas 2 anunciantes por categoria e bairro. O espaço será bloqueado automaticamente após sua compra.
               </p>
            </div>
            
            <button 
                onClick={handleGoToPayment}
                className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
            >
                Ativar meu destaque agora
                <ArrowRight size={20}/>
            </button>
        </section>
      </main>

      {/* 3. RESUMO DO PEDIDO */}
      <div className="fixed bottom-[80px] left-0 right-0 z-[40] bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-5 shadow-[0_-10px_25px_rgba(0,0,0,0.1)] max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Investimento</span>
              {summary.discount > 0 && (
                <span className="text-[8px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-black">-{summary.percent}% OFF</span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold text-slate-500">R$</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {summary.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{summary.hoods} bairro(s) selecionados</p>
            <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">{placement || 'Sem posicionamento'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
