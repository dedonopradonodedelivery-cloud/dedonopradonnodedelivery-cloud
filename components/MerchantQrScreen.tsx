
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Download, Share2, QrCode } from 'lucide-react';

interface MerchantQrScreenProps {
  onBack: () => void;
  user: any;
}

export const MerchantQrScreen: React.FC<MerchantQrScreenProps> = ({ onBack, user }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const merchantId = user?.id || 'demo-merchant-id';
  const paymentLink = `${window.location.origin}/loja/${merchantId}`;

  useEffect(() => {
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(paymentLink)}`);
  }, [paymentLink]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3"><button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100"><ChevronLeft className="w-6 h-6" /></button><h1 className="font-bold text-lg text-gray-900 dark:text-white">QR Code da Loja</h1></div>
        <button className="p-2 text-[#1E5BFF] rounded-full"><Share2 className="w-5 h-5" /></button>
      </header>
      <main className="flex-1 p-6 flex flex-col items-center">
        <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-[32px] p-8 shadow-xl text-center relative overflow-hidden mb-6">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1E5BFF]"></div>
          <h2 className="text-gray-900 dark:text-white font-bold text-lg mb-1">Acesso à Loja</h2>
          <p className="text-gray-500 text-sm mb-6">Clientes podem acessar seu catálogo por aqui</p>
          <div className="relative p-3 bg-white rounded-2xl border-2 border-dashed border-gray-200 mb-6">
            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64 object-contain" />}
          </div>
        </div>
      </main>
    </div>
  );
};
