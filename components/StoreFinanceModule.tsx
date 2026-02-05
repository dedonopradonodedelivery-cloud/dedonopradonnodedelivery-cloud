
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Receipt, 
  Calendar, 
  ShieldCheck, 
  Download, 
  ChevronRight, 
  CheckCircle2, 
  LayoutGrid,
  Home,
  Crown,
  ShoppingBag,
  Zap,
  X,
  DollarSign,
  PieChart
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_PAYMENTS = [
  { id: 'pay-01', date: '2024-03-22', product: 'Lead de Serviço (Elétrica)', period: 'Avulso', value: 5.90, status: 'paid' },
  { id: 'pay-02', date: '2024-03-15', product: 'Banners em Destaque', period: 'Mar/2024', value: 69.90, status: 'paid' },
  { id: 'pay-03', date: '2024-03-05', product: 'Assinatura Master', period: 'Mar/2024', value: 1000.00, status: 'paid' },
  { id: 'pay-04', date: '2024-03-02', product: 'Lead de Serviço (Pintura)', period: 'Avulso', value: 5.90, status: 'paid' },
  { id: 'pay-05', date: '2024-02-28', product: 'Lead de Serviço (Pintura)', period: 'Avulso', value: 5.90, status: 'cancelled' },
];

const MOCK_INVOICES = [
  { id: 'FAT-2024-03', period: 'Março/2024', due: '2024-03-10', value: 1075.80, status: 'paid', paidAt: '2024-03-05', method: 'PIX Automatizado' },
  { id: 'FAT-2024-02', period: 'Fevereiro/2024', due: '2024-02-10', value: 1085.60, status: 'paid', paidAt: '2024-02-08', method: 'Cartão de Crédito' },
  { id: 'FAT-2024-01', period: 'Janeiro/2024', due: '2024-01-10', value: 1120.00, status: 'expired', paidAt: null, method: 'PIX' },
];

const SummaryCard = ({ icon: Icon, label, value, sub, color }: any) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between h-28">
    <div className={`w-8 h-8 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center`}>
      <Icon size={16} className={color.replace('bg-', 'text-')} />
    </div>
    <div>
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-sm font-black text-gray-900 dark:text-white leading-tight">{value}</p>
      {sub && <p className="text-[8px] text-gray-400 font-bold mt-1">{sub}</p>}
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const config: any = {
    paid: { label: 'Pago', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    pending: { label: 'Pendente', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    cancelled: { label: 'Cancelado', color: 'bg-gray-100 text-gray-400 border-gray-200' },
    expired: { label: 'Em atraso', color: 'bg-red-50 text-red-500 border-red-100' },
    waiting: { label: 'Aguardando', color: 'bg-blue-50 text-blue-500 border-blue-100' },
  };
  const item = config[status] || config.pending;
  return (
    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${item.color}`}>
      {item.label}
    </span>
  );
};

export const StoreFinanceModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'resumo' | 'faturas' | 'assinaturas' | 'metodos'>('resumo');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const tabs = [
    { id: 'resumo', label: 'Resumo' },
    { id: 'faturas', label: 'Faturas' },
    { id: 'assinaturas', label: 'Assinaturas' },
    { id: 'metodos', label: 'Pagamento' },
  ];

  const renderResumo = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2 mb-4">Detalhamento do Mês</h3>
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
          {[
            { label: 'Banners em Destaque', value: 69.90, icon: LayoutGrid, color: 'text-purple-500' },
            { label: 'Patrocinador Master', value: 1000.00, icon: Crown, color: 'text-amber-500' },
            { label: 'Leads de Serviço (8 unid.)', value: 47.20, icon: ShoppingBag, color: 'text-emerald-500' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-5 border-b last:border-b-0 border-gray-50 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{item.label}</span>
              </div>
              <span className="text-sm font-black text-gray-900 dark:text-white">R$ {item.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderAssinaturas = () => (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Assinaturas Ativas</h3>
      
      <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 flex items-center justify-center text-amber-400">
            <Crown size={24} />
          </div>
          <div>
            <h4 className="font-black text-lg uppercase tracking-tight leading-none">Patrocinador Master</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Status: Ativo</span>
            </div>
          </div>
        </div>
        <div className="space-y-4 mb-8">
          <div className="flex justify-between"><span className="text-slate-400 text-xs font-medium">Contratação</span><span className="font-bold text-xs">Mar/24 - Mai/24</span></div>
          <div className="flex justify-between"><span className="text-slate-400 text-xs font-medium">Valor Mensal</span><span className="font-black text-sm text-amber-400">R$ 1.000,00</span></div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-blue-900/20 flex items-center justify-center text-purple-600">
            <LayoutGrid size={22} />
          </div>
          <h4 className="font-bold text-gray-900 dark:text-white">Banners em Destaque</h4>
        </div>
        <div className="flex justify-between items-center py-2">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Freguesia</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Vigência: Mar/24</span>
            </div>
            <span className="text-sm font-black text-gray-900 dark:text-white">R$ 69,90</span>
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-300">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 active:scale-90 transition-all">
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Pagamentos</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Gestão financeira do seu negócio</p>
        </div>
      </header>

      <main className="p-6 space-y-8 max-w-md mx-auto">
        <section className="grid grid-cols-3 gap-3">
          <SummaryCard icon={DollarSign} label="Pago no Mês" value="R$ 1.117,10" color="bg-emerald-500" />
          <SummaryCard icon={Calendar} label="Próxima Fatura" value="10 de Abr" sub="R$ 1.000,00" color="bg-blue-600" />
          <SummaryCard icon={LayoutGrid} label="Assinaturas" value="2 Ativas" color="bg-purple-600" />
        </section>

        <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white dark:bg-gray-800 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'resumo' && renderResumo()}
        {activeTab === 'faturas' && (
          <div className="space-y-4">
            {MOCK_INVOICES.map((fat, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{fat.id}</p>
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">{fat.period}</h4>
                  </div>
                  <StatusBadge status={fat.status} />
                </div>
                <div className="flex justify-between items-end">
                   <p className="text-xl font-black text-[#1E5BFF]">R$ {fat.value.toFixed(2)}</p>
                   <button className="text-xs font-bold text-blue-500 underline">Recibo</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'assinaturas' && renderAssinaturas()}
        {activeTab === 'metodos' && (
           <div className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
              <ShieldCheck className="text-emerald-500" />
              <p className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tight">PIX Automatizado Ativo</p>
           </div>
        )}
      </main>
    </div>
  );
};
