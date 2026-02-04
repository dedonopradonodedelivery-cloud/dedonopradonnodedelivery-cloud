
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  Crown, 
  CheckCircle2, 
  Zap, 
  Target, 
  ShieldCheck, 
  Users, 
  Layout, 
  Clock,
  Sparkles,
  Award,
  CalendarDays,
  Smartphone,
  TrendingUp,
  Lock,
  Plus,
  Minus,
  CreditCard,
  QrCode,
  Copy,
  Loader2,
  Check,
  MessageSquare
} from 'lucide-react';
import { AppNotification } from '../types';

interface SponsorInfoViewProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
}

interface MonthOption {
  id: number;
  label: string;
  available: boolean;
}

const MONTHS: MonthOption[] = [
  { id: 1, label: 'Jan', available: false },
  { id: 2, label: 'Fev', available: false },
  { id: 3, label: 'Mar', available: true },
  { id: 4, label: 'Abr', available: true },
  { id: 5, label: 'Mai', available: true },
  { id: 6, label: 'Jun', available: true },
  { id: 7, label: 'Jul', available: true },
  { id: 8, label: 'Ago', available: true },
  { id: 9, label: 'Set', available: true },
  { id: 10, label: 'Out', available: true },
  { id: 11, label: 'Nov', available: true },
  { id: 12, label: 'Dez', available: true },
];

const FAQ_ITEMS = [
  { 
    q: "O que é o Patrocinador Master?", 
    a: "O Patrocinador Master é o plano de maior destaque do Localizei JPA. Sua marca aparece em posições estratégicas do app e ganha visibilidade máxima para moradores reais do bairro, fortalecendo autoridade local." 
  },
  { 
    q: "Onde minha marca vai aparecer?", 
    a: "Sua marca aparece com destaque no app, incluindo Home, áreas de exploração do bairro e banner ao final das páginas internas, além de uma página institucional exclusiva da sua empresa." 
  },
  { 
    q: "Existe exclusividade?", 
    a: "Sim. Apenas um Patrocinador Master pode estar ativo por período, garantindo exclusividade dentro desse formato." 
  },
  { 
    q: "Posso escolher os meses que quero anunciar?", 
    a: "Sim. Você escolhe os meses fechados em que deseja aparecer, inclusive meses não consecutivos, de acordo com a disponibilidade exibida." 
  },
  { 
    q: "Por que o valor está com desconto?", 
    a: "O valor promocional é uma condição especial de inauguração do Localizei JPA. O desconto é por tempo indeterminado e pode ser encerrado sem aviso prévio." 
  },
  { 
    q: "O pagamento é automático?", 
    a: "Não. Você seleciona os meses, escolhe a forma de pagamento e confirma a contratação. A ativação do Patrocinador Master ocorre após a confirmação." 
  }
];

export const SponsorInfoView: React.FC<SponsorInfoViewProps> = ({ onBack, onNavigate }) => {
  const [view, setView] = useState<'sales' | 'payment' | 'success'>('sales');
  const [selectedMonthIds, setSelectedMonthIds] = useState<number[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleMonth = (id: number) => {
    setSelectedMonthIds(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const totals = useMemo(() => {
    const count = selectedMonthIds.length;
    const unitPrice = 1497; // NOVO PREÇO EM 7
    const originalUnitPrice = 4000; // PREÇO PADRÃO AJUSTADO
    const promoTotal = count * unitPrice;
    const originalTotal = count * originalUnitPrice;
    const savings = originalTotal - promoTotal;

    return {
      count,
      promoTotal,
      originalTotal,
      savings,
      monthsLabels: MONTHS.filter(m => selectedMonthIds.includes(m.id)).map(m => m.label).join(', ')
    };
  }, [selectedMonthIds]);

  const formatBRL = (val: number) => 
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleContinue = () => {
    if (selectedMonthIds.length === 0) {
      alert("Selecione pelo menos 1 mês para continuar.");
      return;
    }
    setView('payment');
    window.scrollTo(0, 0);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setView('success');
      
      const savedNotifs = JSON.parse(localStorage.getItem('app_notifications') || '[]');
      const adminNotif: AppNotification = {
        id: `admin-master-${Date.now()}`,
        userId: 'admin-auditoria',
        title: 'Nova Contratação Master!',
        message: `Uma loja acaba de contratar o Patrocinador Master para os meses: ${totals.monthsLabels}.`,
        type: 'system',
        read: false,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('app_notifications', JSON.stringify([adminNotif, ...savedNotifs]));
    }, 2000);
  };

  const handleOpenChat = () => {
    const orderId = `MASTER-${Math.floor(1000 + Math.random() * 9000)}`;
    const autoMsg = `✨ NOVO PATROCINADOR MASTER ✨
    
Plano: Patrocinador Master
Meses contratados: ${totals.monthsLabels}
Valor original: R$ ${totals.originalTotal.toFixed(2)} (Riscado)
Valor pago: R$ ${totals.promoTotal.toFixed(2)}
Economia total: R$ ${totals.savings.toFixed(2)} • 62,6% OFF

Próximos passos para iniciarmos sua vitrine:
1) Enviar sua logo (PNG preferencial)
2) Enviar descrição institucional (até 5 linhas)
3) Enviar contatos e links (WhatsApp/Instagram/Site)
4) Fotos e referências visuais (opcional)

Nosso time de designers iniciará a criação em breve!`;

    const chatKey = `msgs_${orderId}_admin_auditoria`;
    const initialMsgs = [{
      id: `sys-master-${Date.now()}`,
      requestId: orderId,
      senderId: 'system',
      senderName: 'Localizei JPA',
      senderRole: 'merchant',
      text: autoMsg,
      timestamp: new Date().toISOString()
    }];
    localStorage.setItem(chatKey, JSON.stringify(initialMsgs));
    onNavigate('service_chat', { requestId: orderId, professionalId: 'admin_auditoria', role: 'resident' });
  };

  if (view === 'success') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2.5rem] flex items-center justify-center mb-8 text-emerald-600 shadow-xl">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4">Contratação realizada com sucesso</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto leading-relaxed mb-12">
          Recebemos sua solicitação do Patrocinador Master. Agora vamos alinhar a criação da sua página e do seu banner.
        </p>
        <button 
          onClick={handleOpenChat}
          className="w-full max-w-sm bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3"
        >
          <MessageSquare size={18} />
          Abrir Chat Patrocinador Master
        </button>
      </div>
    );
  }

  if (view === 'payment') {
    return (
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans flex flex-col animate-in slide-in-from-right duration-300">
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
          <button onClick={() => setView('sales')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Pagamento</h1>
        </header>

        <main className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar pb-32">
          <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4">Resumo da Contratação</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-sm font-bold text-slate-400">Meses:</span>
                <span className="text-sm font-black text-white text-right max-w-[150px]">{totals.monthsLabels}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-400">Quantidade:</span>
                <span className="text-sm font-black text-white">{totals.count} {totals.count === 1 ? 'mês' : 'meses'}</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex flex-col items-end">
                <span className="text-xs text-slate-500 line-through font-bold">{formatBRL(totals.originalTotal)}</span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-white">{formatBRL(totals.promoTotal)}</span>
                </div>
                <span className="text-[10px] font-black text-emerald-400 uppercase mt-1">Você economiza {formatBRL(totals.savings)} (62,6% OFF)</span>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Forma de Pagamento</h3>
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <button 
                onClick={() => setPaymentMethod('pix')}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${paymentMethod === 'pix' ? 'bg-white dark:bg-gray-800 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}
              >
                <QrCode className="w-4 h-4 inline-block mr-2" /> PIX
              </button>
              <button 
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${paymentMethod === 'card' ? 'bg-white dark:bg-gray-800 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}
              >
                <CreditCard className="w-4 h-4 inline-block mr-2" /> Cartão
              </button>
            </div>

            {paymentMethod === 'pix' ? (
              <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 text-center space-y-6">
                <div className="w-48 h-48 bg-gray-50 dark:bg-gray-950 rounded-3xl mx-auto flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800">
                  <QrCode size={120} className="text-gray-300" />
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Código Pix Copia e Cola</p>
                  <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-100 dark:border-gray-800 font-mono text-[10px] break-all text-gray-400">
                    00020126330014BR.GOV.BCB.PIX011112345678901520400005303986540510.005802BR5920LOCALIZEI6009RJ62070503***6304E2D1
                  </div>
                  <button className="flex items-center justify-center gap-2 text-[#1E5BFF] text-[10px] font-black uppercase tracking-widest mx-auto">
                    <Copy size={14} /> Copiar Código
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nome no Cartão</label>
                  <input type="text" placeholder="Como no cartão" className="w-full p-4 bg-gray-50 dark:bg-gray-950 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Número do Cartão</label>
                  <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-4 bg-gray-50 dark:bg-gray-950 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Validade</label>
                    <input type="text" placeholder="MM/AA" className="w-full p-4 bg-gray-50 dark:bg-gray-950 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">CVV</label>
                    <input type="text" placeholder="123" className="w-full p-4 bg-gray-50 dark:bg-gray-950 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">CPF do Titular</label>
                  <input type="text" placeholder="000.000.000-00" className="w-full p-4 bg-gray-50 dark:bg-gray-950 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            )}
          </section>
        </main>

        <footer className="fixed bottom-[80px] left-0 right-0 p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-50 max-w-md mx-auto shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
           <button 
             onClick={handleConfirmPayment}
             disabled={isProcessing}
             className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm disabled:opacity-50"
           >
             {isProcessing ? <Loader2 className="animate-spin" /> : <><ShieldCheck size={20}/> Confirmar Pagamento</>}
           </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 flex flex-col relative overflow-x-hidden">
      
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div className="flex flex-col">
          <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Patrocinador Master</h1>
          <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">O topo do seu bairro, todos os dias.</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-64">
        {/* Título e descrição inicial */}
        <section className="p-8 text-center bg-gradient-to-b from-white to-transparent dark:from-gray-900 dark:to-transparent">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border-4 border-white dark:border-gray-800 shadow-xl">
            <Crown className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium max-w-xs mx-auto">
            Sua marca aparece com destaque máximo no Localizei JPA e entra na rotina de quem realmente mora e compra no seu bairro.
          </p>
        </section>

        {/* Banner Oportunidade Única */}
        <section className="px-6 mb-12">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-500/10 border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div className="relative z-10">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400 mb-2 block">Oportunidade Única</span>
              <div className="flex flex-col gap-1 mb-6">
                <span className="text-lg font-bold text-slate-500 line-through">De: R$ 4.000,00/mês</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-black uppercase text-slate-300">Por:</span>
                  <span className="text-4xl font-black text-white tracking-tighter">{formatBRL(1497)}<span className="text-base">/mês</span></span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 w-fit px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <TrendingUp size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Você economiza R$ 2.503,00 por mês</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 w-fit px-3 py-1.5 rounded-full border border-blue-500/20">
                  <Zap size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Desconto de 62,6% na inauguração</span>
                </div>
              </div>

              <p className="text-[9px] text-slate-500 font-bold uppercase mt-8 tracking-wider">
                * Desconto de inauguração por tempo indeterminado. Sujeito a encerramento sem aviso prévio.
              </p>
            </div>
          </div>
        </section>

        {/* NOVO POSICIONAMENTO: Bloco Escolha os meses */}
        <section className="px-6 mb-12">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-1">Escolha os meses</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-6 leading-relaxed">
              Selecione um ou mais meses. Você pode escolher meses não consecutivos.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {MONTHS.map(month => {
                const isSelected = selectedMonthIds.includes(month.id);
                return (
                  <button
                    key={month.id}
                    disabled={!month.available}
                    onClick={() => toggleMonth(month.id)}
                    className={`
                      relative py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 border-2
                      ${!month.available 
                        ? 'bg-gray-50 dark:bg-gray-950 border-transparent text-gray-300 dark:text-gray-800 cursor-not-allowed opacity-50' 
                        : isSelected 
                          ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-lg shadow-blue-500/20 active:scale-95' 
                          : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 text-gray-400 hover:border-blue-200'}
                    `}
                  >
                    {month.label}
                    {!month.available && (
                      <span className="absolute -top-1 -right-1 bg-gray-400 dark:bg-gray-700 text-white text-[7px] px-1 py-0.5 rounded-md">Indisponível</span>
                    )}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full shadow-md">
                        <CheckCircle2 size={12} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <CalendarDays size={18} />
                <span className="text-xs font-black uppercase tracking-widest">Meses: {totals.count}</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-gray-900 dark:text-white">{formatBRL(totals.promoTotal)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Benefícios Section */}
        <section className="px-6 mb-12">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 ml-1">Por que o Patrocinador Master vale mais</h3>
          <div className="space-y-4">
            {[
              { icon: Target, title: "Presença constante", desc: "Sua marca aparece em pontos estratégicos do app." },
              { icon: Award, title: "Top of mind local", desc: "Você vira referência absoluta no bairro." },
              { icon: ShieldCheck, title: "Autoridade e confiança", desc: "Destaque premium para quem quer ser lembrado primeiro." },
              { icon: Users, title: "Foco em moradores reais", desc: "Alcance hiperlocal e qualificado diariamente." },
              { icon: Lock, title: "Exclusividade", desc: "Apenas 1 Patrocinador Master ativo por região definida." },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-[#1E5BFF] shrink-0 border border-blue-100 dark:border-blue-800/30">
                  <item.icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Positions Section */}
        <section className="px-6 mb-12">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 ml-1">Sua marca em quase todo o app</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: Sparkles, title: "Tela de Splash", desc: "Impacto no primeiro segundo do app." },
              { icon: Layout, title: "Topo da Home", desc: "Destaque fixo e imbatível no Feed." },
              { icon: ArrowRight, title: "Rodapé de Páginas", desc: "Banner ao final das buscas internas." },
              { icon: Smartphone, title: "Página Institucional", desc: "Uma tela exclusiva para contar sua história." },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-xl text-[#1E5BFF] shadow-sm">
                  <item.icon size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-tight">{item.title}</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-500 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-6 mb-24">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 ml-1">Dúvidas Frequentes</h3>
            <div className="space-y-3">
                {FAQ_ITEMS.map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                        <button 
                            onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                            className="w-full flex items-center justify-between p-5 text-left"
                        >
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-tight pr-4">{item.q}</span>
                            {openFaqIndex === idx ? <Minus className="w-4 h-4 text-blue-500 shrink-0" /> : <Plus className="w-4 h-4 text-gray-400 shrink-0" />}
                        </button>
                        {openFaqIndex === idx && (
                            <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300">
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                    {item.a}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>

      </main>

      {/* FOOTER: Resumo de valores e CTA */}
      <div className="fixed bottom-[80px] left-0 right-0 z-[50] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{totals.count} {totals.count === 1 ? 'Mês Selecionado' : 'Meses Selecionados'}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-gray-400 line-through font-bold">{formatBRL(totals.originalTotal)}</span>
              <span className="text-2xl font-black text-[#1E5BFF] tracking-tighter">{formatBRL(totals.promoTotal)}</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] font-black text-emerald-500 uppercase bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800">Economia {formatBRL(totals.savings)}</span>
            <span className="text-[10px] font-black text-blue-500 uppercase mt-1">62,6% OFF</span>
          </div>
        </div>

        <button 
          onClick={handleContinue}
          className={`
            w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2
            ${selectedMonthIds.length === 0 
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed shadow-none' 
              : 'bg-[#1E5BFF] text-white shadow-blue-500/30 active:scale-[0.98] hover:bg-blue-600'}
          `}
        >
          Continuar contratação
          <ArrowRight size={18} strokeWidth={3} />
        </button>
      </div>

    </div>
  );
};
