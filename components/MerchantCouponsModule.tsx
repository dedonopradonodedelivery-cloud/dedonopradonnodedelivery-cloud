import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Ticket, 
  CheckCircle2, 
  Clock, 
  X, 
  Save, 
  PauseCircle, 
  PlayCircle,
  TrendingUp,
  Users,
  Check,
  AlertCircle,
  BarChart3,
  Calendar,
  ChevronRight
} from 'lucide-react';

interface CouponMovement {
  id: string;
  userId: string;
  date: string;
  status: 'resgatado' | 'utilizado' | 'expirado' | 'cancelado';
  validity: string;
}

const MOCK_MOVEMENTS: CouponMovement[] = [
  { id: '1', userId: 'Marcos S.', date: 'Hoje, 10:45', status: 'resgatado', validity: 'Válido até 25/11' },
  { id: '2', userId: 'Ana P.', date: 'Hoje, 09:20', status: 'utilizado', validity: 'Válido até 25/11' },
  { id: '3', userId: 'Lucas B.', date: 'Ontem, 18:30', status: 'resgatado', validity: 'Válido até 24/11' },
  { id: '4', userId: 'Carla D.', date: 'Ontem, 14:15', status: 'expirado', validity: 'Vencido em 20/11' },
  { id: '5', userId: 'João R.', date: '19 Nov, 11:00', status: 'utilizado', validity: 'Vencido em 19/11' },
];

export const MerchantCouponsModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [hasOptedIn, setHasOptedIn] = useState(false);
  const [movements, setMovements] = useState<CouponMovement[]>(MOCK_MOVEMENTS);
  const [confirmModal, setConfirmModal] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Configuração do Cupom
  const [config, setConfig] = useState({
    title: 'Desconto de Inauguração',
    description: 'Aproveite nosso desconto exclusivo para moradores do bairro.',
    type: 'percentage' as 'percentage' | 'fixed' | 'gift',
    value: '20',
    code: 'BEMVINDO20',
    validity: '30',
    quantity: '100',
    rules: 'Válido apenas para consumo no local.'
  });

  const stats = useMemo(() => {
    return {
      resgatados: movements.length,
      utilizados: movements.filter(m => m.status === 'utilizado').length,
      pendentes: movements.filter(m => m.status === 'resgatado').length,
      taxaUso: ((movements.filter(m => m.status === 'utilizado').length / movements.length) * 100).toFixed(0)
    };
  }, [movements]);

  const handleMarkAsUsed = (id: string) => {
    setMovements(prev => prev.map(m => 
      m.id === id ? { ...m, status: 'utilizado' as const } : m
    ));
    setConfirmModal(null);
  };

  if (!hasOptedIn) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 font-sans animate-in fade-in duration-300 flex flex-col">
        <header className="px-5 h-20 flex items-center gap-4 shrink-0 border-b border-gray-100 dark:border-gray-800">
          <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl active:scale-90 transition-all">
            <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter">Gestão de Cupons</h1>
        </header>

        <main className="flex-1 p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] flex items-center justify-center mb-8 text-[#1E5BFF] shadow-xl shadow-blue-500/10">
            <Ticket size={48} />
          </div>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight mb-4 uppercase tracking-tighter">
            Cupom da Semana
          </h1>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-10">
            Participe do Cupom da Semana para atrair moradores e aumentar recorrência. 
            Os usuários desbloqueiam cupons ao longo da semana e usam na sua loja.
          </p>

          <div className="w-full space-y-4 mb-12">
            <div className="flex items-center gap-3 text-left">
              <div className="p-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg"><Check size={16} /></div>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tight">Mais visitas e recorrência</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="p-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg"><Check size={16} /></div>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tight">Você define oferta e validade</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="p-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg"><Check size={16} /></div>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tight">Controle de resgates e uso</span>
            </div>
          </div>

          <button 
            onClick={() => setHasOptedIn(true)}
            className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 active:scale-95 transition-all uppercase tracking-widest text-sm"
          >
            Ativar participação
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-300">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 transition-all active:scale-90">
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Gestão de Cupons</h1>
          <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">Participação Ativa</p>
        </div>
        <button onClick={() => setHasOptedIn(false)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
          <PauseCircle size={22} />
        </button>
      </header>

      <main className="p-6 space-y-8 max-w-md mx-auto">
        
        {/* BLOCO 1: STATUS */}
        <section className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Participação ativa</p>
              <p className="text-[10px] text-gray-500 uppercase font-medium">Sua loja está participando do Cupom da Semana</p>
            </div>
          </div>
        </section>

        {/* BLOCO 2: CONFIGURAÇÃO */}
        <section className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Configuração do Cupom</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1">Título do cupom</label>
              <input 
                type="text" 
                value={config.title}
                onChange={e => setConfig({...config, title: e.target.value})}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-bold dark:text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1">Descrição</label>
              <textarea 
                value={config.description}
                onChange={e => setConfig({...config, description: e.target.value})}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-medium dark:text-white resize-none h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1">Tipo</label>
                <select 
                  value={config.type}
                  onChange={e => setConfig({...config, type: e.target.value as any})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-bold dark:text-white"
                >
                  <option value="percentage">% desconto</option>
                  <option value="fixed">R$ desconto</option>
                  <option value="gift">brinde</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1">Valor</label>
                <input 
                  type="text" 
                  value={config.value}
                  onChange={e => setConfig({...config, value: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-bold dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1">Validade (dias)</label>
                <input 
                  type="number" 
                  value={config.validity}
                  onChange={e => setConfig({...config, validity: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-bold dark:text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1">Código (opcional)</label>
                <input 
                  type="text" 
                  value={config.code}
                  onChange={e => setConfig({...config, code: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-bold dark:text-white uppercase"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1">Regras de uso</label>
              <input 
                type="text" 
                value={config.rules}
                onChange={e => setConfig({...config, rules: e.target.value})}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-medium dark:text-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-500 font-bold py-4 rounded-2xl text-xs uppercase tracking-widest">Pausar cupom</button>
              <button className="flex-[2] bg-[#1E5BFF] text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20">Salvar cupom</button>
            </div>
          </div>
        </section>

        {/* BLOCO 3: MOVIMENTAÇÃO */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Movimentação</h2>
            <button className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest">Ver Tudo</button>
          </div>

          <div className="grid grid-cols-3 gap-3">
             <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Resgatados</p>
                <p className="text-xl font-black text-gray-900 dark:text-white">{stats.resgatados}</p>
             </div>
             <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Utilizados</p>
                <p className="text-xl font-black text-emerald-500">{stats.utilizados}</p>
             </div>
             <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Pendentes</p>
                <p className="text-xl font-black text-blue-500">{stats.pendentes}</p>
             </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            {movements.map((m, idx) => (
              <div key={m.id} className={`p-5 flex items-center justify-between transition-colors ${idx !== movements.length - 1 ? 'border-b border-gray-50 dark:border-gray-800' : ''}`}>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900 dark:text-white truncate">{m.userId}</span>
                    {m.status === 'resgatado' && <span className="bg-blue-50 text-blue-600 text-[8px] font-black uppercase px-1.5 py-0.5 rounded">Resgatado</span>}
                    {m.status === 'utilizado' && <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase px-1.5 py-0.5 rounded">Utilizado</span>}
                    {m.status === 'expirado' && <span className="bg-gray-50 text-gray-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded">Expirado</span>}
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">{m.date} • {m.validity}</p>
                </div>
                {m.status === 'resgatado' && (
                  <button 
                    onClick={() => setConfirmModal(m.id)}
                    className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 active:scale-95 transition-all"
                    title="Marcar como utilizado"
                  >
                    <Check size={18} strokeWidth={3} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* BLOCO 4: RELATÓRIO RÁPIDO */}
        <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-[2.5rem] space-y-4">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Relatório Rápido</h2>
            <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">Resgates nos últimos 7 dias:</span>
                    <span className="font-bold text-gray-900 dark:text-white">12</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">Taxa de uso (Conversão):</span>
                    <span className="font-bold text-emerald-500">{stats.taxaUso}%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">Cupom mais resgatado:</span>
                    <span className="font-bold text-[#1E5BFF]">Desconto Inauguração</span>
                </div>
            </div>
        </section>
      </main>

      {/* MODAL DE CONFIRMAÇÃO */}
      {confirmModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-[#1E5BFF] mx-auto">
                    <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4 uppercase tracking-tighter">Confirmar utilização?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8 leading-relaxed font-medium">
                    Confirmar a utilização deste cupom pelo cliente? Esta ação não pode ser desfeita.
                </p>
                <div className="space-y-3">
                    <button 
                        onClick={() => handleMarkAsUsed(confirmModal)}
                        className="w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-xs uppercase tracking-widest"
                    >
                        Confirmar utilização
                    </button>
                    <button 
                        onClick={() => setConfirmModal(null)}
                        className="w-full py-4 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-gray-600 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};