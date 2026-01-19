
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Settings, 
  TrendingUp, 
  Save,
  Loader2,
  CheckCircle2,
  Download,
  Copy,
  XCircle,
  Clock
} from 'lucide-react';
import { Store } from '../types';

interface MerchantCashbackDashboardProps {
  store: Store;
  onBack: () => void;
}

export const MerchantCashbackDashboard: React.FC<MerchantCashbackDashboardProps> = ({ store, onBack }) => {
  // CONFIGURAÇÕES SOLICITADAS
  const [isActive, setIsActive] = useState(store.cashback_active ?? true);
  const [percent, setPercent] = useState(store.cashback_percent ?? 5);
  const [validity, setValidity] = useState(store.cashback_validity_days ?? 30);
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=localizei-store-${store.id}`;
  const manualCode = store.store_manual_code || "JPA-882";

  const handleSaveConfig = () => {
    setIsSaving(true);
    // Simulação de salvamento no backend
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 px-5 pt-12 pb-5 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <h1 className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">Configurar Cashback</h1>
        </div>
      </div>

      <div className="flex-1 p-5 space-y-6 overflow-y-auto no-scrollbar pb-32">
        
        {/* 1. ATIVAR / DESATIVAR */}
        <section className={`p-6 rounded-[2rem] border-2 transition-all duration-300 flex items-center justify-between ${isActive ? 'bg-white dark:bg-gray-800 border-[#1E5BFF]/20 shadow-lg shadow-blue-500/5' : 'bg-gray-100 dark:bg-gray-900 border-transparent opacity-60'}`}>
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isActive ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'}`}>
                    {isActive ? <TrendingUp className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Programa {isActive ? 'Ativado' : 'Pausado'}</h3>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{isActive ? 'Distribuindo créditos' : 'Campanha suspensa'}</p>
                </div>
            </div>
            <button 
                onClick={() => setIsActive(!isActive)}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${isActive ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
        </section>

        {/* 2. REGRAS DE NEGÓCIO */}
        <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-[#1E5BFF]">
                    <Settings className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Regras de Venda</h3>
            </div>

            <div className={`space-y-10 transition-all ${!isActive && 'grayscale opacity-50 pointer-events-none'}`}>
                {/* DEFINIR PERCENTUAL */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Percentual de Volta</label>
                        <span className="text-3xl font-black text-[#1E5BFF]">{percent}%</span>
                    </div>
                    <div className="relative h-3 bg-gray-100 dark:bg-gray-900 rounded-full">
                        <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#1E5BFF] to-[#4D7CFF] rounded-full transition-all"
                            style={{ width: `${((percent - 1) / (15 - 1)) * 100}%` }}
                        ></div>
                        <input 
                            type="range" min="1" max="15" step="1"
                            value={percent}
                            onChange={(e) => setPercent(parseInt(e.target.value))}
                            className="absolute top-[-4px] left-0 w-full h-5 opacity-0 cursor-pointer"
                        />
                    </div>
                    <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                        <span>1% (Mín)</span>
                        <span>Sugestão: 5%</span>
                        <span>15% (Máx)</span>
                    </div>
                </div>

                {/* DEFINIR VALIDADE */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Validade dos Créditos</label>
                        <Clock size={12} className="text-gray-400" />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {[15, 30, 60, 90].map((days) => (
                            <button
                                key={days}
                                onClick={() => setValidity(days)}
                                className={`py-4 rounded-2xl text-xs font-black transition-all border ${
                                    validity === days 
                                    ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-lg' 
                                    : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-500 hover:border-[#1E5BFF]/30'
                                }`}
                            >
                                {days}d
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={handleSaveConfig}
                    disabled={isSaving}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Salvar Alterações
                </button>
            </div>
        </section>

        {/* IDENTIFICAÇÃO */}
        <section className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Identificação no Balcão</h3>
            <div className="bg-white p-4 rounded-3xl mb-6 shadow-inner border border-gray-50">
                <img src={qrUrl} alt="QR Code" className="w-32 h-32 object-contain" />
            </div>
            <div className="space-y-2 mb-6">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Código Digital</p>
                <div className="bg-gray-100 dark:bg-gray-900 px-6 py-3 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <span className="text-2xl font-black text-gray-800 dark:text-white tracking-[0.2em]">{manualCode}</span>
                </div>
            </div>
            <div className="flex gap-2 w-full">
                <button className="flex-1 py-3.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-blue-100 dark:border-blue-800/50">
                    <Download className="w-3.5 h-3.5" /> Kit Impressão
                </button>
                <button className="flex-1 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-gray-100 dark:border-gray-800">
                    <Copy className="w-3.5 h-3.5" /> Copiar Código
                </button>
            </div>
        </section>

      </div>

      {/* Success Notification */}
      {showSuccess && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-[100]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="font-black text-xs uppercase tracking-widest">Configurações Ativas!</span>
          </div>
      )}
    </div>
  );
};
