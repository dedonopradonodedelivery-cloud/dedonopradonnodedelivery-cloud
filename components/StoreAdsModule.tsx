

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  // Added CheckCircle2 to fix the error on line 66
  ChevronLeft, ArrowRight, Home, LayoutGrid, Zap, MapPin, Loader2, Gem, Info, AlertTriangle, ShieldCheck, Paintbrush, CheckCircle2
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StoreBannerEditor, BannerPreview } from '@/components/StoreBannerEditor';
import { MandatoryVideoLock } from './MandatoryVideoLock';

// FIX: Added missing StoreAdsModuleProps interface to resolve error on line 17
interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
  user: User | null;
  categoryName?: string;
  viewMode?: string;
  initialView?: 'sales' | 'chat';
}

const NEIGHBORHOODS = ["Freguesia", "Pechincha", "Anil", "Taquara", "Tanque", "Curicica"];
const DISPLAY_MODES = [
  { id: 'home', label: 'HOME', icon: Home, price: 49.90, description: 'Exibido na página inicial.' },
  { id: 'cat', label: 'CATEGORIAS', icon: LayoutGrid, price: 29.90, description: 'Exibido nas buscas por produtos.' },
  { id: 'combo', label: 'COMBO', icon: Zap, price: 69.90, description: 'Home + Categorias.' },
];

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user }) => {
  const [view, setView] = useState<'sales' | 'editor'>('sales');
  const [selectedMode, setSelectedMode] = useState<typeof DISPLAY_MODES[0] | null>(null);
  const [isArtSaved, setIsArtSaved] = useState(false);
  const [savedDesign, setSavedDesign] = useState<any>(null);

  const handleSaveDesign = (design: any) => {
    setSavedDesign(design);
    setIsArtSaved(true);
    setView('sales');
  };

  if (view === 'editor') return <StoreBannerEditor storeName={user?.user_metadata?.store_name || "Sua Loja"} storeLogo={user?.user_metadata?.logo_url} onSave={handleSaveDesign} onBack={() => setView('sales')} />;

  return (
    <MandatoryVideoLock videoUrl="https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4" storageKey="highlight_banners">
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans flex flex-col overflow-hidden relative">
        <header className="bg-white dark:bg-[#020617] border-b border-gray-100 dark:border-white/5 px-6 py-4 flex items-center gap-4 z-50">
            <button onClick={onBack} className="p-2 bg-gray-50 dark:bg-slate-900 rounded-xl text-gray-400"><ChevronLeft size={20} /></button>
            <h1 className="font-bold text-lg">Anunciar nos Banners</h1>
        </header>
        <main className="flex-1 p-6 space-y-16 pb-64 overflow-y-auto no-scrollbar">
            <section className="text-center space-y-4">
                <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Destaque sua loja</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 max-w-[340px] mx-auto">Apareça no topo para moradores reais de Jacarepaguá.</p>
                <div className="bg-blue-600 bg-opacity-5 border border-blue-500/20 p-6 rounded-[2.5rem] flex flex-col items-center gap-4 w-full">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl text-[#1E5BFF]"><Gem size={28} /></div>
                    <div><h4 className="font-black text-base uppercase tracking-tighter">💎 FUNDADOR APOIADOR</h4><p className="text-yellow-500 text-[10px] font-black uppercase tracking-widest mt-1">Oportunidade Única de Inauguração</p></div>
                </div>
            </section>
            <section className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">1. Onde deseja aparecer?</h3>
              <div className="grid grid-cols-1 gap-4">
                  {DISPLAY_MODES.map((mode) => (
                      <button key={mode.id} onClick={() => setSelectedMode(mode)} className={`p-6 rounded-[2rem] border-2 transition-all text-left flex gap-5 items-center ${selectedMode?.id === mode.id ? 'bg-blue-50 dark:bg-blue-600/10 border-[#1E5BFF]' : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-white/10'}`}>
                          <div className={`p-4 rounded-2xl ${selectedMode?.id === mode.id ? 'bg-[#1E5BFF] text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}><mode.icon size={24} /></div>
                          <div className="flex-1"><p className="text-xs font-black uppercase mb-1 tracking-widest">{mode.label}</p><p className="text-xl font-black text-[#1E5BFF]">R$ {mode.price.toFixed(2)} <span className="text-[10px] font-bold text-gray-400">/ mês</span></p></div>
                      </button>
                  ))}
              </div>
            </section>
            <section className={`space-y-8 transition-all duration-500 ${!selectedMode && 'opacity-20 pointer-events-none'}`}>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">2. Crie sua arte</h3>
              <button onClick={() => setView('editor')} className={`w-full p-8 rounded-[2.5rem] border-2 text-left flex items-center gap-6 transition-all ${isArtSaved ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500' : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-white/10'}`}><div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isArtSaved ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}><Paintbrush size={28} /></div><div><h4 className="font-bold">{isArtSaved ? 'Arte Pronta!' : 'Configurar Banner'}</h4><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Toque para começar</p></div></button>
            </section>
            {isArtSaved && savedDesign && (
              <section className="space-y-6 animate-in zoom-in-95 duration-500">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">3. Revisão Final</h3>
                  <div className="w-full aspect-[16/10] shadow-xl rounded-[2.5rem] overflow-hidden"><BannerPreview config={savedDesign} storeName={user?.user_metadata?.store_name || "Sua Loja"} storeLogo={user?.user_metadata?.logo_url} /></div>
                  <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-8 space-y-4 shadow-sm"><div className="flex justify-between items-center"><span className="text-xs font-bold text-gray-400 uppercase">Total do Destaque</span><span className="text-3xl font-black text-emerald-600">R$ {selectedMode?.price.toFixed(2)}</span></div><div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase"><CheckCircle2 size={12} className="text-emerald-500" /> Ativação Imediata após o PIX</div></div>
              </section>
            )}
        </main>
        <div className="fixed bottom-[80px] left-0 right-0 p-5 bg-white dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-white/10 z-[101] max-w-md mx-auto">
            <button disabled={!isArtSaved} className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 ${isArtSaved ? 'bg-[#1E5BFF] text-white shadow-xl shadow-blue-500/20' : 'bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-slate-700 cursor-not-allowed'}`}>Finalizar e Publicar <ArrowRight size={18} /></button>
        </div>
      </div>
    </MandatoryVideoLock>
  );
};
