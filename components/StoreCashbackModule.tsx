
import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  QrCode, 
  Download, 
  Settings, 
  Save, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  Users, 
  DollarSign, 
  AlertCircle,
  FileText,
  X,
  Check,
  Lock,
  Play,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface StoreCashbackModuleProps {
  onBack: () => void;
}

const TRANSACTIONS = [
  { id: 1, date: '12/11 - 14:30', client: 'Ana S.', purchase: 150.00, cashback: 7.50, status: 'confirmado' },
  { id: 2, date: '12/11 - 10:15', client: 'Carlos M.', purchase: 85.00, cashback: 4.25, status: 'pendente' },
  { id: 3, date: '11/11 - 18:45', client: 'Beatriz L.', purchase: 210.00, cashback: 10.50, status: 'confirmado' },
  { id: 4, date: '10/11 - 09:20', client: 'João P.', purchase: 45.00, cashback: 2.25, status: 'expirado' },
];

export const StoreCashbackModule: React.FC<StoreCashbackModuleProps> = ({ onBack }) => {
  const STORE_ID = 'store_123_freguesia';
  
  const [isTutorialCompleted, setIsTutorialCompleted] = useState(() => {
    return localStorage.getItem(`tutorial_completed_${STORE_ID}`) === 'true';
  });
  
  const [isActive, setIsActive] = useState(false); 
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsCheck, setTermsCheck] = useState(false);

  const [percent, setPercent] = useState<number>(5);
  const [maxValue, setMaxValue] = useState('50');
  const [validity, setValidity] = useState('30');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (isActive) {
      generateStoreQRCode(STORE_ID);
    }
  }, [isActive]);

  const handleSimulateTutorialEnd = () => {
    localStorage.setItem(`tutorial_completed_${STORE_ID}`, 'true');
    setIsTutorialCompleted(true);
  };

  const generateStoreQRCode = (storeId: string) => {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=localizei-cashback-${storeId}`;
    setQrCodeUrl(url);
  };

  const handleToggleClick = () => {
    if (isActive) {
      setIsActive(false);
    } else {
      if (hasAcceptedTerms) {
        setIsActive(true);
      } else {
        setShowTermsModal(true);
      }
    }
  };

  const handleAcceptTerms = () => {
    setHasAcceptedTerms(true);
    setIsActive(true);
    setShowTermsModal(false);
  };

  const handleDownloadQr = async () => {
    if (!qrCodeUrl) return;
    try {
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qrcode-localizei-${STORE_ID}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (err) {
        alert("Erro ao baixar QR Code.");
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  if (!isTutorialCompleted) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30 border-4 border-white/10">
                <Sparkles className="w-8 h-8 text-white fill-white" />
            </div>
            <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight mb-2">
                Guia de Cashback
            </h2>
            <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                Clique no card abaixo para concluir o guia e liberar as configurações da sua loja.
            </p>
        </div>

        <div 
            onClick={handleSimulateTutorialEnd}
            className="w-full max-w-md aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800 relative group cursor-pointer active:scale-[0.98] transition-all"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play size={32} fill="currentColor" className="ml-1" />
                </div>
                <p className="mt-4 text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Toque para concluir guia</p>
            </div>
        </div>

        <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/20 animate-pulse">
            <Lock className="w-4 h-4 text-yellow-500" />
            <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">
                Painel bloqueado até concluir o guia
            </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300 pb-20 relative">
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Cashback da sua loja</h1>
      </div>

      <div className="p-5 space-y-6">
        <div className={`rounded-3xl p-6 transition-all duration-300 ${isActive ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-xl shadow-indigo-500/20' : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700'}`}>
            <div className="flex items-center justify-between mb-2">
                <span className={`font-bold text-lg ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                    {isActive ? 'Cashback Ativado' : 'Cashback Desativado'}
                </span>
                <button 
                    onClick={handleToggleClick}
                    className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${isActive ? 'bg-white/30' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
            </div>

            {!isActive && (
                <div className="mt-4 flex gap-3 items-start bg-orange-50 dark:bg-orange-900/10 p-3 rounded-xl border border-orange-100 dark:border-orange-800/30">
                    <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-orange-700 dark:text-orange-300 leading-relaxed">
                        Sua loja não aparece nos filtros de "Cashback" e "Destaques" enquanto essa função estiver desativada.
                    </p>
                </div>
            )}

            {isActive && (
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 mt-6">
                    <div className="bg-white p-3 rounded-2xl shadow-lg mb-4">
                        {qrCodeUrl ? (
                            <img src={qrCodeUrl} alt="QR Code Loja" className="w-32 h-32" />
                        ) : (
                            <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-lg"></div>
                        )}
                    </div>
                    <p className="text-indigo-100 text-xs mb-4 text-center max-w-[200px]">
                        Este é o QR Code oficial da sua loja. Imprima e coloque no balcão para os clientes escanearem.
                    </p>
                    <button 
                        onClick={handleDownloadQr}
                        className="bg-white text-indigo-700 font-bold text-sm py-3 px-6 rounded-xl shadow-sm hover:bg-indigo-50 transition-colors flex items-center gap-2 active:scale-95"
                    >
                        <Download className="w-4 h-4" />
                        Baixar QR Code
                    </button>
                </div>
            )}
        </div>

        <section className={`bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-opacity duration-300 ${!isActive ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white">
                <Settings className="w-5 h-5 text-gray-400" />
                <h3 className="font-bold text-lg">Configurar Cashback</h3>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                    <div className="flex justify-between items-end mb-3">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Porcentagem de Volta</label>
                        <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{percent}%</span>
                    </div>
                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
                        <div 
                            className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${((percent - 3) / 47) * 100}%` }}
                        ></div>
                        <input 
                            type="range" 
                            min="3" 
                            max="50" 
                            step="1"
                            value={percent}
                            onChange={(e) => setPercent(parseInt(e.target.value))}
                            className="absolute top-[-6px] left-0 w-full h-4 opacity-0 cursor-pointer" 
                        />
                        <div 
                            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-indigo-500 rounded-full shadow-md pointer-events-none transition-all"
                            style={{ left: `calc(${((percent - 3) / 47) * 100}% - 10px)` }}
                        ></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Valor Máx (R$)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                            <input 
                                type="number" 
                                value={maxValue}
                                onChange={(e) => setMaxValue(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-3 pl-8 text-gray-900 dark:text-white font-bold outline-none" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Validade (Dias)</label>
                        <input 
                            type="number" 
                            value={validity}
                            onChange={(e) => setValidity(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-gray-900 dark:text-white font-bold outline-none" 
                        />
                    </div>
                </div>
            </div>

            <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                {isSaving ? 'Salvando...' : 'Salvar Configurações'}
                {!isSaving && <Save className="w-4 h-4" />}
            </button>
        </section>

        <section>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4 px-1">Resultados</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm col-span-2">
                    <div className="flex items-center gap-2 mb-2 text-green-600">
                        <DollarSign className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wide">Vendas Influenciadas</span>
                    </div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">R$ 12.450,00</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-[#1E5BFF]">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">Cashback Dado</span>
                    </div>
                    <p className="text-lg font-black text-gray-900 dark:text-white">R$ 622,50</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-blue-500">
                        <Users className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">Clientes</span>
                    </div>
                    <p className="text-lg font-black text-gray-900 dark:text-white">114</p>
                </div>
            </div>

            <div>
                <h4 className="font-bold text-sm text-gray-700 dark:text-gray-200 mb-3 px-1">Últimas Transações</h4>
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                    {TRANSACTIONS.map((t, i) => (
                        <div key={t.id} className={`p-4 flex items-center justify-between ${i !== TRANSACTIONS.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
                            <div>
                                <p className="font-bold text-sm text-gray-900 dark:text-white">{t.client}</p>
                                <p className="text-xs text-gray-400">{t.date}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-sm text-gray-900 dark:text-white">R$ {t.purchase.toFixed(2)}</p>
                                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                    <span className="text-[10px] font-bold text-[#1E5BFF]">+ R$ {t.cashback.toFixed(2)}</span>
                                    {t.status === 'confirmado' && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

      </div>

      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
            <div 
                className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Termos de Adesão</h2>
                    <button onClick={() => setShowTermsModal(false)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
                </div>
                <div className="flex-1 overflow-y-auto bg-[#EAF0FF] dark:bg-gray-800 rounded-xl p-4 text-xs text-gray-600 dark:text-gray-300 mb-4 border border-blue-100 leading-relaxed">
                    <p className="font-bold mb-2">1. Programa de Cashback</p>
                    <p className="mb-2">Ao ativar o programa de cashback, o estabelecimento concorda em conceder o desconto definido sobre o valor total da compra.</p>
                    <p className="font-bold mb-2">2. Responsabilidade do Lojista</p>
                    <p>O lojista é responsável por honrar o cashback prometido e validar a transação.</p>
                </div>
                <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => setTermsCheck(!termsCheck)}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${termsCheck ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}>
                        {termsCheck && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-sm font-medium">Li e aceito os termos</span>
                </div>
                <button onClick={handleAcceptTerms} disabled={!termsCheck} className="w-full bg-[#1E5BFF] text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-[0.98] disabled:opacity-50">Ativar Cashback</button>
            </div>
        </div>
      )}

    </div>
  );
};
