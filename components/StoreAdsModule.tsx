
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Megaphone, 
  Plus, 
  Calendar, 
  MousePointer, 
  Eye, 
  ShoppingBag, 
  PauseCircle, 
  PlayCircle, 
  CheckCircle2,
  TrendingUp,
  Target,
  Rocket,
  Wallet,
  QrCode,
  FileText,
  AlertCircle
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
    orders: number;
    cpa: number;
  };
  history: number[]; 
}

// Mock Data - Simulando sem campanhas para mostrar onboarding primeiro
// Mude para o array abaixo para testar lista ativa
const MOCK_CAMPAIGNS: Campaign[] = []; 

const STORE_BALANCE = 45.00; 

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack }) => {
  const [view, setView] = useState<ViewState>('list');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  
  const [createStep, setCreateStep] = useState(1);
  const [newCampaignType, setNewCampaignType] = useState<AdType>('local');
  
  const [campaignName, setCampaignName] = useState('');
  const [campaignDesc, setCampaignDesc] = useState('');
  const [duration, setDuration] = useState(7);

  const getPricePerDay = (type: AdType) => type === 'local' ? 1.90 : 3.90;
  const totalCost = getPricePerDay(newCampaignType) * duration;
  const hasSufficientBalance = STORE_BALANCE >= totalCost;

  const handleCreateClick = () => {
    setCreateStep(1);
    setCampaignName('');
    setCampaignDesc('');
    setDuration(7);
    setView('create');
  };

  const handleCampaignClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setView('details');
  };

  const renderStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-200',
      paused: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      ended: 'bg-gray-100 text-gray-600 border-gray-200'
    };
    const labels = { active: 'Ativa', paused: 'Pausada', ended: 'Encerrada' };
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const ListView = () => (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="p-5 pb-32 w-full max-w-md mx-auto space-y-6">
        
        {/* Onboarding / Highlight Card */}
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
                className="w-full bg-white text-purple-700 font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-yellow-400 hover:text-black"
              >
                <Plus className="w-5 h-5" strokeWidth={3} />
                CRIAR PRIMEIRA CAMPANHA
              </button>
          </div>
        </div>

        {campaigns.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom duration-500">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="font-bold text-gray-900 dark:text-white uppercase text-xs tracking-widest">Minhas Campanhas</h3>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-black bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full border border-purple-100 dark:border-purple-800">
                  Saldo: R$ {STORE_BALANCE.toFixed(2).replace('.', ',')}
              </span>
            </div>
            
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div 
                  key={campaign.id}
                  onClick={() => handleCampaignClick(campaign)}
                  className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-900 transition-all cursor-pointer group active:scale-[0.99]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-base leading-tight group-hover:text-purple-600 transition-colors">{campaign.name}</h4>
                      <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-tighter">
                          {campaign.type === 'premium' ? 'Destaque Premium' : 'ADS Local Freguesia'}
                      </p>
                    </div>
                    {renderStatusBadge(campaign.status)}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
                      <div className="flex gap-6">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                              <Eye className="w-4 h-4 text-purple-400" />
                              {campaign.metrics.impressions.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                              <MousePointer className="w-4 h-4 text-blue-400" />
                              {campaign.metrics.clicks}
                          </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center opacity-40 grayscale">
              <Megaphone className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest leading-none">Comece a Anunciar</p>
              <p className="text-xs text-gray-400 mt-2">Suas campanhas aparecerão aqui.</p>
          </div>
        )}
      </div>
    </div>
  );

  const CreateView = () => (
    <div className="p-5 pb-40 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="flex justify-between mb-8 px-4 relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-10 mx-8"></div>
        {[1, 2, 3].map(step => (
          <div key={step} className="flex flex-col items-center gap-2 bg-gray-50 dark:bg-gray-950 px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors shadow-sm ${
              createStep >= step ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700'
            }`}>
              {step}
            </div>
            <span className={`text-[10px] font-bold ${createStep >= step ? 'text-purple-600' : 'text-gray-400'}`}>
              {step === 1 ? 'Plano' : step === 2 ? 'Dados' : 'Pagar'}
            </span>
          </div>
        ))}
      </div>

      {createStep === 1 && (
        <div className="space-y-4 animate-in slide-in-from-right duration-300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center font-display">Escolha sua visibilidade</h3>
          
          <button 
            onClick={() => setNewCampaignType('local')}
            className={`w-full p-5 rounded-3xl border-2 text-left transition-all ${
              newCampaignType === 'local' 
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' 
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-gray-900 dark:text-white text-lg">ADS Local</span>
              <span className="text-purple-700 dark:text-purple-300 font-bold bg-purple-100 dark:bg-purple-900/40 px-3 py-1 rounded-lg text-xs">
                R$ 1,90/dia
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Destaque nas listas de categoria e resultados de busca local na Freguesia.
            </p>
          </button>

          <button 
            onClick={() => setNewCampaignType('premium')}
            className={`w-full p-5 rounded-3xl border-2 text-left transition-all relative overflow-hidden ${
              newCampaignType === 'premium' 
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' 
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-gray-900 dark:text-white text-lg">ADS Premium</span>
              <span className="text-purple-700 dark:text-purple-300 font-bold bg-purple-100 dark:bg-purple-900/40 px-3 py-1 rounded-lg text-xs">
                R$ 3,90/dia
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Banner rotativo na Home, prioridade máxima e badge especial de patrocínio.
            </p>
          </button>
        </div>
      )}

      {createStep === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 ml-1">Nome da Campanha</label>
            <input 
                type="text"
                placeholder="Ex: Promoção de Natal"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-end mb-4">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Duração (dias)</label>
                <span className="text-xl font-black text-purple-600">{duration} dias</span>
            </div>
            <input 
                type="range" min="7" max="90" step="1" value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-2xl flex justify-between items-center border border-purple-100 dark:border-purple-800/30">
             <span className="text-sm font-bold text-gray-600 dark:text-purple-200">Investimento Estimado</span>
             <span className="text-2xl font-black text-purple-700 dark:text-purple-300">R$ {totalCost.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      )}

      {createStep === 3 && (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Revisão do Pedido</h3>
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duração</span>
                    <span className="font-bold text-gray-900 dark:text-white">{duration} dias</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Plano</span>
                    <span className="font-bold text-gray-900 dark:text-white">{newCampaignType.toUpperCase()}</span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>
                <div className="flex justify-between text-base">
                    <span className="font-bold text-gray-900 dark:text-white">Valor Final</span>
                    <span className="font-black text-purple-600 text-lg">R$ {totalCost.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>

            <div className={`p-4 rounded-xl border ${hasSufficientBalance ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                <div className="flex items-center gap-2 mb-1 text-sm font-bold">
                    <Wallet className="w-4 h-4" /> {hasSufficientBalance ? 'Pagar com Saldo' : 'Pagar com Pix'}
                </div>
                <p className="text-xs opacity-70">
                    {hasSufficientBalance 
                        ? 'O valor será debitado do seu saldo atual da loja.' 
                        : 'Saldo insuficiente. Gere um código Pix para ativar agora.'}
                </p>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-30 flex gap-3 max-w-md mx-auto">
        <button 
          onClick={() => createStep === 1 ? setView('list') : setCreateStep(prev => prev - 1)}
          className="flex-1 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm"
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
      <div className="p-5 pb-32 animate-in slide-in-from-right duration-300 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedCampaign.name}</h2>
                    <p className="text-xs text-gray-500 mt-1">{selectedCampaign.startDate} - {selectedCampaign.endDate}</p>
                </div>
                {renderStatusBadge(selectedCampaign.status)}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Cliques</p>
                    <p className="text-2xl font-black text-[#1E5BFF]">{selectedCampaign.metrics.clicks}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">CTR Médio</p>
                    <p className="text-2xl font-black text-purple-600">{selectedCampaign.metrics.ctr}%</p>
                </div>
            </div>
        </div>

        <h3 className="font-bold text-gray-900 dark:text-white mb-4 px-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#1E5BFF]" /> Desempenho Diário
        </h3>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-end justify-between h-32 gap-3">
                {selectedCampaign.history.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2">
                        <div 
                            className="w-full bg-[#1E5BFF] rounded-t-lg transition-all duration-700"
                            style={{ height: `${(val / 90) * 100}%`, opacity: 0.2 + (val / 90) }}
                        ></div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][i]}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans flex flex-col">
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button 
          onClick={view === 'list' ? onBack : () => setView('list')} 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">
          {view === 'list' ? 'Anúncios e Destaques' : view === 'create' ? 'Nova Campanha' : 'Detalhes do Anúncio'}
        </h1>
      </div>
      <div className="flex-1 flex flex-col w-full bg-gray-50 dark:bg-gray-950">
        {view === 'list' && <ListView />}
        {view === 'create' && <CreateView />}
        {view === 'details' && <DetailsView />}
      </div>
    </div>
  );
};
