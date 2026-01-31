import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  DollarSign, 
  Receipt, 
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  Home,
  LayoutGrid,
  Zap,
  Megaphone,
  Palette,
  Download,
  X,
  CreditCard,
  Filter
} from 'lucide-react';

// --- TIPOS E DADOS MOCKADOS ---

type PaymentStatus = 'paid' | 'pending' | 'failed';
type ProductType = 'banner_home' | 'banner_category' | 'banner_combo' | 'ads' | 'art';

interface Payment {
  id: string;
  product_type: ProductType;
  product_description: string;
  date: string;
  payment_method: 'PIX' | 'Crédito' | 'Débito';
  amount: number;
  status: PaymentStatus;
  reference: string;
  installments?: number;
}

const MOCK_PAYMENTS: Payment[] = [
  { id: 'pay_1', product_type: 'banner_home', product_description: 'Banner Home — Freguesia', date: new Date().toISOString(), payment_method: 'PIX', amount: 49.90, status: 'paid', reference: 'Anúncio (30 dias)' },
  { id: 'pay_2', product_type: 'ads', product_description: 'ADS Patrocinado (14 dias)', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), payment_method: 'Crédito', amount: 13.86, status: 'paid', reference: 'Campanha de ADS' },
  { id: 'pay_3', product_type: 'art', product_description: 'Arte Profissional', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), payment_method: 'PIX', amount: 69.90, status: 'paid', reference: 'Criação de Banner' },
  { id: 'pay_4', product_type: 'banner_category', product_description: 'Banner Categoria — Comida', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(), payment_method: 'Débito', amount: 29.90, status: 'paid', reference: 'Anúncio (30 dias)' },
];

// --- COMPONENTES AUXILIARES ---

const ProductBadge: React.FC<{ type: ProductType }> = ({ type }) => {
  const config = {
    banner_home: { icon: Home, label: 'Banner Home', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    banner_category: { icon: LayoutGrid, label: 'Banner Categoria', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
    banner_combo: { icon: Zap, label: 'Home + Categorias', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' },
    ads: { icon: Megaphone, label: 'ADS Patrocinado', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
    art: { icon: Palette, label: 'Arte Profissional', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
  }[type];

  if (!config) return null;
  const Icon = config.icon;
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${config.color}`}>
      <Icon size={12} />
      <span className="text-[9px] font-black uppercase tracking-tight">{config.label}</span>
    </div>
  );
};

const PaymentDetailModal: React.FC<{ payment: Payment | null; onClose: () => void }> = ({ payment, onClose }) => {
    if (!payment) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Detalhes do Pagamento</h3>
                    <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar pb-6">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-4">
                        <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
                            <span className="text-gray-500 text-xs font-medium">Produto Contratado</span>
                            <span className="font-bold text-gray-900 dark:text-white text-xs text-right">{payment.product_description}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-xs font-medium">Valor Total</span>
                            <span className="text-2xl font-black text-[#1E5BFF]">R$ {payment.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-xs font-medium">Forma de Pagamento</span>
                            <span className="font-bold text-gray-900 dark:text-white text-xs">{payment.payment_method}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-xs font-medium">Data e Hora</span>
                            <span className="font-bold text-gray-900 dark:text-white text-xs">{new Date(payment.date).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-xs font-medium">Status</span>
                            <span className="font-bold text-emerald-500 text-xs uppercase flex items-center gap-1"><CheckCircle2 size={12}/> {payment.status}</span>
                        </div>
                    </div>

                    <button className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold py-4 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
                        <Download size={16} />
                        Baixar Comprovante
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---

export const StoreFinanceModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [payments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [filter, setFilter] = useState<'30d' | '90d' | 'all'>('30d');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const totalInvested = useMemo(() => {
    return payments.reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const now = new Date();
    return payments.filter(p => {
      if (filter === 'all') return true;
      const days = filter === '30d' ? 30 : 90;
      const limit = new Date();
      limit.setDate(now.getDate() - days);
      return new Date(p.date) >= limit;
    });
  }, [payments, filter]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans animate-in fade-in duration-300">
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div>
          <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Pagamentos</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Consulte seus investimentos</p>
        </div>
      </header>

      <main className="p-6 space-y-8 pb-48">
        <section className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total investido no app</p>
          <p className="text-3xl font-black text-[#1E5BFF]">R$ {totalInvested.toFixed(2)}</p>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Histórico</h3>
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              {(['30d', '90d', 'all'] as const).map(f => (
                <button 
                  key={f} 
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg transition-all ${filter === f ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}
                >
                  {f === 'all' ? 'Tudo' : `${f.replace('d', '')} Dias`}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredPayments.map(payment => (
              <div key={payment.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{payment.product_description}</p>
                    <p className="text-[10px] text-gray-400">{payment.reference}</p>
                  </div>
                  <ProductBadge type={payment.product_type} />
                </div>
                
                <div className="pt-3 border-t border-gray-50 dark:border-gray-700 flex justify-between items-end">
                   <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Data</p>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{new Date(payment.date).toLocaleDateString()}</p>
                   </div>
                   <button onClick={() => setSelectedPayment(payment)} className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
                      Ver Detalhes <ChevronRight size={12} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="fixed bottom-[80px] left-0 right-0 p-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 max-w-md mx-auto z-40">
        <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-widest">
            Todos os pagamentos são processados em ambiente seguro.
        </p>
      </footer>

      <PaymentDetailModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />
    </div>
  );
};
