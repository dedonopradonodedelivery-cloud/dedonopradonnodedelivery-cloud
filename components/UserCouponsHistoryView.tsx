
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Tag, 
  PiggyBank, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Ticket,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

interface UserCouponsHistoryViewProps {
  onBack: () => void;
}

const COUPON_HISTORY = [
  { id: '1', storeName: 'Hamburgueria Brasa', date: '2023-11-14T19:30:00', saved: 15.50, status: 'used', discountLabel: 'R$ 15,50' },
  { id: '2', storeName: 'Padaria Imperial', date: '2023-11-10T09:15:00', saved: 5.00, status: 'used', discountLabel: '5% OFF' },
  { id: '3', storeName: 'Pet Shop Amigo', date: '2023-11-05T14:20:00', saved: 12.00, status: 'expired', discountLabel: 'R$ 12,00' },
];

export const UserCouponsHistoryView: React.FC<UserCouponsHistoryViewProps> = ({ onBack }) => {
  const [couponInput, setCouponInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<'success' | 'error' | null>(null);

  const totalSaved = useMemo(() => {
    return COUPON_HISTORY.filter(c => c.status === 'used').reduce((acc, curr) => acc + curr.saved, 0);
  }, []);

  const handleValidateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsValidating(true);
    setValidationResult(null);

    // Simulação de validação de backend
    setTimeout(() => {
        setIsValidating(false);
        // Regra de sucesso: JPA2024 ou qualquer código com "FREE"
        if (couponInput.toUpperCase() === 'JPA2024' || couponInput.toUpperCase().includes('FREE')) {
            setValidationResult('success');
        } else {
            setValidationResult('error');
        }
    }, 1500);
  };

  const formatDate = (isoString: string) => new Date(isoString).toLocaleDateString('pt-BR');

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-all">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Meus Cupons</h1>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Histórico e Validação</p>
        </div>
      </header>

      <main className="p-6 pb-32 space-y-8 max-w-md mx-auto">
        
        {/* 1. SEÇÃO DE VALIDAÇÃO DE NOVO CUPOM */}
        <section className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Validar Novo Código</h3>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                <form onSubmit={handleValidateCoupon} className="space-y-4">
                    <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                            type="text" 
                            value={couponInput}
                            onChange={(e) => {
                                setCouponInput(e.target.value.toUpperCase());
                                if (validationResult) setValidationResult(null);
                            }}
                            placeholder="DIGITE O CÓDIGO"
                            className="w-full bg-gray-50 dark:bg-gray-800 border-none py-4 pl-11 pr-4 rounded-2xl text-sm font-black tracking-widest outline-none focus:ring-2 focus:ring-blue-500/30 dark:text-white uppercase"
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={isValidating || !couponInput.trim()}
                        className="w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] disabled:opacity-50 disabled:grayscale"
                    >
                        {isValidating ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>Verificar Validade <ArrowRight size={16} /></>
                        )}
                    </button>
                </form>

                {/* Feedbacks de Validação */}
                {validationResult === 'success' && (
                    <div className="animate-in zoom-in duration-300 p-5 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-3xl flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
                            <CheckCircle2 size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-tight">Cupom Disponível!</h4>
                            <p className="text-xs text-emerald-700 dark:text-emerald-500/80 font-medium leading-relaxed mt-1">
                                Este código é válido e garante 20% OFF na sua próxima compra em lojas parceiras.
                            </p>
                        </div>
                    </div>
                )}

                {validationResult === 'error' && (
                    <div className="animate-in shake duration-300 p-5 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 rounded-3xl flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-500/20">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-rose-900 dark:text-rose-400 uppercase tracking-tight">Código Inválido</h4>
                            <p className="text-xs text-rose-700 dark:text-rose-500/80 font-medium leading-relaxed mt-1">
                                Verifique se o código está correto ou se já expirou. Tente novamente.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>

        {/* 2. CARD DE RESUMO */}
        <section className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Sua Economia</h3>
            <div className="bg-gradient-to-br from-[#1E5BFF] to-[#0A3BBF] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm">
                        <PiggyBank className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Total Economizado</span>
                </div>
                <h2 className="text-4xl font-black tracking-tight flex items-baseline gap-1.5">
                    <span className="text-xl font-bold opacity-60">R$</span>
                    {totalSaved.toFixed(2).replace('.', ',')}
                </h2>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-blue-100 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10">
                    <Sparkles size={10} className="text-yellow-400" />
                    <span>O bairro cresce quando você economiza aqui</span>
                </div>
            </div>
        </section>

        {/* 3. LISTA DE HISTÓRICO */}
        <section className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Atividade Recente</h3>
            <div className="space-y-3">
                {COUPON_HISTORY.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-sm group active:scale-[0.99] transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${item.status === 'used' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                                <Ticket size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{item.storeName}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <Clock size={10} className="text-gray-300" />
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">{formatDate(item.date)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-sm font-black ${item.status === 'used' ? 'text-emerald-600' : 'text-gray-400'}`}>
                                {item.status === 'used' ? `- R$ ${item.saved.toFixed(2).replace('.', ',')}` : 'Expirado'}
                            </p>
                            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{item.discountLabel}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        <div className="pt-10 text-center opacity-30">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Localizei JPA • Cupons v1.2</p>
        </div>
      </main>
    </div>
  );
};
