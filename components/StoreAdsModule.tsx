
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
  Lightbulb
} from 'lucide-react';

interface StoreAdsModuleProps {
  onBack: () => void;
}

type ViewState = 'list' | 'create' | 'summary' | 'success';

const BUDGET_LEVELS = [
  { value: 0.99, label: "Presença", reach: "80 a 150", desc: "Sua loja entra na lista de destaques do bairro.", icon: Zap },
  { value: 1.99, label: "Notável", reach: "200 a 350", desc: "Você aparece com mais frequência para os vizinhos.", icon: Sparkles },
  { value: 2.99, label: "Preferido", reach: "400 a 650", desc: "Sua loja ganha prioridade no topo das buscas.", icon: Star, recommended: true },
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

  const ListView = () => (
    <div className="flex-1 flex flex-col bg-slate-950 p-5 space-y-8">
      {/* Banner Principal - FASE 1: O Brilho */}
      <div className="bg-gradient-to-br from-[#1E5BFF] to-indigo-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10">
            <Sparkles className="w-7 h-7 text-amber-300" />
          </div>
          <h2 className="text-2xl font-black mb-4 font-display tracking-tight leading-tight">
            Destaque sua loja <br/> para a Freguesia
          </h2>
          <p className="text-indigo-100 text-sm mb-8 font-medium leading-relaxed">
            Seja encontrado primeiro por quem mora e busca serviços perto de você. Comece com pouco e veja o resultado.
          </p>
          
          <button 
            onClick={() => setView('create')}
            className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-amber-400 uppercase tracking-widest text-xs"
          >
            CRIAR NOVO DESTAQUE
          </button>
        </div>
      </div>

      {/* Gestão de Campanhas */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] ml-1">Seu desempenho atual</h3>
        {campaigns.map((c) => (
          <div key={c.id} className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#1E5BFF]/5 rounded-bl-full pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${c.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
                  <h4 className="font-bold text-white text-sm">Destaque {c.status === 'active' ? 'Ativo' : 'Pausado'}</h4>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Válido até {c.endDate}</p>
              </div>
              <button className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                 <PauseCircle className="w-4 h-4" />
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
                <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">Interessados</span>
                <p className="text-xl font-black text-white">{c.clicks}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Educacional - Roadmap Visual */}
      <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-[2rem] p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Lightbulb className="w-4 h-4 text-indigo-400" />
          </div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider">Como funciona o Destaque?</h4>
        </div>
        <p className="text-[11px] text-indigo-200/70 leading-relaxed">
          O destaque coloca sua loja nas primeiras posições da categoria e nos filtros de busca. O alcance depende da demanda do bairro por seus serviços no momento.
        </p>
      </div>
    </div>
  );

  const CreateView = () => (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-screen">
      <div className="p-5 flex items-center gap-4 border-b border-white/5 sticky top-0 bg-slate-950 z-20 h-20">
        <button onClick={() => setView('list')} className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-400" />
        </button>
        <h2 className="font-bold text-lg text-white font-display">Configurar Destaque</h2>
      </div>

      <div className="p-6 space-y-10 overflow-y-auto no-scrollbar pb-32">
        {/* Nível de Investimento */}
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h3 className="text-xl font-black font-display text-white tracking-tight">Quanto quer investir por dia?</h3>
                <p className="text-slate-500 text-xs px-6">Valores acessíveis para impulsionar sua loja no bairro.</p>
            </div>

            <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 relative shadow-inner">
                <div className="flex flex-col items-center text-center mb-8 h-36 justify-center">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20 animate-in zoom-in duration-300" key={levelIndex}>
                        {React.createElement(selectedLevel.icon, { className: "w-8 h-8 text-[#1E5BFF]" })}
                    </div>
                    <h4 className="text-2xl font-black text-white leading-tight">
                        R$ {selectedLevel.value.toFixed(2).replace('.', ',')} 
                        <span className="text-xs text-slate-500 font-bold uppercase ml-2 tracking-widest">/dia</span>
                    </h4>
                    <p className="text-xs text-[#1E5BFF] font-black mt-1 uppercase tracking-widest">Plano {selectedLevel.label}</p>
                </div>

                <div className="mb-10 bg-slate-950/50 rounded-2xl p-4 border border-white/5 flex items-center justify-between animate-in fade-in duration-500" key={`reach-${levelIndex}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Alcance estimado</p>
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

        {/* Duração */}
        <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duração do Destaque</span>
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
          REVISAR E ATIVAR
          <ArrowRight className="w-5 h-5" strokeWidth={3} />
        </button>
      </div>
    </div>
  );

  const SummaryView = () => (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-screen">
      <div className="p-5 flex items-center gap-4 border-b border-white/5 sticky top-0 bg-slate-950 z-20 h-20">
        <button onClick={() => setView('create')} className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-400" />
        </button>
        <h2 className="font-bold text-lg text-white font-display">Revisão</h2>
      </div>

      <div className="p-6 space-y-8 overflow-y-auto no-scrollbar pb-32">
        <div className="text-center">
            <h3 className="text-2xl font-black text-white font-display tracking-tight">Quase pronto para brilhar</h3>
            <p className="text-slate-500 text-xs mt-1">Confira os detalhes do seu investimento.</p>
        </div>

        <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                {React.createElement(selectedLevel.icon, { className: "w-6 h-6 text-[#1E5BFF]" })}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nível de Destaque</p>
                <p className="text-lg font-bold text-white">{selectedLevel.label} (R$ {selectedLevel.value.toFixed(2).replace('.', ',')}/dia)</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tempo Total</p>
                <p className="text-lg font-bold text-white">{duration} dias</p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-between items-end">
              <span className="text-slate-400 font-black uppercase text-xs tracking-widest">Investimento Total</span>
              <span className="text-3xl font-black text-[#1E5BFF]">R$ {totalCost.toFixed(2).replace('.', ',')}</span>
            </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900/20 p-6 rounded-3xl border border-indigo-500/20">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h4 className="font-bold text-white text-sm">Você está no controle</h4>
          </div>
          <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
            <p className="flex items-center gap-3">
              <PauseCircle className="w-4 h-4 text-slate-500" /> 
              <span>Sua campanha pode ser <span className="text-white font-bold">pausada</span> a qualquer momento.</span>
            </p>
            <p className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-slate-500" /> 
              <span>Pagamento único via carteira. <span className="text-white font-bold">Sem renovações automáticas</span>.</span>
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/80 backdrop-blur-md border-t border-white/5 z-30 max-w-md mx-auto">
        <button 
          onClick={handleActivate}
          disabled={isActivating}
          className="w-full bg-[#1E5BFF] hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-[0.15em] text-xs"
        >
          {isActivating ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
              CONFIRMAR E ATIVAR
              <ArrowRight className="w-5 h-5" strokeWidth={3} />
            </>
          )}
        </button>
      </div>
    </div>
  );

  const SuccessView = () => (
    <div className="flex-1 flex flex-col bg-slate-950 items-center justify-center p-8 text-center animate-in zoom-in duration-500 h-screen">
      <div className="w-24 h-24 bg-emerald-500/20 rounded-[2.5rem] flex items-center justify-center mb-8 border border-emerald-500/20 shadow-[0_0_60px_rgba(16,185,129,0.15)] relative">
        <CheckCircle2 className="w-12 h-12 text-emerald-400" />
      </div>
      
      <h2 className="text-3xl font-black text-white mb-4 font-display tracking-tight">Sua loja já está brilhando!</h2>
      <p className="text-slate-400 text-sm max-w-[260px] mb-12 leading-relaxed font-medium">
        Seu negócio agora aparece com prioridade nas buscas e listas para quem está na <span className="text-white font-bold">Freguesia</span>.
      </p>

      <div className="w-full max-w-xs space-y-4 mb-12">
         <div className="bg-slate-900 p-5 rounded-2xl border border-white/5 flex items-start gap-4 text-left">
            <LayoutDashboard className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
            <div>
                <p className="text-xs font-bold text-white mb-1">Acompanhe os resultados</p>
                <p className="text-[10px] text-slate-500 leading-relaxed">Fique de olho no número de visualizações e cliques para ver o impacto no seu negócio.</p>
            </div>
         </div>
      </div>

      <button 
        onClick={() => setView('list')}
        className="w-full max-w-xs bg-white text-slate-950 font-black py-5 rounded-2xl shadow-xl active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-xs"
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
          <h1 className="font-black text-xl font-display tracking-tight text-white uppercase tracking-widest">Anúncios</h1>
        </div>
      )}
      
      {view === 'list' && <ListView />}
      {view === 'create' && <CreateView />}
      {view === 'summary' && <SummaryView />}
      {view === 'success' && <SuccessView />}
    </div>
  );
};
