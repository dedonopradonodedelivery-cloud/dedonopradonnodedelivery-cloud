
import React, { useState } from 'react';
import { ChevronLeft, Zap, Calendar, Megaphone, Clock, CheckCircle2, Loader2, Camera, X } from 'lucide-react';
import { HappeningType } from '../types';

interface HappeningNowFormProps {
  onBack: () => void;
  userRole: 'cliente' | 'lojista' | null;
}

export const HappeningNowForm: React.FC<HappeningNowFormProps> = ({ onBack, userRole }) => {
  const [type, setType] = useState<HappeningType>('notice');
  const [duration, setDuration] = useState<'2' | '6' | '24'>('2');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2.5rem] flex items-center justify-center mb-8 text-emerald-600 shadow-xl">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">Postagem enviada!</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto mb-10">
          {userRole === 'lojista' ? 'Sua oferta já está ativa na Home.' : 'Seu aviso foi enviado para moderação e aparecerá em breve.'}
        </p>
        <button onClick={onBack} className="w-full max-w-xs bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl uppercase tracking-widest text-xs">Voltar</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans flex flex-col animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 h-20 flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500"><ChevronLeft size={20}/></button>
        <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter">Acontecendo Agora</h1>
      </header>

      <main className="flex-1 p-6 space-y-8 max-w-md mx-auto w-full pb-32 overflow-y-auto no-scrollbar">
        <section className="text-center space-y-2">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">O que está rolando?</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Avise o bairro sobre algo importante ou uma promoção relâmpago.</p>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">Tipo de Postagem</label>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { id: 'promo', label: 'Promoção', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                        { id: 'event', label: 'Evento', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { id: 'notice', label: 'Aviso', icon: Megaphone, color: 'text-amber-500', bg: 'bg-amber-50' }
                    ].map(opt => (
                        <button 
                            key={opt.id} type="button" 
                            onClick={() => setType(opt.id as any)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${type === opt.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'}`}
                        >
                            <opt.icon size={20} className={type === opt.id ? 'text-blue-600' : 'text-gray-400'} />
                            <span className={`text-[10px] font-black uppercase ${type === opt.id ? 'text-blue-600' : 'text-gray-400'}`}>{opt.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Duração (Expira em)</label>
                <div className="grid grid-cols-3 gap-2">
                    {['2', '6', '24'].map(d => (
                        <button 
                            key={d} type="button" 
                            onClick={() => setDuration(d as any)}
                            className={`py-3 rounded-xl border-2 font-bold text-xs transition-all ${duration === d ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 text-gray-500'}`}
                        >
                            {d} Horas
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Título Curto *</label>
                    <input required value={title} onChange={e => setTitle(e.target.value)} maxLength={50} placeholder="Ex: Show na praça começando!" className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none focus:border-blue-500" />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Imagem (Opcional)</label>
                    {image ? (
                        <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-gray-100">
                            <img src={image} className="w-full h-full object-cover" />
                            <button onClick={() => setImage(null)} className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full"><X size={16}/></button>
                        </div>
                    ) : (
                        <label className="w-full aspect-video rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors">
                            <Camera size={32} className="text-gray-300" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Adicionar Foto</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    )}
                </div>
            </div>

            <button type="submit" disabled={isSubmitting || !title} className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs disabled:opacity-50">
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Publicar Agora'}
            </button>
        </form>
      </main>
    </div>
  );
};
