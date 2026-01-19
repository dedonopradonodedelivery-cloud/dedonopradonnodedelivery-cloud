
import React, { useState, useEffect } from "react";
import { 
  Camera, 
  QrCode, 
  KeyRound, 
  ArrowLeft, 
  Loader2, 
  ArrowRight, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck,
  CameraOff
} from "lucide-react";
import { useQrScanner } from "../hooks/useQrScanner";
import { validateStoreCode } from "../backend/services";

interface CashbackScanScreenProps {
  onBack: () => void;
  onScanSuccess: (storeData: any) => void;
}

export const CashbackScanScreen: React.FC<CashbackScanScreenProps> = ({ onBack, onScanSuccess }) => {
  const { videoRef, canvasRef, scanning, result, error: cameraError, startScanner, stopScanner } = useQrScanner();
  const [activeTab, setActiveTab] = useState<"qr" | "manual">("qr");
  const [manualCode, setManualCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Iniciar câmera automaticamente se estiver na aba QR
  useEffect(() => {
    if (activeTab === "qr") {
      startScanner();
    } else {
      stopScanner();
    }
    return () => stopScanner();
  }, [activeTab]);

  // Se a câmera falhar por permissão, muda automaticamente para manual após exibir erro breve
  useEffect(() => {
    if (cameraError) {
      const timer = setTimeout(() => {
        setActiveTab("manual");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [cameraError]);

  // Quando o scanner detectar um código
  useEffect(() => {
    if (result) {
      handleValidate(result);
    }
  }, [result]);

  const handleValidate = async (code: string) => {
    if (!code || code.trim().length < 3) return;
    
    setIsValidating(true);
    setValidationError(null);
    
    try {
        const storeData = await validateStoreCode(code);
        if (storeData) {
            stopScanner();
            onScanSuccess(storeData);
        }
    } catch (e: any) {
        setValidationError(e.message || "Código inválido. Verifique e tente novamente.");
        // Se falhar no QR, reinicia o scanner após delay
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
    handleValidate(manualCode);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col animate-in fade-in duration-300 overflow-hidden">
      
      {/* Header Fixo */}
      <div className="pt-12 px-5 pb-6 flex items-center justify-between relative bg-gradient-to-b from-black/90 to-transparent z-20">
        <button 
            type="button" 
            className="p-2.5 rounded-full bg-white/10 backdrop-blur-md active:scale-90 transition-transform" 
            onClick={onBack}
        >
            <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
            <h1 className="text-sm font-black uppercase tracking-[0.2em] text-white/90">Cashback Scanner</h1>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Identificar Estabelecimento</p>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-12 relative">
        
        {activeTab === "qr" ? (
          <div className="flex flex-col items-center w-full animate-in zoom-in-95 duration-500">
            
            {/* Viewfinder ou Mensagem de Erro */}
            <div className="relative w-72 h-72 rounded-[3.5rem] border-[4px] border-white/20 overflow-hidden shadow-[0_0_0_100vmax_rgba(0,0,0,0.85)]">
              {cameraError ? (
                <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center p-8 text-center">
                   <CameraOff className="w-12 h-12 text-rose-500 mb-4" />
                   <p className="text-sm font-bold text-rose-200 leading-tight mb-2">Acesso à câmera negado</p>
                   <p className="text-[10px] text-white/40 uppercase">Redirecionando para entrada manual...</p>
                </div>
              ) : (
                <>
                  <video 
                    ref={videoRef} 
                    className="absolute inset-0 w-full h-full object-cover" 
                    muted 
                    playsInline 
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Moldura */}
                  <div className="absolute inset-0 border-[2px] border-[#1E5BFF] rounded-[3.3rem] opacity-40"></div>
                  
                  {/* Laser */}
                  {scanning && !isValidating && !validationError && (
                    <div className="absolute top-0 left-8 right-8 h-1 bg-[#1E5BFF] shadow-[0_0_15px_#1E5BFF] animate-[scan_2.5s_infinite_ease-in-out]"></div>
                  )}
                </>
              )}

              {/* Feedback de Validação/Erro */}
              {(isValidating || validationError) && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
                    {isValidating ? (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-[#1E5BFF]" />
                            <p className="text-xs font-black uppercase tracking-widest text-blue-100">Validando...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500">
                                <AlertTriangle className="w-7 h-7" />
                            </div>
                            <p className="text-xs font-bold text-rose-400 leading-tight uppercase tracking-wide">{validationError}</p>
                            <button onClick={() => {setValidationError(null); startScanner();}} className="text-[10px] font-black uppercase tracking-widest text-white/60 bg-white/10 px-4 py-2 rounded-lg">Tentar de novo</button>
                        </div>
                    )}
                </div>
              )}
            </div>

            <div className="mt-16 w-full flex flex-col gap-4 max-w-xs z-30">
                <button 
                    onClick={() => setActiveTab("manual")} 
                    className="w-full flex items-center justify-center gap-3 bg-[#1E5BFF] text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-900/40 active:scale-95 transition-all"
                >
                    <KeyRound size={20} /> 
                    Digitar código da loja
                </button>
            </div>
          </div>
        ) : (
          /* MODO MANUAL (CÓDIGO JPA-XXXX) */
          <div className="w-full max-w-xs animate-in slide-in-from-bottom duration-500 z-30">
             <div className="text-center mb-10">
                <div className="w-20 h-20 bg-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/10">
                    <KeyRound className="w-10 h-10 text-[#1E5BFF]" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Entrada Manual</h2>
                <p className="text-sm text-white/50 font-medium leading-tight">Informe o código exibido no display do parceiro.</p>
             </div>

             <form onSubmit={handleManualSubmit} className="space-y-6">
                <div className="relative">
                    <input 
                        type="text" 
                        value={manualCode} 
                        onChange={(e) => {
                            setValidationError(null);
                            setManualCode(e.target.value.toUpperCase());
                        }} 
                        className={`w-full bg-white/5 border-2 transition-all rounded-[2rem] py-6 text-center text-3xl font-black tracking-[0.2em] outline-none focus:bg-white/10 ${
                            validationError ? 'border-rose-500 text-rose-500' : 'border-white/10 focus:border-[#1E5BFF]'
                        }`} 
                        placeholder="JPA-000" 
                        autoFocus 
                        autoComplete="off"
                        spellCheck="false"
                    />
                    {validationError && (
                        <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-1.5 text-rose-500 animate-in slide-in-from-top-1">
                            <XCircle size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Loja não encontrada</span>
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={manualCode.length < 3 || isValidating} 
                        className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] disabled:bg-white/5 disabled:text-white/20 text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] uppercase tracking-widest text-sm"
                    >
                        {isValidating ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>Confirmar <ArrowRight size={20} /></>
                        )}
                    </button>
                </div>
             </form>

             <button 
                onClick={() => { setValidationError(null); setActiveTab("qr"); }} 
                className="w-full text-center mt-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-colors"
             >
                Voltar para Câmera
             </button>
          </div>
        )}
      </div>

      <div className="p-10 flex flex-col items-center justify-center opacity-30 pointer-events-none pb-20">
        <ShieldCheck className="w-5 h-5 mb-2 text-gray-500" />
        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-center">Transação Segura • Localizei JPA</p>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(270px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
