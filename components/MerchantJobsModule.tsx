
import React, { useState } from 'react';
import { ChevronLeft, Briefcase, Plus, Trash2, Clock, CheckCircle2, AlertCircle, Save, Loader2, Eye, PauseCircle } from 'lucide-react';

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
    type: 'CLT',
    schedule: '',
    salary: '',
    duration: '7'
  });

  const handleSave = () => {
    if (!formData.role || !formData.description) return;
    setIsSaving(true);
    setTimeout(() => {
        const newJob: MerchantJob = {
            id: Math.random().toString(),
            role: formData.role,
            type: formData.type,
            status: 'active',
            candidates: 0,
            daysLeft: parseInt(formData.duration)
        };
        setJobs([newJob, ...jobs]);
        setIsSaving(false);
        setView('list');
        setFormData({ role: '', description: '', type: 'CLT', schedule: '', salary: '', duration: '7' });
    }, 1500);
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
                <div className="space-y-4">
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
                                    onClick={() => setFormData({...formData, type: t})}
                                    className={`py-3 rounded-xl text-sm font-bold border transition-all ${formData.type === t ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Descrição & Requisitos</label>
                        <textarea 
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            placeholder="Descreva as atividades e o que você precisa..."
                            rows={4}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 outline-none focus:border-[#1E5BFF] transition-all dark:text-white resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Horário</label>
                            <input 
                                value={formData.schedule}
                                onChange={e => setFormData({...formData, schedule: e.target.value})}
                                placeholder="Ex: 09h às 18h"
                                className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 outline-none focus:border-[#1E5BFF] transition-all dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Salário (Opcional)</label>
                            <input 
                                value={formData.salary}
                                onChange={e => setFormData({...formData, salary: e.target.value})}
                                placeholder="R$ 0,00"
                                className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 outline-none focus:border-[#1E5BFF] transition-all dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Duração do Anúncio</label>
                        <select 
                            value={formData.duration}
                            onChange={e => setFormData({...formData, duration: e.target.value})}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 outline-none focus:border-[#1E5BFF] transition-all dark:text-white"
                        >
                            <option value="7">7 dias</option>
                            <option value="15">15 dias</option>
                            <option value="30">30 dias</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 max-w-md mx-auto">
                <button 
                    onClick={handleSave}
                    disabled={isSaving || !formData.role}
                    className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mb-8">
                    Anuncie suas vagas para moradores do bairro e receba candidaturas direto no WhatsApp.
                </p>
                <button 
                    onClick={() => setView('create')}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1E5BFF] text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Criar Primeira Vaga
                </button>
            </div>
        ) : (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Minhas Vagas</h3>
                    <button 
                        onClick={() => setView('create')}
                        className="text-[#1E5BFF] text-xs font-bold bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                    >
                        + Nova
                    </button>
                </div>

                {jobs.map(job => (
                    <div key={job.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-base">{job.role}</h4>
                                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md mt-1 inline-block font-medium">
                                    {job.type}
                                </span>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${job.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700'}`}>
                                {job.status === 'active' ? 'Ativa' : 'Pausada'}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                            <div className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                {job.candidates * 15} views
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {job.daysLeft} dias restantes
                            </div>
                        </div>

                        <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <button className="flex-1 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2">
                                <PauseCircle className="w-4 h-4" /> Pausar
                            </button>
                            <button 
                                onClick={() => handleDelete(job.id)}
                                className="flex-1 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" /> Excluir
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
