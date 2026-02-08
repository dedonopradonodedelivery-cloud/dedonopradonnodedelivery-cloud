

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, CheckCircle2, Tag, Percent, DollarSign, Check, X, Loader2, Save, Clock, Users, XCircle, Search, Play, Lock, ArrowRight, Info } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { AppNotification, CommunityPost } from '../types';

interface WeeklyPromoModuleProps {
  onBack: () => void;
  user: User | null;
}

type View = 'config' | 'validation' | 'history';
type DiscountType = 'percentage' | 'fixed';

interface CouponValidation {
  id: string;
  userName: string;
  redeemedAt: string;
}

const MOCK_PENDING_COUPONS: CouponValidation[] = [
    { id: 'CUP-ABC1', userName: 'Maria S.', redeemedAt: new Date().toISOString() },
    { id: 'CUP-DEF2', userName: 'João P.', redeemedAt: new Date(Date.now() - 3600 * 1000).toISOString() },
];

const TutorialView: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [videoFinished, setVideoFinished] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleVideoEnd = () => {
        setVideoFinished(true);
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-between p-6 pt-10 text-center animate-in fade-in duration-500">
            <div>
                <div className="w-20 h-20 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border-4 border-blue-600/20 shadow-lg shadow-blue-900/10">
                    <Play className="w-10 h-10 text-blue-400 fill-blue-400" />
                </div>
                <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight mb-3">
                    Como Funciona o Cupom Semanal
                </h2>
                <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                    Assista ao vídeo obrigatório para entender as regras, como validar o cupom do seu cliente e os benefícios para sua loja.
                </p>
            </div>
            
            <div className="w-full max-w-md aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700 relative group my-8">
                <video
                    ref={videoRef}
                    src="https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4" 
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                    onEnded={handleVideoEnd}
                    onContextMenu={(e) => e.preventDefault()}
                    controlsList="nodownload noplaybackrate"
                />
            </div>

            <button
                onClick={onComplete}
                disabled={!videoFinished}
                className={`w-full max-w-sm py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3
                ${videoFinished 
                    ? 'bg-emerald-500 text-white shadow-emerald-500/30 active:scale-[0.98] hover:bg-emerald-600' 
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
            >
                {videoFinished ? (
                    <>
                        Entendi, continuar <ArrowRight className="w-5 h-5" strokeWidth={3} />
                    </>
                ) : (
                    <>
                        <Lock className="w-4 h-4" />
                        Assista para continuar
                    </>
                )}
            </button>
        </div>
    );
};

export const MerchantWeeklyReward: React.FC<MerchantWeeklyRewardProps> = ({ onBack, user }) => {
  const tutorialStorageKey = `video_cupons_lojista_assistido_${user?.id}`;
  const [isTutorialCompleted, setIsTutorialCompleted] = useState(() => localStorage.getItem(tutorialStorageKey) === 'true');

  const [view, setView] = useState<View>('config');
  const [isSaving, setIsSaving] = useState(false);
  
  // Config state
  const [isParticipating, setIsParticipating] = useState(false);
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState('10');
  const [isCustomValue, setIsCustomValue] = useState(false);

  const [rewardData, setRewardData] = useState({
    title: 'Suco Natural Grátis',
    description: 'Na compra de qualquer hambúrguer artesanal.',
    rules: 'Válido apenas para consumo no local. 1 uso por CPF.',
    expiry: '7 dias após o resgate'
  });

  const handleTutorialComplete = () => {
    localStorage.setItem(tutorialStorageKey, 'true');
    setIsTutorialCompleted(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
        setIsSaving(false);
        alert('Configurações salvas!');
    }, 1200);
  };

  const handleValidate = () => {
    setValidationStatus('loading');
    setTimeout(() => {
        if (['CUP-ABC1', 'CUP-DEF2'].includes(validationCode.toUpperCase())) {
            setValidationStatus('success');
        } else {
            setValidationStatus('error');
        }
    }, 1000);
  };
  
  const renderConfig = () => (
    <div className="space-y-8">
        <div className="flex justify-between items-center bg-slate-800 p-6 rounded-3xl border border-white/10">
            <div>
                <h3 className="font-bold text-white text-lg">Participar do Desconto da Semana</h3>
                <p className="text-xs text-slate-400">Ative para sua