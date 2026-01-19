
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Share2, 
  QrCode, 
  Copy, 
  CheckCircle2, 
  ShieldCheck, 
  Store, 
  Info,
  Printer,
  AlertCircle
} from 'lucide-react';

interface MerchantQrScreenProps {
  onBack: () => void;
  user: any;
}

export const MerchantQrScreen: React.FC<MerchantQrScreenProps> = ({ onBack, user }) => {
  const [copied, setCopied] = useState(false);
  
  // Identificador seguro da loja (UUID permanente do usuário lojista)
  // Este ID é usado no QR Code para evitar fraudes de digitação
  const secureId = user?.id || 'loja-identificador-seguro';
  
  // REGRA: Código fixo, curto e fácil (Ex: JPA-123)
  // Vinculado permanentemente ao lojista. Nunca muda.
  const manualCode = useMemo(() => {
    if (user?.user_metadata?.manual_code) return user.user_metadata.manual_code;
    if (!user?.id) return "JPA-000";
    
    // Simulação de geração de código único e permanente baseado no UID
    // Em produção, este valor é persistido na coluna 'merchants.manual_code' com UNIQUE constraint
    const suffix = user.id.slice(-4).toUpperCase();
    return `JPA-${suffix}`;
  }, [user]);

  // QR Code aponta para o ID seguro no backend
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${secureId}&color=1e5bff&bgcolor=ffffff`;

  const handleCopy = () => {
    navigator.clipboard.writeText(manualCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareText = `Registre sua compra na loja *${user?.user_metadata?.store_name || "Minha Loja"}* usando meu código fixo: *${manualCode}* ou escaneie o QR Code no balcão!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Código da Loja - Localizei JPA',
          text: shareText,
          url: window.location.origin,
        });
      } catch (err) {
        console.log('Share error:', err);
      }
    } else {
      handleCopy();
      alert("Código copiado! Compartilhe com seus clientes.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans flex flex-col animate-in fade-in duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">Identificação Permanente</h1>
        </div>
        <button onClick={handleShare} className="p-2 text-[#1E5BFF] rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-90 transition-transform">
          <Share2 className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center overflow-y-auto no-scrollbar pb-10">
        
        {/* Banner de Segurança */}
        <div className="w-full bg-[#EAF0FF] dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-2xl mb-8 flex gap-4 items-start shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-[#1E5BFF] shrink-0 shadow-sm border border-blue-50">
                <ShieldCheck size={20} />
            </div>
            <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed font-medium">
                Este é o identificador único da sua loja. Ele nunca muda e é vinculado permanentemente ao seu estabelecimento no Localizei JPA.
            </p>
        </div>

        {/* Card do QR Code Principal */}
        <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-[3rem] p-8 shadow-2xl text-center relative overflow-hidden mb-8 border border-gray-100 dark:border-gray-700">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1E5BFF] via-[#4D7CFF] to-[#1E5BFF]"></div>
            
            <div className="flex flex-col items-center mb-8">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-[#1E5BFF] mb-3 shadow-inner">
                    <Store size={28} />
                </div>
                <h2 className="text-gray-900 dark:text-white font-black text-xl uppercase tracking-tighter">
                    {user?.user_metadata?.store_name || "Seu Estabelecimento"}
                </h2>
                <div className="flex items-center gap-1.5 mt-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={12} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Código Validado pelo Sistema</span>
                </div>
            </div>

            {/* QR Area - Grande e Central */}
            <div className="relative p-6 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 mb-10 shadow-inner group transition-all hover:scale-[1.02]">
                <img 
                    src={qrUrl} 
                    alt="QR Code Oficial da Loja" 
                    className="w-full aspect-square object-contain mix-blend-multiply" 
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/40 backdrop-blur-[2px] rounded-[2.5rem]">
                    <QrCode size={56} className="text-[#1E5BFF] drop-shadow-lg" />
                </div>
            </div>

            {/* Código Manual Destacado */}
            <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Código de Digitação Manual</p>
                <div className="relative flex items-center group">
                  <div className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex items-center justify-center shadow-inner">
                    <span className="text-4xl font-black text-gray-800 dark:text-white tracking-[0.25em] select-all">
                        {manualCode}
                    </span>
                  </div>
                  <button 
                      onClick={handleCopy}
                      className="absolute right-3 p-3.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-gray-400 hover:text-[#1E5BFF] active:scale-90 transition-all border border-gray-100 dark:border-gray-700 group-hover:shadow-[#1E5BFF]/10"
                  >
                      {copied ? <CheckCircle2 size={24} className="text-green-500" /> : <Copy size={24} />}
                  </button>
                </div>
                {copied && (
                  <p className="text-[10px] text-green-500 font-bold animate-in fade-in slide-in-from-top-1 text-center">
                    Copiado para o balcão!
                  </p>
                )}
            </div>
        </div>

        {/* Footer Info */}
        <div className="w-full max-w-sm flex items-start gap-3 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-2xl">
            <AlertCircle size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                O cliente pode escanear o QR Code ou digitar o código acima para validar transações. Ambos levam ao mesmo perfil de lojista de forma segura.
            </p>
        </div>

        <button 
            onClick={() => window.print()}
            className="mt-8 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold py-4 px-10 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-gray-50"
        >
            <Printer size={18} />
            Gerar Kit p/ Balcão (PDF)
        </button>

      </main>
    </div>
  );
};
