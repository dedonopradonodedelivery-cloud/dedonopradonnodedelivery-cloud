import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  Info, 
  Lock,
  Phone,
  BarChart3,
  Users,
  Eye,
  Award,
  CalendarDays,
  Home, 
  LayoutGrid,
  List,
  Sparkles,
  ImageIcon,
  Repeat,
  CheckCircle2,
  Loader2,
  Send,
  User as UserIcon,
  MessageSquare,
  Shield,
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface PatrocinadorMasterScreenProps {
  onBack: () => void;
}

type ScreenStep = 'selection' | 'payment' | 'processing' | 'success' | 'admin_chat';

const BenefitItem: React.FC<{ icon: React.ElementType, text: string }> = ({ icon: Icon, text }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
      <Icon className="w-5 h-5 text-emerald-400" />
    </div>
    <div>
      <p className="font-bold text-slate-200 text-sm leading-tight">{text}</p>
    </div>
  </div>
);

const PlacementItem: React.FC<{ icon: React.ElementType, text: string }> = ({ icon: Icon, text }) => (
  <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
    <div className="p-2 bg-slate-700 rounded-lg text-slate-300">
      <Icon className="w-4 h-4" />
    </div>
    <span className="font-semibold text-xs text-slate-300">{text}</span>
  </div>
);

export const PatrocinadorMasterScreen: React.FC<PatrocinadorMasterScreenProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [step, setStep] = useState<ScreenStep>('selection');
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const availableMonths = useMemo(() => {
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const currentMonthIndex = new Date().getMonth();
    const months = [];
    for (let i = 0; i < 6; i++) {
        const monthIndex = (currentMonthIndex + i) % 12;
        months.push({
            name: monthNames[monthIndex],
            available: i >= 2
        });
    }
    return months;
  }, []);

  const handleMonthToggle = (monthName: string) => {
    setSelectedMonths(prev => {
      const isSelected = prev.includes(monthName);
      if (isSelected) {
        return prev.filter(m => m !== monthName);
      } else {
        if (prev.length < 3) {
          return [...prev, monthName];
        }
        return prev;
      }
    });
  };
  
  const pricing = useMemo(() => {
    const count = selectedMonths.length;
    const basePrice = 4000;
    const totalWithoutDiscount = count * basePrice;
    let discountPercent = 0;
    
    if (count === 1) discountPercent = 10;
    if (count === 2) discountPercent = 30;
    if (count === 3) discountPercent = 50;
    
    const totalSavings = totalWithoutDiscount * (discountPercent / 100);
    const finalTotal = totalWithoutDiscount - totalSavings;
    
    return {
        totalWithoutDiscount,
        discountPercent,
        totalSavings,
        finalTotal,
        basePrice,
    };
  }, [selectedMonths]);

  const areAllMonthsSoldOut = availableMonths.every(m => !m.available);

  // --- HANDLERS FLUXO ---

  const handleConfirmPayment = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 2000);
  };

  const [chatMessages, setChatMessages] = useState<any[]>([]);
  
  useEffect(() => {
    if (step === 'admin_chat') {
        setChatMessages([
            {
                id: 1,
                role: 'system',
                text: "Olá! 👋\n\nParabéns por contratar o Patrocinador Master.\n\nEste chat será usado para alinharmos todos os detalhes estratégicos da sua presença no app, como:\n\n• Posicionamentos\n• Destaques\n• Prioridades\n• Ajustes especiais\n\nEm breve nosso administrador entrará em contato por aqui.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);
    }
  }, [step]);

  useEffect(() => {
    if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleHeaderBack = () => {
    if (step === 'payment' || step === 'admin_chat') setStep('selection');
    else onBack();
  }

  const getPageTitle = () => {
    switch (step) {
        case 'payment': return 'Pagamento';
        case 'admin_chat': return 'Alinhamento';
        default: return 'Seja Patrocinador Master';
    }
  }

  // --- RENDERS ---

  const renderSelection = () => (
    <div className="animate-in fade-in duration-500 px-6 pt-8 pb-32">
      <section className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-amber-500/20 border-2 border-white/10">
          <Award className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-4xl font-black text-white font-display tracking-tight leading-none mb-6">
          Aqui você não compra um banner. <br/> Você compra <span className="text-amber-400">presença total</span> no app.
        </h2>
        <p className="text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
          O Patrocinador Master é a contratação de espaço publicitário premium, onde sua marca aparece em aproximadamente <strong>90% das áreas estratégicas</strong> do aplicativo.
        </p>
      </section>

      <div className="bg-slate-900/50 p-5 rounded-3xl border border-white/5 flex items-start gap-4 mt-12">
        <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
          <Info size={20} />
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          Aqui você contrata o espaço Patrocinador Master (por mês fechado). A criação dos materiais visuais acontece após a contratação, com suporte da nossa equipe de design.
        </p>
      </div>
      
      <section className="mt-16">
        <h3 className="font-bold text-lg text-white mb-6 text-center">Onde sua marca aparece:</h3>
        <div className="grid grid-cols-2 gap-3">
          <PlacementItem icon={Home} text="Home do app" />
          <PlacementItem icon={LayoutGrid} text="Topo das categorias" />
          <PlacementItem icon={List} text="Listas de empresas" />
          <PlacementItem icon={Sparkles} text="Destaques patrocinados" />
          <PlacementItem icon={ImageIcon} text="Banners principais" />
          <PlacementItem icon={Repeat} text="Espaços premium" />
        </div>
      </section>

      <section className="mt-16">
        <div className="text-center mb-8">
          <h3 className="font-bold text-xl text-white mb-2">Escolha seus meses</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">(venda por mês fechado)</p>
        </div>

        {areAllMonthsSoldOut ? (
          <div className="bg-slate-900 border-2 border-amber-500/20 rounded-3xl p-8 text-center">
            <h4 className="text-lg font-bold text-amber-400 mb-3">Vagas Esgotadas</h4>
            <p className="text-slate-300 text-sm mb-4">No momento, as próximas vagas mensais estão esgotadas.</p>
            <button className="w-full bg-amber-500 text-slate-900 font-bold py-3 rounded-xl">Entrar na lista de espera</button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 mb-16">
            {availableMonths.map(month => {
              const isSelected = selectedMonths.includes(month.name);
              const isFull = selectedMonths.length >= 3 && !isSelected;
              return (
                <button
                  key={month.name}
                  disabled={!month.available || isFull}
                  onClick={() => handleMonthToggle(month.name)}
                  className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all duration-200 h-32
                    ${!month.available
                      ? 'bg-slate-800 border-slate-700 opacity-50 cursor-not-allowed'
                      : isSelected
                        ? 'bg-blue-50/20 border-blue-500 scale-105'
                        : 'bg-slate-900 border-slate-800 hover:border-blue-500 disabled:opacity-30'
                    }
                  `}
                >
                  <CalendarDays size={24} className={!month.available ? 'text-slate-600' : 'text-slate-300'} />
                  <span className="font-black text-lg mt-2">{month.name}</span>
                  {!month.available && <span className="text-[9px] font-bold text-red-400 uppercase mt-1">Esgotado</span>}
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-8 space-y-4">
        <h3 className="font-bold text-lg text-white mb-6 text-center">Benefícios Diretos:</h3>
        <BenefitItem icon={Eye} text="Máxima exposição local" />
        <BenefitItem icon={Award} text="Autoridade imediata no bairro" />
        <BenefitItem icon={Users} text="Sua marca sempre lembrada" />
        <BenefitItem icon={Phone} text="Mais chamadas, visitas e vendas" />
        <BenefitItem icon={BarChart3} text="Posicionamento acima da concorrência" />
      </section>

      <footer className="fixed bottom-[80px] left-0 right-0 p-5 bg-slate-950/80 backdrop-blur-md border-t border-white/5 z-30 max-w-md mx-auto">
        <button 
            disabled={selectedMonths.length === 0}
            onClick={() => setStep('payment')}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-base py-5 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
            Quero contratar Patrocinador Master
            <ArrowRight className="w-5 h-5 stroke-[3]" />
        </button>
      </footer>
    </div>
  );

  const renderPayment = () => (
    <div className="animate-in slide-in-from-right duration-500 flex flex-col h-full px-6 pt-8 pb-32">
        <div className="flex-1">
            <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Produto</p>
                    <p className="text-xl font-bold text-white">Patrocinador Master</p>
                </div>
                
                <div className="pt-4 border-t border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Meses Selecionados</p>
                    <p className="text-base font-semibold text-slate-200">{selectedMonths.join(', ')}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Valor por Mês</p>
                        <p className="text-sm font-bold text-slate-300">R$ 4.000,00</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Desconto ({pricing.discountPercent}%)</p>
                        <p className="text-sm font-bold text-emerald-400">- R$ {pricing.totalSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <p className="text-lg font-bold text-white uppercase tracking-tight">Total Final</p>
                    <p className="text-3xl font-black text-amber-400">R$ {pricing.finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
            </div>

            <p className="mt-8 text-center text-xs text-slate-400 leading-relaxed max-w-[280px] mx-auto font-medium">
                Após o pagamento, você será direcionado para um chat exclusivo com nosso time para alinhar os detalhes do Patrocinador Master.
            </p>
        </div>

        <footer className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950 border-t border-white/5 max-w-md mx-auto z-30">
            <button 
                onClick={handleConfirmPayment}
                className="w-full bg-[#1E5BFF] hover:bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl active:scale-[0.98] transition-all"
            >
                Confirmar Pagamento
            </button>
        </footer>
    </div>
  );

  const renderProcessing = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500 min-h-[70vh] bg-slate-950">
        <Loader2 className="w-12 h-12 text-[#1E5BFF] animate-spin mb-6" />
        <h2 className="text-xl font-bold text-white">Processando pagamento...</h2>
        <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-black">Não feche esta tela</p>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500 min-h-[70vh] bg-slate-950">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 border-4 border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
            <CheckCircle2 size={48} className="text-emerald-400" />
        </div>
        <h2 className="text-3xl font-black text-white leading-tight mb-4">Pagamento aprovado ✅</h2>
        <p className="text-slate-400 text-lg leading-relaxed max-w-[280px] mb-12 font-medium">
            Parabéns! 🎉<br/>
            Você agora é um <strong className="text-white">Patrocinador Master</strong>.
        </p>
        <p className="text-slate-500 text-sm mb-12">
            Vamos alinhar os detalhes da sua presença no app.
        </p>

        <button 
            onClick={() => setStep('admin_chat')}
            className="w-full max-w-sm bg-white text-slate-950 font-black py-5 rounded-2xl shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
            Falar com o administrador
            <ArrowRight size={20} strokeWidth={3} />
        </button>
    </div>
  );

  const renderChat = () => (
    <div className="flex flex-col h-full bg-[#020617] animate-in slide-in-from-bottom duration-500 pb-[80px]">
        {/* Info Admin */}
        <div className="px-6 py-3 bg-slate-800/30 border-b border-white/5 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-2">
                <div className="p-1 bg-blue-50/10 rounded-lg">
                    <Shield size={12} className="text-blue-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Administrador: Rafael Carvalho</span>
            </div>
            <span className="text-[9px] font-bold text-slate-600 uppercase">Segunda a Sexta • 09h - 18h</span>
        </div>

        {/* Chat Messages */}
        <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
            {chatMessages.map(msg => (
                <div key={msg.id} className={`flex flex-col gap-1.5 max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-3xl shadow-sm border ${
                        msg.role === 'user' 
                        ? 'bg-[#1E5BFF] text-white rounded-tr-none border-blue-500' 
                        : 'bg-slate-900 text-slate-100 rounded-tl-none border-white/5'
                    }`}>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest px-2">{msg.timestamp}</span>
                </div>
            ))}
        </div>

        {/* Chat Input */}
        <footer className="p-6 bg-slate-900 border-t border-white/10 shrink-0">
            <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                    <input 
                        type="text" 
                        placeholder="Escreva sua mensagem..."
                        className="w-full bg-slate-800 border border-white/5 rounded-2xl py-4 px-5 pr-12 text-sm outline-none focus:border-[#1E5BFF] transition-all"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <ExternalLink size={20} />
                    </button>
                </div>
                <button className="w-14 h-14 bg-[#1E5BFF] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                    <Send size={20} />
                </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-4 opacity-30">
                <ShieldCheck size={10} className="text-slate-500" />
                <p className="text-[8px] font-black uppercase tracking-[0.3em]">Conexão Segura Localizei</p>
            </div>
        </footer>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col relative overflow-hidden">
      
      {/* Background Decor */}
      {step !== 'admin_chat' && (
        <>
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
        </>
      )}

      {/* CABEÇALHO FIXO PERSISTENTE (STICKY HEADER) */}
      {step !== 'success' && step !== 'processing' && (
        <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-white/5 shrink-0">
            <button 
                onClick={handleHeaderBack}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-slate-300 transition-colors"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
                <h1 className="font-bold text-white text-lg leading-tight">
                    {getPageTitle()}
                </h1>
                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                    {step === 'selection' ? 'Plano de Máxima Visibilidade' : 'Contratação Premium'}
                </p>
            </div>
        </header>
      )}

      <main className={`flex-1 overflow-y-auto no-scrollbar`}>
        {step === 'selection' && renderSelection()}
        {step === 'payment' && renderPayment()}
        {step === 'processing' && renderProcessing()}
        {step === 'success' && renderSuccess()}
        {step === 'admin_chat' && renderChat()}
      </main>
    </div>
  );
};
