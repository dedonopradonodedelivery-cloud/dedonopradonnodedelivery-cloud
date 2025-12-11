
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Download, Copy, CheckCircle2, HelpCircle, Share2, QrCode } from 'lucide-react';

interface MerchantQrScreenProps {
  onBack: () => void;
  user: any;
}

export const MerchantQrScreen: React.FC<MerchantQrScreenProps> = ({ onBack, user }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Derive merchant data safely
  const merchantId = user?.uid || 'demo-merchant-id';
  // Generate a mock PIN based on ID for visual purposes
  const pin = merchantId.substring(0, 6).toUpperCase();
  
  // Construct a deep link for payment
  // In production, this would be a real URL that opens the customer app
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://localizei.app';
  const paymentLink = `${origin}/cashback/loja/${merchantId}`;

  useEffect(() => {
    // Generate QR using a reliable public API to avoid local library dependencies
    const params = new URLSearchParams({
      size: '600x600',
      data: paymentLink,
      color: '000000',
      bgcolor: 'ffffff',
      qzone: '2', // Quiet zone (padding)
      margin: '0'
    });
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`);
  }, [paymentLink]);

  const handleDownload = async () => {
    if (!qrCodeUrl) return;
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-localizei-${pin}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      alert("Não foi possível baixar a imagem.");
    }
  };

  const handleCopyPin = () => {
    navigator.clipboard.writeText(pin).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pagar com Localizei',
          text: `Pague com cashback na minha loja!`,
          url: paymentLink,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      handleCopyPin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans flex flex-col animate-in fade-in duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">Receber Pagamento</h1>
        </div>
        <button 
          onClick={handleShare}
          className="p-2 text-[#1E5BFF] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center pb-24">
        
        {/* Main QR Card */}
        <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-[32px] p-8 shadow-xl shadow-blue-900/5 border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center relative overflow-hidden mb-6">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#1E5BFF] to-[#4D7CFF]"></div>
          
          <h2 className="text-gray-900 dark:text-white font-bold text-lg mb-1">Escaneie para Pagar</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Aponte a câmera do celular para o código</p>

          <div className="relative p-3 bg-white rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600 mb-6">
            {qrCodeUrl ? (
              <img 
                src={qrCodeUrl} 
                alt="QR Code de Pagamento" 
                className="w-64 h-64 object-contain rounded-xl"
              />
            ) : (
              <div className="w-64 h-64 bg-gray-100 dark:bg-gray-700 animate-pulse rounded-xl flex items-center justify-center text-gray-400">
                Gerando QR...
              </div>
            )}
            
            {/* Center Logo Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1.5 rounded-full shadow-md">
                <QrCode className="w-6 h-6 text-black" />
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Cashback Ativo
          </div>
        </div>

        {/* PIN Section */}
        <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between mb-6">
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
              PIN de Pagamento
            </span>
            <span className="text-3xl font-mono font-black text-gray-800 dark:text-white tracking-wider">
              {pin}
            </span>
          </div>
          <button 
            onClick={handleCopyPin}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#EAF0FF] dark:bg-blue-900/20 text-[#1E5BFF] dark:text-blue-300 rounded-xl font-bold text-xs hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors active:scale-95"
          >
            {copied ? (
                <>
                    <CheckCircle2 className="w-4 h-4" /> Copiado
                </>
            ) : (
                <>
                    <Copy className="w-4 h-4" /> Copiar
                </>
            )}
          </button>
        </div>

        {/* Actions */}
        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={handleDownload}
            className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white rounded-2xl py-4 font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Baixar QR Code
          </button>

          <button
            onClick={() => alert("O cliente deve ler este código para validar a compra e ganhar cashback.")}
            className="w-full py-3 text-gray-500 dark:text-gray-400 font-bold text-sm hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            Como funciona?
          </button>
        </div>

      </main>
    </div>
  );
};
