
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Lightbulb, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Bug,
  Sparkles,
  Zap,
  HelpCircle,
  // Fix: Imported missing Info icon from lucide-react
  Info
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { AppSuggestion } from '../types';

interface AppSuggestionViewProps {
  user: User | null;
  onBack: () => void;
}

const CATEGORIES = [
  { id: 'bug', label: 'Bug / Erro', icon: Bug, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  { id: 'idea', label: 'Ideia nova', icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { id: 'improve', label: 'Melhorar algo existente', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 'other', label: 'Outro', icon: HelpCircle, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-900/20' },
];

export const AppSuggestionView: React.FC<AppSuggestionViewProps> = ({ user, onBack }) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'idea' as AppSuggestion['category'],
    contactConsent: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);
    
    // Simulação de registro no "banco" (localStorage) para que o ADM possa ler
    setTimeout(() => {
        const newSuggestion: AppSuggestion = {
            id: `sug-${Date.now()}`,
            userId: user?.id || 'anon',
            userName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Morador',
            timestamp: new Date().toISOString(),
            ...formData,
            status: 'new'
        };

        const existing = JSON.parse(localStorage.getItem('app_suggestions_mock') || '[]');
        localStorage.setItem('app_suggestions_mock', JSON.stringify([newSuggestion, ...existing]));

        setIsSubmitting(false);
        setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-[2.5rem] flex items-center justify-center mb-8 text-[#1E5BFF] shadow-xl">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4">Valeu pela ajuda! 💙</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-12 max-w-xs mx-auto">Sua sugestão foi enviada para o time do Localizei JPA. Juntos vamos fazer o bairro evoluir cada vez mais.</p>
        <button onClick={onBack} className="w-full max-w-xs bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl uppercase tracking-widest text-xs">Voltar ao Menu</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 flex flex-col">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 transition-all active:scale-90">
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Melhorar o App</h1>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar">
        <section className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 text-[#1E5BFF]">
                <Lightbulb size={32} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">Sua sugestão faz o bairro evoluir</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Conte pra gente o que pode melhorar no Localizei JPA</p>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Categoria</label>
                    <div className="grid grid-cols-2 gap-2">
                        {CATEGORIES.map(cat => (
                            <button 
                                key={cat.id}
                                type="button"
                                onClick={() => setFormData({...formData, category: cat.id as any})}
                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 ${formData.category === cat.id ? 'border-[#1E5BFF] bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'}`}
                            >
                                <cat.icon className={`w-5 h-5 ${cat.color}`} />
                                <span className={`text-[9px] font-black uppercase tracking-tight ${formData.category === cat.id ? 'text-[#1E5BFF]' : 'text-gray-400'}`}>{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Assunto da sugestão *</label>
                    <input 
                        required
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                        placeholder="Ex: Novo filtro nos classificados"
                        className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF] shadow-sm"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Sua ideia em detalhes *</label>
                    <textarea 
                        required
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        placeholder="Explique o que você pensou..."
                        rows={6}
                        className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl text-sm font-medium dark:text-white outline-none focus:border-[#1E5BFF] shadow-sm resize-none"
                    />
                </div>

                <label className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={formData.contactConsent}
                        onChange={e => setFormData({...formData, contactConsent: e.target.checked})}
                        className="w-5 h-5 rounded text-[#1E5BFF] border-gray-300"
                    />
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Posso ser contatado se precisarem de mais detalhes</span>
                </label>
            </div>

            <button 
                type="submit"
                disabled={isSubmitting || !formData.subject || !formData.message}
                className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm disabled:opacity-50"
            >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <>Enviar sugestão <Send size={18} /></>}
            </button>
        </form>

        <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-3xl flex gap-4">
            <Info size={20} className="text-gray-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed italic">
                "As melhores funcionalidades do Localizei JPA nasceram de conversas com moradores como você."
            </p>
        </div>
      </main>
    </div>
  );
};
