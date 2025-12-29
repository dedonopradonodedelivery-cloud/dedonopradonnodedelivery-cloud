
import React, { useState } from 'react';
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
  Users,
  Target
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
  status: 'active' | 'paused' | 'ended';
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

// Mock Data - Simulação de campanha ativa para exibir o painel de métricas
// Se o array estiver vazio [], exibirá apenas a tela educativa inicial
const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'Campanha de Verão',
    type: 'premium',
    status: 'active',
    startDate: '01/03/2024',
    endDate: '31/03/2024',
    budget: 120.90,
    metrics: { impressions: 4850, clicks: 124, ctr: 2.5, reach: 3200 },
    history: [45, 60, 55, 80, 70, 90, 50]
  }
];

const STORE_BALANCE = 45.00; 

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack }) => {
  const [view, setView] = useState<ViewState>('list');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  
  const [createStep, setCreateStep] = useState(1);
  const [newCampaignType, setNewCampaignType] = useState<AdType>('local');
  
  const [campaignName, setCampaignName] = useState('');
  const [duration, setDuration] = useState(7);

  const getPricePerDay = (type: AdType) => type === 'local' ? 0.89 : 3.90;
  const totalCost = getPricePerDay(newCampaignType) * duration;
  const hasSufficientBalance = STORE_BALANCE >= totalCost;

  const handleCreateClick = () => {
    setCreateStep(1);
    setCampaignName('');
    setDuration(7);
    setView('create');
  };

  const renderStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      ended: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    const labels = { active: 'Ativa', paused: 'Pausada', ended: 'Encerrada' };
    return (
      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const ListView = () => (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-950">
      <div className="p-5 pb-32 w-full max-w-md mx-auto space-y-6">
        
        {/* Banner Principal (Sempre Visível) */}
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
                onClick={handleCreateClick}
                className="w-full bg-white text-purple-700 font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <Plus className="w-5 h-5" strokeWidth={3} />
                CRIAR PRIMEIRA CAMPANHA
              </button>
          </div>
        </div>

        {/* Painel de Métricas (Visível apenas se houver campanhas ativas) */}
        {campaigns.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-1">
              Desempenho da Campanha
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-900 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Visualizações</span>
                </div>
                <p className="text-xl font-black text-white">{campaigns[0].metrics.impressions.toLocaleString()}</p>
              </div>
              
              <div className="bg-slate-900 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <MousePointer className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Cliques no Perfil</span>
                </div>
                <p className="text-xl font-black text-white">{campaigns[0].metrics.clicks}</p>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Target className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Alcance Patrocinado</span>
                </div>
                <p className="text-xl font-black text-white">{campaigns[0].metrics.reach.toLocaleString()}</p>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Status</span>
                </div>
                <div className="mt-1">{renderStatusBadge(campaigns[0].status)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Minhas Campanhas</h3>
              <span className="text-[10px] text-purple-400 font-black bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                  Saldo: R$ {STORE_BALANCE.toFixed(2).replace('.', ',')}
              </span>
            </div>
            
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <div 
                  key={campaign.id}
                  onClick={() => { setSelectedCampaign(campaign); setView('details'); }}
                  className="bg-slate-900 p-4 rounded-2xl shadow-sm border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group active:scale-[0.99] flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-sm truncate">{campaign.name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight mt-0.5">
                        {campaign.type === 'premium' ? 'ADS Premium' : 'ADS Básico'}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors" />
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
    <div className="p-5 pb-40 bg-slate-950 min-h-screen">
      <div className="flex justify-between mb-8 px-4 relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-800 -z-10 mx-8"></div>
        {[1, 2, 3].map(step => (
          <div key={step} className="flex flex-col items-center gap-2 bg-slate-950 px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors shadow-sm ${
              createStep >= step ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-500 border border-white/5'
            }`}>
              {step}
            </div>
            <span className={`text-[10px] font-bold ${createStep >= step ? 'text-purple-600' : 'text-slate-500'}`}>
              {step === 1 ? 'Plano' : step === 2 ? 'Dados' : 'Pagar'}
            </span>
          </div>
        ))}
      </div>

      {createStep === 1 && (
        <div className="space-y-4 animate-in slide-in-from-right duration-300">
          <h3 className="text-xl font-bold text-white mb-2 text-center font-display">Escolha sua visibilidade</h3>
          
          <button 
            onClick={() => setNewCampaignType('local')}
            className={`w-full p-6 rounded-3xl border-2 text-left transition-all ${
              newCampaignType === 'local' 
                ? 'border-purple-600 bg-purple-600/10' 
                : 'border-white/5 bg-slate-900'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-black text-white text-lg">ADS Básico</span>
              <span className="text-purple-400 font-black bg-purple-500/10 px-3 py-1 rounded-lg text-xs border border-purple-500/20">
                R$ 0,89/dia
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Destaque sua loja nas listas de categoria e nos resultados de busca local da freguesia.
            </p>
          </button>

          <button 
            onClick={() => setNewCampaignType('premium')}
            className={`w-full p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden ${
              newCampaignType === 'premium' 
                ? 'border-purple-600 bg-purple-600/10' 
                : 'border-white/5 bg-slate-900'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-black text-white text-lg">ADS Premium</span>
              <span className="text-purple-400 font-black bg-purple-500/10 px-3 py-1 rounded-lg text-xs border border-purple-500/20">
                R$ 3,90/dia
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Inclui todos os benefícios do ADS Básico, além de aparição cruzada em todas as categorias, prioridade máxima nos resultados e destaque no banner rotativo da Home.
            </p>
          </button>
        </div>
      )}

      {createStep === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Nome da Campanha</label>
            <input 
                type="text"
                placeholder="Ex: Promoção de Inverno"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-4 text-white outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-end mb-4">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Duração (dias)</label>
                <span className="text-xl font-black text-purple-500">{duration} dias</span>
            </div>
            <input 
                type="range" min="7" max="90" step="1" value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          <div className="bg-purple-600/10 p-6 rounded-2xl flex justify-between items-center border border-purple-500/20">
             <span className="text-sm font-bold text-slate-300">Investimento Total</span>
             <span className="text-2xl font-black text-purple-400">R$ {totalCost.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      )}

      {createStep === 3 && (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
          <div className="bg-slate-900 p-6 rounded-3xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-6">Revisão do Pedido</h3>
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Duração</span>
                    <span className="font-bold text-white">{duration} dias</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Plano</span>
                    <span className="font-bold text-white">{newCampaignType === 'local' ? 'ADS BÁSICO' : 'ADS PREMIUM'}</span>
                </div>
                <div className="border-t border-white/5 my-2"></div>
                <div className="flex justify-between text-base">
                    <span className="font-bold text-slate-300">Valor Final</span>
                    <span className="font-black text-purple-500 text-lg">R$ {totalCost.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>

            <div className={`p-4 rounded-xl border ${hasSufficientBalance ? 'bg-green-500/10 border-green-500/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
                <div className="flex items-center gap-2 mb-1 text-sm font-bold text-white">
                    <Wallet className="w-4 h-4 text-purple-400" /> {hasSufficientBalance ? 'Pagar com Saldo' : 'Pagar com Pix'}
                </div>
                <p className="text-xs text-slate-400 font-medium">
                    {hasSufficientBalance 
                        ? 'O valor será debitado do seu saldo atual da loja.' 
                        : 'Saldo insuficiente. Gere um código Pix para ativar agora.'}
                </p>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-slate-950 border-t border-white/5 z-30 flex gap-3 max-w-md mx-auto">
        <button 
          onClick={() => createStep === 1 ? setView('list') : setCreateStep(prev => prev - 1)}
          className="flex-1 py-4 rounded-2xl border border-white/5 text-slate-400 font-bold text-sm"
        >
          {createStep === 1 ? 'Cancelar' : 'Voltar'}
        </button>
        <button 
          onClick={() => createStep < 3 ? setCreateStep(prev => prev + 1) : setView('list')}
          className="flex-[2] bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {createStep === 3 ? 'Confirmar e Ativar' : 'Continuar'}
          {createStep < 3 && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  const DetailsView = () => {
    if (!selectedCampaign) return null;
    return (
      <div className="p-5 pb-32 animate-in slide-in-from-right duration-300 bg-slate-950 min-h-screen">
        <div className="bg-slate-900 rounded-3xl p-6 shadow-sm border border-white/5 mb-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-bold text-white">{selectedCampaign.name}</h2>
                    <p className="text-xs text-slate-500 mt-1">{selectedCampaign.startDate} - {selectedCampaign.endDate}</p>
                </div>
                {renderStatusBadge(selectedCampaign.status)}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Cliques</p>
                    <p className="text-2xl font-black text-[#1E5BFF]">{selectedCampaign.metrics.clicks}</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">CTR Médio</p>
                    <p className="text-2xl font-black text-purple-600">{selectedCampaign.metrics.ctr}%</p>
                </div>
            </div>
        </div>

        <h3 className="font-bold text-white mb-4 px-1 flex items-center gap-2 uppercase text-xs tracking-widest">
            <TrendingUp className="w-4 h-4 text-[#1E5BFF]" /> Desempenho Diário
        </h3>
        <div className="bg-slate-900 p-6 rounded-3xl border border-white/5">
            <div className="flex items-end justify-between h-32 gap-3">
                {selectedCampaign.history.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2">
                        <div 
                            className="w-full bg-[#1E5BFF] rounded-t-lg transition-all duration-700"
                            style={{ height: `${(val / 90) * 100}%`, opacity: 0.2 + (val / 90) }}
                        ></div>
                        <span className="text-[10px] text-slate-600 font-bold uppercase">{['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][i]}</span>
                    </div>
                ))}
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
