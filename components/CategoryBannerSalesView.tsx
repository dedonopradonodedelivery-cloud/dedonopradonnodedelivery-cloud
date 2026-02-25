
import React, { useState, useMemo } from 'react';
import { ChevronLeft, Check, DollarSign, Calendar, LayoutGrid, Info, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { categoryBannerService } from '../lib/categoryBannerService';
import { SUBCATEGORIES, CATEGORIES } from '../constants';
import { useAuth } from '@/contexts/AuthContext';

const BAIRROS_LIST = [
  { name: 'Taquara', slug: 'taquara' },
  { name: 'Freguesia', slug: 'freguesia' },
  { name: 'Pechincha', slug: 'pechincha' },
  { name: 'Curicica', slug: 'curicica' },
  { name: 'Anil', slug: 'anil' },
  { name: 'Tanque', slug: 'tanque' },
  { name: 'Praça Seca', slug: 'praca-seca' },
  { name: 'Gardênia Azul', slug: 'gardenia-azul' },
  { name: 'Cidade de Deus', slug: 'cidade-de-deus' },
];

interface CategoryBannerSalesViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CategoryBannerSalesView: React.FC<CategoryBannerSalesViewProps> = ({ onBack, onSuccess }) => {
  const { user } = useAuth();
  const [bairro, setBairro] = useState('freguesia');
  const [categoria, setCategoria] = useState('Comida');
  const [subcategoria, setSubcategoria] = useState('');
  const [isBuying, setIsBuying] = useState<string | null>(null);
  
  // Derivar lista de subcategorias baseado na categoria selecionada
  const availableSubcategories = useMemo(() => {
    return SUBCATEGORIES[categoria] || [];
  }, [categoria]);

  // Set default subcategory when category changes
  React.useEffect(() => {
    if (availableSubcategories.length > 0) {
        setSubcategoria(availableSubcategories[0].name);
    } else {
        setSubcategoria('');
    }
  }, [categoria, availableSubcategories]);
  
  // O slug agora é baseado na subcategoria, pois o banner é de subcategoria
  const subcategorySlug = useMemo(() => subcategoria.toLowerCase().replace(/\s+/g, '-'), [subcategoria]);

  const slots = useMemo(() => {
    // Busca slots usando o slug da subcategoria
    const s1 = categoryBannerService.getSlot(bairro, subcategorySlug, 1);
    // const s2 = categoryBannerService.getSlot(bairro, subcategorySlug, 2); // Removido: Apenas 1 banner fixo por subcategoria conforme regra 2
    return [s1];
  }, [bairro, subcategorySlug]);

  const handleBuy = (slotKey: string) => {
    if (!user) return alert('Faça login para comprar.');
    
    setIsBuying(slotKey);
    // Simula Checkout e Pagamento
    setTimeout(() => {
        categoryBannerService.reserveSlot(slotKey, 'temp-user-id', 'Minha Loja');
        
        categoryBannerService.confirmPurchase(slotKey, {
            image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=800',
            title: 'Oferta Especial',
            subtitle: 'Aproveite agora mesmo no bairro'
        });

        setIsBuying(null);
        alert('Espaço garantido com sucesso! Seu banner já está no ar.');
        onSuccess();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col animate-in fade-in duration-500">
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-white/5">
        <button onClick={onBack} className="p-2.5 bg-white/5 rounded-xl text-slate-300 transition-colors">
            <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
            <h1 className="font-bold text-white text-lg leading-tight">Anunciar em Subcategoria</h1>
            <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest">Slots de Visibilidade</p>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar pb-32">
        <section className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8">
            <h2 className="text-xl font-black mb-6 uppercase tracking-tighter">1. Escolha o Local</h2>
            
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Bairro de Jacarepaguá</label>
                    <select 
                        value={bairro} 
                        onChange={e => setBairro(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-blue-500"
                    >
                        {BAIRROS_LIST.map(b => <option key={b.slug} value={b.slug}>{b.name}</option>)}
                    </select>
                </div>

                <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Categoria</label>
                    <select 
                        value={categoria} 
                        onChange={e => setCategoria(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-blue-500"
                    >
                        {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                </div>

                <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Subcategoria (Onde o anúncio aparecerá)</label>
                    <select 
                        value={subcategoria} 
                        onChange={e => setSubcategoria(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-blue-500"
                        disabled={availableSubcategories.length === 0}
                    >
                        {availableSubcategories.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                    </select>
                </div>
            </div>
        </section>

        <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-black uppercase tracking-tighter">2. Disponibilidade</h2>
                <span className="text-[9px] font-black bg-blue-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Alta Procura</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {slots.map(slot => (
                    <div key={slot.uniqueKey} className={`p-6 rounded-[2.5rem] border-2 transition-all flex items-center justify-between ${slot.status === 'available' ? 'bg-slate-900 border-white/5 shadow-xl' : 'bg-slate-900 border-white/5 opacity-50'}`}>
                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${slot.status === 'available' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-600'}`}>
                                <LayoutGrid size={28} />
                            </div>
                            <div className="text-left">
                                <p className="font-black text-white text-lg leading-tight uppercase tracking-tight">Banner Fixo</p>
                                <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${slot.status === 'available' ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    {slot.status === 'available' ? 'Livre para compra' : slot.status === 'reserved' ? 'Sendo comprado agora' : `Vendido para: ${slot.merchantName}`}
                                </p>
                            </div>
                        </div>

                        {slot.status === 'available' ? (
                            <button 
                                onClick={() => handleBuy(slot.uniqueKey)}
                                disabled={!!isBuying}
                                className="bg-[#1E5BFF] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
                            >
                                {isBuying === slot.uniqueKey ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check size={14} />}
                                Comprar
                            </button>
                        ) : (
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Indisponível</span>
                        )}
                    </div>
                ))}
            </div>
        </section>

        <section className="bg-slate-900/50 p-6 rounded-3xl border border-white/5">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400 shrink-0">
                    <Info size={20} />
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-slate-300 leading-relaxed font-bold">O banner dura 30 dias após a compra.</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">Cada subcategoria possui apenas 1 banner fixo por bairro, garantindo exclusividade absoluta no momento da decisão do cliente.</p>
                </div>
            </div>
        </section>
      </main>

      <footer className="fixed bottom-[80px] left-0 right-0 p-5 bg-slate-950/80 backdrop-blur-md border-t border-white/5 z-30 max-w-md mx-auto flex items-center justify-between">
          <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Banner Subcategoria</span>
              <span className="text-2xl font-black text-emerald-400">R$ 29,90</span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <CheckCircle2 size={12} className="text-blue-500" />
            Pagamento Único
          </div>
      </footer>
    </div>
  );
};
