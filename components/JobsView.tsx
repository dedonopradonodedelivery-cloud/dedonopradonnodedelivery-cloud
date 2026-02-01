import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Briefcase, 
  MapPin, 
  ChevronRight, 
  AlertCircle, 
  Plus, 
  Building2,
  X
} from 'lucide-react';
import { MOCK_JOBS } from '../constants';
import { Job } from '../types';

interface JobsViewProps {
  onBack: () => void;
  onJobClick: (job: Job) => void;
  onNavigate?: (view: string) => void;
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

  return (
    <div className="flex flex-col bg-[#F8F9FC] dark:bg-gray-950 w-full max-w-md mx-auto min-h-screen font-sans pb-32 animate-in fade-in duration-500">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 py-6 border-b border-gray-100 dark:border-gray-800 rounded-b-[2.5rem] shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 transition-colors active:scale-90 shadow-sm">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Vagas de Emprego</h1>
            <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Oportunidades reais de trabalho no seu bairro</p>
          </div>
        </div>

        {/* Filtros */}
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
          
          <div className="space-y-2">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Filtre por bairro para ver vagas perto de você</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
              <button 
                onClick={() => setFilterHood(null)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                  filterHood === null 
                  ? 'bg-gray-900 text-white border-gray-900' 
                  : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700'
                }`}
              >
                Todos
              </button>
              {neighborhoods.map(hood => (
                <button 
                  key={hood}
                  onClick={() => setFilterHood(hood)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                    filterHood === hood 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                    : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700'
                  }`}
                >
                  {hood}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="px-5 py-6 flex-1 flex flex-col">
        {filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onClick={() => onJobClick(job)} />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-[2.5rem] flex items-center justify-center mb-6 text-gray-400">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Nenhuma vaga encontrada</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-8 max-w-[200px] mx-auto leading-relaxed">
              Tente outro bairro ou tipo de contratação.
            </p>
            <button 
              onClick={handleClearFilters}
              className="px-8 py-3.5 bg-[#1E5BFF] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              Limpar filtros
            </button>
          </div>
        )}

        {/* CTA PARA LOJISTAS */}
        <section className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
          <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#1E5BFF]">
              <Building2 size={24} />
            </div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-6">É lojista ou empresa do bairro?</p>
            <button 
              onClick={() => onNavigate?.('merchant_jobs')}
              className="w-full py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95"
            >
              Publicar vaga
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

const Search = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);
