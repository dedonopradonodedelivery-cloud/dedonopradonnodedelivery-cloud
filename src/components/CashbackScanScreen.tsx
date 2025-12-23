

import React, { useState, useEffect } from "react";
import { Camera, QrCode, KeyRound, ArrowLeft, Loader2, ArrowRight, XCircle, AlertTriangle } from "lucide-react";
import { useQrScanner } from '@/hooks/useQrScanner';

interface CashbackScanScreenProps {
  onBack: () => void;
  onScanSuccess: (data: { merchantId: string; storeId: string }) => void;
}

export const CashbackScanScreen: React.FC<CashbackScanScreenProps> = ({ onBack, onScanSuccess }) => {
  const {
    videoRef,
    canvasRef,
    scanning,
    result,
    error,
    startScanner,
    stopScanner,
    setResult
  } = useQrScanner();

  const [activeTab, setActiveTab] = useState<"qr" | "pin">("qr");
  const [pin, setPin] = useState("");
  const [hasScanned, setHasScanned] = useState(false);

  // Iniciar scanner automaticamente ao abrir (UX requirement: "Imediato")
  useEffect(() => {
    if (activeTab === "qr") {
        startScanner();
    }
    return () => stopScanner();
  }, [activeTab]);

  useEffect(() => {
    if (result) {
      setHasScanned(true);
      try {
        const data = JSON.parse(result);
        // Suporte a formatos legados ou simples para robustez
        const merchantId = data.merchantId || data.id; 
        const storeId = data.storeId || data.merchantId || data.id;

        if (merchantId) {
            stopScanner();
            onScanSuccess({ merchantId, storeId });
        } else {
            // Fallback: talvez o QR seja apenas o ID string direto
            if (typeof result === 'string' && result.length > 5) {
                 stopScanner();
                 onScanSuccess({ merchantId: result, storeId: result });
            } else {
                setHasScanned(false);
            }
        }
      } catch (e) {
        // Fallback para string simples (ex: URL ou ID direto)
        console.warn("QR não JSON, usando raw string");
        stopScanner();
        // Assume que o QR é o ID se falhar o parse
        onScanSuccess({ merchantId: result, storeId: result });
      }
    }
  }, [result]);

  const handleStartScan = () => {
    setHasScanned(false);
    startScanner();
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) return;
    // Simulação de sucesso com PIN
    onScanSuccess({ merchantId: 'merchant_pin_lookup', storeId: 'store_pin_lookup' });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col animate-in fade-in duration-300">
      
      {/* Header Fixo */}
      <div className="pt-6 px-5 pb-4 flex flex-col items-center relative bg-gradient-to-b from-black/80 to-transparent z-10">
        <button
          type="button"
          className="absolute left-5 top-6 p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
          onClick={onBack}
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <h1 className="text-lg font-bold text-white mb-1">Escaneie o QR do lojista</h1>
        <p className="text-sm text-white/70 font-medium">Registre sua compra e receba cashback</p>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-10">
        
        {activeTab === "qr" ? (
          <>
            {/* Viewfinder */}
            <div className="relative w-72 h-72 rounded-[32px] border-[3px] border-white/20 overflow-hidden shadow-[0_0_0_100vmax_rgba(0,0,0,0.6)] z-0">
              
              {/* Câmera */}
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                playsInline
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Elementos de Overlay */}
              <div className="absolute inset-0 border-[3px] border-[#1E5BFF] rounded-[30px] opacity-50"></div>
              
              {/* Scan Animation Line */}
              {scanning && (
                  <div className="absolute top-0 left-4 right-4 h-0.5 bg-[#1E5BFF] shadow-[0_0_20px_#1E5BFF] animate-[scan_2s_infinite_ease-in-out]"></div>
              )}

              {/* State: Permissão Negada ou Erro */}
              {error && (
                  <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-3">
                          <XCircle className="w-6 h-6 text-red-500" />
                      </div>
                      <p className="text-sm font-bold text-white mb-1">Câmera indisponível</p>
                      <p className="text-xs text-white/60 mb-4">Verifique as permissões do seu navegador.</p>
                      <button 
                        onClick={handleStartScan}
                        className="text-xs font-bold text-[#1E5BFF] bg-white/10 px-4 py-2 rounded-full"
                      >
                        Tentar Novamente
                      </button>
                  </div>
              )}

              {/* State: Carregando */}
              {scanning && !result && !error && (
                 <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
                        <Loader2 className="w-3 h-3 text-white animate-spin" />
                        <span className="text-[10px] font-bold text-white/90 uppercase tracking-wide">Buscando QR...</span>
                    </div>
                 </div>
              )}
            </div>

            {/* Alternativa PIN */}
            <div className="mt-12 flex flex-col items-center gap-4 z-10">
                <p className="text-sm text-white/50">Não consegue ler o código?</p>
                <button 
                    onClick={() => { stopScanner(); setActiveTab("pin"); }}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-full transition-all active:scale-95"
                >
                    <KeyRound className="w-4 h-4" />
                    Digitar código do lojista
                </button>
            </div>
            
            {/* Dev Helper */}
            <button
              onClick={() => onScanSuccess({ merchantId: 'dev_mock', storeId: 'dev_mock' })}
              className="fixed bottom-4 right-4 text-[10px] text-white/10 hover:text-white/50"
            >
              [DEV: Simular Scan]
            </button>
          </>
        ) : (
          <div className="w-full max-w-xs animate-in slide-in-from-right duration-300">
             <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-8 h-8 text-[#1E5BFF]" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Código do Lojista</h2>
                <p className="text-sm text-white/60">Peça o PIN de 6 dígitos no caixa.</p>
             </div>

             <form onSubmit={handlePinSubmit}>
                <input
                    type="tel"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full bg-white/10 border-2 border-white/10 rounded-2xl py-4 text-center text-3xl font-bold text-white tracking-[0.3em] outline-none focus:border-[#1E5BFF] transition-colors mb-6 placeholder-white/10"
                    placeholder="000000"
                    autoFocus
                />
                
                <button
                    type="submit"
                    disabled={pin.length < 4}
                    className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] disabled:bg-white/10 disabled:text-white/30 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    Continuar
                    <ArrowRight className="w-5 h-5" />
                </button>
             </form>

             <button 
                onClick={() => setActiveTab("qr")}
                className="w-full text-center mt-6 text-sm font-bold text-white/50 hover:text-white transition-colors"
             >
                Voltar para Câmera
             </button>
          </div>
        )}
      </div>
    </div>
  );
};