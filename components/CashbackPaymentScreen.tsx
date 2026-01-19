
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Wallet, 
  Store, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  Coins,
  AlertTriangle,
  // Added Clock import
  Clock
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { getEffectiveBalance, initiateTransaction } from '../backend/services';

interface CashbackPaymentScreenProps {
  user: User | null;
  merchantId: string;
  storeId: string;
  onBack: () => void;
  onComplete: (transactionData: any) => void;
}

export const CashbackPaymentScreen: React.FC<CashbackPaymentScreenProps> = ({ 
  user, 
  merchantId, 
  storeId, 
  onBack, 
  onComplete 
}) => {
  const [step, setStep] = useState<'type_selection' | 'input' | 'waiting' | 'approved' | 'rejected'>('type_selection');
  const [txType, setTxType] = useState<'earn' | 'use'>('earn');
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [purchaseValue, setPurchaseValue] = useState('');
  const [storeBalance, setStoreBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
        if (!user || !supabase) return;
        
        // 1. Busca Info da Loja e Regras
        const { data: store } = await supabase.from('stores').select('*').eq('id', storeId).single();
        setStoreInfo(store);
        
        // 2. Busca SALDO EXCLUSIVO DESTA LOJA (Regra de Negócio Crítica)
        const balance = await getEffectiveBalance(user.id, storeId);
        setStoreBalance(balance);
    };
    loadData();
  }, [user, storeId]);

  const handleSubmit = async () => {
    const val = parseFloat(purchaseValue.replace(',', '.') || '0');
    if (val <= 0) return;

    setError(null);
    setIsLoading(true);

    try {
        if (!user) throw new Error("Usuário não logado.");

        // Valor em centavos
        const amountCents = txType === 'earn' 
            ? Math.round(val * (storeInfo?.cashback_percent / 100) * 100) 
            : Math.round(val * 100);

        // Chama o serviço que implementa as regras de validação
        await initiateTransaction({
            userId: user.id,
            storeId,
            merchantId,
            amountCents,
            type: txType,
            purchaseTotalCents: Math.round(val * 100)
        });

        setStep('waiting');
    } catch (e: any) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  };

  // Simulação de aprovação em tempo real
  useEffect(() => {
    if (step === 'waiting') {
        const timer = setTimeout(() => setStep('approved'), 3000);
        return () => clearTimeout(timer);
    }
    if (step === 'approved') {
        const timer = setTimeout(() => onComplete({}), 2000);
        return () => clearTimeout(timer);
    }
  }, [step]);

  const formatBRL = (cents: number) => 
    (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans flex flex-col animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 px-5 pt-12 pb-5 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <div>
            <h1 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">Pagamento Cashback</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1"><Store className="w-3 h-3" /> {storeInfo?.name || 'Carregando...'}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center max-w-md mx-auto w-full">
        
        {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl flex gap-3 text-red-600 dark:text-red-400 animate-in shake duration-300">
                <AlertTriangle className="shrink-0" />
                <p className="text-sm font-bold">{error}</p>
            </div>
        )}

        {step === 'type_selection' && (
            <div className="space-y-6">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 text-[#1E5BFF]">
                        <Coins size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Loja Identificada!</h2>
                    <p className="text-gray-500 text-sm mt-2 italic">Saldo exclusivo nesta unidade: <span className="font-bold text-[#0E8A3A]">{formatBRL(storeBalance)}</span></p>
                </div>

                <div className="grid gap-4">
                    <button 
                        onClick={() => { setTxType('earn'); setStep('input'); }}
                        className="w-full bg-white dark:bg-gray-900 p-6 rounded-3xl border-2 border-gray-100 dark:border-gray-800 flex items-center gap-5 hover:border-[#1E5BFF] transition-all text-left"
                    >
                        <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600">
                            <TrendingUp size={28} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Ganhar Saldo</h3>
                            <p className="text-xs text-gray-500 mt-1">Receba {storeInfo?.cashback_percent || 0}% desta compra de volta.</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => { setTxType('use'); setStep('input'); }}
                        disabled={storeBalance <= 0}
                        className={`w-full bg-white dark:bg-gray-900 p-6 rounded-3xl border-2 flex items-center gap-5 transition-all text-left ${storeBalance > 0 ? 'border-gray-100 dark:border-gray-800 hover:border-[#1E5BFF]' : 'opacity-40 grayscale cursor-not-allowed'}`}
                    >
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-[#1E5BFF]">
                            <Wallet size={28} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Pagar com Cashback</h3>
                            <p className="text-xs text-gray-500 mt-1">Você tem {formatBRL(storeBalance)} para usar aqui.</p>
                        </div>
                    </button>
                </div>
            </div>
        )}

        {step === 'input' && (
            <div className="space-y-8">
                <div className="text-center">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-4">
                        {txType === 'earn' ? 'Valor Total da Compra' : 'Quanto deseja resgatar?'}
                    </label>
                    <div className="relative">
                        <input 
                            type="tel"
                            value={purchaseValue}
                            onChange={(e) => setPurchaseValue(e.target.value.replace(/[^0-9,]/g, ''))}
                            placeholder="0,00"
                            autoFocus
                            className="w-full bg-transparent text-6xl font-black text-center text-gray-900 dark:text-white outline-none placeholder-gray-100 dark:placeholder-gray-800"
                        />
                    </div>
                </div>

                <button 
                    onClick={handleSubmit}
                    disabled={!purchaseValue || isLoading}
                    className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <>SOLICITAR NO CAIXA <ArrowRight className="w-5 h-5" /></>}
                </button>
                
                <button onClick={() => setStep('type_selection')} className="w-full text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Alterar tipo de transação</button>
            </div>
        )}

        {step === 'waiting' && (
            <div className="flex flex-col items-center text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin"></div>
                    <Clock className="w-10 h-10 text-yellow-600 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Aguardando Lojista</h2>
                <p className="text-gray-500 text-sm mt-2 max-w-[240px]">O lojista recebeu sua solicitação no terminal e precisa confirmar o valor.</p>
            </div>
        )}

        {step === 'approved' && (
            <div className="flex flex-col items-center text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-50 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-xl shadow-green-500/10">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Sucesso!</h2>
                <p className="text-gray-500 text-sm mt-2">Sua transação foi validada e registrada no bairro.</p>
            </div>
        )}

      </div>
    </div>
  );
};
