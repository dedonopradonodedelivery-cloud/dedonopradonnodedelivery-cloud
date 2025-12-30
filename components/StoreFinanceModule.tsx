
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  User, 
  Landmark, 
  Receipt, 
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Wallet,
  Clock,
  ArrowUpRight,
  Save,
  Building2,
  Phone,
  Mail,
  CreditCard
} from 'lucide-react';

interface StoreFinanceModuleProps {
  onBack: () => void;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending';
}

export const StoreFinanceModule: React.FC<StoreFinanceModuleProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [accountData, setAccountData] = useState({
    responsibleName: 'Carlos Eduardo Silva',
    document: '123.456.789-00',
    email: 'carlos@hamburgueriabrasa.com.br',
    phone: '(21) 99999-8888'
  });

  const [bankData, setBankData] = useState({
    bank: 'Itaú Unibanco',
    agency: '0450',
    account: '12345-6',
    type: 'Corrente'
  });

  const [history] = useState<Transaction[]>([
    { id: 'REC-001', date: '12/11/2023', amount: 450.90, status: 'paid' },
    { id: 'REC-002', date: '05/11/2023', amount: 1200.00, status: 'paid' },
    { id: 'REC-003', date: '30/10/2023', amount: 850.25, status: 'paid' },
    { id: 'REC-004', date: '15/11/2023', amount: 320.00, status: 'pending' },
  ]);

  useEffect(() => {
    // Simula carregamento inicial dos dados do backend
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    // Simula salvamento via API
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 text-[#1E5BFF] animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Carregando dados financeiros...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans animate-in fade-in duration-300 pb-32">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 pt-12 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
            <div>
              <h1 className="font-bold text-xl text-gray-900 dark:text-white font-display">Dados da Conta e Financeiro</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Gerencie seus dados cadastrais e financeiros</p>
            </div>
        </div>
      </div>

      <div className="p-5 space-y-8">
        
        {/* 1. STATUS DA CONTA FINANCEIRA */}
        <section className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 p-5 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Status da Conta</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">Ativa e Verificada</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Gateway</p>
                <p className="text-xs font-black text-gray-700 dark:text-gray-300">Asaas</p>
            </div>
        </section>

        {/* 2. DASHBOARD DE SALDOS */}
        <section className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Saldo Disponível</p>
                <p className="text-2xl font-black text-[#1E5BFF]">R$ 450,90</p>
                <button className="mt-3 text-[10px] font-black text-blue-600 uppercase flex items-center gap-1 hover:underline">
                    Solicitar Saque <ArrowUpRight className="w-3 h-3" />
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">A Receber</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">R$ 320,00</p>
                <p className="mt-3 text-[10px] font-bold text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Prev. 15/11
                </p>
            </div>
        </section>

        {/* 3. DADOS DO RESPONSÁVEL */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <User className="w-4 h-4 text-[#1E5BFF]" />
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Dados da Conta</h3>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome do Responsável</label>
                    <input 
                        value={accountData.responsibleName}
                        onChange={(e) => setAccountData({...accountData, responsibleName: e.target.value})}
                        className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 focus:border-[#1E5BFF] outline-none transition-all dark:text-white font-medium"
                    />
                </div>
                <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CPF / CNPJ</label>
                        <input 
                            value={accountData.document}
                            className="w-full p-4 bg-gray-100 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 outline-none dark:text-gray-400 font-medium cursor-not-allowed"
                            readOnly
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail para Notificações</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            value={accountData.email}
                            onChange={(e) => setAccountData({...accountData, email: e.target.value})}
                            className="w-full p-4 pl-11 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 focus:border-[#1E5BFF] outline-none transition-all dark:text-white font-medium"
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* 4. DADOS BANCÁRIOS */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <Landmark className="w-4 h-4 text-[#1E5BFF]" />
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Dados Bancários</h3>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Banco</label>
                    <select 
                        value={bankData.bank}
                        onChange={(e) => setBankData({...bankData, bank: e.target.value})}
                        className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 outline-none dark:text-white font-medium"
                    >
                        <option>Itaú Unibanco</option>
                        <option>Bradesco</option>
                        <option>Santander</option>
                        <option>Nubank</option>
                        <option>Banco do Brasil</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Agência</label>
                        <input 
                            value={bankData.agency}
                            onChange={(e) => setBankData({...bankData, agency: e.target.value})}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 outline-none dark:text-white font-medium"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Conta</label>
                        <input 
                            value={bankData.account}
                            onChange={(e) => setBankData({...bankData, account: e.target.value})}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 outline-none dark:text-white font-medium"
                        />
                    </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                    <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed italic">
                        "Os pagamentos e repasses serão realizados nesta conta."
                    </p>
                </div>
            </div>
        </section>

        {/* 5. HISTÓRICO FINANCEIRO */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <Receipt className="w-4 h-4 text-[#1E5BFF]" />
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Últimos Recebimentos</h3>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                {history.map((item, idx) => (
                    <div key={item.id} className={`p-5 flex items-center justify-between ${idx !== history.length - 1 ? 'border-b border-gray-50 dark:border-gray-700' : ''}`}>
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">{item.date} • {item.id}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${item.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                            {item.status === 'paid' ? 'Pago' : 'Pendente'}
                        </span>
                    </div>
                ))}
                <button className="w-full py-4 bg-gray-50 dark:bg-gray-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#1E5BFF] transition-colors">
                    Ver relatório completo
                </button>
            </div>
        </section>

      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-40 flex flex-col gap-2 max-w-md mx-auto">
        {showSuccess && (
            <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-sm mb-2 animate-in slide-in-from-bottom-2">
                <CheckCircle2 className="w-4 h-4" /> Dados atualizados com sucesso!
            </div>
        )}
        <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Salvar alterações
        </button>
      </div>

    </div>
  );
};
