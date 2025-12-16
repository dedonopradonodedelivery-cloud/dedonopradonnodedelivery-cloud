
import React, { useEffect, useState } from 'react';
import { Store, CheckCircle2, X } from 'lucide-react';
import { getStoreLogo } from '../utils/mockLogos';

interface ScanConfirmationScreenProps {
  storeId: string; // ID recebido do QR
  onConfirm: () => void;
  onCancel: () => void;
}

export const ScanConfirmationScreen: React.FC<ScanConfirmationScreenProps> = ({ storeId, onConfirm, onCancel }) => {
  const [storeData, setStoreData] = useState<{ name: string; address: string; logo: string } | null>(null);

  useEffect(() => {
    // Simulação de busca dos dados da loja baseada no ID
    // Em produção, faria um fetch no Supabase: supabase.from('businesses').select('*').eq('id', storeId)
    setTimeout(() => {
        setStoreData({
            name: "Hamburgueria Brasa", // Mock
            address: "Rua Araguaia, 450 - Freguesia",
            logo: getStoreLogo(1)
        });
    }, 600);
  }, [storeId]);

  if (!storeData) {
      return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 animate-in fade-in">
              <div className="w-16 h-16 border-4 border-[#1E5BFF] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">Identificando loja...</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 animate-in zoom-in-95 duration-300">
        
        <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent pointer-events-none"></div>

            <div className="relative z-10">
                <div className="w-24 h-24 bg-white dark:bg-gray-700 rounded-2xl mx-auto mb-6 shadow-lg flex items-center justify-center p-2 border border-gray-100 dark:border-gray-600">
                    <img src={storeData.logo} alt={storeData.name} className="w-full h-full object-contain rounded-xl" />
                </div>

                <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold mb-4">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Loja Verificada
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {storeData.name}
                </h2>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-[200px] mx-auto">
                    Você está registrando uma compra nesta loja.
                </p>

                <div className="space-y-3">
                    <button 
                        onClick={onConfirm}
                        className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
                    >
                        Continuar
                    </button>
                    <button 
                        onClick={onCancel}
                        className="w-full bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>

    </div>
  );
};
