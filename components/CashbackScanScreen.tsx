
import React, { useState, useEffect } from "react";
// Add ShieldCheck to the lucide-react imports
import { Camera, QrCode, KeyRound, ArrowLeft, Loader2, ArrowRight, XCircle, AlertTriangle, RefreshCcw, ShieldCheck } from "lucide-react";
import { useQrScanner } from "../hooks/useQrScanner";
import { validateStoreCode } from "../backend/services";

interface CashbackScanScreenProps {
  onBack: () => void;
  onScanSuccess: (storeData: any) => void;
}

export const CashbackScanScreen: React.FC<CashbackScanScreenProps> = ({ onBack, onScanSuccess }) => {
  const { videoRef, canvasRef, scanning, result, error, startScanner, stopScanner } = useQrScanner();
  const [activeTab, setActiveTab] = useState<"qr" | "pin">("qr");
  const [manualCode, setManualCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === "qr") {
      startScanner();
    } else {
      stopScanner();
    }
    return () => stopScanner();
  }, [activeTab]);

  useEffect(() => {
    if (result) {
      handleValidate(result);
    }
  }, [result]);

  const handleValidate = async (code: string) => {
    if (!code || code.length < 3) return;
    
    setIsValidating(true);
    setValidationError(null);
    
    try {
        // Validação obrigatória no backend (identificador seguro ou código fixo)
        const storeData = await validateStoreCode(code);
        if (storeData) {
            stopScanner();
            onScanSuccess(storeData);
        }
    } catch (e: any) {
        setValidationError(e.message || "Loja não encontrada. Verifique o código.");
        
        // Se estiver no modo QR, dá um tempo para o usuário ler o erro e reinicia o scanner
        if (activeTab === 'qr') {
            setTimeout(() => {
                if (activeTab === 'qr') startScanner();
            }, 3000);
        }
    } finally {
        setIsValidating(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.length >= 3) {
      handleValidate(manualCode);
    }
  };

  const handleReset = () => {
    setValidationError(null);
    setManualCode("");
    if (activeTab === 'qr') startScanner();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col animate-in fade-in duration-300 overflow-hidden">
      
      {/* Header Transparente */}
      <div className="pt-8 px-5 pb-4 flex flex-col items-center relative bg-gradient-to-b from-black/90 to-transparent z-10">
        <button 
            type="button" 
            className="absolute left-5 top-8 p-2.5 rounded-full bg-white/10 backdrop-blur-md active:scale-90 transition-transform" 
            onClick={onBack}
        >
            <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter">Identificar Loja</h1>
        <p className="text-xs text-white/50 font-bold uppercase tracking-widest mt-1">Jacarepaguá • RJ</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-12">
        
        {activeTab === "qr" ? (
          <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
            {/* Viewfinder da Câmera */}
            <div className="relative w-72 h-72 rounded-[3rem] border-[4px] border-white/20 overflow-hidden shadow-[0_0_0_100vmax_rgba(0,0,0,0.7)]">
              <video 
                ref={videoRef} 
                className="absolute inset-0 w-full h-full object-cover" 
                muted 
                playsInline 
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Moldura de Foco */}
              <div className="absolute inset-0 border-[2px] border-[#1E5BFF] rounded-[2.8rem] opacity-30"></div>
              
              {/* Linha de Scan Animada */}
              {scanning && !isValidating && !validationError && (
                <div className="absolute top-0 left-6 right-6 h-1 bg-[#1E5BFF] shadow-[0_0_20px_#1E5BFF] animate-[scan_2s_infinite_ease-in-out]"></div>
              )}

              {/* Overlays de Estado (Validação / Erro) */}
              {(isValidating || validationError) && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
                    {isValidating ? (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-[#1E5BFF]" />
                            <p className="text-sm font-black uppercase tracking-widest">Validando Loja...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500">
                                <AlertTriangle className="w-7 h-7" />
                            </div>
                            <p className="text-sm font-bold text-rose-400 leading-tight">{validationError}</p>
                            <button 
                                onClick={handleReset}
                                className="mt-2 text-[10px] font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-lg"
                            >
                                Tentar Novamente
                            </button>
                        </div>
                    )}
                </div>
              )}
            </div>

            <div className="mt-16 flex flex-col items-center gap-4 z-10 w-full">
                <button 
                    onClick={() => { stopScanner(); setActiveTab("pin"); }} 
                    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl transition-all border border-white/10 backdrop-blur-md active:scale-95"
                >
                    <KeyRound size={20} className="text-[#1E5BFF]" /> 
                    <span className="text-sm font-black uppercase tracking-widest">Digitar código da loja</span>
                </button>
            </div>
          </div>
        ) : (
          /* Modo de Digitação Manual */
          <div className="w-full max-w-xs animate-in slide-in-from-bottom duration-500">
             <div className="text-center mb-10">
                <div className="w-20 h-20 bg-[#1E5BFF]/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-[#1E5BFF]/20">
                    <KeyRound className="w-10 h-10 text-[#1E5BFF]" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-2">Código da Loja</h2>
                <p className="text-sm text-white/50 font-medium">Digite o código exibido no balcão do parceiro.</p>
             </div>

             <form onSubmit={handleManualSubmit} className="space-y-6">
                <div className="relative">
                    <input 
                        type="text" 
                        value={manualCode} 
                        onChange={(e) => {
                            setValidationError(null);
                            let val = e.target.value.toUpperCase();
                            if (val.length > 10) val = val.slice(0, 10);
                            setManualCode(val);
                        }} 
                        className={`w-full bg-white/5 border-2 transition-all rounded-3xl py-6 text-center text-4xl font-black tracking-[0.15em] outline-none focus:bg-white/10 shadow-inner ${
                            validationError ? 'border-rose-500 text-rose-500' : 'border-white/10 focus:border-[#1E5BFF]'
                        }`} 
                        placeholder="JPA-..." 
                        autoFocus 
                        autoComplete="off"
                        spellCheck="false"
                    />
                    {validationError && (
                        <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-1.5 text-rose-500 animate-in slide-in-from-top-1">
                            <XCircle size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{validationError}</span>
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={manualCode.length < 3 || isValidating} 
                        className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] disabled:bg-white/5 disabled:text-white/20 text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] uppercase tracking-widest text-sm"
                    >
                        {isValidating ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>Validar Loja <ArrowRight size={20} /></>
                        )}
                    </button>
                </div>
             </form>

             <button 
                onClick={() => { setValidationError(null); setActiveTab("qr"); }} 
                className="w-full text-center mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors"
             >
                Voltar para Câmera
             </button>
          </div>
        )}
      </div>

      {/* Dica do Rodapé */}
      <div className="p-10 flex flex-col items-center justify-center opacity-30 pointer-events-none">
        {/* Fixed: Added ShieldCheck to imports to resolve "Cannot find name 'ShieldCheck'" error */}
        <ShieldCheck className="w-5 h-5 mb-2 text-gray-500" />
        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-center">Identificação segura • JPA Localizei</p>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(280px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
