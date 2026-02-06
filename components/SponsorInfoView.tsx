
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  Crown, 
  CheckCircle2, 
  Zap, 
  Target, 
  ShieldCheck, 
  Users, 
  Layout, 
  Clock,
  Sparkles,
  Award,
  CalendarDays,
  Smartphone,
  TrendingUp,
  Lock,
  Plus,
  Minus,
  CreditCard,
  QrCode,
  Copy,
  Loader2,
  Check,
  MessageSquare
} from 'lucide-react';
import { AppNotification } from '../types';
import { MandatoryVideoLock } from './MandatoryVideoLock';

interface SponsorInfoViewProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
}

const MONTHS = [
  { id: 1, label: 'Jan', available: false },
  { id: 2, label: 'Fev', available: false },
  { id: 3, label: 'Mar', available: true },
  { id: 4, label: 'Abr', available: true },
  { id: 5, label: 'Mai', available: true },
  { id: 6, label: 'Jun', available: true },
  { id: 7, label: 'Jul', available: true },
  { id: 8, label: 'Ago', available: true },
  { id: 9, label: 'Set', available: true },
  { id: 10, label: 'Out', available: true },
  { id: 11, label: 'Nov', available: true },
  { id: 12, label: 'Dez', available: true },
];

export const SponsorInfoView: React.FC<SponsorInfoViewProps> = ({ onBack, onNavigate }) => {
  const [view, setView] = useState<'sales' | 'payment' | 'success'>('sales');
  const [selectedMonthIds, setSelectedMonthIds] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleMonth = (id: number) => {
    setSelectedMonthIds(prev => prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => { setIsProcessing(false); setView('success'); }, 2000);
  };

  return (
    <MandatoryVideoLock 
      videoUrl="https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4" 
      storageKey="master_sponsor"
    >
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 flex flex-col relative overflow-x-hidden">
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <div className="flex flex-col">
            <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Patrocinador Master</h1>
            <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">O topo do seu bairro, todos os dias.</p>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto no-scrollbar pb-32">
          <section className="p-8 text-center">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border-4 border-white dark:border-gray-800 shadow-xl">
              <Crown className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium max-w-xs mx-auto italic">
              "Sua marca em destaque máximo no Localizei JPA."
            </p>
          </section>
        </main>
      </div>
    </MandatoryVideoLock>
  );
};
