
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Gift, CheckCircle2, Lock, ArrowRight, Tag } from 'lucide-react';
import { STORES } from '../constants';
import { Store } from '../types';

interface WeeklyPromoSelectionViewProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

const PARTICIPATING_STORES = STORES.slice(0, 5); // Mock

export const WeeklyPromoSelectionView: React.FC<WeeklyPromoSelectionViewProps> = ({ onBack, onNavigate }) => {
  const [userChoice, setUserChoice] = useState<{ storeId: string; status: 'chosen' | 'redeemed' } | null>(null);
  const [unlockProgress, setUnlockProgress] = useState(60); // Mocked progress

  const handleChoose = (storeId: string) => {
    setUserChoice({ storeId, status: 'chosen' });
  };
  
  const handleRedeem = () => {
    if (userChoice) {
      setUserChoice({ ...userChoice, status: 'redeemed' });
      // Em um app real, aqui seria a chamada para gerar o cupom no backend
      setTimeout(() => onNavigate('user_coupons'), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-white/10">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10"><ChevronLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">Desconto da Semana</h1>
      </header>

      <div className="p-5">
        {/* Unlock Progress */}
        <div className="bg-slate-800 p-5 rounded-3xl border border-white/10 mb-8">
          <p className="text-xs font-bold text-amber-400 uppercase mb-2">Seu Progresso Semanal</p>
          <div className="w-full bg-slate-700 rounded-full h-2.5 mb-2">
            <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${unlockProgress}%` }}></div>
          </div>
          <p className="text-xs text-slate-400">
            {unlockProgress < 100 ? `Faltam ${5 - Math.floor(unlockProgress/20)} acessos para liberar. Continue usando o app!` : 'Você desbloqueou o desconto desta semana!'}
          </p>
        </div>

        {/* Store List */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Lojas participantes esta semana:</h2>
          {PARTICIPATING_STORES.map(store => {
            const isSelected = userChoice?.storeId === store.id;
            const isLocked = userChoice !== null && !isSelected;

            return (
              <div 
                key={store.id} 
                className={`p-4 rounded-2xl border-2 transition-all ${
                  isSelected ? 'bg-blue-600/20 border-blue-500' : 
                  isLocked ? 'bg-slate-800/50 border-slate-700 opacity-50' : 
                  'bg-slate-800 border-slate-700 hover:border-blue-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={store.logoUrl || store.image} className="w-10 h-10 rounded-lg bg-white object-contain" />
                    <div>
                      <h3 className="font-bold text-sm text-white">{store.name}</h3>
                      <p className="text-xs text-slate-400">{store.category}</p>
                    </div>
                  </div>
                  {!userChoice && (
                    <button onClick={() => handleChoose(store.id)} className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-lg">Escolher</button>
                  )}
                  {isLocked && <Lock size={16} className="text-slate-500" />}
                  {isSelected && <CheckCircle2 size={20} className="text-blue-400" />}
                </div>
              </div>
            );
          })}
        </div>

        {userChoice && userChoice.status === 'chosen' && (
             <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-800/80 backdrop-blur-md border-t border-white/10 max-w-md mx-auto animate-in slide-in-from-bottom duration-500">
                 <p className="text-center text-xs text-slate-400 mb-4">Você escolheu <strong className="text-white">{PARTICIPATING_STORES.find(s => s.id === userChoice.storeId)?.name}</strong>. Esta ação não pode ser desfeita esta semana.</p>
                 <button onClick={handleRedeem} className="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2">
                     <Tag size={18} /> Resgatar Cupom Agora
                 </button>
             </div>
        )}
         {userChoice && userChoice.status === 'redeemed' && (
             <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-800/80 backdrop-blur-md border-t border-white/10 max-w-md mx-auto animate-in slide-in-from-bottom duration-500">
                 <div className="flex items-center justify-center gap-2 text-emerald-400">
                    <CheckCircle2 size={20} />
                    <p className="font-bold text-sm">Cupom resgatado! Redirecionando...</p>
                 </div>
             </div>
        )}

      </div>
    </div>
  );
};
