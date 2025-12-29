
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
  Target,
  Clock,
  ShieldCheck,
  Loader2,
  Crown,
  CreditCard,
  CheckCircle2
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
  const [duration, setDuration] = useState<number>(15); 
  const [isActivating, setIsActivating] = useState(false);

  const getPricePerDay = (type: AdType) => type === 'local' ? 0.89 : 3.90;
  const currentPrice = newCampaignType ? getPricePerDay(newCampaignType) : 0;
  
  const displayDuration = Math.round(duration);
  const totalCost = currentPrice * displayDuration;

  const handleCreateStart = () => {
    setCreateStep(1);
    setNewCampaignType(null);
    setCampaignName('');
    setDuration(15);
    setView('create');
  };

  const handleSelectPlan = (type: AdType) => {
    setNewCampaignType(type);
    setCreateStep(2); 
  };

  const handleActivateCampaign = () => {
    setIsActivating(true);
    setTimeout(() => {
      const newCampaign: Campaign = {
        id: Math.random().toString(36).substr(2, 9),
        name: campaignName || 'Nova Campanha',
        type: newCampaignType || 'local',
        status: 'active',
        startDate: new Date().toLocaleDateString('pt-BR'),
        endDate: new Date(Date.now() + displayDuration * 86400000).toLocaleDateString('pt-BR'),
        budget: totalCost,
        metrics: { impressions: 0, clicks: 0, ctr: 0, reach: 0 },
        history: [0, 0, 0, 0, 0, 0, 0]
      };

      setCampaigns([newCampaign, ...campaigns]);
      setIsActivating(false);
      setView('list');
      setCreateStep(1);
    }, 2500);
  };

  const isDataStepValid = campaignName.trim().length > 0;

  const renderStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
      starting: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30 animate-pulse',
      paused: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
      ended: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30'
    };
    const labels = { active: 'Ativa', starting: 'Iniciando', paused: 'Pausada', ended: 'Encerrada' };
    return (
      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const ListView = () => (
    <div className="flex-1 flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="p-5 pb-32 w-full space-y-6">
        <div className="bg-gradient-to-br from-[#1E5BFF] to-indigo-800 rounded-[32px] p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
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
                className="w-full bg-white text-[#1E5BFF] font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-amber-400 hover:text-slate-950"
              >
                <Plus className="w-5 h-5" strokeWidth={3} />
                CRIAR CAMPANHA PRÉ-PAGA
              </button>
          </div>
        </div>

        {campaigns.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-1">
              Desempenho Geral
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Visualizações</span>
                </div>
                <p className="text-xl font-black text-gray-900 dark:text-white">
                  {campaigns.reduce((acc, c) => acc + c.metrics.impressions, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <MousePointer className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Cliques no Perfil</span>
                </div>
                <p className="text-xl font-black text-gray-900 dark:text-white">
                  {campaigns.reduce((acc, c) => acc + c.metrics.clicks, 0)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Minhas Campanhas</h3>
            </div>
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <div 
                  key={campaign.id}
                  onClick={() => { setSelectedCampaign(campaign); setView('details'); }}
                  className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group active:scale-[0.99] flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{campaign.name}</h4>
                        {renderStatusBadge(campaign.status)}
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                        {campaign.type === 'premium' ? 'ADS Premium' : 'ADS Básico'} • até {campaign.endDate}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}

        {campaigns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center opacity-40 grayscale">
              <Megaphone className="w-16 h-16 text-slate-400 mb-4" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none">Comece a Anunciar</p>
              <p className="text-xs text-slate-400 mt-2">Suas campanhas aparecerão aqui.</p>
          </div>
        )}
      </div>
    </div>
  );

  const CreateView = () => (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Stepper */}
      <div className="p-5 flex justify-between mb-2 px-8 relative shrink-0">
        <div className="absolute top-9 left-0 right-0 h-0.5 bg-gray-100 dark:bg-slate-800 -z-0 mx-12"></div>
        {[1, 2, 3].map(step => (
          <div key={step} className="flex flex-col items-center gap-2 z-10 bg-white dark:bg-slate-950 px-2 transition-colors">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
              createStep >= step 
              ? 'bg-[#1E5BFF] text-white shadow-[0_0_15px_rgba(30,91,255,0.4)]' 
              : 'bg-gray-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-gray-200 dark:border-white/5'
            }`}>
              {step}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-wider transition-colors ${createStep >= step ? 'text-[#1E5BFF] dark:text-purple-500' : 'text-slate-400 dark:text-slate-600'}`}>
              {step === 1 ? 'Plano' : step === 2 ? 'Dados' : 'Pagar'}
            </span>
          </div>
        ))}
      </div>

      <div className="flex-1 p-5 pb-40 overflow-y-auto no-scrollbar w-full">
        {/* PASSO 1: SELEÇÃO DE PLANO */}
        {createStep === 1 && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center font-display">Escolha sua visibilidade</h3>
            
            <button 
              onClick={() => handleSelectPlan('local')}
              className={`w-full p-6 rounded-[28px] border-2 text-left transition-all group ${
                newCampaignType === 'local' 
                  ? 'border-[#1E5BFF] bg-blue-50 dark:bg-blue-900/10 shadow-[0_10px_30px_rgba(30,91,255,0.1)]' 
                  : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${newCampaignType === 'local' ? 'bg-[#1E5BFF] text-white' : 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-500'}`}>
                        <Target className="w-5 h-5" />
                    </div>
                    <span className="font-black text-gray-900 dark:text-white text-lg">ADS Básico</span>
                </div>
                <span className="text-[#1E5BFF] dark:text-purple-400 font-black bg-blue-500/10 px-3 py-1 rounded-lg text-xs border border-blue-500/20">
                  R$ 0,89/dia
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed font-medium pl-[52px]">
                Destaque sua loja nas buscas e listas da freguesia por um preço acessível.
              </p>
            </button>

            <button 
              onClick={() => handleSelectPlan('premium')}
              className={`w-full p-6 rounded-[28px] border-2 text-left transition-all group ${
                newCampaignType === 'premium' 
                  ? 'border-[#1E5BFF] bg-blue-50 dark:bg-blue-900/10 shadow-[0_10px_30px_rgba(30,91,255,0.1)]' 
                  : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${newCampaignType === 'premium' ? 'bg-[#1E5BFF] text-white' : 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-500'}`}>
                        <Crown className="w-5 h-5" />
                    </div>
                    <span className="font-black text-gray-900 dark:text-white text-lg">ADS Premium</span>
                </div>
                <span className="text-[#1E5BFF] dark:text-purple-400 font-black bg-blue-500/10 px-3 py-1 rounded-lg text-xs border border-blue-500/20">
                  R$ 3,90/dia
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed font-medium pl-[52px]">
                Prioridade máxima, banner na home e destaque em todas as categorias.
              </p>
            </button>
          </div>
        )}

        {/* PASSO 2: DADOS DA CAMPANHA */}
        {createStep === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300 w-full">
            <div className="bg-gray-50 dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-white/5 flex justify-between items-center w-full">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Plano Selecionado</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white uppercase">{newCampaignType === 'local' ? 'ADS Básico' : 'ADS Premium'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Valor por dia</p>
                <p className="text-sm font-bold text-[#1E5BFF] dark:text-purple-400">R$ {currentPrice.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>

            <div className="w-full">
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Nome da Campanha</label>
              <input 
                  type="text"
                  placeholder="Ex: Promoção de Verão"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/5 rounded-2xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#1E5BFF] transition-all placeholder-gray-400 dark:placeholder-slate-700 font-bold"
              />
            </div>

            {/* SLIDER DE DURAÇÃO - STEP DE 5 DIAS */}
            <div className="bg-gray-50 dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 w-full relative overflow-visible">
              <div className="flex justify-between items-center mb-6 relative z-10">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Duração da campanha
                </label>
                <span className="text-xl font-black text-[#1E5BFF] dark:text-purple-500 px-4 py-1.5 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-inner">
                  {displayDuration} dias
                </span>
              </div>
              
              <div className="px-2 relative mb-10">
                <div className="absolute left-2 right-2 h-2 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden pointer-events-none">
                    <div 
                        className="h-full bg-gradient-to-r from-[#1E5BFF] to-indigo-600 transition-none"
                        style={{ width: `${((duration - 15) / 165) * 100}%` }}
                    />
                </div>

                <div className="absolute left-2 right-2 h-1 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                    <div className="w-1.5 h-1.5 bg-white dark:bg-slate-600 rounded-full -translate-x-1/2 shadow-sm"></div>
                    <div className="w-1.5 h-1.5 bg-white dark:bg-slate-600 rounded-full translate-x-1/2 shadow-sm"></div>
                </div>
                
                <input 
                  type="range" 
                  min="15" 
                  max="180" 
                  step="5" 
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full h-10 opacity-0 relative z-20 cursor-pointer touch-none"
                />

                <div 
                    className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-30 transition-none"
                    style={{ left: `calc(${((duration - 15) / 165) * 100}% - 0px)` }}
                >
                    <div className="w-9 h-9 bg-white rounded-full shadow-[0_5px_15px_rgba(30,91,255,0.4)] border-[5px] border-[#1E5BFF] flex items-center justify-center transform -translate-x-1/2">
                        <div className="w-1 h-3 bg-[#1E5BFF]/30 rounded-full" />
                    </div>
                </div>
              </div>

              {/* BOTÕES DE SELEÇÃO RÁPIDA */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-widest text-center mb-2">Seleção rápida</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[15, 30, 60, 90, 180].map((val) => (
                    <button
                      key={val}
                      onClick={() => setDuration(val)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${
                        duration === val
                        ? 'bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-lg shadow-blue-500/20'
                        : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-white/5 hover:border-blue-300'
                      }`}
                    >
                      {val} dias
                    </button>
                  ))}
                </div>
              </div>
              
              <p className="text-center text-[9px] text-gray-400 dark:text-slate-500 font-bold mt-6 italic uppercase tracking-[0.2em] animate-pulse">
                Arraste o slider para ajuste fino (step 5d)
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-purple-600/20 dark:to-indigo-600/20 p-6 rounded-3xl flex justify-between items-center border border-blue-500/20 dark:border-white/10 shadow-sm w-full">
               <div>
                    <span className="text-[10px] font-black text-[#1E5BFF] dark:text-purple-300 uppercase tracking-widest block mb-1">Investimento Total Hoje</span>
                    <span className="text-xs text-gray-500 dark:text-slate-500 font-bold">Total: {displayDuration} dias × R$ {currentPrice.toFixed(2).replace('.', ',')}/dia</span>
               </div>
               <span className="text-2xl font-black text-gray-900 dark:text-white">R$ {totalCost.toFixed(2).replace('.', ',')}</span>
            </div>

            {/* BOTÃO PRIMÁRIO IN-PAGE PARA FINALIZAR */}
            <button 
              onClick={() => setCreateStep(3)}
              disabled={!isDataStepValid}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 mb-4 ${
                isDataStepValid 
                ? 'bg-[#1E5BFF] text-white active:scale-[0.98] shadow-blue-500/20' 
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              Finalizar campanha
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* PASSO 3: PAGAMENTO PRÉ-PAGO */}
        {createStep === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300 w-full">
            <div className="bg-gray-50 dark:bg-slate-900 p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E5BFF]/5 rounded-full blur-3xl"></div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2 font-display">
                    <ShieldCheck className="w-6 h-6 text-[#1E5BFF]" />
                    Resumo do Investimento
                </h3>
                
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl mb-6 border border-blue-100 dark:border-blue-800/40">
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard className="w-5 h-5 text-[#1E5BFF]" />
                    <p className="font-bold text-sm text-[#1E5BFF]">Cobrança única no cartão</p>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    Este é um plano <strong>pré-pago</strong>. Você paga hoje pelo período completo e sua loja fica em destaque imediatamente após o processamento.
                  </p>
                </div>

                <div className="space-y-4 mb-8 text-sm">
                    <div className="flex justify-between items-center border-b border-gray-200 dark:border-white/5 pb-4">
                        <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Plano</span>
                        <span className="font-black text-gray-900 dark:text-white uppercase tracking-wider">{newCampaignType === 'local' ? 'ADS BÁSICO' : 'ADS PREMIUM'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 dark:border-white/5 pb-4">
                        <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Período</span>
                        <span className="font-bold text-gray-900 dark:text-white">{displayDuration} dias</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Total à Pagar Hoje</span>
                        <span className="text-3xl font-black text-[#1E5BFF]">R$ {totalCost.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-3 text-gray-500 dark:text-gray-400">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <p className="text-[10px] font-medium leading-tight">Pagamento 100% seguro. Sem cobranças recorrentes surpresas.</p>
                </div>
            </div>

            {/* BOTÃO PRIMÁRIO IN-PAGE PARA FINALIZAR COMPRA */}
            <div className="space-y-3">
              <button 
                onClick={handleActivateCampaign}
                disabled={isActivating}
                className={`w-full py-4 rounded-2xl bg-[#1E5BFF] text-white font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50`}
              >
                {isActivating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Finalizar compra
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Pagamento único. Sem cobranças recorrentes.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER FIXO NAVEGAÇÃO */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl border-t border-gray-100 dark:border-white/5 z-30 flex gap-3 w-full max-w-md mx-auto">
        <button 
          onClick={() => createStep === 1 ? setView('list') : setCreateStep(prev => prev - 1)}
          className="flex-1 py-4 rounded-2xl border border-gray-200 dark:border-white/10 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all"
        >
          {createStep === 1 ? 'Cancelar' : 'Voltar'}
        </button>
        {createStep > 1 && (
          <button 
            onClick={() => {
              if (createStep === 2) {
                  if (isDataStepValid) setCreateStep(3);
                  else alert("Por favor, dê um nome para sua campanha.");
              } else if (createStep === 3) {
                  handleActivateCampaign();
              }
            }}
            disabled={isActivating || (createStep === 2 && !isDataStepValid)}
            className={`flex-[2] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.2em] py-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:grayscale`}
          >
            {isActivating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {createStep === 2 ? 'Finalizar campanha' : 'Finalizar compra'}
                <ChevronRight className="w-4 h-4" strokeWidth={3} />
              </>
            )}
          </button>
        )}
      </div>

      {/* OVERLAY DE ATIVAÇÃO */}
      {isActivating && (
        <div className="fixed inset-0 z-[100] bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-300">
            <div className="w-24 h-24 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 rounded-[2.5rem] border-4 border-purple-500/30 animate-ping"></div>
                <Rocket className="w-10 h-10 text-[#1E5BFF] animate-bounce" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 font-display">Processando Pagamento</h2>
            <p className="text-gray-500 dark:text-slate-500 text-sm max-w-[240px]">Confirmando sua campanha pré-paga de {displayDuration} dias...</p>
        </div>
      )}
    </div>
  );

  const DetailsView = () => {
    if (!selectedCampaign) return null;
    return (
      <div className="p-5 pb-32 animate-in slide-in-from-right duration-300 bg-white dark:bg-slate-950 min-h-screen transition-colors w-full">
        <div className="bg-gray-50 dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5 mb-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-1 font-display">{selectedCampaign.name}</h2>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{selectedCampaign.startDate} - {selectedCampaign.endDate}</p>
                </div>
                {renderStatusBadge(selectedCampaign.status)}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-inner">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Cliques</p>
                    <p className="text-2xl font-black text-blue-500">{selectedCampaign.metrics.clicks}</p>
                </div>
                <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-inner">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Impressões</p>
                    <p className="text-2xl font-black text-purple-600">{selectedCampaign.metrics.impressions}</p>
                </div>
            </div>
        </div>

        <h3 className="font-bold text-gray-900 dark:text-white mb-4 px-1 flex items-center gap-2 uppercase text-[10px] tracking-[0.2em] opacity-60">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-purple-400" /> Histórico Semanal
        </h3>
        <div className="bg-gray-50 dark:bg-slate-900 p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-end justify-between h-32 gap-3">
                {selectedCampaign.history.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2">
                        <div 
                            className="w-full bg-[#1E5BFF] rounded-t-lg transition-all duration-700 shadow-[0_0_10px_rgba(30,91,255,0.2)]"
                            style={{ height: `${val === 0 ? 5 : (val / 90) * 100}%`, opacity: 0.2 + (val / 90) }}
                        ></div>
                        <span className="text-[8px] text-slate-400 dark:text-slate-600 font-black uppercase tracking-tighter">{['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][i]}</span>
                    </div>
                ))}
            </div>
            <div className="mt-8 p-4 bg-white dark:bg-slate-950 rounded-2xl border border-gray-50 dark:border-white/5 text-center shadow-inner">
                <p className="text-[9px] text-gray-400 dark:text-slate-500 italic font-medium uppercase tracking-widest">As métricas são atualizadas a cada 60 min.</p>
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans flex flex-col transition-colors duration-300">
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-100 shrink-0">
        <button 
          onClick={view === 'list' ? onBack : () => setView('list')} 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white font-display tracking-tight">
          {view === 'list' ? 'Anúncios e Destaques' : view === 'create' ? 'Nova Campanha' : 'Detalhes do Anúncio'}
        </h1>
      </div>
      <div className="flex-1 flex flex-col w-full">
        {view === 'list' && <ListView />}
        {view === 'create' && <CreateView />}
        {view === 'details' && <DetailsView />}
      </div>
    </div>
  );
};
