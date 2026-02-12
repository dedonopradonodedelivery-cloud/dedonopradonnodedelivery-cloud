
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Handshake, 
  ArrowRight,
  Lock,
  Target,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock as ClockIcon,
  Sparkles,
  UserCheck,
  Award,
  Coffee,
  ShieldCheck,
  TrendingUp,
  X,
  Loader2,
  Send,
  Users,
  Briefcase,
  Zap,
  Gem,
  XCircle,
  Info,
  Play
} from 'lucide-react';

interface JPAConnectSalesViewProps {
  onBack: () => void;
}

const BenefitCard: React.FC<{ icon: React.ElementType, title: string, desc: string }> = ({ icon: Icon, title, desc }) => (
  <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] flex flex-col gap-4">
    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
      <Icon size={24} />
    </div>
    <div>
      <h4 className="font-bold text-white text-base mb-1">{title}</h4>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const ApplicationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1800);
    };

    return (
        <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={20}/></button>

                {isSuccess ? (
                    <div className="text-center py-8 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 border border-emerald-500/20">
                            <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Aplicação Recebida</h3>
                        <p className="text-sm text-slate-400 leading-relaxed mb-8">Nossa equipe analisará seu perfil e entraremos em contato para uma breve entrevista.</p>
                        <button onClick={onClose} className="w-full py-4 bg-white text-slate-900 font-black rounded-2xl uppercase tracking-widest text-xs">Entendi</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Formulário de Acesso</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input required placeholder="Nome Completo" className="w-full bg-slate-950 border border-white/5 p-4 rounded-2xl text-sm outline-none focus:border-indigo-500 transition-all text-white" />
                            <input required placeholder="Nome da Empresa" className="w-full bg-slate-950 border border-white/5 p-4 rounded-2xl text-sm outline-none focus:border-indigo-500 transition-all text-white" />
                            <input required placeholder="Nicho de Atuação" className="w-full bg-slate-950 border border-white/5 p-4 rounded-2xl text-sm outline-none focus:border-indigo-500 transition-all text-white" />
                            <input required placeholder="WhatsApp" className="w-full bg-slate-950 border border-white/5 p-4 rounded-2xl text-sm outline-none focus:border-indigo-500 transition-all text-white" />
                            <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs active:scale-95 transition-all">
                                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Enviar minha aplicação'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export const JPAConnectSalesView: React.FC<JPAConnectSalesViewProps> = ({ onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col relative overflow-x-hidden pb-40 selection:bg-indigo-500/30">
      {/* Header Fixo Sticky */}
      <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl px-6 h-20 flex items-center gap-4 border-b border-white/5">
        <button onClick={onBack} className="p-2.5 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"><ChevronLeft size={20} /></button>
        <div className="flex-1">
          <h1 className="font-black text-base uppercase tracking-[0.2em] leading-none text-white">JPA Connect</h1>
          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Networking de Liderança</p>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
      </header>

      <main className="flex-1 p-6 space-y-20 max-w-md mx-auto w-full">
        
        {/* HERO SECTION */}
        <section className="text-center pt-10 relative space-y-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full animate-in slide-in-from-top-4 duration-700">
                    <Gem size={14} className="text-indigo-400" />
                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Acesso Restrito</span>
                </div>
                
                <h2 className="text-4xl font-black text-white leading-[1.1] uppercase tracking-tighter animate-in slide-in-from-bottom-4 duration-700 delay-100">
                    Conectando as lideranças que movem <span className="text-indigo-500">Jacarepaguá.</span>
                </h2>
                
                <p className="text-base text-slate-400 font-medium leading-relaxed max-w-sm mx-auto animate-in slide-in-from-bottom-6 duration-700 delay-200">
                    Um grupo seleto de empresários focado em relacionamento estratégico, confiança mútua e crescimento local.
                </p>
            </div>

            {/* BLOCO DE VÍDEO (REPOSICIONADO NO TOPO) */}
            <div className="space-y-6 animate-in fade-in duration-1000 delay-300">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter text-center max-w-[280px] mx-auto leading-tight">
                    Assista ao vídeo e entenda como funciona o JPA Connect
                </h3>
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/10 shadow-2xl group mx-auto w-full">
                    <video 
                        src="https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4" 
                        className="w-full h-full object-cover"
                        controls
                        poster="https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=800"
                    />
                </div>
            </div>

            <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-white text-slate-900 font-black py-5 rounded-[2rem] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
                Quero fazer minha aplicação <ArrowRight size={18} strokeWidth={3} />
            </button>
        </section>

        {/* COMO FUNCIONA */}
        <section className="space-y-12">
            <div className="text-center">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">O Formato</h3>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Sincronia Semanal</h2>
            </div>

            <div className="grid gap-4">
                <BenefitCard 
                    icon={ClockIcon} 
                    title="Encontros às 07:00" 
                    desc="Reuniões presenciais semanais no início do dia. Negócios fechados enquanto o bairro ainda desperta."
                />
                <BenefitCard 
                    icon={Briefcase} 
                    title="Apresentações Executivas" 
                    desc="Espaço garantido para expor seus diferenciais e o perfil de cliente que você busca."
                />
                <BenefitCard 
                    icon={Coffee} 
                    title="Coffee & Networking" 
                    desc="Momentos de conexão individual após a reunião para aprofundar relacionamentos."
                />
            </div>
        </section>

        {/* O VALOR REAL */}
        <section className="bg-slate-900 rounded-[3rem] p-10 border border-white/5 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 space-y-6">
                <h3 className="text-xs font-black text-amber-400 uppercase tracking-[0.2em]">O Verdadeiro Valor</h3>
                <h2 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter">
                    Indicações que nascem da confiança real.
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    No JPA Connect, não existem trocas forçadas or comissões ocultas. 
                    O modelo é baseado na economia de proximidade: empresários que se conhecem, 
                    confiam e se indicam naturalmente para suas redes de contatos.
                </p>
                <div className="flex items-center gap-3 pt-4 text-emerald-400">
                    <ShieldCheck size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Ambiente Blindado e Seguro</span>
                </div>
            </div>
        </section>

        {/* EXCLUSIVIDADE */}
        <section className="space-y-8">
            <div className="text-center">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Regra de Ouro</h3>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Apenas 1 por nicho.</h2>
            </div>
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-500/20 relative">
                <div className="absolute bottom-4 right-6 opacity-20"><Zap size={120} strokeWidth={2.5}/></div>
                <p className="text-sm font-bold leading-relaxed mb-6">
                    Garantimos exclusividade total para o seu segmento. Uma vez que você faz parte, nenhum concorrente direto seu poderá entrar no mesmo grupo.
                </p>
                <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/10">
                    <Users size={14} />
                    <span className="text-[10px] font-black uppercase">Máximo 30 membros</span>
                </div>
            </div>
        </section>

        {/* PARA QUEM É */}
        <section className="grid grid-cols-1 gap-6">
            <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Este grupo é para você se:</h3>
                <div className="space-y-3">
                    {[
                        "É dono(a) de negócio em Jacarepaguá",
                        "Busca parceiros estratégicos e não apenas clientes",
                        "Valoriza o relacionamento antes da transação",
                        "Tem compromisso com a economia local"
                    ].map((text, i) => (
                        <div key={i} className="flex items-center gap-3 px-1">
                            <CheckCircle2 size={18} className="text-indigo-500" />
                            <span className="text-sm text-slate-300 font-medium">{text}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="space-y-6 pt-10 border-t border-white/5">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-2">NÃO é para você se:</h3>
                <div className="space-y-3">
                    {[
                        "Busca faturamento imediato sem convívio",
                        "Quer vender para o grupo agressivamente",
                        "Não tem disponibilidade para encontros presenciais",
                        "Prefere o anonimato à autoridade local"
                    ].map((text, i) => (
                        <div key={i} className="flex items-center gap-3 px-1 opacity-50">
                            <XCircle size={18} className="text-slate-500" />
                            <span className="text-sm text-slate-500 font-medium">{text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* INVESTIMENTO */}
        <section className="text-center space-y-8">
            <div className="text-center">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Investimento</h3>
                <div className="inline-block bg-white p-10 rounded-[3rem] shadow-2xl relative">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-indigo-600 rounded-t-full"></div>
                    <p className="text-sm font-bold text-slate-400 mb-2">Investimento Mensal</p>
                    <div className="flex items-baseline justify-center gap-1">
                        <span className="text-xl font-bold text-slate-400">R$</span>
                        <span className="text-6xl font-black text-slate-900 tracking-tighter">200</span>
                        <span className="text-sm font-bold text-slate-400">,00</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 mt-4 uppercase tracking-tight">Cobrança mensal. Cancelamento simples a qualquer momento.</p>
                </div>
            </div>
            
            <div className="p-6 bg-slate-900/50 rounded-3xl border border-white/5">
                <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                    "Participar do JPA Connect custa menos do que um almoço de negócios e entrega um ecossistema inteiro de oportunidades."
                </p>
            </div>
        </section>

        {/* CTA FINAL */}
        <section className="pt-10 space-y-6">
            <div className="bg-amber-50/5 border border-amber-500/20 p-5 rounded-2xl flex gap-4">
                <span className="shrink-0"><Info size={20} className="text-amber-500" /></span>
                <p className="text-[11px] text-amber-200/70 font-bold uppercase leading-relaxed">
                    A entrada no grupo depende de análise prévia de nicho e perfil empresarial para garantir a qualidade do círculo.
                </p>
            </div>
            
            <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-xs"
            >
                Quero fazer minha aplicação
                <ArrowRight size={18} strokeWidth={3} />
            </button>
            <p className="text-center text-[9px] text-slate-500 font-bold uppercase tracking-widest">Vagas limitadas • Jacarepaguá/RJ</p>
        </section>

      </main>

      {isModalOpen && <ApplicationModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
