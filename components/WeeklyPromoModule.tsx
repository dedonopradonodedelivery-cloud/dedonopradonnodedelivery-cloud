
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Camera, 
  Tag, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Save, 
  Loader2,
  Trash2,
  Timer,
  Rocket,
  PlayCircle,
  HelpCircle
} from 'lucide-react';
import { WeeklyPromoTutorial } from './WeeklyPromoTutorial';

interface WeeklyPromoModuleProps {
  onBack: () => void;
}

interface PromoData {
  id: string;
  productName: string;
  originalPrice: string;
  promoPrice: string;
  imageUrl: string;
  status: 'active' | 'expired' | 'none';
  daysLeft: number;
}

export const WeeklyPromoModule: React.FC<WeeklyPromoModuleProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // State for active promo or new entry
  const [promo, setPromo] = useState<PromoData>({
    id: '',
    productName: '',
    originalPrice: '',
    promoPrice: '',
    imageUrl: '',
    status: 'none',
    daysLeft: 7
  });

  useEffect(() => {
    // Simulating loading current promo
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  const calculateDiscount = () => {
    const original = parseFloat(promo.originalPrice.replace(',', '.'));
    const current = parseFloat(promo.promoPrice.replace(',', '.'));
    if (!original || !current || current >= original) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  const discount = calculateDiscount();
  const isValidDiscount = discount >= 20;

  const handleSave = () => {
    if (!isValidDiscount) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setPromo(prev => ({ ...prev, status: 'active', daysLeft: 7 }));
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja remover esta promoção? Ela sairá da home imediatamente.")) {
        setPromo({
            id: '',
            productName: '',
            originalPrice: '',
            promoPrice: '',
            imageUrl: '',
            status: 'none',
            daysLeft: 7
        });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1E5BFF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans animate-in slide-in-from-right duration-300 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md px-5 h-16 flex items-center justify-between border-b border-white/5 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-400" />
          </button>
          <h1 className="font-bold text-lg">Promoção da Semana</h1>
        </div>
        <button 
          onClick={() => setShowTutorial(true)}
          className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
        >
          <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-black uppercase tracking-wider">Tutorial</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
        
        {/* Educational Message */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 flex gap-4 items-start relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="p-2 bg-indigo-500/20 rounded-xl">
                <Rocket className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="relative z-10">
                <p className="text-xs text-indigo-200 leading-relaxed font-medium">
                    Essa promoção aparece na home do app por <strong>7 dias</strong>.<br/>
                    Quanto melhor o desconto, mais chances de atrair clientes.
                </p>
                <button 
                  onClick={() => setShowTutorial(true)}
                  className="mt-3 text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1 hover:text-indigo-300"
                >
                  <HelpCircle className="w-3 h-3" /> Entenda como funciona
                </button>
            </div>
        </div>

        {promo.status === 'active' ? (
            <div className="space-y-6 animate-in fade-in duration-500">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Promoção Ativa</h3>
                
                <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group">
                    <div className="flex gap-5">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border border-white/5">
                            <img src={promo.imageUrl} alt={promo.productName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <h4 className="font-bold text-white text-lg leading-tight mb-1">{promo.productName}</h4>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 line-through text-xs font-medium">R$ {parseFloat(promo.originalPrice).toFixed(2)}</span>
                                <span className="text-emerald-400 font-black text-lg">R$ {parseFloat(promo.promoPrice).toFixed(2)}</span>
                            </div>
                            <div className="mt-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-1 rounded-lg w-fit border border-emerald-500/20 uppercase tracking-widest">
                                {discount}% de desconto
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4 text-amber-500 animate-pulse" />
                            <p className="text-xs font-bold text-amber-500">Expira em {promo.daysLeft} dias</p>
                        </div>
                        <button 
                            onClick={handleDelete}
                            className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 text-center">
                    <p className="text-xs text-slate-500 font-medium italic">
                        Você já tem uma promoção ativa. Para criar uma nova, aguarde a expiração ou remova a atual.
                    </p>
                </div>
            </div>
        ) : (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
                
                {/* FORMULÁRIO */}
                <div className="space-y-6">
                    {/* Imagem */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Imagem do Produto</label>
                        <div 
                            onClick={() => setPromo({...promo, imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop'})}
                            className="w-full aspect-video rounded-3xl border-2 border-dashed border-white/10 bg-slate-900 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800 transition-all group overflow-hidden relative"
                        >
                            {promo.imageUrl ? (
                                <img src={promo.imageUrl} className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-slate-500 group-hover:text-indigo-400">
                                        <Camera className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Toque para subir foto</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Nome */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Nome do Produto</label>
                        <input 
                            type="text"
                            placeholder="Ex: Barca de Sushi 30 peças"
                            value={promo.productName}
                            onChange={(e) => setPromo({...promo, productName: e.target.value})}
                            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-[#1E5BFF] transition-all font-bold placeholder-slate-700"
                        />
                    </div>

                    {/* Preços */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Preço Original</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">R$</span>
                                <input 
                                    type="text"
                                    placeholder="0,00"
                                    value={promo.originalPrice}
                                    onChange={(e) => setPromo({...promo, originalPrice: e.target.value.replace(/[^0-9,.]/g, '')})}
                                    className="w-full bg-slate-900 border border-white/10 rounded-2xl pl-10 pr-4 py-4 text-white outline-none focus:ring-2 focus:ring-[#1E5BFF] transition-all font-black"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Preço Promo</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold text-xs">R$</span>
                                <input 
                                    type="text"
                                    placeholder="0,00"
                                    value={promo.promoPrice}
                                    onChange={(e) => setPromo({...promo, promoPrice: e.target.value.replace(/[^0-9,.]/g, '')})}
                                    className="w-full bg-slate-900 border border-white/10 rounded-2xl pl-10 pr-4 py-4 text-emerald-400 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-black"
                                />
                            </div>
                        </div>
                    </div>

                    {/* DESCONTO DINÂMICO */}
                    <div className={`p-6 rounded-[2rem] border transition-all duration-500 flex flex-col items-center text-center ${
                        promo.originalPrice && promo.promoPrice
                        ? isValidDiscount 
                            ? 'bg-emerald-500/10 border-emerald-500/30' 
                            : 'bg-rose-500/10 border-rose-500/30'
                        : 'bg-slate-900 border-white/5'
                    }`}>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Desconto Calculado</span>
                            <span className={`text-5xl font-black tracking-tighter ${isValidDiscount ? 'text-emerald-400' : 'text-rose-500'}`}>
                                {discount}%
                            </span>
                        </div>

                        {!isValidDiscount && promo.originalPrice && promo.promoPrice && (
                            <div className="mt-4 flex items-start gap-2 text-rose-400">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <p className="text-[10px] font-bold text-left leading-tight uppercase tracking-wider">
                                    O desconto precisa ser de pelo menos 20% para ser aceito.
                                </p>
                            </div>
                        )}
                        
                        {isValidDiscount && (
                            <div className="mt-4 flex items-center gap-2 text-emerald-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Excelente oferta!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* PREVIEW DO CARD */}
                <div>
                   <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Como ficará na Home</h3>
                   <div className="w-[240px] mx-auto bg-white rounded-[28px] shadow-2xl overflow-hidden border border-gray-100 opacity-60">
                        <div className="h-32 bg-gray-100 flex items-center justify-center relative">
                            {promo.imageUrl ? <img src={promo.imageUrl} className="w-full h-full object-cover" /> : <Tag className="w-8 h-8 text-gray-300" />}
                            <div className="absolute top-2 left-2 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-lg">
                                {discount}% OFF
                            </div>
                        </div>
                        <div className="p-3">
                            <div className="h-3 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                            <div className="h-2 bg-gray-100 rounded-full w-1/2 mb-3"></div>
                            <div className="flex gap-2">
                                <div className="h-4 bg-gray-100 rounded-full w-1/3"></div>
                                <div className="h-4 bg-gray-200 rounded-full w-1/3"></div>
                            </div>
                        </div>
                   </div>
                </div>

                <div className="pb-10">
                    <button 
                        onClick={handleSave}
                        disabled={!isValidDiscount || isSaving || !promo.productName || !promo.imageUrl}
                        className="w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 bg-[#1E5BFF] text-white active:scale-[0.98] shadow-blue-500/20 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Publicar Promoção
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <WeeklyPromoTutorial 
          onClose={() => setShowTutorial(false)} 
          onStart={() => setShowTutorial(false)}
        />
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-20 left-5 right-5 z-[100] bg-emerald-500 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-10">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
                <p className="font-bold text-sm">Promoção Ativada!</p>
                <p className="text-[10px] opacity-80 uppercase font-bold tracking-widest">Sua oferta já está na home do app.</p>
            </div>
        </div>
      )}
    </div>
  );
};
