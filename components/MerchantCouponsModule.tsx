import React, { useState, useMemo } from 'react';
// Added Info to the lucide-react imports to fix the error in line 164/165
import { 
  ChevronLeft, 
  Ticket, 
  CheckCircle2, 
  Clock, 
  X, 
  Save, 
  PauseCircle, 
  PlayCircle,
  TrendingUp,
  Users,
  Check,
  AlertCircle,
  BarChart3,
  Calendar,
  ChevronRight,
  ScanLine,
  XCircle,
  Loader2,
  Info
} from 'lucide-react';

interface CouponMovement {
  id: string;
  userId: string;
  storeName: string;
  date: string;
  status: 'available' | 'used' | 'expired';
  validity: string;
}

export const MerchantCouponsModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [hasOptedIn, setHasOptedIn] = useState(true); // Default true for this view
  const [activeTab, setActiveTab] = useState<'validation' | 'config' | 'history'>('validation');
  
  // Validation state
  const [validationCode, setValidationCode] = useState('');
  const [validationStatus, setValidationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [validationMessage, setValidationMessage] = useState('');
  const [lastValidatedCoupon, setLastValidatedCoupon] = useState<any>(null);

  // Config state
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState({
    title: 'Desconto de Inauguração',
    description: 'Aproveite nosso desconto exclusivo para moradores do bairro.',
    type: 'percentage' as 'percentage' | 'fixed' | 'gift',
    value: '20',
    code: 'BEMVINDO20',
    validity: '30',
    quantity: '100',
    rules: 'Válido apenas para consumo no local.'
  });

  const movements = useMemo(() => {
    return JSON.parse(localStorage.getItem('user_saved_coupons') || '[]');
  }, [validationStatus]);

  const stats = useMemo(() => {
    return {
      resgatados: movements.length,
      utilizados: movements.filter((m: any) => m.status === 'used').length,
      pendentes: movements.filter((m: any) => m.status === 'available').length,
      taxaUso: movements.length > 0 ? ((movements.filter((m: any) => m.status === 'used').length / movements.length) * 100).toFixed(0) : 0
    };
  }, [movements]);

  const handleValidate = () => {
    if (!validationCode.trim()) return;

    setValidationStatus('loading');
    
    setTimeout(() => {
        const coupons = JSON.parse(localStorage.getItem('user_saved_coupons') || '[]');
        const cleanCode = validationCode.trim().toUpperCase();
        
        const couponIndex = coupons.findIndex((c: any) => c.id === cleanCode);
        
        if (couponIndex === -1) {
            setValidationStatus('error');
            setValidationMessage('Cupom não encontrado. Verifique o código digitado.');
            return;
        }

        const coupon = coupons[couponIndex];

        if (coupon.status === 'used') {
            setValidationStatus('error');
            setValidationMessage('Este cupom já foi utilizado anteriormente.');
            return;
        }

        if (new Date(coupon.expiresAt).getTime() < new Date().getTime()) {
            setValidationStatus('error');
            setValidationMessage('Este cupom está expirado.');
            return;
        }

        // Sucesso: Marcar como usado
        coupons[couponIndex].status = 'used';
        localStorage.setItem('user_saved_coupons', JSON.stringify(coupons));
        
        setLastValidatedCoupon(coupon);
        setValidationStatus('success');
        setValidationMessage(`Cupom validado! Desconto de ${coupon.discount} aplicado.`);
        setValidationCode('');
    }, 1200);
  };

  const renderValidation = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#1E5BFF]">
                <ScanLine size={32} />
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Validar Cupom</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Digite o código apresentado pelo cliente no caixa.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Código do Cupom</label>
                <input 
                    value={validationCode}
                    onChange={(e) => {
                        setValidationCode(e.target.value.toUpperCase());
                        if (validationStatus !== 'idle') setValidationStatus('idle');
                    }}
                    placeholder="CUP-XXXXX"
                    className="w-full p-5 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-2xl text-center text-3xl font-black tracking-[0.2em] uppercase outline-none dark:text-white transition-all shadow-inner"
                />
            </div>

            <button 
                onClick={handleValidate}
                disabled={validationStatus === 'loading' || !validationCode}
                className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs disabled:opacity-50"
            >
                {validationStatus === 'loading' ? <Loader2 className="animate-spin" /> : 'Validar agora'}
            </button>

            {validationStatus === 'success' && (
                <div className="p-5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl flex gap-4 items-center animate-in zoom-in duration-300">
                    <CheckCircle2 className="text-emerald-600 shrink-0" size={24} />
                    <div className="text-left">
                        <p className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Cupom Válido!</p>
                        <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200 mt-0.5">{validationMessage}</p>
                    </div>
                </div>
            )}

            {validationStatus === 'error' && (
                <div className="p-5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl flex gap-4 items-center animate-in shake duration-300">
                    <XCircle className="text-red-600 shrink-0" size={24} />
                    <div className="text-left">
                        <p className="text-xs font-black text-red-700 dark:text-red-400 uppercase tracking-widest">Ops! Erro na validação</p>
                        <p className="text-sm font-bold text-red-800 dark:text-red-200 mt-0.5">{validationMessage}</p>
                    </div>
                </div>
            )}
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-800/30 flex gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold leading-relaxed uppercase">
                Lembre-se: Após validado, o cupom não poderá ser reutilizado pelo cliente. Certifique-se de aplicar o desconto no fechamento da conta.
            </p>
        </div>
    </div>
  );

  const renderConfig = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <section className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Campanha de Desconto</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1">Título da Oferta</label>
              <input 
                type="text" 
                value={config.title}
                onChange={e => setConfig({...config, title: e.target.value})}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-bold dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1">Tipo</label>
                <select 
                  value={config.type}
                  onChange={e => setConfig({...config, type: e.target.value as any})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-bold dark:text-white"
                >
                  <option value="percentage">% desconto</option>
                  <option value="fixed">R$ desconto</option>
                  <option value="gift">brinde</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1">Valor</label>
                <input 
                  type="text" 
                  value={config.value}
                  onChange={e => setConfig({...config, value: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-bold dark:text-white"
                />
              </div>
            </div>

            <button 
                onClick={() => { setIsSaving(true); setTimeout(() => setIsSaving(false), 1000); }}
                className="w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-xl text-[10px] uppercase tracking-widest active:scale-95 transition-all"
            >
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-3">
             <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Resgatados</p>
                <p className="text-xl font-black text-gray-900 dark:text-white">{stats.resgatados}</p>
             </div>
             <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Utilizados</p>
                <p className="text-xl font-black text-emerald-500">{stats.utilizados}</p>
             </div>
             <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Taxa Uso</p>
                <p className="text-xl font-black text-blue-500">{stats.taxaUso}%</p>
             </div>
        </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-300 flex flex-col">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shadow-sm shrink-0">
        <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 active:scale-90 transition-all">
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Gestão de Cupons</h1>
          <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">Lojista Parceiro</p>
        </div>
      </header>

      <div className="flex bg-white dark:bg-gray-900 p-1 mx-5 mt-6 rounded-2xl border border-gray-100 dark:border-gray-800">
          <button onClick={() => setActiveTab('validation')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'validation' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400'}`}>Validar</button>
          <button onClick={() => setActiveTab('config')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'config' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400'}`}>Configurar</button>
          <button onClick={() => setActiveTab('history')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400'}`}>Relatórios</button>
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6">
          {activeTab === 'validation' && renderValidation()}
          {activeTab === 'config' && renderConfig()}
          {activeTab === 'history' && (
              <div className="space-y-4">
                  {movements.map((m: any, idx: number) => (
                      <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                          <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">{m.storeName} - {m.id}</p>
                              <p className="text-[10px] text-gray-400 uppercase font-medium">{m.redeemedAt}</p>
                          </div>
                          <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${m.status === 'used' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                              {m.status === 'used' ? 'Utilizado' : 'Disponível'}
                          </span>
                      </div>
                  ))}
              </div>
          )}
      </main>
    </div>
  );
};