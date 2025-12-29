
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Megaphone, 
  Plus, 
  MousePointer, 
  Eye, 
  TrendingUp,
  Rocket,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Target,
  Clock,
  ShieldCheck,
  LayoutDashboard,
  Loader2,
  Sparkles,
  MapPin,
  Crown
} from 'lucide-react';

interface StoreAdsModuleProps {
  onBack: () => void;
}

type ViewState = 'list' | 'create' | 'details';
type AdType = 'local' | 'premium';

interface Campaign {
  id: string;
  name: string;
  type: AdType;
  status: 'active' | 'paused' | 'ended' | 'starting';
  startDate: string;
  endDate: string;
  budget: number;
  metrics: {
    impressions: number;
    clicks: number;
    ctr: number;
    reach: number;
  };
  history: number[]; 
}

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack }) => {
  const [view, setView] = useState<ViewState>('list');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  
  const [createStep, setCreateStep] = useState(1);
  const [newCampaignType, setNewCampaignType] = useState<AdType | null>(null);
  const [campaignName, setCampaignName] = useState('');
  const [duration, setDuration] = useState<number | 'monthly'>(7);
  const [isActivating, setIsActivating] = useState(false);

  const STORE_BALANCE = 45.00; 

  const getPricePerDay = (type: AdType) => type === 'local' ? 0.89 : 3.90;
  const currentPrice = newCampaignType ? getPricePerDay(newCampaignType) : 0;
  const totalCost = duration === 'monthly' ? currentPrice * 30 : currentPrice * (duration as number);
  const hasSufficientBalance = STORE_BALANCE >= totalCost;

  const handleCreateStart = () => {
    setCreateStep(1);
    setNewCampaignType(null);
    setCampaignName('');
    setDuration(7);
    setView('create');
  };

  const handleSelectPlan = (type: AdType) => {
    setNewCampaignType(type);
    setCreateStep(2); // Navegação automática conforme regra #1
  };

  const handleActivateCampaign = () => {
    setIsActivating(true);
    setTimeout(() => {
      const newCampaign: Campaign = {
        id: Math.random().toString(36).substr(2, 9),
        name: campaignName || 'Nova Campanha',
        type: newCampaignType || 'local',
        status: 'starting',
        startDate: new Date().toLocaleDateString('pt-BR'),
        endDate: duration === 'monthly' ? 'Recorrente' : new Date(Date.now() + (duration as number) * 86400000).toLocaleDateString('pt-BR'),
        budget: totalCost,
        metrics: { impressions: 0, clicks: 0, ctr: 0, reach: 0 },
        history: [0, 0, 0, 0, 0, 0, 0]
      };

      setCampaigns([newCampaign, ...campaigns]);
      setIsActivating(false);
      setView('list');
      setCreateStep(1);
    }, 2000);
  };

  const renderStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      starting: 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse',
      paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      ended: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    const labels = { active: 'Ativa', starting: 'Iniciando', paused: 'Pausada', ended: 'Encerrada' };
    return (
      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const ListView = () => (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-950">
      <div className="p-5 pb-32 w-full max-w-md mx-auto space-y-6">
        <div className="bg-gradient-to-br from-indigo-700 to-purple-800 rounded-[32px] p-8 text-white shadow-xl shadow-purple-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                  <Rocket className="w-8 h-8 text-yellow-300 fill-yellow-300" />
              </div>
              <h2 className="text-2xl font-black mb-3 font-display tracking-tight leading-tight">Impulsione sua loja</h2>
              <p className="text-indigo-100 text-sm mb-8 leading-relaxed font-medium">
                Apareça para mais clientes da freguesia e receba até <strong>3x mais cliques</strong> no seu perfil.
              </p>
              <button 
                onClick={handleCreateStart}
                className="w-full bg-white text-purple-700 font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-amber-400 hover:text-slate-950"
              >
                <Plus className="w-5 h-5" strokeWidth={3} />
                CRIAR PRIMEIRA CAMPANHA
              </button>
          </div>
        </div>

        {campaigns.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-1">
              Desempenho Geral
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-slate-900 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Visualizações</span>
                </div>
                <p className="text-xl font-black text-white">
                  {campaigns.reduce((acc, c) => acc + c.metrics.impressions, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <MousePointer className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Cliques no Perfil</span>
                </div>
                <p className="text-xl font-black text-white">
                  {campaigns.reduce((acc, c) => acc + c.metrics.clicks, 0)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Minhas Campanhas</h3>
              <span className="text-[10px] text-purple-400 font-black bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                  Saldo ADS: R$ {STORE_BALANCE.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <div 
                  key={campaign.id}
                  onClick={() => { setSelectedCampaign(campaign); setView('details'); }}
                  className="bg-slate-900 p-5 rounded-3xl shadow-sm border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group active:scale-[0.99] flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-white text-sm truncate">{campaign.name}</h4>
                        {renderStatusBadge(campaign.status)}
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                        {campaign.type === 'premium' ? 'ADS Premium' : 'ADS Básico'} • {campaign.endDate}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}

        {campaigns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center opacity-40 grayscale">
              <Megaphone className="w-16 h-16 text-slate-500 mb-4" />
              <p className="text-sm font-black text-slate-500 uppercase tracking-widest leading-none">Comece a Anunciar</p>
              <p className="text-xs text-slate-600 mt-2">Suas campanhas aparecerão aqui.</p>
          </div>
        )}
      </div>
    </div>
  );

  const CreateView = () => (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <div className="p-5 flex justify-between mb-4 px-8 relative">
        <div className="absolute top-9 left-0 right-0 h-0.5 bg-slate-800 -z-0 mx-12"></div>
        {[1, 2, 3].map(step => (
          <div key={step} className="flex flex-col items-center gap-2 z-10 bg-slate-950 px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
              createStep >= step ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]' : 'bg-slate-800 text-slate-500 border border-white/5'
            }`}>
              {step}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-wider ${createStep >= step ? 'text-purple-500' : 'text-slate-600'}`}>
              {step === 1 ? 'Plano' : step === 2 ? 'Dados' : 'Pagar'}
            </span>
          </div>
        ))}
      </div>

      <div className="flex-1 p-5 pb-40 overflow-y-auto no-scrollbar">
        {createStep === 1 && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <h3 className="text-xl font-bold text-white mb-2 text-center font-display">Escolha sua visibilidade</h3>
            
            <button 
              onClick={() => handleSelectPlan('local')}
              className={`w-full p-6 rounded-3xl border-2 text-left transition-all group ${
                newCampaignType === 'local' 
                  ? 'border-purple-600 bg-purple-600/10 shadow-[0_10px_30px_rgba(147,51,234,0.1)]' 
                  : 'border-white/5 bg-slate-900/50 hover:bg-slate-900'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${newCampaignType === 'local' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                        <Target className="w-5 h-5" />
                    </div>
                    <span className="font-black text-white text-lg">ADS Básico</span>
                </div>
                <span className="text-purple-400 font-black bg-purple-500/10 px-3 py-1 rounded-lg text-xs border border-purple-500/20">
                  R$ 0,89/dia
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium pl-13">
                Destaque sua loja nas listas de categoria e nos resultados de busca local da freguesia.
              </p>
            </button>

            <button 
              onClick={() => handleSelectPlan('premium')}
              className={`w-full p-6 rounded-3xl border-2 text-left transition-all group ${
                newCampaignType === 'premium' 
                  ? 'border-purple-600 bg-purple-600/10 shadow-[0_10px_30_rgba(147,51,234,0.1)]' 
                  : 'border-white/5 bg-slate-900/50 hover:bg-slate-900'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${newCampaignType === 'premium' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                        <Crown className="w-5 h-5" />
                    </div>
                    <span className="font-black text-white text-lg">ADS Premium</span>
                </div>
                <span className="text-purple-400 font-black bg-purple-500/10 px-3 py-1 rounded-lg text-xs border border-purple-500/20">
                  R$ 3,90/dia
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium pl-13">
                Inclui todos os benefícios do Básico + aparição em todas as categorias, prioridade máxima e banner na Home.
              </p>
            </button>
          </div>
        )}

        {createStep === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="bg-slate-900 p-5 rounded-2xl border border-white/5 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Plano Selecionado</p>
                <p className="text-sm font-bold text-white uppercase">{newCampaignType === 'local' ? 'ADS Básico' : 'ADS Premium'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Valor por dia</p>
                <p className="text-sm font-bold text-purple-400">R$ {currentPrice.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Nome da Campanha</label>
              <input 
                  type="text"
                  placeholder="Ex: Promoção de Inverno"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-purple-600 transition-all placeholder-slate-700 font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 ml-1 tracking-widest">Duração da Campanha</label>
              <div className="grid grid-cols-2 gap-3">
                {[7, 15, 30, 'monthly'].map((opt) => (
                    <button
                        key={opt}
                        onClick={() => setDuration(opt as any)}
                        className={`py-4 rounded-2xl border-2 font-bold text-xs transition-all ${
                            duration === opt 
                            ? 'border-purple-600 bg-purple-600/10 text-white' 
                            : 'border-white/5 bg-slate-900 text-slate-500'
                        }`}
                    >
                        {opt === 'monthly' ? 'Indeterminado' : `${opt} dias`}
                    </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 p-6 rounded-3xl flex justify-between items-center border border-white/10 shadow-xl">
               <div>
                    <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest block mb-1">Investimento Estimado</span>
                    <span className="text-xs text-slate-500 font-bold">Total: R$ {totalCost.toFixed(2).replace('.', ',')}</span>
               </div>
               <span className="text-2xl font-black text-white">R$ {totalCost.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        )}

        {createStep === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="bg-slate-900 p-8 rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-3xl"></div>
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-500" />
                    Resumo do Pedido
                </h3>
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-slate-500 text-sm font-medium">Plano</span>
                        <span className="font-black text-white uppercase tracking-wider">{newCampaignType === 'local' ? 'ADS BÁSICO' : 'ADS PREMIUM'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-slate-500 text-sm font-medium">Duração</span>
                        <span className="font-bold text-white">{duration === 'monthly' ? 'Assinatura Mensal' : `${duration} dias`}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-slate-500 text-sm font-medium">Valor Diário</span>
                        <span className="font-bold text-white">R$ {currentPrice.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="font-black text-slate-300">Total a Pagar</span>
                        <span className="text-3xl font-black text-purple-500">R$ {totalCost.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
                <div className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${hasSufficientBalance ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${hasSufficientBalance ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                        <Wallet className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-white mb-1">
                            {hasSufficientBalance ? 'Pagar com Saldo Localizei' : 'Pagar via Pix / Cartão'}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            {hasSufficientBalance 
                                ? `Serão debitados R$ ${totalCost.toFixed(2).replace('.', ',')} do seu saldo disponível (R$ ${STORE_BALANCE.toFixed(2).replace('.', ',')}).` 
                                : 'Seu saldo é insuficiente. Gere um código Pix para ativar sua campanha agora.'}
                        </p>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 z-30 flex gap-3 max-w-md mx-auto">
        <button 
          onClick={() => createStep === 1 ? setView('list') : setCreateStep(prev => prev - 1)}
          className="flex-1 py-4 rounded-2xl border border-white/10 text-slate-400 font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
        >
          {createStep === 1 ? 'Cancelar' : 'Voltar'}
        </button>
        {/* O botão "Continuar" no passo 1 é removido/desativado para privilegiar a navegação automática do toque no plano */}
        {createStep > 1 && (
          <button 
            onClick={() => {
              if (createStep === 2) {
                  if (campaignName.trim()) setCreateStep(3);
                  else alert("Por favor, dê um nome para sua campanha.");
              } else if (createStep === 3) {
                  handleActivateCampaign();
              }
            }}
            disabled={isActivating}
            className={`flex-[2] bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:grayscale`}
          >
            {isActivating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {createStep === 2 ? 'Ir para pagamento' : 'Ativar campanha'}
              </>
            )}
          </button>
        )}
      </div>

      {isActivating && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-300">
            <div className="w-24 h-24 bg-purple-600/20 rounded-[2.5rem] flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 rounded-[2.5rem] border-4 border-purple-500/30 animate-ping"></div>
                <Rocket className="w-10 h-10 text-purple-500 animate-bounce" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 font-display">Ativando ADS</h2>
            <p className="text-slate-500 text-sm max-w-[240px]">Estamos configurando sua visibilidade premium na Freguesia...</p>
        </div>
      )}
    </div>
  );

  const DetailsView = () => {
    if (!selectedCampaign) return null;
    return (
      <div className="p-5 pb-32 animate-in slide-in-from-right duration-300 bg-slate-950 min-h-screen">
        <div className="bg-slate-900 rounded-3xl p-6 shadow-sm border border-white/5 mb-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white leading-tight mb-1">{selectedCampaign.name}</h2>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{selectedCampaign.startDate} - {selectedCampaign.endDate}</p>
                </div>
                {renderStatusBadge(selectedCampaign.status)}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Cliques</p>
                    <p className="text-2xl font-black text-blue-500">{selectedCampaign.metrics.clicks}</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Impressões</p>
                    <p className="text-2xl font-black text-purple-600">{selectedCampaign.metrics.impressions}</p>
                </div>
            </div>
        </div>

        <h3 className="font-bold text-white mb-4 px-1 flex items-center gap-2 uppercase text-xs tracking-widest opacity-60">
            <TrendingUp className="w-4 h-4 text-purple-400" /> Histórico Semanal
        </h3>
        <div className="bg-slate-900 p-8 rounded-[32px] border border-white/5">
            <div className="flex items-end justify-between h-32 gap-3">
                {selectedCampaign.history.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2">
                        <div 
                            className="w-full bg-indigo-500 rounded-t-lg transition-all duration-700"
                            style={{ height: `${val === 0 ? 5 : (val / 90) * 100}%`, opacity: 0.2 + (val / 90) }}
                        ></div>
                        <span className="text-[8px] text-slate-600 font-black uppercase">{['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][i]}</span>
                    </div>
                ))}
            </div>
            <div className="mt-8 p-4 bg-slate-950 rounded-2xl border border-white/5 text-center">
                <p className="text-[10px] text-slate-500 italic">As métricas de desempenho são atualizadas a cada 60 minutos.</p>
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans flex flex-col">
      <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-white/5">
        <button 
          onClick={view === 'list' ? onBack : () => setView('list')} 
          className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="font-bold text-lg text-white">
          {view === 'list' ? 'Anúncios e Destaques' : view === 'create' ? 'Nova Campanha' : 'Detalhes do Anúncio'}
        </h1>
      </div>
      <div className="flex-1 flex flex-col w-full bg-slate-950">
        {view === 'list' && <ListView />}
        {view === 'create' && <CreateView />}
        {view === 'details' && <DetailsView />}
      </div>
    </div>
  );
};
