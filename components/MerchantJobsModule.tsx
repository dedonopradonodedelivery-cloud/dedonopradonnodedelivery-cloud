
import React, { useState, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  ChevronLeft, 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Loader2,
  Clock,
  MapPin,
  DollarSign,
  PlusCircle,
  PauseCircle,
  PlayCircle,
  Eye,
  MoreVertical,
  Users,
  MessageSquare,
  Calendar,
  Star as StarIcon,
  UserX
} from 'lucide-react';
import { calculateCompatibility } from '@/utils/compatibilityEngine';
import { CompatibilityResult } from '@/types';

export interface MerchantJob {
  id: string;
  titulo_cargo: string;
  empresa_nome: string;
  bairro: string;
  raio_max_km: string;
  tipo: 'CLT' | 'PJ' | 'Freela';
// FIX: Added 'Integral' to the allowed values for the 'turno' property to match the mock data and prevent type errors.
  turno: 'Manhã' | 'Tarde' | 'Noite' | '12x36' | 'Integral';
  salario?: string;
  requisitos_obrigatorios: string[];
  habilidades_desejadas: string[];
  descricao_curta: string;
  status: 'ativa' | 'pausada' | 'encerrada';
  experiencia_minima: string;
}

interface CandidateProfile {
    id: string;
    nome: string;
    localizacao?: { bairro?: string | null };
    disponibilidade?: { turnos?: string[] | null };
    habilidades_tecnicas?: string[] | null;
    habilidades_comportamentais?: string[] | null;
    experiencias?: { cargo?: string | null }[] | null;
    perfil_resumo?: string;
}

const MOCK_JOBS: MerchantJob[] = [
    {
        id: 'job-123',
        titulo_cargo: 'Atendente de Balcão',
        empresa_nome: 'Padaria Imperial',
        bairro: 'Freguesia',
        raio_max_km: '3km',
        tipo: 'CLT',
        turno: 'Tarde',
        salario: 'R$ 1.850,00',
        requisitos_obrigatorios: ['Experiência com caixa', 'Simpatia'],
        habilidades_desejadas: ['Proatividade', 'Vendas'],
        descricao_curta: 'Atendimento ao cliente no balcão, operação de caixa e organização geral da loja.',
        status: 'ativa',
        experiencia_minima: 'Atendimento',
    },
    {
        id: 'job-456',
        titulo_cargo: 'Cozinheiro(a)',
        empresa_nome: 'Padaria Imperial',
        bairro: 'Freguesia',
        raio_max_km: '5km',
        tipo: 'CLT',
        turno: 'Manhã',
        salario: 'R$ 2.200,00',
        requisitos_obrigatorios: ['Experiência em cozinha', 'Higiene'],
        habilidades_desejadas: ['Agilidade', 'Trabalho em equipe'],
        descricao_curta: 'Preparo de lanches, salgados e refeições.',
        status: 'pausada',
        experiencia_minima: 'Cozinha',
    }
];

const MOCK_CANDIDATES: CandidateProfile[] = [
    {
        id: 'cand-1',
        nome: 'Juliana Costa',
        localizacao: { bairro: 'Freguesia' },
        disponibilidade: { turnos: ['Tarde', 'Noite'] },
        habilidades_tecnicas: ['Operação de Caixa', 'Controle de Estoque', 'Vendas'],
        habilidades_comportamentais: ['Comunicação', 'Simpatia', 'Proatividade'],
        experiencias: [{ cargo: 'Atendente de Loja' }, { cargo: 'Operadora de Caixa' }],
        perfil_resumo: 'Profissional com 2 anos de experiência em atendimento ao cliente e varejo, buscando oportunidade para crescer.'
    },
    {
        id: 'cand-2',
        nome: 'Marcos Oliveira',
        localizacao: { bairro: 'Pechincha' },
        disponibilidade: { turnos: ['Manhã', 'Tarde'] },
        habilidades_tecnicas: ['Cozinha Rápida', 'Higiene Alimentar', 'Excel'],
        habilidades_comportamentais: ['Trabalho em Equipe', 'Agilidade'],
        experiencias: [{ cargo: 'Auxiliar de Cozinha' }],
        perfil_resumo: 'Auxiliar de cozinha ágil e dedicado, com experiência em preparo de lanches e refeições rápidas.'
    },
    {
        id: 'cand-3',
        nome: 'Beatriz Lima',
        localizacao: { bairro: 'Curicica' },
        disponibilidade: { turnos: ['Integral'] },
        habilidades_tecnicas: ['Gestão de Cozinha', 'Preparo de Massas'],
        habilidades_comportamentais: ['Liderança', 'Organização'],
        experiencias: [{ cargo: 'Cozinheira' }, { cargo: 'Chefe de Cozinha' }],
        perfil_resumo: 'Cozinheira experiente com mais de 5 anos de atuação, especialista em culinária caseira e gestão de equipe.'
    }
];

const MOCK_APPLICATIONS: Record<string, string[]> = {
    'job-123': ['cand-1', 'cand-2'],
    'job-456': ['cand-2', 'cand-3'],
};

interface MerchantJobsModuleProps {
  onBack: () => void;
  user: User | null;
}

export const MerchantJobsModule: React.FC<MerchantJobsModuleProps> = ({ onBack, user }) => {
  const [view, setView] = useState<'list' | 'form' | 'candidates'>('list');
  const [jobs, setJobs] = useState<MerchantJob[]>(MOCK_JOBS);
  const [editingJob, setEditingJob] = useState<MerchantJob | null>(null);
  const [selectedJob, setSelectedJob] = useState<MerchantJob | null>(null);

  const handleSave = (jobData: Omit<MerchantJob, 'id'>) => {
    if (editingJob) {
      setJobs(prev => prev.map(j => j.id === editingJob.id ? { ...j, ...jobData } : j));
    } else {
      const newJob: MerchantJob = {
        id: `job-${Date.now()}`,
        ...jobData
      };
      setJobs(prev => [newJob, ...prev]);
    }
    setView('list');
    setEditingJob(null);
  };
  
  const handleEdit = (job: MerchantJob) => {
    setEditingJob(job);
    setView('form');
  };
  
  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta vaga?")) {
      setJobs(prev => prev.filter(j => j.id !== id));
    }
  };

  const toggleStatus = (id: string, currentStatus: MerchantJob['status']) => {
      let newStatus: MerchantJob['status'] = 'ativa';
      if (currentStatus === 'ativa') newStatus = 'pausada';
      if (currentStatus === 'pausada') newStatus = 'ativa';
      
      setJobs(prev => prev.map(j => j.id === id ? {...j, status: newStatus} : j));
  }
  
  const handleViewCandidates = (job: MerchantJob) => {
    setSelectedJob(job);
    setView('candidates');
  };

  if (view === 'form') {
      return <JobForm onBack={() => setView('list')} onSave={handleSave} job={editingJob} />;
  }
  
  if (view === 'candidates' && selectedJob) {
      return <CandidatesView job={selectedJob} onBack={() => setView('list')} />;
  }

  return (
    <div className="min-h-screen bg-[#F4F7FF] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-300">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center justify-between border-b border-blue-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl active:scale-90 transition-all">
            <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Vagas de Emprego</h1>
            <p className="text-[10px] text-cyan-500 font-black uppercase tracking-widest mt-1">Gestão de Talentos</p>
          </div>
        </div>
        <button onClick={() => setView('form')} className="p-3 bg-[#1E5BFF] text-white rounded-2xl shadow-xl active:scale-95 transition-all">
          <Plus size={20} strokeWidth={3} />
        </button>
      </header>

      <main className="p-6 space-y-4">
        {jobs.map(job => {
          const interestedCount = MOCK_APPLICATIONS[job.id]?.length || 0;
          return (
            <div key={job.id} onClick={() => handleViewCandidates(job)} className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer group active:scale-[0.98] transition-all">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-900 dark:text-white text-base group-hover:text-blue-600">{job.titulo_cargo}</h3>
                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${
                    job.status === 'ativa' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    job.status === 'pausada' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-gray-100 text-gray-500 border-gray-200'
                }`}>{job.status}</span>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1"><MapPin size={12}/> {job.bairro}</span>
                <span className="flex items-center gap-1"><Clock size={12}/> {job.turno}</span>
              </div>

              <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800 pt-4">
                  <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); handleEdit(job); }} className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-bold flex items-center gap-1"><Edit3 size={12}/> Editar</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(job.id); }} className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg"><Trash2 size={12}/></button>
                  </div>
                  <div className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 ${interestedCount > 0 ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                      <Users size={12}/> {interestedCount} Interessados
                  </div>
              </div>
            </div>
          )
        })}
      </main>
    </div>
  );
};

const CandidatesView: React.FC<{ job: MerchantJob, onBack: () => void }> = ({ job, onBack }) => {
    const candidatesWithScores = useMemo(() => {
        const applicantIds = MOCK_APPLICATIONS[job.id] || [];
        if (applicantIds.length === 0) return [];
        
        return applicantIds.map(id => {
            const candidate = MOCK_CANDIDATES.find(c => c.id === id);
            if (!candidate) return null;
            const compatibility = calculateCompatibility(candidate, job);
            return { candidate, compatibility };
        }).filter(Boolean).sort((a,b) => b!.compatibility.score_total - a!.compatibility.score_total) as { candidate: CandidateProfile; compatibility: CompatibilityResult }[];
    }, [job]);

    return (
        <div className="min-h-screen bg-[#F4F7FF] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-300">
            <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center justify-between border-b border-blue-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl active:scale-90 transition-all">
                  <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
                <div>
                  <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{job.titulo_cargo}</h1>
                  <p className="text-[10px] text-cyan-500 font-black uppercase tracking-widest mt-1">{candidatesWithScores.length} Candidatos Interessados</p>
                </div>
              </div>
            </header>
            <main className="p-6 space-y-4">
                {candidatesWithScores.map(({ candidate, compatibility }) => (
                    <CandidateCard key={candidate.id} candidate={candidate} compatibility={compatibility} />
                ))}
            </main>
        </div>
    );
};

const CandidateCard: React.FC<{ candidate: CandidateProfile, compatibility: CompatibilityResult }> = ({ candidate, compatibility }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    if (isDismissed) return null;

    return (
        <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">{candidate.nome}</h3>
                    <p className="text-xs text-gray-500 font-medium">{candidate.localizacao?.bairro}</p>
                </div>
                <div className="text-right">
                    <span className="font-black text-2xl text-emerald-500">{compatibility.score_total}%</span>
                    <p className="text-[8px] font-bold text-gray-400 uppercase">Compatível</p>
                </div>
            </div>
            
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 italic">"{candidate.perfil_resumo}"</p>
            
            <div className="mb-4">
                <h5 className="text-[9px] font-bold text-gray-400 uppercase mb-2">Habilidades</h5>
                <div className="flex flex-wrap gap-1.5">
                    {candidate.habilidades_tecnicas?.slice(0,3).map(skill => <span key={skill} className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md">{skill}</span>)}
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5 text-[9px] font-bold">
                {compatibility.pontos_fortes.slice(0,2).map(motivo => <span key={motivo} className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md">✓ {motivo}</span>)}
                {compatibility.pontos_de_atencao.slice(0,1).map(motivo => <span key={motivo} className="bg-amber-50 text-amber-700 px-2 py-1 rounded-md">! {motivo}</span>)}
            </div>

            <div className="flex gap-2 border-t border-gray-50 dark:border-gray-800 mt-4 pt-4">
                <button className="flex-1 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 rounded-xl"><MessageSquare size={14}/> Conversar</button>
                <button className="py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-xl"><Calendar size={14}/></button>
                <button onClick={() => setIsFavorite(!isFavorite)} className={`py-3 px-4 rounded-xl transition-colors ${isFavorite ? 'bg-amber-100 text-amber-600' : 'bg-gray-50 dark:bg-gray-800'}`}>
                    <StarIcon size={14} className={isFavorite ? 'fill-current' : ''} />
                </button>
                <button onClick={() => setIsDismissed(true)} className="py-3 px-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl"><UserX size={14}/></button>
            </div>
        </div>
    );
}

const JobForm: React.FC<{onBack: () => void, onSave: (data: any) => void, job: MerchantJob | null}> = ({onBack, onSave, job}) => {
    const [formData, setFormData] = useState({
        titulo_cargo: job?.titulo_cargo || '',
        empresa_nome: job?.empresa_nome || 'Padaria Imperial', // Mock
        bairro: job?.bairro || 'Freguesia',
        raio_max_km: job?.raio_max_km || '5km',
        tipo: job?.tipo || 'CLT',
        turno: job?.turno || 'Tarde',
        salario: job?.salario || '',
        requisitos_obrigatorios: job?.requisitos_obrigatorios || [],
        habilidades_desejadas: job?.habilidades_desejadas || [],
        descricao_curta: job?.descricao_curta || '',
        status: job?.status || 'ativa',
        experiencia_minima: job?.experiencia_minima || ''
    });
    const [reqInput, setReqInput] = useState('');
    const [skillInput, setSkillInput] = useState('');

    const handleSave = () => {
        if (!formData.titulo_cargo || !formData.descricao_curta) return;
        onSave(formData);
    };
    
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans">
            <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-16 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                <button onClick={onBack} className="p-2"><ChevronLeft /></button>
                <h2 className="font-bold">{job ? 'Editar Vaga' : 'Nova Vaga'}</h2>
                <button onClick={handleSave} className="font-bold text-blue-600">Salvar</button>
            </header>
            <main className="p-6 space-y-6 overflow-y-auto">
                <FormField label="Título do Cargo" value={formData.titulo_cargo} onChange={v => setFormData({...formData, titulo_cargo: v})} />
                <FormField label="Nome da Empresa" value={formData.empresa_nome} onChange={v => setFormData({...formData, empresa_nome: v})} />
                <div className="grid grid-cols-2 gap-4">
                  <FormSelect label="Bairro" value={formData.bairro} onChange={v => setFormData({...formData, bairro: v})} options={['Freguesia', 'Taquara', 'Pechincha']} />
                  <FormSelect label="Raio Máximo" value={formData.raio_max_km} onChange={v => setFormData({...formData, raio_max_km: v})} options={['3km', '5km', '10km']} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormSelect label="Tipo" value={formData.tipo} onChange={v => setFormData({...formData, tipo: v as any})} options={['CLT', 'PJ', 'Freela']} />
                    <FormSelect label="Turno" value={formData.turno} onChange={v => setFormData({...formData, turno: v as any})} options={['Manhã', 'Tarde', 'Noite', '12x36', 'Integral']} />
                </div>
                <FormField label="Salário (Opcional)" value={formData.salario} onChange={v => setFormData({...formData, salario: v})} placeholder="Ex: R$ 2.500,00 ou A combinar" />
                <FormField label="Experiência Mínima (Opcional)" value={formData.experiencia_minima} onChange={v => setFormData({...formData, experiencia_minima: v})} placeholder="Ex: Atendimento, 1 ano" />
                <FormListInput label="Requisitos Obrigatórios" items={formData.requisitos_obrigatorios} setItems={v => setFormData({...formData, requisitos_obrigatorios: v})} inputValue={reqInput} setInputValue={setReqInput} />
                <FormListInput label="Habilidades Desejadas" items={formData.habilidades_desejadas} setItems={v => setFormData({...formData, habilidades_desejadas: v})} inputValue={skillInput} setInputValue={setSkillInput} />
                <div className="space-y-1"><label className="text-xs font-bold text-gray-500 ml-1">Descrição Curta</label><textarea value={formData.descricao_curta} onChange={e => setFormData({...formData, descricao_curta: e.target.value})} rows={3} className="w-full p-3 bg-gray-100 rounded-xl" /></div>
            </main>
        </div>
    );
};

const FormField: React.FC<{label: string, value: string, onChange: (val: string) => void, placeholder?: string}> = ({label, value, onChange, placeholder}) => (
    <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 ml-1">{label}</label>
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full p-3 bg-gray-100 rounded-xl" />
    </div>
);

const FormSelect: React.FC<{label: string, value: string, onChange: (val: string) => void, options: string[]}> = ({label, value, onChange, options}) => (
    <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 ml-1">{label}</label>
        <select value={value} onChange={e => onChange(e.target.value)} className="w-full p-3 bg-gray-100 rounded-xl">
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
);

const FormListInput: React.FC<{label: string, items: string[], setItems: (items: string[]) => void, inputValue: string, setInputValue: (val: string) => void}> = ({label, items, setItems, inputValue, setInputValue}) => {
    const handleAdd = () => {
        if(inputValue.trim()) {
            setItems([...items, inputValue.trim()]);
            setInputValue('');
        }
    };
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 ml-1">{label}</label>
            <div className="flex gap-2">
                <input value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} className="flex-1 p-3 bg-gray-100 rounded-xl" />
                <button type="button" onClick={handleAdd} className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Plus/></button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
                {items.map((item, i) => (
                    <div key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                        {item} <button onClick={() => setItems(items.filter((_, idx) => idx !== i))}><X size={12}/></button>
                    </div>
                ))}
            </div>
        </div>
    );
};
