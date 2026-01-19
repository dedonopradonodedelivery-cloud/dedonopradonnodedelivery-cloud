
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  QrCode, 
  KeyRound, 
  Settings, 
  ToggleRight, 
  ToggleLeft, 
  History, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  PlayCircle,
  Save,
  // Added Loader2 to imports
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  Copy,
  ChevronRight
} from 'lucide-react';
import { Store, CashbackTransaction } from '../types';

interface MerchantCashbackDashboardProps {
  store: Store;
  onBack: () => void;
}

export const MerchantCashbackDashboard: React.FC<MerchantCashbackDashboardProps> = ({ store, onBack }) => {
  // Configurações Locais (Simulando persistência)
  const [isActive, setIsActive] = useState(store.cashback_active ?? true);
  const [percent, setPercent] = useState(store.cashback_percent ?? 5);
  const [validity, setValidity] = useState(store.cashback_validity_days ?? 30);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mocks de Dados Financeiros
  const stats = {
    totalGeneratedCents: 125000, // R$ 1.250,00
    totalRedeemedCents: 45000,   // R$ 450,00
    totalPendingCents: 80000,    // R$ 800,00
  };

  // Fixed: Added missing merchant_id to mock items
  const history: CashbackTransaction[] = [
    { id: '1', user_name: 'Ana Silva', amount_cents: 1250, type: 'earn', status: 'approved', store_id: store.id, merchant_id: store.id, user_id: 'u1', created_at: 'Hoje, 14:20' },
    { id: '2', user_name: 'Marcos Souza', amount_cents: 800, type: 'use', status: 'approved', store_id: store.id, merchant_id: store.id, user_id: 'u2', created_at: 'Hoje, 10:15' },
    { id: '3', user_name: 'Clara Oliveira', amount_cents: 550, type: 'earn', status: 'approved', store_id: store.id, merchant_id: store.id, user_id: 'u3', created_at: 'Ontem, 18:45' },
  ];

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=localizei-store-${store.id}`;
  const manualCode = store.store_manual_code || "JPA-882";

  const handleSaveConfig = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const formatBRL = (cents: number) => 
    (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 px-5 pt-12 pb-5 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <h1 className="font-bold text-xl text-gray-900 dark:text-white">Gestão de Cashback</h1>
        </div>
      </div>

      <div className="flex-1 p-5 space-y-8 overflow-y-auto no-scrollbar pb-32">
        
        {/* 1. VÍDEO EXPLICATIVO (FIXO) */}
        <section className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-xl border border-white/5 relative">
            <div className="aspect-video w-full bg-black flex items-center justify-center">
                {/* Simulando um embed de vídeo (YouTube/Vimeo) */}
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1556742049-13e73bb3b83d?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="relative z-10 flex flex-col items-center gap-3">
                    <PlayCircle className="w-16 h-16 text-white animate-pulse" />
                    <p className="text-white font-bold text-xs uppercase tracking-widest">Tutorial: Como vender mais</p>
                </div>
            </div>
            <div className="p-5 text-center">
                <h3 className="text-white font-bold text-sm">Entenda como o Cashback fideliza seu cliente</h3>
                <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-wider">Duração: 1min 45s</p>
            </div>
        </section>

        {/* 2. IDENTIFICAÇÃO DA LOJA (QR & PIN) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-2xl mb-4 border border-gray-100 dark:border-gray-800">
                    <img src={qrUrl} alt="QR Code Loja" className="w-32 h-32 object-contain" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">QR Code Exclusivo</h3>
                <p className="text-xs text-gray-400 mb-4">Para os clientes escanearem no balcão</p>
                <button className="w-full py-2.5 rounded-xl border border-blue-100 dark:border-blue-900 text-[#1E5BFF] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
                    <Download className="w-3.5 h-3.5" /> Baixar p/ Impressão
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center justify-center">
                <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                    <KeyRound className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Código de Balcão</h3>
                <div className="bg-gray-100 dark:bg-gray-900 px-6 py-2 rounded-xl border border-gray-200 dark:border-gray-700 my-2">
                    <span className="text-2xl font-black text-gray-800 dark:text-white tracking-widest">{manualCode}</span>
                </div>
                <p className="text-[10px] text-gray-400 uppercase font-bold mt-2">Digitação manual</p>
            </div>
        </section>

        {/* 3. PAINEL DE CONFIGURAÇÃO */}
        <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-[#1E5BFF]">
                        <Settings className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Configurações</h3>
                </div>
                <button 
                    onClick={() => setIsActive(!isActive)}
                    className="flex items-center gap-2 active:scale-95 transition-transform"
                >
                    {isActive ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Ativo</span>
                            <ToggleRight className="w-6 h-6 text-emerald-500" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inativo</span>
                            <ToggleLeft className="w-6 h-6 text-gray-300" />
                        </div>
                    )}
                </button>
            </div>

            <div className={`space-y-8 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                {/* Percentual */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Percentual de Cashback</label>
                        <span className="text-xl font-black text-[#1E5BFF]">{percent}%</span>
                    </div>
                    <div className="relative h-2 bg-gray-100 dark:bg-gray-900 rounded-full">
                        <div 
                            className="absolute top-0 left-0 h-full bg-[#1E5BFF] rounded-full transition-all"
                            style={{ width: `${((percent - 3) / (10 - 3)) * 100}%` }}
                        ></div>
                        <input 
                            type="range" min="3" max="10" step="1"
                            value={percent}
                            onChange={(e) => setPercent(parseInt(e.target.value))}
                            className="absolute top-[-6px] left-0 w-full h-4 opacity-0 cursor-pointer"
                        />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 px-1">
                        <span>3%</span>
                        <span>10%</span>
                    </div>
                </div>

                {/* Validade */}
                <div className="space-y-4">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">Validade do Crédito (Dias)</label>
                    <div className="flex gap-3">
                        {[15, 30, 60, 90].map((days) => (
                            <button
                                key={days}
                                onClick={() => setValidity(days)}
                                className={`flex-1 py-3 rounded-2xl text-xs font-bold border transition-all ${
                                    validity === days 
                                    ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-lg shadow-blue-500/20' 
                                    : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-500'
                                }`}
                            >
                                {days}d
                            </button>
                        ))}
                    </div>
                </div>

                {/* Salvar */}
                <button 
                    onClick={handleSaveConfig}
                    disabled={isSaving}
                    className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Salvar Configurações
                </button>
            </div>
        </section>

        {/* 4. RESULTADOS & HISTÓRICO */}
        <section className="space-y-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Desempenho</h3>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm col-span-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Saldo Pendente dos Clientes</p>
                    <div className="flex items-center gap-3">
                        <h4 className="text-2xl font-black text-gray-900 dark:text-white">{formatBRL(stats.totalPendingCents)}</h4>
                        <div className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold">Saldo Circular</div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">Valor que os clientes têm para gastar na sua loja.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 mb-3">
                        <TrendingUp className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Gerado</p>
                    <h4 className="text-lg font-black text-gray-900 dark:text-white">{formatBRL(stats.totalGeneratedCents)}</h4>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 mb-3">
                        <History className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Resgatado</p>
                    <h4 className="text-lg font-black text-gray-900 dark:text-white">{formatBRL(stats.totalRedeemedCents)}</h4>
                </div>
            </div>

            {/* Lista de Histórico */}
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Últimas Transações</span>
                    <button className="text-[10px] font-black text-[#1E5BFF] uppercase">Ver tudo</button>
                </div>
                {history.map((tx, idx) => (
                    <div key={tx.id} className={`p-5 flex items-center justify-between ${idx !== history.length - 1 ? 'border-b border-gray-50 dark:border-gray-700' : ''}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'earn' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                {tx.type === 'earn' ? <TrendingUp className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{tx.user_name}</h4>
                                <p className="text-[10px] text-gray-400">{tx.created_at}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`font-black text-sm ${tx.type === 'earn' ? 'text-emerald-600' : 'text-blue-600'}`}>
                                {tx.type === 'earn' ? '+' : '-'} {formatBRL(tx.amount_cents)}
                            </p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase">{tx.type === 'earn' ? 'Gerado' : 'Resgate'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

      </div>

      {/* Success Notification */}
      {showSuccess && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2 z-[100]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-sm">Configurações atualizadas!</span>
          </div>
      )}

      {/* Footer Branding */}
      <div className="fixed bottom-0 left-0 right-0 p-8 flex flex-col items-center justify-center opacity-30 bg-transparent pointer-events-none">
        <TrendingUp className="w-4 h-4 mb-2 text-gray-500" />
        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-500">Localizei Business v2.0</p>
      </div>

    </div>
  );
};
