
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  QrCode, 
  KeyRound, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  History, 
  RefreshCw,
  Plus,
  CreditCard,
  CircleDollarSign,
  ArrowRight,
  Loader2,
  AlertCircle,
  WifiOff,
  Calendar,
  MoreHorizontal,
  ReceiptText
} from 'lucide-react';

interface MerchantPanelProps {
  onBack: () => void;
}

type TerminalTab = 'terminal' | 'history';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  method: 'pix' | 'card';
  status: 'paid' | 'pending' | 'cancelled';
  description?: string;
}

export const MerchantPanel: React.FC<MerchantPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<TerminalTab>('terminal');
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [offline] = useState(false);
  
  // Form State
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');

  // Mock Data
  const [history, setHistory] = useState<Transaction[]>([
    { id: '1', date: 'Hoje, 14:20', amount: 89.90, method: 'pix', status: 'paid', description: 'Combo Burger Familia' },
    { id: '2', date: 'Hoje, 11:15', amount: 45.00, method: 'card', status: 'pending', description: '2x Cheeseburger' },
    { id: '3', date: 'Ontem, 20:45', amount: 120.00, method: 'pix', status: 'cancelled', description: 'Entrega pendente' },
  ]);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerateCharge = () => {
    if (!amount || parseFloat(amount.replace(',', '.')) <= 0) return;
    
    setIsGenerating(true);
    // Simulate API call to Asaas/Gateway
    setTimeout(() => {
      setIsGenerating(false);
      alert('Cobrança gerada! Em uma integração real, aqui abriria o QR Code do Pix ou o Checkout do Cartão.');
      
      // Add to mock history
      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        date: 'Agora',
        amount: parseFloat(amount.replace(',', '.')),
        method: paymentMethod,
        status: 'pending',
        description: description || 'Venda Terminal'
      };
      setHistory([newTx, ...history]);
      setAmount('');
      setDescription('');
    }, 1500);
  };

  const formatBRL = (val: number) => 
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 text-[#1E5BFF] animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse uppercase text-[10px] tracking-widest">Iniciando Terminal...</p>
      </div>
    );
  }

  if (offline) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-white/5">
          <WifiOff className="w-10 h-10 text-slate-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Sem conexão</h2>
        <p className="text-slate-400 text-sm mb-8">O terminal precisa de internet para validar transações em tempo real.</p>
        <button onClick={() => window.location.reload()} className="bg-[#1E5BFF] text-white font-bold py-3 px-8 rounded-2xl shadow-lg active:scale-95 transition-all">Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col animate-in fade-in duration-300">
      
      {/* Header Sticky */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-white/5 px-5 h-20 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-400" />
        </button>
        <div className="flex-1">
            <h1 className="font-bold text-lg font-display tracking-tight">Terminal do Caixa</h1>
            <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Sistema Online
            </p>
        </div>
        <button className="p-2 rounded-full bg-slate-900 border border-white/5">
            <History className="w-5 h-5 text-slate-400" onClick={() => setActiveTab('history')} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        
        {/* Resumo do Dia - Cards Horizontais */}
        <section className="p-5 pt-6 grid grid-cols-2 gap-3">
            <div className="bg-slate-900 p-4 rounded-3xl border border-white/5 shadow-lg col-span-2">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-emerald-500/10 rounded-xl">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Hoje</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Vendas Localizei</p>
                <h2 className="text-3xl font-black tracking-tighter">{formatBRL(450.90)}</h2>
            </div>
            
            <div className="bg-slate-900 p-4 rounded-3xl border border-white/5 shadow-lg">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Recebido</p>
                <p className="text-lg font-bold text-white">{formatBRL(380.00)}</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-3xl border border-white/5 shadow-lg">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Pendentes</p>
                <p className="text-lg font-bold text-amber-400">{formatBRL(70.90)}</p>
            </div>
        </section>

        {/* Tabs Quick Selection */}
        <div className="px-5 mb-6">
            <div className="bg-slate-900 p-1 rounded-2xl border border-white/5 flex gap-1">
                <button 
                    onClick={() => setActiveTab('terminal')}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'terminal' ? 'bg-[#1E5BFF] text-white shadow-lg shadow-blue-500/20' : 'text-slate-500'}`}
                >
                    Nova Cobrança
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-[#1E5BFF] text-white shadow-lg shadow-blue-500/20' : 'text-slate-500'}`}
                >
                    Histórico
                </button>
            </div>
        </div>

        {activeTab === 'terminal' ? (
            <section className="px-5 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                
                {/* Nova Cobrança Form */}
                <div className="bg-slate-900 p-6 rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E5BFF]/5 rounded-full blur-3xl"></div>
                    
                    <h3 className="text-sm font-black text-slate-300 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-[#1E5BFF]" strokeWidth={3} /> Gerar Cobrança
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Valor da Venda</label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-600 group-focus-within:text-[#1E5BFF] transition-colors">R$</span>
                                <input 
                                    type="text" 
                                    inputMode="decimal"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0,00"
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 pl-16 pr-5 text-3xl font-black text-white outline-none focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-500/10 transition-all placeholder-slate-800"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Descrição (Opcional)</label>
                            <input 
                                type="text" 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ex: Almoço Executivo"
                                className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-5 text-sm font-bold text-white outline-none focus:border-[#1E5BFF] transition-all placeholder-slate-800"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Forma de Recebimento</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => setPaymentMethod('pix')}
                                    className={`py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'pix' ? 'bg-blue-500/10 border-[#1E5BFF] text-white' : 'bg-slate-950 border-white/5 text-slate-500'}`}
                                >
                                    <QrCode className={`w-6 h-6 ${paymentMethod === 'pix' ? 'text-[#1E5BFF]' : 'text-slate-700'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">PIX Imadiato</span>
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod('card')}
                                    className={`py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'bg-blue-500/10 border-[#1E5BFF] text-white' : 'bg-slate-950 border-white/5 text-slate-500'}`}
                                >
                                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-[#1E5BFF]' : 'text-slate-700'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Cartão (Link)</span>
                                </button>
                            </div>
                        </div>

                        <button 
                            onClick={handleGenerateCharge}
                            disabled={isGenerating || !amount}
                            className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                        >
                            {isGenerating ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    GERAR COBRANÇA
                                    <ArrowRight className="w-5 h-5" strokeWidth={3} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Dica de Segurança */}
                <div className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl flex items-start gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-[#1E5BFF]" />
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                        A cobrança será validada automaticamente pelo sistema Localizei e o cashback creditado na hora para o cliente.
                    </p>
                </div>
            </section>
        ) : (
            <section className="px-5 space-y-4 animate-in slide-in-from-right duration-500">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Últimas 24 horas</h3>
                    <button className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest">Exportar CSV</button>
                </div>

                {history.length === 0 ? (
                    <div className="bg-slate-900/50 border border-white/5 border-dashed rounded-[32px] p-12 text-center">
                        <ReceiptText className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                        <p className="text-slate-500 font-bold text-sm">Nenhuma cobrança hoje.</p>
                        <p className="text-slate-600 text-[10px] mt-1 uppercase tracking-widest">Vendas via terminal aparecerão aqui.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history.map((tx) => (
                            <div key={tx.id} className="bg-slate-900 p-4 rounded-2xl border border-white/5 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        tx.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' :
                                        tx.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                                        'bg-slate-800 text-slate-500'
                                    }`}>
                                        {tx.method === 'pix' ? <QrCode className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white leading-none mb-1">{formatBRL(tx.amount)}</p>
                                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">
                                            {tx.date} • {tx.method.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md border ${
                                        tx.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        tx.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' :
                                        'bg-slate-800 text-slate-600 border-white/5'
                                    }`}>
                                        {tx.status === 'paid' ? 'Pago' : tx.status === 'pending' ? 'Pendente' : 'Cancelado'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <button className="w-full py-4 text-slate-600 font-black text-[10px] uppercase tracking-[0.3em] hover:text-slate-400 transition-colors">
                    Ver relatório mensal completo
                </button>
            </section>
        )}

      </main>

      {/* Footer Branding */}
      <div className="fixed bottom-0 left-0 right-0 p-8 flex flex-col items-center justify-center opacity-30 bg-slate-950 pointer-events-none">
        <CircleDollarSign className="w-4 h-4 mb-2 text-slate-500" />
        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-500">Localizei Pay Terminal v1.0</p>
      </div>

    </div>
  );
};
