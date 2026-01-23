
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, CheckCircle2, Tag, Percent, DollarSign, Check, X, Loader2, Save, Clock, Users, XCircle, Search, Play, Lock, ArrowRight } from 'lucide-react';
import { User } from '@supabase/supabase-js';

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
                    Como Funciona a Promoção
                </h2>
                <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                    Assista ao vídeo rápido para entender as regras e como validar o cupom do seu cliente no caixa.
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

export const WeeklyPromoModule: React.FC<WeeklyPromoModuleProps> = ({ onBack, user }) => {
  const tutorialStorageKey = `promo_tutorial_completed_${user?.id}`;
  const [isTutorialCompleted, setIsTutorialCompleted] = useState(() => localStorage.getItem(tutorialStorageKey) === 'true');

  const [view, setView] = useState<View>('config');
  const [isSaving, setIsSaving] = useState(false);
  
  // Config state
  const [isParticipating, setIsParticipating] = useState(false);
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState('10');
  const [minValue, setMinValue] = useState('');

  // Validation state
  const [validationCode, setValidationCode] = useState('');
  const [validationStatus, setValidationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
                <h3 className="font-bold text-white text-lg">Participar da Promoção</h3>
                <p className="text-xs text-slate-400">Ative para sua loja aparecer na lista.</p>
            </div>
            <button 
                onClick={() => setIsParticipating(!isParticipating)}
                className={`w-14 h-8 rounded-full p-1 transition-colors ${isParticipating ? 'bg-emerald-500' : 'bg-slate-700'}`}
            >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${isParticipating ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
        </div>

        <div className={`space-y-6 transition-opacity ${!isParticipating ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-2 block">Tipo de Desconto</label>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setDiscountType('percentage')} className={`py-4 rounded-2xl border-2 flex items-center justify-center gap-2 ${discountType === 'percentage' ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                        <Percent size={16} /> <span className="text-sm font-bold">Percentual</span>
                    </button>
                    <button onClick={() => setDiscountType('fixed')} className={`py-4 rounded-2xl border-2 flex items-center justify-center gap-2 ${discountType === 'fixed' ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                        <DollarSign size={16} /> <span className="text-sm font-bold">Valor Fixo</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-2 block">{discountType === 'percentage' ? 'Desconto (%)' : 'Desconto (R$)'}</label>
                    <input 
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 outline-none focus:border-blue-500 text-white font-bold"
                    />
                </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-2 block">Compra Mínima (R$)</label>
                    <input 
                        type="number"
                        value={minValue}
                        onChange={(e) => setMinValue(e.target.value)}
                        placeholder="Opcional"
                        className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 outline-none focus:border-blue-500 text-white font-bold"
                    />
                </div>
            </div>
        </div>

        <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
            {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />} Salvar Regras
        </button>
    </div>
  );

  const renderValidation = () => (
    <div className="space-y-8">
        <div>
            <h3 className="text-center font-bold text-white mb-2">Validar Cupom do Cliente</h3>
            <p className="text-center text-xs text-slate-400">Digite o código apresentado pelo cliente no caixa.</p>
        </div>
        <div className="space-y-4">
            <input 
                value={validationCode}
                onChange={(e) => { setValidationCode(e.target.value); setValidationStatus('idle'); }}
                placeholder="CUP-XXXX"
                className="w-full p-5 bg-slate-800 rounded-2xl border border-slate-700 text-center text-2xl font-black tracking-[0.2em] uppercase outline-none focus:border-blue-500 text-white"
            />
             <button 
                onClick={handleValidate}
                disabled={validationStatus === 'loading' || !validationCode}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {validationStatus === 'loading' ? <Loader2 className="animate-spin" /> : 'Validar Cupom'}
            </button>
        </div>

        {validationStatus === 'success' && <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-xl text-center font-bold text-sm flex items-center justify-center gap-2"><CheckCircle2 size={16}/> Cupom validado com sucesso!</div>}
        {validationStatus === 'error' && <div className="p-4 bg-red-500/10 text-red-400 rounded-xl text-center font-bold text-sm flex items-center justify-center gap-2"><XCircle size={16}/> Código inválido ou já utilizado.</div>}

        <div className="pt-8 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cupons aguardando validação</h3>
            <div className="bg-slate-800 rounded-2xl border border-slate-700">
                {MOCK_PENDING_COUPONS.map((c, i) => (
                    <div key={c.id} className={`p-4 flex justify-between items-center ${i < MOCK_PENDING_COUPONS.length - 1 ? 'border-b border-slate-700' : ''}`}>
                        <div>
                            <p className="text-sm font-bold text-white">{c.userName}</p>
                            <p className="text-xs text-slate-400">Resgatado: {new Date(c.redeemedAt).toLocaleTimeString()}</p>
                        </div>
                        <span className="text-xs font-mono bg-slate-700 px-2 py-1 rounded text-slate-300">{c.id}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-white/10 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10"><ChevronLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">Promoção da Semana</h1>
      </header>
      
      {!isTutorialCompleted ? (
        <TutorialView onComplete={handleTutorialComplete} />
      ) : (
        <div className="flex-1 overflow-y-auto p-5">
            <div className="flex gap-1 bg-slate-800 p-1 rounded-2xl mb-8">
                <button onClick={() => setView('config')} className={`flex-1 py-3 text-xs font-bold uppercase rounded-xl ${view === 'config' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Configurar</button>
                <button onClick={() => setView('validation')} className={`flex-1 py-3 text-xs font-bold uppercase rounded-xl ${view === 'validation' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Validar</button>
                <button onClick={() => setView('history')} className={`flex-1 py-3 text-xs font-bold uppercase rounded-xl ${view === 'history' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Histórico</button>
            </div>
            {view === 'config' && renderConfig()}
            {view === 'validation' && renderValidation()}
            {view === 'history' && <div className="text-center text-slate-500 py-20">Histórico em breve.</div>}
        </div>
      )}
    </div>
  );
};
