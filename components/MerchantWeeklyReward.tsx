
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  Tag, 
  Info, 
  Plus, 
  Save, 
  Eye, 
  AlertTriangle,
  Loader2,
  Clock,
  Zap,
  Percent,
  DollarSign
} from 'lucide-react';

interface MerchantWeeklyRewardProps {
  onBack: () => void;
  user: any;
}

export const MerchantWeeklyReward: React.FC<MerchantWeeklyRewardProps> = ({ onBack, user }) => {
  const [isParticipating, setIsParticipating] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados para o Tipo e Valor do Benefício
  const [rewardType, setRewardType] = useState<'percent' | 'fixed'>('percent');
  const [rewardValue, setRewardValue] = useState<string>('10');
  const [isCustomValue, setIsCustomValue] = useState(false);

  const [rewardData, setRewardData] = useState({
    title: 'Suco Natural Grátis',
    description: 'Na compra de qualquer hambúrguer artesanal.',
    rules: 'Válido apenas para consumo no local. 1 uso por CPF.',
    expiry: '7 dias após o resgate'
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Recompensa atualizada com sucesso!');
    }, 1200);
  };

  const percentPresets = ['5', '10', '20', '30', '35', '40'];
  const fixedPresets = ['5', '20', '35', '50'];

  const handlePresetClick = (val: string) => {
    setRewardValue(val);
    setIsCustomValue(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-gray-950 font-sans pb-32 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-6 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <button 
          onClick={onBack} 
          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 transition-all active:scale-90"
        >
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
            Gestão de Recompensas
          </h1>
          <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Serviço Gratuito</p>
        </div>
      </header>

      <main className="p-6 space-y-10 max-w-md mx-auto w-full">
        
        {/* 1. EXPLICAÇÃO SIMPLES */}
        <section className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-3xl border border-blue-100 dark:border-blue-800/30 flex gap-4">
            <Sparkles className="w-6 h-6 text-[#1E5BFF] shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium leading-relaxed">
                Crie benefícios exclusivos para aparecer na <strong>Recompensa da Semana</strong> da Home e atrair novos moradores do bairro para sua loja.
            </p>
        </section>

        {/* 2. STATUS DE PARTICIPAÇÃO */}
        <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 px-1">Status no Bairro</h3>
            <div className={`p-6 rounded-[2.5rem] border-2 transition-all flex items-center justify-between ${isParticipating ? 'bg-white dark:bg-gray-900 border-[#1E5BFF]/20 shadow-sm' : 'bg-gray-100 dark:bg-gray-900 border-transparent opacity-60'}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isParticipating ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'}`}>
                        {isParticipating ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                    </div>
                    <div>
                        <p className="font-black text-gray-900 dark:text-white text-sm uppercase">{isParticipating ? 'Participando' : 'Inativo'}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Semana Atual: {isParticipating ? 'Ativa' : 'Pausada'}</p>
                    </div>
                </div>
                <button 
                  onClick={() => setIsParticipating(!isParticipating)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors ${isParticipating ? 'bg-[#1E5BFF]' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${isParticipating ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>
        </section>

        {/* 3. CRIAR / EDITAR RECOMPENSA */}
        <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Configurar Benefício</h3>
                <Zap size={14} className="text-amber-500" />
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Título da Recompensa</label>
                    <input 
                        type="text" 
                        value={rewardData.title}
                        onChange={(e) => setRewardData({...rewardData, title: e.target.value})}
                        placeholder="Ex: 10% de Desconto, Café Grátis..."
                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-[#1E5BFF] outline-none"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Descrição Curta</label>
                    <textarea 
                        value={rewardData.description}
                        onChange={(e) => setRewardData({...rewardData, description: e.target.value})}
                        placeholder="O que o cliente ganha?"
                        rows={2}
                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-medium dark:text-white focus:ring-2 focus:ring-[#1E5BFF] outline-none resize-none"
                    />
                </div>

                {/* NOVA SEÇÃO: TIPO DE RECOMPENSA */}
                <div className="space-y-4 pt-2 border-t border-gray-50 dark:border-gray-800">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo de recompensa</label>
                    
                    <div className="flex bg-gray-50 dark:bg-gray-800 p-1 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <button 
                        onClick={() => { setRewardType('percent'); setRewardValue('10'); setIsCustomValue(false); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${rewardType === 'percent' ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}
                      >
                        <Percent size={14} /> Percentual
                      </button>
                      <button 
                        onClick={() => { setRewardType('fixed'); setRewardValue('20'); setIsCustomValue(false); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${rewardType === 'fixed' ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}
                      >
                        <DollarSign size={14} /> Valor em reais
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {rewardType === 'percent' ? (
                        percentPresets.map(val => (
                          <button
                            key={val}
                            onClick={() => handlePresetClick(val)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${rewardValue === val && !isCustomValue ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-100 dark:border-gray-700'}`}
                          >
                            {val}%
                          </button>
                        ))
                      ) : (
                        fixedPresets.map(val => (
                          <button
                            key={val}
                            onClick={() => handlePresetClick(val)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${rewardValue === val && !isCustomValue ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-100 dark:border-gray-700'}`}
                          >
                            R$ {val}
                          </button>
                        ))
                      )}
                      <button
                        onClick={() => setIsCustomValue(true)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${isCustomValue ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-100 dark:border-gray-700'}`}
                      >
                        Personalizado
                      </button>
                    </div>

                    {isCustomValue && (
                      <div className="animate-in slide-in-from-top-2 duration-300">
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                            {rewardType === 'percent' ? '%' : 'R$'}
                          </span>
                          <input 
                            type="number"
                            value={rewardValue}
                            onChange={(e) => setRewardValue(e.target.value)}
                            placeholder="Digite o valor..."
                            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 pl-10 text-sm font-bold dark:text-white focus:ring-2 focus:ring-[#1E5BFF] outline-none"
                          />
                        </div>
                      </div>
                    )}
                </div>

                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Regras de Uso</label>
                    <input 
                        type="text" 
                        value={rewardData.rules}
                        onChange={(e) => setRewardData({...rewardData, rules: e.target.value})}
                        placeholder="Ex: Válido acima de R$ 50,00"
                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-medium dark:text-white focus:ring-2 focus:ring-[#1E5BFF] outline-none"
                    />
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/30 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <p className="text-[10px] text-amber-700 dark:text-amber-300 font-bold uppercase leading-tight">
                        A recompensa não é acumulativa e permite apenas 1 uso por vez por cliente.
                    </p>
                </div>

                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                    Salvar Recompensa
                </button>
            </div>
        </section>

        {/* 4. PREVIEW */}
        <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
                <Eye size={14} className="text-gray-400" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Como o morador verá</h3>
            </div>
            
            {/* Mock do Card da Home */}
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 shadow-xl shadow-blue-950/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#1E5BFF]/5 rounded-full blur-3xl"></div>
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-[#1E5BFF] border border-blue-100 dark:border-blue-800/30">
                        <Tag className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase leading-tight">
                          {rewardType === 'percent' ? `${rewardValue}% de desconto` : `R$ ${rewardValue} de desconto`} em {rewardData.title}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user?.user_metadata?.store_name || 'Sua Loja'}</p>
                    </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-4 leading-relaxed italic">
                    "{rewardData.description || 'Descrição do benefício...'}"
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Resgatar Agora</span>
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[#1E5BFF]">
                        <ChevronLeft className="w-4 h-4 rotate-180" />
                    </div>
                </div>
            </div>
        </section>

      </main>

      <div className="mt-12 text-center opacity-30 px-10">
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] leading-relaxed">
          Localizei JPA Recompensas <br/> v1.5.0
        </p>
      </div>
    </div>
  );
};
