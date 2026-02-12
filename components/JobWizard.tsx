
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, X, ArrowRight, Loader2, CheckCircle2, 
  Briefcase, Building2, MapPin, Clock, Tag, Plus, 
  Info, Lock, Zap, ShieldCheck, QrCode, Copy, CreditCard,
  Check, Star, Award, Crown
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { NEIGHBORHOODS } from '@/contexts/NeighborhoodContext';

interface JobWizardProps {
  user: User | null;
  onBack: () => void;
  onComplete: () => void;
}

type Step = 'intro' | 'info' | 'limit' | 'plan' | 'highlight' | 'summary' | 'payment' | 'success';

export const JobWizard: React.FC<JobWizardProps> = ({ user, onBack, onComplete }) => {
  const [step, setStep] = useState<Step>('info');
  const [isProcessing, setIsProcessing] = useState(false);
  const [publishedCount] = useState(2); // Simulação: Já publicou 2 vagas
  
  const [formData, setFormData] = useState({
    role: '',
    company: user?.user_metadata?.store_name || '',
    description: '',
    neighborhood: 'Freguesia',
    type: 'CLT' as any,
    shift: 'Integral' as any,
    contact: '',
    highlightWeeks: 0,
    isPlanSelected: false,
    paymentMethod: 'pix' as 'pix' | 'card'
  });

  const prices = {
    single: 9.90,
    plan: 49.90,
    highlightWeek: 4.90
  };

  const totals = useMemo(() => {
    let total = 0;
    if (formData.isPlanSelected) total += prices.plan;
    else if (publishedCount >= 2) total += prices.single;
    
    total += formData.highlightWeeks * prices.highlightWeek;
    return total;
  }, [formData.isPlanSelected, formData.highlightWeeks, publishedCount]);

  const handleNext = () => {
    if (step === 'info' && publishedCount >= 2) setStep('limit');
    else if (step === 'info') setStep('highlight');
    else if (step === 'limit') setStep('highlight');
    else if (step === 'plan') setStep('highlight');
    else if (step === 'highlight') setStep('summary');
    else if (step === 'summary') {
        if (totals > 0) setStep('payment');
        else handlePublish();
    }
  };

  const handlePublish = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
    }, 2000);
  };

  const renewalDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setDate(1);
    return d.toLocaleDateString('pt-BR');
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans animate-in fade-in duration-500 overflow-x-hidden relative">
      
      {step !== 'success' && (
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <div className="flex-1 text-center">
             <h1 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Anunciar Vaga no Bairro</h1>
          </div>
          <button onClick={onBack} className="p-2 text-gray-400 hover:text-red-500"><X size={20}/></button>
        </header>
      )}

      <main className="flex-1 p-6 max-w-md mx-auto w-full pb-40 overflow-y-auto no-scrollbar">
        
        {step === 'info' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">Nova Vaga de Emprego</h2>
                    <p className="text-sm text-gray-500 font-medium">Divulgue para moradores e encontre talentos locais.</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Cargo / Função *</label>
                        <input 
                          value={formData.role} 
                          onChange={e => setFormData({...formData, role: e.target.value})}
                          placeholder="Ex: Atendente de Balcão"
                          className="w-full bg-gray-50 dark:bg-gray-800 border-none p-5 rounded-2xl outline-none font-bold dark:text-white shadow-inner"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Nome da Empresa *</label>
                        <input 
                          value={formData.company} 
                          onChange={e => setFormData({...formData, company: e.target.value})}
                          placeholder="Nome fantasia"
                          className="w-full bg-gray-50 dark:bg-gray-800 border-none p-5 rounded-2xl outline-none font-bold dark:text-white shadow-inner"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Bairro *</label>
                            <select 
                              value={formData.neighborhood}
                              onChange={e => setFormData({...formData, neighborhood: e.target.value})}
                              className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border-none outline-none font-bold dark:text-white appearance-none"
                            >
                              {NEIGHBORHOODS.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Tipo *</label>
                            <select 
                              value={formData.type}
                              onChange={e => setFormData({...formData, type: e.target.value})}
                              className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border-none outline-none font-bold dark:text-white appearance-none"
                            >
                              {['CLT', 'PJ', 'Freelancer', 'Estágio', 'Temporário'].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Descrição da Vaga *</label>
                        <textarea 
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            placeholder="Descreva as responsabilidades e requisitos..."
                            rows={5}
                            className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border-none outline-none font-medium dark:text-white resize-none shadow-inner"
                        />
                    </div>
                </div>

                <button 
                    onClick={handleNext} 
                    disabled={!formData.role || !formData.company || !formData.description}
                    className="w-full bg-[#1E5BFF] disabled:bg-gray-100 disabled:text-gray-400 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                    Avançar <ArrowRight size={18} />
                </button>
            </div>
        )}

        {step === 'limit' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
             <div className="text-center">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-[#1E5BFF] shadow-sm border border-blue-100">
                    <Info size={40} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Limite gratuito atingido</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-4 leading-relaxed">
                    Você já utilizou suas 2 vagas gratuitas neste mês.<br/>
                    Sua cota renova em <strong className="text-gray-900 dark:text-white">{renewalDate}</strong>.
                </p>
            </div>

            <div className="space-y-4">
                <button 
                    onClick={() => { setFormData({...formData, isPlanSelected: false}); handleNext(); }}
                    className="w-full bg-white dark:bg-gray-900 p-6 rounded-3xl border-2 border-gray-100 dark:border-gray-800 flex items-center justify-between group active:scale-[0.98] transition-all hover:border-blue-200"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400">
                            <Briefcase size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-sm dark:text-white">Publicação Avulsa</h3>
                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Válida por 30 dias</p>
                        </div>
                    </div>
                    <div className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">R$ 9,90</div>
                </button>

                <button 
                    onClick={() => { setFormData({...formData, isPlanSelected: true}); setStep('plan'); }}
                    className="w-full bg-indigo-600 p-6 rounded-3xl border-2 border-indigo-400 flex items-center justify-between group active:scale-[0.98] transition-all shadow-xl shadow-indigo-500/20"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                            <Crown size={24} fill="white" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-sm text-white">Plano Empresa Local</h3>
                            <p className="text-[10px] text-indigo-200 uppercase font-black tracking-widest">Vagas Ilimitadas + Selo</p>
                        </div>
                    </div>
                    <div className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">R$ 49,90</div>
                </button>
            </div>
          </div>
        )}

        {step === 'success' && (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2.5rem] flex items-center justify-center mb-8 text-emerald-600 shadow-xl shadow-emerald-500/10">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4">
                    Vaga publicada com sucesso! 🎉
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-12">
                    Moradores do bairro agora podem visualizar e se candidatar.
                </p>

                <div className="w-full space-y-4">
                    <button 
                        onClick={onComplete}
                        className="w-full bg-gray-900 dark:bg-white dark:text-black text-white font-black py-5 rounded-[2rem] shadow-xl uppercase tracking-widest text-xs active:scale-[0.98] transition-all"
                    >
                        Ver minhas vagas
                    </button>
                    <button 
                        onClick={onComplete}
                        className="w-full py-4 text-gray-400 font-bold text-xs uppercase tracking-widest"
                    >
                        Voltar para início
                    </button>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};
