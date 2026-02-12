
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
  { id: 'pay-02', date: '2024-03-15', product: 'Banners em Destaque', period: 'Mar/2024', value: 69.90, status: 'paid' }
];

const SummaryCard = ({ icon: Icon, label, value, sub, color }: any) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-blue-50 dark:border-gray-700 shadow-sm flex flex-col justify-between h-28">
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

export const StoreFinanceModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'resumo' | 'faturas' | 'assinaturas' | 'metodos'>('resumo');

  const tabs = [
    { id: 'resumo', label: 'Resumo' },
    { id: 'faturas', label: 'Faturas' },
    { id: 'assinaturas', label: 'Assinaturas' },
    { id: 'metodos', label: 'Pagamento' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FF] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-300">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-blue-100 dark:border-gray-800 shadow-sm">
        <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 active:scale-90 transition-all">
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Pagamentos</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Gestão financeira</p>
        </div>
      </header>

      <main className="p-6 space-y-8 max-w-md mx-auto">
        <section className="grid grid-cols-3 gap-3">
          <SummaryCard icon={DollarSign} label="Pago no Mês" value="R$ 1.117,10" color="bg-emerald-500" />
          <SummaryCard icon={Calendar} label="Próxima Fatura" value="10 Abr" sub="R$ 1.000,00" color="bg-blue-600" />
          <SummaryCard icon={LayoutGrid} label="Assinaturas" value="2 Ativas" color="bg-purple-600" />
        </section>

        <div className="flex bg-blue-100/50 dark:bg-gray-900 p-1 rounded-2xl border border-blue-100/50 dark:border-gray-800">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-2 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white dark:bg-gray-800 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-blue-50 dark:border-gray-800 shadow-sm p-8 text-center">
            <p className="text-gray-400 font-bold text-sm">Seu extrato detalhado aparecerá aqui.</p>
        </div>
      </main>
    </div>
  );
};
