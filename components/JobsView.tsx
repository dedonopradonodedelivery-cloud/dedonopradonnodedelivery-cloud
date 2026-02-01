import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  MapPin, 
  ChevronRight, 
  Search,
  Building2
} from 'lucide-react';
import { MOCK_JOBS, STORES } from '../constants';
import { Job, Store } from '../types';
import { ClassifiedsCategoryHighlight } from './ClassifiedsCategoryHighlight';

interface JobsViewProps {
  onBack: () => void;
  onJobClick: (job: Job) => void;
  onNavigate?: (view: string, data?: any) => void;
}

const JobCard: React.FC<{ job: Job; onClick: () => void }> = ({ job, onClick }) => {
  const getBadgeStyles = (type: string) => {
    switch (type) {
      case 'CLT': return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'PJ': return 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800';
      case 'Freelancer': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800';
      default: return 'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800 active:scale-[0.98] transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start gap-3 mb-1">
        <h3 className="font-black text-gray-900 dark:text-white text-base leading-tight group-hover:text-[#1E5BFF] transition-colors">
          {job.role}
        </h3>
        <span className={`shrink-0 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getBadgeStyles(job.type)}`}>
          {job.type}
        </span>
      </div>
      
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
        {job.company}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
        <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-tight">
          <MapPin size={12} /> {job.neighborhood}
        </div>
        <span className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest flex items-center gap-1">
          Ver detalhes <ChevronRight size={12} strokeWidth={3} />
        </span>
      </div>
    </div>
  );
};

export const JobsView: React.FC<JobsViewProps> = ({ onBack, onJobClick, onNavigate }) => {
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [filterHood, setFilterHood] = useState<string | null>(null);

  const neighborhoods = useMemo(() => {
    return Array.from(new Set(MOCK_JOBS.map(j => j.neighborhood))).sort();
  }, []);

  const toggleTypeFilter = (type: string) => {
    setFilterTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleClearFilters = () => {
    setFilterTypes([]);
    setFilterHood(null);
  };

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter(job => {
      const matchType = filterTypes.length === 0 || filterTypes.includes(job.type);
      const matchHood = !filterHood || job.neighborhood === filterHood;
      return matchType && matchHood;
    });
  }, [filterTypes, filterHood]);

  // Destaque de categoria
  const categoryHighlight = useMemo(() => {
    return STORES.find(s => s.isSponsored && s.category === 'Pro') || STORES[0];
  }, []);

  return (
    <div className="flex flex-col bg-[#F8F9FC] dark:bg-gray-950 w-full max-w-md mx-auto min-h-screen font-sans pb-32 animate-in fade-in duration-500">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 py-6 border-b border-gray-100 dark:border-gray-800 rounded-b-[2.5rem] shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 transition-colors active:scale-90 shadow-sm">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Vagas de Emprego</h1>
            <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Oportunidades reais no seu bairro</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
            {['CLT', 'PJ', 'Freelancer'].map(type => {
              const isActive = filterTypes.includes(type);
              return (
                <button 
                  key={type}
                  onClick={() => toggleTypeFilter(type)}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    isActive 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                    : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="px-5 py-6 flex-1 flex flex-col">
        {/* BLOCO DE DESTAQUE ÚNICO */}
        <ClassifiedsCategoryHighlight 
          store={categoryHighlight} 
          onClick={(store) => onNavigate?.('store_detail', { store })} 
        />

        {filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onClick={() => onJobClick(job)} />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 animate-in fade-in duration-500">
            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Nenhuma vaga encontrada</h3>
            <button 
              onClick={handleClearFilters}
              className="px-8 py-3.5 bg-[#1E5BFF] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-all mt-4"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </main>
    </div>
  );
};