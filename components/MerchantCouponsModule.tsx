
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
  const [validationResult, setValidationResult] = useState<'success' | 'error' | null>(null);

  const handleValidate = () => {
    setIsProcessing(true);
    setValidationResult(null);
    setTimeout(() => {
        setIsProcessing(false);
        if (validationCode.toUpperCase() === 'ANIL20') {
            setValidationResult('success');
            setValidationCode('');
        } else {
            setValidationResult('error');
        }
    }, 1500);
  };

  return (
    <MandatoryVideoLock 
      videoUrl="https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4" 
      storageKey="merchant_coupons"
    >
      <div className="min-h-screen bg-[#F4F7FF] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-300 flex flex-col">
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-blue-100 dark:border-gray-800 shadow-sm">
          <button onClick={view === 'list' ? onBack : () => setView('list')} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 active:scale-90 transition-all"><ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" /></button>
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
              <button onClick={() => setView('validate')} className="w-full bg-emerald-500 text-white p-5 rounded-3xl shadow-lg flex items-center justify-between group active:scale-95 transition-all">
                  <div className="flex items-center gap-4">
                      <div className="p-2 bg-white/20 rounded-xl"><ScanLine size={24}/></div>
                      <div className="text-left"><p className="font-black text-sm uppercase tracking-widest leading-none">Validar Cupom</p><p className="text-[10px] text-emerald-50 font-medium mt-1">Clique para validar código do cliente</p></div>
                  </div>
                  <ArrowRight size={20}/>
              </button>

              <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-blue-400/70 uppercase tracking-[0.2em] ml-2">Suas Campanhas</h3>
                  {coupons.map(coupon => (
                      <div key={coupon.id} className="bg-white dark:bg-gray-900 p-5 rounded-[2.5rem] border border-blue-50 dark:border-gray-800 shadow-sm flex flex-col gap-4">
                          <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF] flex items-center justify-center"><Ticket size={20}/></div>
                                  <div><h4 className="font-bold text-gray-900 dark:text-white text-sm">{coupon.title}</h4><p className="text-[10px] font-mono text-[#1E5BFF] font-black tracking-widest">{coupon.code}</p></div>
                              </div>
                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${coupon.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>{coupon.status === 'active' ? 'Ativo' : 'Pausado'}</span>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-blue-50 dark:border-gray-800">
                              <div className="flex gap-4">
                                  <div className="text-center"><p className="text-[8px] font-bold text-gray-400 uppercase">Resgates</p><p className="text-sm font-black text-gray-900 dark:text-white">{coupon.redemptions}</p></div>
                                  <div className="text-center"><p className="text-[8px] font-bold text-gray-400 uppercase">Desconto</p><p className="text-sm font-black text-emerald-600">{coupon.value}{coupon.type === 'percentage' ? '%' : 'R$'}</p></div>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400"><Clock size={12}/> Expira {new Date(coupon.expiry).toLocaleDateString()}</div>
                          </div>
                      </div>
                  ))}
              </div>
            </div>
          )}

          {view === 'validate' && (
              <div className="space-y-10 animate-in fade-in pt-10">
                  <div className="text-center space-y-4">
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Validar Código</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Digite o código do cupom retirado pelo morador no app.</p>
                  </div>

                  <div className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-blue-100 dark:border-gray-800 shadow-xl space-y-6">
                      <input value={validationCode} onChange={e => setValidationCode(e.target.value.toUpperCase())} placeholder="CUP-XXXXXX" className="w-full bg-blue-50/50 dark:bg-gray-800 border-none rounded-2xl p-5 text-center text-3xl font-black tracking-[0.2em] outline-none dark:text-white" />
                      <button onClick={handleValidate} disabled={!validationCode || isProcessing} className="w-full bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
                          {isProcessing ? <Loader2 className="animate-spin" /> : <><CheckCircle2 /> Validar e Aplicar</>}
                      </button>
                  </div>
              </div>
          )}

          {view === 'form' && (
              <div className="space-y-8 animate-in slide-in-from-right pt-4">
                  <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Criar Novo Cupom</h2>
                  <div className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-blue-50 dark:border-gray-800 shadow-sm space-y-6">
                      <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Título da Oferta</label><input placeholder="Ex: 20% OFF no Almoço" className="w-full bg-blue-50/30 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Código Promocional</label><input placeholder="EX: ANIL20" className="w-full bg-blue-50/30 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-black tracking-widest dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20" /></div>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Valor</label><input type="number" placeholder="20" className="w-full bg-blue-50/30 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20" /></div>
                          <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vencimento</label><input type="date" className="w-full bg-blue-50/30 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20" /></div>
                      </div>
                      <button onClick={() => setView('list')} className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all">Criar Cupom</button>
                  </div>
              </div>
          )}
        </main>
      </div>
    </MandatoryVideoLock>
  );
};
