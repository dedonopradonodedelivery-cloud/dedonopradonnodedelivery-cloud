
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  Home, 
  LayoutGrid, 
  Zap, 
  MapPin, 
  Loader2,
  CheckCircle2,
  Paintbrush,
  Gem,
  Lock,
  XCircle
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StoreBannerEditor, BannerPreview } from '@/components/StoreBannerEditor';
import { supabase } from '@/lib/supabaseClient';
import { MandatoryVideoLock } from './MandatoryVideoLock';

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
    label: 'HOME', 
    icon: Home, 
    price: 49.90,
    originalPrice: 79.90,
    description: 'Exibido no carrossel da página inicial para todos os usuários.',
  },
  { 
    id: 'cat', 
    label: 'CATEGORIAS', 
    icon: LayoutGrid, 
    price: 29.90,
    originalPrice: 59.90,
    description: 'Exibido no topo das buscas por produtos ou serviços específicos.',
  },
  { 
    id: 'combo', 
    label: 'HOME + CATEGORIAS', 
    icon: Zap, 
    price: 69.90,
    originalPrice: 119.90,
    description: 'Destaque na página inicial e em todas as categorias.',
  },
];

const MONTH_OPTIONS = [1, 2, 3, 4, 5, 6];

interface OccupancyRecord {
  hood: string;
  modeId: string;
  expiryDate: string;
  merchantId: string;
}

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user, categoryName, viewMode, initialView = 'sales' }) => {
  const [view, setView] = useState<'sales' | 'editor'>('sales');
  const [selectedMode, setSelectedMode] = useState<typeof DISPLAY_MODES[0] | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isArtSaved, setIsArtSaved] = useState(false);
  const [savedDesign, setSavedDesign] = useState<any>(null);
  const [merchantSubcategory, setMerchantSubcategory] = useState<string>('');
  const [occupancy, setOccupancy] = useState<OccupancyRecord[]>([]);
  
  const finishStepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedOccupancy = localStorage.getItem('localizei_hood_occupancy');
    if (savedOccupancy) setOccupancy(JSON.parse(savedOccupancy));

    if (user) {
        supabase.from('merchants').select('subcategory').eq('owner_id', user.id).maybeSingle()
            .then(({data}) => {
                if (data?.subcategory) setMerchantSubcategory(data.subcategory);
            });
    }
  }, [user]);

  const isHoodOccupied = (hood: string) => {
    if (!selectedMode) return false;
    const now = new Date();
    return occupancy.some(occ => 
      occ.hood === hood && 
      occ.modeId === selectedMode.id && 
      new Date(occ.expiryDate) > now
    );
  };

  const getMonthDateRange = (index: number) => {
    const start = new Date();
    const startOffset = index * 30 + (index > 0 ? 1 : 0);
    start.setDate(start.getDate() + startOffset);
    const end = new Date(start);
    end.setDate(end.getDate() + 29);
    const fmt = (d: Date) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return { start: fmt(start), end: fmt(end) };
  };

  const prices = useMemo(() => {
    if (!selectedMode) return { current: 0, original: 0, totalMonths: 0, hoodsCount: 0, dateStart: '-', dateEnd: '-' };
    const numMonths = selectedMonths.length;
    const numHoods = selectedNeighborhoods.length;
    const current = (selectedMode.price * Math.max(1, numMonths)) * Math.max(1, numHoods);
    const original = (selectedMode.originalPrice * Math.max(1, numMonths)) * Math.max(1, numHoods);
    return { current, original, totalMonths: numMonths, hoodsCount: numHoods, dateStart: '-', dateEnd: '-' };
  }, [selectedMode, selectedMonths, selectedNeighborhoods]);

  const handleSaveDesign = (design: any) => {
    setSavedDesign(design);
    setIsArtSaved(true);
    setView('sales');
    setTimeout(() => finishStepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
  };

  const handleFinalize = () => {
    if (!selectedMode || !user) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (view === 'editor') {
    return (
      <StoreBannerEditor 
        storeName={user?.user_metadata?.store_name || "Sua Loja"} 
        storeLogo={user?.user_metadata?.logo_url}
        onSave={handleSaveDesign} 
        onBack={() => setView('sales')} 
      />
    );
  }

  return (
    <MandatoryVideoLock 
      videoUrl="https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4" 
      storageKey="highlight_banners"
    >
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col selection:bg-blue-500/30">
        <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all"><ChevronLeft size={20} /></button>
            <h1 className="font-bold text-lg leading-none">Anunciar nos Banners</h1>
        </header>

        <main className="flex-1 w-full space-y-16 pb-[320px] overflow-y-auto no-scrollbar">
            <section className="px-6 pt-10 space-y-4 text-center flex flex-col items-center">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-[0.95] max-w-[320px]">
                  Seu concorrente já pode estar aqui. Você vai ficar de fora?
                </h2>
                <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-[340px]">
                  Destaque sua loja exatamente para quem está perto de você.
                </p>
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-6 rounded-[2.5rem] flex flex-col items-center gap-4 shadow-2xl relative overflow-hidden w-full text-center">
                    <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400 shrink-0"><Gem size={28} /></div>
                    <div className="relative z-10">
                        <h4 className="font-black text-white text-base uppercase tracking-tighter flex items-center justify-center gap-2">💎 FUNDADOR APOIADOR</h4>
                        <p className="text-[10px] text-slate-300 mt-4 leading-relaxed px-2">
                          Durante este período, apenas alguns lojistas terão acesso a um <span className="text-yellow-400">VALOR REDUZIDO</span>.
                        </p>
                    </div>
                </div>
            </section>
        </main>
      </div>
    </MandatoryVideoLock>
  );
};
