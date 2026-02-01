
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, X, ArrowRight, Loader2, CheckCircle2, 
  Briefcase, Building2, MapPin, Clock, Tag, Plus, 
  Info, Lock, Zap, ShieldCheck, QrCode, Copy, CreditCard,
  Check, Star, Award, Crown
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { NEIGHBORHOODS } from '../contexts/NeighborhoodContext';

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

      <main className="flex-1 p-6 max-w-md mx-auto w-full pb-32 overflow-y-auto no-scrollbar">
        
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
                    Seu limite será renovado em <strong className="text-gray-900 dark:text-white">{renewalDate}</strong>.
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
                            <h3 className="font-bold text-sm dark:text-white">Publicar Vaga Avulsa</h3>
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
                            {/* FIX: Crown import added to lucide-react imports above */}
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

        {step === 'plan' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Benefícios do Plano</h2>
                    <p className="text-sm text-gray-500 font-medium">Contratação inteligente no seu bairro.</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                    {[
                        { icon: Check, title: "Vagas Ilimitadas", desc: "Publique quantas vagas precisar no mês." },
                        { icon: Zap, title: "Destaque Automático", desc: "Suas vagas sempre no topo da lista." },
                        { icon: Award, title: "Selo Vaga Verificada", desc: "Gere mais confiança para os candidatos." }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 shrink-0">
                                <item.icon size={18} strokeWidth={3} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                  onClick={handleNext}
                  className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                    Confirmar Plano <ArrowRight size={18} />
                </button>
            </div>
        )}

        {step === 'highlight' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="text-center">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Quer destacar sua vaga?</h2>
                <p className="text-sm text-gray-500 font-medium">Sua vaga aparece no topo da lista e recebe muito mais visualizações no bairro.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {[
                  { weeks: 1, price: 4.90 },
                  { weeks: 2, price: 9.80 },
                  { weeks: 3, price: 14.70 },
                  { weeks: 4, price: 19.60 }
                ].map(opt => (
                    <button 
                      key={opt.weeks}
                      onClick={() => setFormData({...formData, highlightWeeks: formData.highlightWeeks === opt.weeks ? 0 : opt.weeks})}
                      className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 text-center ${formData.highlightWeeks === opt.weeks ? 'bg-blue-600 border-blue-600 text-white shadow-xl' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 hover:border-blue-200'}`}
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest">{opt.weeks} Semana{opt.weeks > 1 ? 's' : ''}</span>
                        <p className={`text-lg font-black ${formData.highlightWeeks === opt.weeks ? 'text-white' : 'text-gray-900 dark:text-white'}`}>R$ {opt.price.toFixed(2).replace('.', ',')}</p>
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-4">
                <button 
                  onClick={handleNext}
                  className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-2xl shadow-xl uppercase tracking-widest text-xs"
                >
                  Continuar para resumo
                </button>
                <button onClick={handleNext} className="w-full py-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">Pular destaque</button>
            </div>
          </div>
        )}

        {step === 'summary' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Resumo da Vaga</h2>
                
                <div className="bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 space-y-6">
                    <div className="flex flex-col gap-1">
                        <h4 className="font-black text-gray-900 dark:text-white text-lg uppercase tracking-tight">{formData.role}</h4>
                        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">{formData.company} • {formData.neighborhood}</p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span className="font-medium uppercase tracking-widest">Publicação:</span>
                            <span className="font-black">{formData.isPlanSelected ? 'Incluso no Plano' : publishedCount >= 2 ? 'R$ 9,90' : 'Grátis'}</span>
                        </div>
                        
                        {formData.isPlanSelected && (
                             <div className="flex justify-between text-xs text-indigo-500">
                                <span className="font-bold uppercase tracking-widest">Plano Empresa Local:</span>
                                <span className="font-black">R$ 49,90</span>
                            </div>
                        )}

                        {formData.highlightWeeks > 0 && (
                            <div className="flex justify-between text-xs text-amber-500">
                                <span className="font-bold uppercase tracking-widest">Destaque ({formData.highlightWeeks} sem.):</span>
                                <span className="font-black">R$ {(formData.highlightWeeks * prices.highlightWeek).toFixed(2).replace('.', ',')}</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase">Total a pagar:</span>
                        <span className="text-2xl font-black text-emerald-600">
                            R$ {totals.toFixed(2).replace('.', ',')}
                        </span>
                    </div>
                </div>

                <button 
                    onClick={handleNext}
                    disabled={isProcessing}
                    className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                >
                    {isProcessing ? <Loader2 className="animate-spin" /> : 'Publicar Vaga'}
                </button>
            </div>
        )}

        {step === 'payment' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Pagamento</h2>
                
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
                   <div className="text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total do Pedido</p>
                        <p className="text-4xl font-black text-emerald-600">R$ {totals.toFixed(2).replace('.', ',')}</p>
                   </div>

                   <div className="space-y-3">
                       <button onClick={() => setFormData({...formData, paymentMethod: 'pix'})} className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${formData.paymentMethod === 'pix' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-400'}`}>
                           <div className="flex items-center gap-3"><QrCode size={20}/><span className="font-bold text-sm">PIX (Imediato)</span></div>
                           {formData.paymentMethod === 'pix' && <CheckCircle2 size={18} />}
                       </button>
                       <button onClick={() => setFormData({...formData, paymentMethod: 'card'})} className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${formData.paymentMethod === 'card' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-400'}`}>
                           <div className="flex items-center gap-3"><CreditCard size={20}/><span className="font-bold text-sm">Cartão de Crédito</span></div>
                           {formData.paymentMethod === 'card' && <CheckCircle2 size={18} />}
                       </button>
                   </div>
                </div>

                <button 
                    onClick={handlePublish}
                    disabled={isProcessing}
                    className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                >
                    {isProcessing ? <Loader2 className="animate-spin" /> : 'Confirmar Pagamento'}
                </button>
            </div>
        )}

        {step === 'success' && (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2.5rem] flex items-center justify-center mb-8 text-emerald-600 shadow-xl">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4">
                    Vaga publicada com sucesso! 🎉
                </h2>
                {(formData.isPlanSelected || formData.highlightWeeks > 0) && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-full border border-amber-100 dark:border-amber-800/30 text-amber-600 text-[10px] font-black uppercase tracking-widest mb-8">
                         ⭐ Destaque ativado na categoria
                    </div>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-12">
                    Moradores do bairro agora podem visualizar e se candidatar à sua vaga.
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
