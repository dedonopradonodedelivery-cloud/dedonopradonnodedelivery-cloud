
import React, { useState } from 'react';
import { ChevronLeft, ShieldCheck, Zap, Settings, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { FeatureFlags } from '../types';

interface AdminConfigPanelProps {
  onBack: () => void;
}

export const AdminConfigPanel: React.FC<AdminConfigPanelProps> = ({ onBack }) => {
  const { features, updateFeatures, loading } = useConfig();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleToggle = async (key: keyof FeatureFlags) => {
    setIsUpdating(key);
    setFeedback(null);
    
    const success = await updateFeatures({ [key]: !features[key] });
    
    if (success) {
      setFeedback({ type: 'success', msg: 'Flag atualizada com sucesso!' });
    } else {
      setFeedback({ type: 'error', msg: 'Erro ao atualizar. Verifique permissões.' });
    }
    
    setIsUpdating(null);
    setTimeout(() => setFeedback(null), 3000);
  };

  const featureList = [
    { key: 'cashbackEnabled', label: 'Cashback', desc: 'Habilita o sistema de recompensas em dinheiro.' },
    { key: 'couponsEnabled', label: 'Cupons de Desconto', desc: 'Habilita a aba e resgate de cupons promocionais.' },
    { key: 'jobsEnabled', label: 'Vagas de Emprego', desc: 'Habilita o mural de vagas e alertas de emprego.' },
    { key: 'agencyEnabled', label: 'Agência (Parceiro)', desc: 'Habilita o portal para agências parceiras.' },
    { key: 'sponsorMasterBannerEnabled', label: 'Banner Patrocinador Master', desc: 'Exibe o banner VIP do patrocinador master na home.' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1E5BFF]" />
            Configuração Remota
          </h1>
        </div>
      </div>

      <div className="p-5 space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/30">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-blue-900 dark:text-blue-300 text-sm">Feature Flags (Realtime)</h3>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
            As alterações feitas aqui refletem instantaneamente em todos os dispositivos conectados. Use com cautela.
          </p>
        </div>

        {feedback && (
          <div className={`p-3 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
            feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="text-xs font-bold">{feedback.msg}</span>
          </div>
        )}

        <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
          {loading ? (
            <div className="p-10 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-[#1E5BFF] animate-spin" />
              <p className="text-sm text-gray-400">Sincronizando...</p>
            </div>
          ) : (
            featureList.map((item, idx) => (
              <div 
                key={item.key} 
                className={`p-5 flex items-center justify-between transition-colors ${idx !== featureList.length - 1 ? 'border-b border-gray-50 dark:border-gray-800' : ''}`}
              >
                <div className="flex-1 pr-4">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">{item.label}</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                </div>
                
                <button 
                  onClick={() => handleToggle(item.key)}
                  disabled={isUpdating === item.key}
                  className={`w-12 h-6 rounded-full p-1 transition-all duration-300 flex items-center ${
                    features[item.key] ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'
                  } ${isUpdating === item.key ? 'opacity-50' : ''}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                    features[item.key] ? 'translate-x-6' : 'translate-x-0'
                  }`}>
                    {isUpdating === item.key && (
                      <RefreshCw className="w-full h-full p-0.5 text-gray-400 animate-spin" />
                    )}
                  </div>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="pt-8 text-center">
            <p className="text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.4em]">Apenas Administradores</p>
        </div>
      </div>
    </div>
  );
};
