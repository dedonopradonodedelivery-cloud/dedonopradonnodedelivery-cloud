
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Ticket, 
  CheckCircle2, 
  Clock, 
  X, 
  Save, 
  TrendingUp, 
  Plus,
  Loader2,
  Tag,
  Calendar,
  XCircle,
  ScanLine,
  ArrowRight
} from 'lucide-react';
import { MandatoryVideoLock } from './MandatoryVideoLock';

interface MerchantCoupon {
  id: string;
  code: string;
  title: string;
  type: 'percentage' | 'fixed';
  value: number;
  status: 'active' | 'paused';
  redemptions: number;
  expiry: string;
}

const MOCK_MERCHANT_COUPONS: MerchantCoupon[] = [
  { id: '1', code: 'ANIL20', title: 'Desconto Anil', type: 'percentage', value: 20, status: 'active', redemptions: 45, expiry: '2024-12-31' },
  { id: '2', code: 'CUPOM10', title: 'Primeira Compra', type: 'fixed', value: 10, status: 'paused', redemptions: 128, expiry: '2024-06-30' }
];

export const MerchantCouponsModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [coupons, setCoupons] = useState<MerchantCoupon[]>(MOCK_MERCHANT_COUPONS);
  const [view, setView] = useState<'list' | 'form' | 'validate'>('list');
  const [validationCode, setValidationCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleValidate = () => {
    setIsProcessing(true);
    setTimeout(() => {
        setIsProcessing(false);
        setView('list');
    }, 1500);
  };

  return (
    <MandatoryVideoLock 
      videoUrl="https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4" 
      storageKey="merchant_coupons_management"
    >
      <div className="min-h-screen bg-[#F4F7FF] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-300 flex flex-col">
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-blue-100 dark:border-gray-800 shadow-sm">
          <button onClick={view === 'list' ? onBack : () => setView('list')} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 active:scale-90 transition-all"><ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" /></button>
          <div className="flex-1">
              <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Meus Cupons</h1>
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">Fidelização Local</p>
          </div>
          {view === 'list' && (
              <button onClick={() => setView('form')} className="p-3 bg-[#1E5BFF] text-white rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all"><Plus size={20} strokeWidth={3} /></button>
          )}
        </header>

        <main className="p-6 overflow-y-auto no-scrollbar">
          {view === 'list' && (
            <div className="space-y-6">
              <button onClick={() => setView('validate')} className="w-full bg-emerald-500 text-white p-5 rounded-3xl shadow-lg flex items-center justify-between active:scale-95 transition-all">
                  <div className="flex items-center gap-4">
                      <div className="p-2 bg-white/20 rounded-xl"><ScanLine size={24}/></div>
                      <div className="text-left"><p className="font-black text-sm uppercase tracking-widest leading-none">Validar Cupom</p><p className="text-[10px] text-emerald-50 font-medium mt-1">Clique para validar código</p></div>
                  </div>
                  <ArrowRight size={20}/>
              </button>
            </div>
          )}
        </main>
      </div>
    </MandatoryVideoLock>
  );
};
