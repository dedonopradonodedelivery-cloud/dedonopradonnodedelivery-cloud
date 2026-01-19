
import React, { useState, useEffect } from "react";
import { Camera, QrCode, KeyRound, ArrowLeft, Loader2, ArrowRight, XCircle, AlertTriangle } from "lucide-react";
import { useQrScanner } from "../hooks/useQrScanner";
import { validateStoreCode } from "../backend/services";

interface CashbackScanScreenProps {
  onBack: () => void;
  onScanSuccess: (storeData: any) => void;
}

export const CashbackScanScreen: React.FC<CashbackScanScreenProps> = ({ onBack, onScanSuccess }) => {
  const { videoRef, canvasRef, scanning, result, error, startScanner, stopScanner } = useQrScanner();
  const [activeTab, setActiveTab] = useState<"qr" | "pin">("qr");
  const [pin, setPin] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === "qr") startScanner();
    return () => stopScanner();
  }, [activeTab]);

  useEffect(() => {
    if (result) handleValidate(result);
  }, [result]);

  const handleValidate = async (code: string) => {
    setIsValidating(true);
    setValidationError(null);
    try {
        const storeData = await validateStoreCode(code);
        if (storeData) {
            stopScanner();
            onScanSuccess(storeData);
        }
    } catch (e: any) {
        setValidationError(e.message || "Código inválido");
        // Se for QR, volta a escanear após 2 segundos
        if (activeTab === 'qr') setTimeout(() => startScanner(), 2000);
    } finally {
        setIsValidating(false);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length >= 4) handleValidate(pin);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col animate-in fade-in duration-300">
      <div className="pt-6 px-5 pb-4 flex flex-col items-center relative bg-gradient-to-b from-black/80 to-transparent z-10">
        <button type="button" className="absolute left-5 top-6 p-2 rounded-full bg-white/10 backdrop-blur-md" onClick={onBack}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-lg font-bold">Escaneie o QR do lojista</h1>
        <p className="text-sm text-white/70">Registre sua compra e receba cashback</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-10">
        {activeTab === "qr" ? (
          <>
            <div className="relative w-72 h-72 rounded-[32px] border-[3px] border-white/20 overflow-hidden shadow-[0_0_0_100vmax_rgba(0,0,0,0.6)]">
              <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" muted playsInline />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 border-[3px] border-[#1E5BFF] rounded-[30px] opacity-50"></div>
              {scanning && <div className="absolute top-0 left-4 right-4 h-0.5 bg-[#1E5BFF] shadow-[0_0_20px_#1E5BFF] animate-[scan_2s_infinite_ease-in-out]"></div>}
              {(isValidating || validationError) && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                    {isValidating ? <Loader2 className="w-8 h-8 animate-spin text-[#1E5BFF]" /> : <AlertTriangle className="w-8 h-8 text-rose-500 mb-2" />}
                    <p className="text-xs font-bold">{isValidating ? 'Validando...' : validationError}</p>
                </div>
              )}
            </div>
            <div className="mt-12 flex flex-col items-center gap-4 z-10">
                <button onClick={() => { stopScanner(); setActiveTab("pin"); }} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full transition-all"><KeyRound size={16} /> Digitar código manual</button>
            </div>
          </>
        ) : (
          <div className="w-full max-w-xs animate-in slide-in-from-right duration-300">
             <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4"><KeyRound className="w-8 h-8 text-[#1E5BFF]" /></div>
                <h2 className="text-xl font-bold">Código da Loja</h2>
                <p className="text-sm text-white/60">Digite o código exibido no balcão.</p>
             </div>
             <form onSubmit={handlePinSubmit}>
                <input type="text" value={pin} onChange={(e) => setPin(e.target.value.toUpperCase())} className="w-full bg-white/10 border-2 border-white/10 rounded-2xl py-4 text-center text-3xl font-bold tracking-widest outline-none focus:border-[#1E5BFF] mb-4" placeholder="JPA-000" autoFocus />
                {validationError && <p className="text-rose-500 text-center text-xs font-bold mb-4">{validationError}</p>}
                <button type="submit" disabled={pin.length < 4 || isValidating} className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all">
                    {isValidating ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Validar Loja <ArrowRight size={18} /></>}
                </button>
             </form>
             <button onClick={() => setActiveTab("qr")} className="w-full text-center mt-6 text-sm font-bold text-white/50">Voltar para Câmera</button>
          </div>
        )}
      </div>
    </div>
  );
};
