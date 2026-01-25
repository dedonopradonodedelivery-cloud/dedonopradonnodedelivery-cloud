
import React, { useState } from 'react';
import { ChevronLeft, Briefcase, Plus, Trash2, Clock, CheckCircle2, AlertCircle, Save, Loader2, Eye, PauseCircle, BellRing } from 'lucide-react';
import { sendJobPushNotification } from '../services/jobNotificationService';

interface MerchantJobsModuleProps {
  onBack: () => void;
}

interface MerchantJob {
  id: string;
  role: string;
  type: string;
  status: 'active' | 'paused';
  candidates: number;
  daysLeft: number;
}

const CATEGORIES_JOBS = ['Alimentação', 'Beleza', 'Orçamento de Serviços', 'Pets', 'Moda', 'Saúde', 'Educação', 'Tecnologia'];

export const MerchantJobsModule: React.FC<MerchantJobsModuleProps> = ({ onBack }) => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [jobs, setJobs] = useState<MerchantJob[]>([
    { id: '1', role: 'Atendente de Balcão', type: 'CLT', status: 'active', candidates: 12, daysLeft: 5 }
  ]);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    role: '',
    description: '',
    category: 'Alimentação',
    type: 'CLT',
    schedule: '',
    salary: '',
    duration: '7',
    isUrgentToday: false
  });

  const handleSave = async () => {
    if (!formData.role || !formData.description) return;
    setIsSaving(true);
    
    // Simulação de delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newJob: any = {
        id: Math.random().toString(),
        role: formData.role,
        company: 'Estabelecimento Local', // Mock
        neighborhood: 'Freguesia', // Mock
        category: formData.category,
        type: formData.type,
        status: 'active',
        candidates: 0,
        daysLeft: parseInt(formData.duration),
        isUrgentToday: formData.isUrgentToday,
        description: formData.description,
        requirements: [],
        schedule: formData.schedule,
        contactWhatsapp: '5521999999999',
        postedAt: 'Hoje'
    };

    setJobs([newJob, ...jobs]);

    // Gatilho do Push (Backend Simulado / Endpoint)
    if (formData.isUrgentToday) {
      await sendJobPushNotification(newJob, 'Estabelecimento Local');
    }

    setIsSaving(false);
    setView('list');
    setFormData({ role: '', description: '', category: 'Alimentação', type: 'CLT', schedule: '', salary: '', duration: '7', isUrgentToday: false });
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza?')) {
        setJobs(prev => prev.filter(j => j.id !== id));
    }
  };

  if (view === 'create') {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300">
            <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
                <button onClick={() => setView('list')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white">Nova Vaga</h1>
            </div>

            <div className="p-5 pb-20 space-y-6">
                {/* NOTIFICAÇÃO PUSH TOGGLE */}
                <div className={`p-4 rounded-2xl border transition-all ${formData.isUrgentToday ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800' : 'bg-gray-50 border-gray-100 dark:bg-gray-800 dark:border-gray-700'}`}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <BellRing className={`w-5 h-5 ${formData.isUrgentToday ? 'text-orange-600' : 'text-gray-400'}`} />
                            <h4 className="font-bold text-sm dark:text-white">Urgente para Hoje?</h4>
                        </div>
                        <button 
                            onClick={() => setFormData({...formData, isUrgentToday: !formData.isUrgentToday})}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.isUrgentToday ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.isUrgentToday ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                        Se ativado, enviaremos uma notificação push para todos os candidatos com perfil compatível. Use apenas para vagas imediatas.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Categoria da Vaga</label>
                        <select 
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 outline-none dark:text-white"
                        >
                            {CATEGORIES_JOBS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Cargo / Função</label>
                        <input 
                            value={formData.role}
                            onChange={e => setFormData({...formData, role: e.target.value})}
                            placeholder="Ex: Vendedor, Cozinheiro"
                            className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 outline-none focus:border-[#1E5BFF] transition-all dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Tipo de Contrato</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['CLT', 'PJ', 'Freelancer'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setFormData({...formData, type: t as any})}
                                    className={`py-3 rounded-xl text-sm font-bold border transition-all ${formData.type === t ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Descrição</label>
                        <textarea 
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            placeholder="Resumo da vaga..."
                            rows={3}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 outline-none focus:border-[#1E5BFF] transition-all dark:text-white resize-none"
                        />
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 max-w-md mx-auto">
                <button 
                    onClick={handleSave}
                    disabled={isSaving || !formData.role}
                    className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold py-4 rounded-2xl shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publicar Vaga'}
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Gestão de Vagas</h1>
      </div>

      <div className="p-5 pb-24">
        {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-16 text-center">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                    <Briefcase className="w-10 h-10 text-[#1E5BFF]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Contrate Locais</h2>
                <button onClick={() => setView('create')} className="px-6 py-3 bg-[#1E5BFF] text-white font-bold rounded-full shadow-lg">+ Criar Vaga</button>
            </div>
        ) : (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Minhas Vagas</h3>
                    <button onClick={() => setView('create')} className="text-[#1E5BFF] text-xs font-bold bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full">+ Nova</button>
                </div>

                {jobs.map(job => (
                    <div key={job.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-base">{job.role}</h4>
                                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md mt-1 inline-block">{job.type}</span>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {job.status === 'active' ? 'Ativa' : 'Pausada'}
                            </span>
                        </div>
                        <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <button className="flex-1 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2"><PauseCircle className="w-4 h-4" /> Pausar</button>
                            <button onClick={() => handleDelete(job.id)} className="flex-1 py-2 text-xs font-bold text-red-500 flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" /> Excluir</button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
