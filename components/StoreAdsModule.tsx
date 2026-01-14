
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Plus, 
  TrendingUp,
  Target,
  ShieldCheck,
  Loader2,
  ArrowRight,
  Rocket,
  Zap,
  Star,
  CheckCircle2,
  Sparkles,
  Flame,
  Award,
  Users,
  Info,
  PauseCircle,
  Clock,
  LayoutDashboard,
  BarChart3,
  Lightbulb,
  ShieldAlert,
  Settings2,
  MousePointer2,
  Crown,
  Instagram,
  MessageCircle,
  CalendarCheck
} from 'lucide-react';

interface StoreAdsModuleProps {
  onBack: () => void;
}

type ViewState = 'list' | 'create' | 'summary' | 'success' | 'master_details';

const BUDGET_LEVELS = [
  { value: 0.99, label: "Presença", reach: "80 a 150", desc: "Sua loja entra na lista de destaques rotativos do bairro.", icon: Zap },
  { value: 1.99, label: "Notável", reach: "200 a 350", desc: "Você aparece com prioridade nas buscas da sua categoria.", icon: Sparkles },
  { value: 2.99, label: "Preferido", reach: "400 a 650", desc: "O equilíbrio perfeito para ser visto pelos vizinhos sem pesar no bolso.", icon: Star, recommended: true, badge: "IDEAL PARA COMEÇAR" },
];

interface Campaign {
  id: string;
  days: number;
  dailyValue: number;
  status: 'active' | 'paused';
  endDate: string;
  views: number;
  clicks: number;
}

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack }) => {
  const [view, setView] = useState<ViewState>('list');
  const [levelIndex, setLevelIndex] = useState(2); 
  const [duration, setDuration] = useState<number>(7); 
  const [isActivating, setIsActivating] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'prev-1',
      days: 7,
      dailyValue: 1.99,
      status: 'active',
      endDate: '25/11/2023',
      views: 242,
      clicks: 18
    }
  ]);

  const selectedLevel = BUDGET_LEVELS[levelIndex];
  const totalCost = duration * selectedLevel.value;

  const handleActivate = () => {
    setIsActivating(true);
    setTimeout(() => {
      const newCampaign: Campaign = {
        id: Math.random().toString(36).substr(2, 9),
        days: duration,
        dailyValue: selectedLevel.value,
        status: 'active',
        endDate: new Date(Date.now() + duration * 86400000).toLocaleDateString('pt-BR'),
        views: 0,
        clicks: 0
      };
      setCampaigns([newCampaign, ...campaigns]);
      setIsActivating(false);
      setView('success');
    }, 2000);
  };

  const handleContactMaster = () => {
    const text = "Olá! Tenho interesse no pacote Patrocinador Master do Localizei JPA. Gostaria de verificar a disponibilidade.";
    const url = `https://wa.me/5521999999999?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const ListView = () => (
    <div className="flex-1 flex flex-col bg-slate-950 p-5 space-y-8">
      
      {/* HEADER DESTAQUE */}
      <div className="bg-gradient-to-br from-[#1E5BFF] to-indigo-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10">
            <Sparkles className="w-7 h-7 text-amber-300" />
          </div>
          <h2 className="text-2xl font-black mb-4 font-display tracking-tight leading-tight">
            Destaque sua loja <br/> em Jacarepaguá
          </h2>
          <p className="text-indigo-100 text-sm mb-8 font-medium leading-relaxed">
            Seja encontrado primeiro por quem mora e busca serviços perto de você.
          </p>
          
          <button 
            onClick={() => setView('create')}
            className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-amber-400 uppercase tracking-widest text-xs"
          >
            CRIAR NOVO DESTAQUE
          </button>
        </div>
      </div>

      {/* CARD PATROCINADOR MASTER */}
      <div 
        onClick={() => setView('master_details')}
        className="bg-gradient-to-r from-slate-900 to-slate-800 p-1 rounded-[32px] cursor-pointer active:scale-[0.98] transition-transform shadow-xl relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent rounded-[32px] animate-pulse"></div>
        <div className="bg-slate-950 rounded-[28px] p-6 relative z-10 border border-amber-500/30">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                    <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Master</span>
                </div>
                <span className="text-[9px] font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">1 VAGA/MÊS</span>
            </div>
            
            <h3 className="text-xl font-black text-white font-display mb-2">Domine o App e o Insta</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
                O pacote mais completo de visibilidade. Banner fixo no app + Collabs no Instagram.
            </p>

            <div className="flex items-center justify-between">
                <div>
                    <span className="text-[10px] text-slate-500 line-through font-bold">R$ 4.000</span>
                    <p className="text-lg font-black text-white">R$ 2.500<span className="text-xs font-normal text-slate-500">/mês</span></p>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-5 h-5" strokeWidth={3} />
                </div>
            </div>
        </div>
      </div>

      {/* CAMPANHAS ATIVAS */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] ml-1">Campanhas em andamento</h3>
        {campaigns.map((c) => (
          <div key={c.id} className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#1E5BFF]/5 rounded-bl-full pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${c.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
                  <h4 className="font-bold text-white text-sm">Loja em destaque</h4>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Ativo até {c.endDate}</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest">
                 <Settings2 className="w-3 h-3" />
                 Gerenciar
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 relative z-10">
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">Vizinhos viram</span>
                <div className="flex items-end gap-1">
                  <p className="text-xl font-black text-white">{c.views}</p>
                  <TrendingUp className="w-3 h-3 text-emerald-500 mb-1" />
                </div>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">Cliques na loja</span>
                <p className="text-xl font-black text-white">{c.clicks}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MasterDetailsView = () => (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-screen relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-amber-900/20 to-slate-950 pointer-events-none"></div>
        <div className="absolute top-20 right-[-100px] w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="p-5 flex items-center gap-4 border-b border-white/5 sticky top-0 bg-slate-950/80 backdrop-blur-md z-20 h-20">
            <button onClick={() => setView('list')} className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-400" />
            </button>
            <h2 className="font-bold text-lg text-white font-display flex items-center gap-2">
                Patrocinador Master <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
            </h2>
        </div>

        <div className="p-6 pb-32 overflow-y-auto no-scrollbar space-y-8 relative z-10">
            
            {/* Intro */}
            <div className="text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    OFERTA EXCLUSIVA
                </span>
                <h1 className="text-3xl font-black text-white leading-tight mb-4">
                    Domine a Freguesia <br/> <span className="text-amber-500">dentro e fora do App</span>
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
                    Apenas 1 marca por vez. Visibilidade máxima para consolidar sua autoridade no bairro.
                </p>
            </div>

            {/* Pricing Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-amber-500/20 shadow-2xl relative overflow-hidden text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-b-xl uppercase tracking-widest shadow-lg">
                    Valor Promocional
                </div>
                <div className="mt-4">
                    <p className="text-sm text-slate-500 line-through font-bold mb-1">R$ 4.000/mês</p>
                    <p className="text-5xl font-black text-white tracking-tighter">R$ 2.500</p>
                    <p className="text-xs text-amber-500 font-bold uppercase tracking-widest mt-2">Mensais / Plano Trimestral</p>
                </div>
            </div>

            {/* Deliverables List */}
            <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Entregas do Pacote</h3>
                
                <div className="bg-slate-900/50 p-5 rounded-3xl border border-white/5 flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Rocket className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm">Destaque Institucional no App</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Sua marca na tela inicial e menus principais.</p>
                    </div>
                </div>

                <div className="bg-slate-900/50 p-5 rounded-3xl border border-white/5 flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center shrink-0">
                        <Instagram className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm">4 Posts no Feed (Collab)</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Conteúdo compartilhado no Instagram oficial.</p>
                    </div>
                </div>

                <div className="bg-slate-900/50 p-5 rounded-3xl border border-white/5 flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center shrink-0">
                        <Zap className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm">2 Stories Semanais</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Frequência constante para engajar.</p>
                    </div>
                </div>

                <div className="bg-slate-900/50 p-5 rounded-3xl border border-white/5 flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
                        <Star className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm">Destaque nos Highlights</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Fixado no perfil do Instagram.</p>
                    </div>
                </div>
            </div>

            {/* Conditions */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 space-y-3">
                <div className="flex items-center gap-3">
                    <CalendarCheck className="w-4 h-4 text-slate-400" />
                    <p className="text-xs text-slate-400 font-medium">Contrato mínimo de 3 meses.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <p className="text-xs text-slate-400 font-medium">Pagamento antecipado (PIX/Boleto).</p>
                </div>
                <div className="flex items-center gap-3">
                    <Crown className="w-4 h-4 text-slate-400" />
                    <p className="text-xs text-slate-400 font-medium">Apenas 1 vaga disponível por período.</p>
                </div>
            </div>

        </div>

        {/* Footer CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950 border-t border-white/10 z-50">
            <button 
                onClick={handleContactMaster}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
            >
                <MessageCircle className="w-5 h-5" />
                Tenho Interesse
            </button>
        </div>
    </div>
  );

  const CreateView = () => (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-screen">
      <div className="p-5 flex items-center gap-4 border-b border-white/5 sticky top-0 bg-slate-950 z-20 h-20">
        <button onClick={() => setView('list')} className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-400" />
        </button>
        <h2 className="font-bold text-lg text-white font-display">Novo Destaque</h2>
      </div>

      <div className="p-6 space-y-10 overflow-y-auto no-scrollbar pb-32">
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h3 className="text-xl font-black font-display text-white tracking-tight">Escolha o valor diário</h3>
                <p className="text-slate-500 text-xs px-6">Quanto mais você investe, mais vezes aparece.</p>
            </div>

            <div className={`bg-slate-900 p-8 rounded-[3rem] border relative shadow-inner transition-all duration-300 ${selectedLevel.recommended ? 'border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.1)]' : 'border-white/5'}`}>
                {selectedLevel.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg tracking-widest animate-bounce-short">
                    {selectedLevel.badge}
                  </div>
                )}

                <div className="flex flex-col items-center text-center mb-8 h-36 justify-center">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20 animate-in zoom-in duration-300" key={levelIndex}>
                        {React.createElement(selectedLevel.icon, { className: `w-8 h-8 ${selectedLevel.recommended ? 'text-amber-500' : 'text-[#1E5BFF]'}` })}
                    </div>
                    <h4 className="text-2xl font-black text-white leading-tight">
                        R$ {selectedLevel.value.toFixed(2).replace('.', ',')} 
                        <span className="text-xs text-slate-500 font-bold uppercase ml-2 tracking-widest">/dia</span>
                    </h4>
                    <p className={`text-xs font-black mt-1 uppercase tracking-widest ${selectedLevel.recommended ? 'text-amber-500' : 'text-[#1E5BFF]'}`}>Nível {selectedLevel.label}</p>
                    <p className="text-[10px] text-slate-400 mt-2 max-w-[200px] mx-auto leading-relaxed">{selectedLevel.desc}</p>
                </div>

                <div className="mb-10 bg-slate-950/50 rounded-2xl p-4 border border-white/5 flex items-center justify-between animate-in fade-in duration-500" key={`reach-${levelIndex}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Target className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estimativa de alcance</p>
                            <p className="text-base font-black text-white italic">{selectedLevel.reach} <span className="text-[10px] text-slate-500 not-italic">vizinhos/dia</span></p>
                        </div>
                    </div>
                </div>

                <input 
                    type="range" min="0" max="2" step="1" 
                    value={levelIndex}
                    onChange={(e) => setLevelIndex(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-[#1E5BFF]"
                />
                
                <div className="flex justify-between mt-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                    <span>Mínimo</span>
                    {BUDGET_LEVELS.map((l, i) => i === 2 && <span key={i} className="text-amber-500">Sugerido</span>)}
                    <span>Top</span>
                </div>
            </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duração do destaque</span>
            <span className="text-3xl font-black text-amber-500">{duration} dias</span>
          </div>
          
          <input 
            type="range" min="7" max="30" step="1" value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        <button 
          onClick={() => setView('summary')}
          className="w-full bg-[#1E5BFF] hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all uppercase tracking-[0.15em] text-xs"
        >
          CONFERIR RESUMO
          <ArrowRight className="w-5 h-5" strokeWidth={3} />
        </button>
      </div>
    </div>
  );

  const SummaryView = () => (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-screen relative">
      <div className="p-5 flex items-center gap-4 border-b border-white/5 sticky top-0 bg-slate-950 z-20 h-20">
        <button onClick={() => setView('create')} className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-400" />
        </button>
        <h2 className="text-lg font-bold text-white font-display">Resumo da Ativação</h2>
      </div>

      <div className="p-6 space-y-8 overflow-y-auto no-scrollbar pb-48">
        <div className="text-center">
            <h3 className="text-2xl font-black text-white font-display tracking-tight">Tudo pronto para brilhar</h3>
            <p className="text-slate-500 text-xs mt-1">Confira os detalhes antes de ativar.</p>
        </div>

        <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                {React.createElement(selectedLevel.icon, { className: "w-6 h-6 text-[#1E5BFF]" })}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nível de visibilidade</p>
                <p className="text-lg font-bold text-white">{selectedLevel.label} (R$ {selectedLevel.value.toFixed(2).replace('.', ',')}/dia)</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duração total</p>
                <p className="text-lg font-bold text-white">{duration} dias</p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-between items-end">
              <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-1">Valor total (Fixo)</span>
              <span className="text-3xl font-black text-[#1E5BFF]">R$ {totalCost.toFixed(2).replace('.', ',')}</span>
            </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900/20 p-6 rounded-[2.5rem] border border-indigo-500/20 shadow-inner">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <Settings2 className="w-4 h-4 text-indigo-400" />
            </div>
            <h4 className="font-black text-white text-[10px] uppercase tracking-widest">Controle Total</h4>
          </div>
          
          <div className="space-y-5 text-xs text-slate-400 leading-relaxed font-medium">
            <div className="flex items-start gap-4">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg shrink-0">
                <PauseCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <p>
                <span className="text-white font-bold block mb-0.5">Pausar é simples</span>
                Você pode pausar a campanha a qualquer momento pelo painel.
              </p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-1.5 bg-amber-500/10 rounded-lg shrink-0">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
              </div>
              <p>
                <span className="text-white font-bold block mb-0.5">Sem renovação automática</span>
                Acabou o prazo de {duration} dias, o destaque encerra sem cobranças novas.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-1.5 bg-blue-500/10 rounded-lg shrink-0">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <p>
                <span className="text-white font-bold block mb-0.5">Valor transparente</span>
                Valor fixo para o período. Sem letras miúdas, taxas extras ou comissões.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/90 backdrop-blur-lg border-t border-white/5 z-50 max-w-md mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" />
            Pagamento via saldo da carteira
          </div>
          
          <button 
            onClick={handleActivate}
            disabled={isActivating}
            className="w-full bg-gradient-to-r from-[#1E5BFF] to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-5 rounded-2xl shadow-[0_10px_40px_rgba(30,91,255,0.3)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-[0.15em] text-xs"
          >
            {isActivating ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                ATIVAR VISIBILIDADE AGORA
                <ArrowRight className="w-5 h-5" strokeWidth={3} />
              </>
            )}
          </button>
        </div>
        <div className="h-4"></div>
      </div>
    </div>
  );

  const SuccessView = () => (
    <div className="flex-1 flex flex-col bg-slate-950 items-center justify-center p-8 text-center animate-in zoom-in duration-500 h-screen">
      <div className="w-24 h-24 bg-emerald-500/20 rounded-[2.5rem] flex items-center justify-center mb-8 border border-emerald-500/20 shadow-[0_0_60px_rgba(16,185,129,0.15)] relative">
        <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping opacity-25"></div>
        <CheckCircle2 className="w-12 h-12 text-emerald-400 relative z-10" />
      </div>
      
      <h2 className="text-3xl font-black text-white mb-4 font-display tracking-tight leading-tight px-4">
        Tudo pronto! Sua loja já é destaque no bairro.
      </h2>
      <p className="text-slate-400 text-sm max-w-[280px] mb-12 leading-relaxed font-medium">
        Seu negócio ganhou <span className="text-white font-bold">prioridade nas buscas</span> e agora aparece no topo para vizinhos interessados.
      </p>

      <div className="w-full max-w-xs space-y-4 mb-12">
         <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 flex items-start gap-4 text-left">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <LayoutDashboard className="w-4 h-4 text-blue-400 shrink-0" />
            </div>
            <div>
                <p className="text-xs font-bold text-white mb-1">Acompanhe pelo painel</p>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Veja em tempo real quantos vizinhos estão descobrindo sua marca hoje.
                </p>
            </div>
         </div>
      </div>

      <button 
        onClick={() => setView('list')}
        className="w-full max-w-xs bg-white text-slate-950 font-black py-5 rounded-2xl shadow-xl active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-xs hover:bg-emerald-400"
      >
        VOLTAR AO PAINEL
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col transition-colors duration-300">
      {view === 'list' && (
        <div className="bg-slate-950 px-5 h-20 flex items-center gap-4 border-b border-white/5 shrink-0">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-400" />
          </button>
          <h1 className="font-black text-xl font-display tracking-tight text-white uppercase tracking-widest">Destaques</h1>
        </div>
      )}
      
      {view === 'list' && <ListView />}
      {view === 'create' && <CreateView />}
      {view === 'summary' && <SummaryView />}
      {view === 'success' && <SuccessView />}
      {view === 'master_details' && <MasterDetailsView />}
    </div>
  );
};
