
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  MapPin, 
  ChevronRight, 
  Search,
  Building2,
  SlidersHorizontal,
  Plus,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { MOCK_JOBS, STORES } from '../constants';
import { Job, Store } from '../types';
import { ClassifiedsCategoryHighlight } from './ClassifiedsCategoryHighlight';
import { JobFiltersView, JobFilters } from './JobFiltersView';

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
        <div className="flex-1">
            {job.isVerified && (
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-widest mb-1.5 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full w-fit">
                    <CheckCircle2 size={10} /> Vaga verificada
                </div>
            )}
            <h3 className="font-black text-gray-900 dark:text-white text-base leading-tight group-hover:text-[#1E5BFF] transition-colors">
              {job.role}
            </h3>
        </div>
        <span className={`shrink-0 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getBadgeStyles(job.type)}`}>
          {job.type}
        </span>
      </div>
      
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
        {job.company}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
        <div className="flex items-center gap-3 text-gray-400 text-[9px] font-bold uppercase tracking-tight">
          <span className="flex items-center gap-1"><MapPin size={10} className="text-blue-500" /> {job.neighborhood}</span>
          {job.schedule_type && <span className="flex items-center gap-1"><Clock size={10} className="text-blue-500" /> {job.schedule_type}</span>}
        </div>
        <span className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest flex items-center gap-1">
          Detalhes <ChevronRight size={12} strokeWidth={3} />
        </span>
      </div>
    </div>
  );
};

export const JobsView: React.FC<JobsViewProps> = ({ onBack, onJobClick, onNavigate }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({
    hireTypes: [],
    neighborhoods: [],
    shifts: [],
    sortBy: 'recent'
  });

  const featuredJobs = useMemo(() => {
    // Vagas que seriam de empresas com plano ativo
    return MOCK_JOBS.slice(0, 3).map(j => ({ ...j, isVerified: true, isSponsored: true }));
  }, []);

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter(job => {
      if (filters.hireTypes.length > 0 && !filters.hireTypes.includes(job.type)) return false;
      if (filters.neighborhoods.length > 0 && !filters.neighborhoods.includes(job.neighborhood)) return false;
      if (filters.shifts.length > 0 && job.schedule_type && !filters.shifts.includes(job.schedule_type)) return false;
      return true;
    });
  }, [filters]);

  const handleApplyFilters = (newFilters: JobFilters) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
  };

  const handleStartAnnouncement = () => {
    onNavigate?.('job_wizard');
  };

  return (
    <div className="flex flex-col bg-[#F8F9FC] dark:bg-gray-950 w-full max-w-md mx-auto min-h-screen font-sans pb-32 animate-in fade-in duration-500">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shadow-sm shrink-0">
        <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 transition-all active:scale-90 shadow-sm shrink-0">
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none truncate">Empregos</h1>
          <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Talentos Locais</p>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={handleStartAnnouncement}
            className="px-3 py-1.5 bg-[#1E5BFF] hover:bg-blue-600 text-white font-black rounded-full shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 uppercase tracking-widest text-[9px] border border-white/10 active:scale-95 transition-all h-9"
          >
            <Plus size={12} strokeWidth={4} />
            Anunciar
          </button>
          
          <button onClick={() => setIsFilterOpen(true)} className="relative p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 shadow-sm active:scale-90 transition-all">
            <SlidersHorizontal size={20}/>
            {(filters.hireTypes.length + filters.neighborhoods.length + filters.shifts.length) > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-sm animate-in zoom-in">
                {filters.hireTypes.length + filters.neighborhoods.length + filters.shifts.length}
              </div>
            )}
          </button>
        </div>
      </header>

      <main className="p-5 space-y-10">
        {/* BLOCO DE DESTAQUES EXCLUSIVO DE VAGAS */}
        <section>
            <div className="flex items-center gap-2 mb-4 px-1">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">⭐ Destaques em Jacarepaguá</span>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2 snap-x">
                {featuredJobs.map(job => (
                    <div 
                        key={`featured-${job.id}`}
                        onClick={() => onJobClick(job)}
                        className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 shadow-xl border-2 border-amber-400/20 min-w-[280px] snap-center relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="flex items-center gap-1 text-emerald-600 text-[8px] font-black uppercase tracking-widest mb-3">
                            <CheckCircle2 size={10} /> Vaga verificada
                        </div>
                        <h4 className="font-black text-gray-900 dark:text-white text-base leading-tight mb-1 uppercase tracking-tight">{job.role}</h4>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4">{job.company}</p>
                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-[9px] font-bold text-gray-400 uppercase">{job.neighborhood}</span>
                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Contratação {job.type}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* LISTAGEM GERAL */}
        <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Vagas Recentes</h2>
                {filteredJobs.length > 0 && <span className="text-[10px] text-gray-400">{filteredJobs.length} vagas</span>}
            </div>

            {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {filteredJobs.map(job => <JobCard key={job.id} job={job} onClick={() => onJobClick(job)} />)}
                </div>
            ) : (
                <div className="py-20 text-center opacity-40 flex flex-col items-center">
                    <Briefcase size={40} className="mb-4 text-gray-400" />
                    <p className="text-sm font-bold">Nenhuma vaga encontrada</p>
                </div>
            )}
        </section>
      </main>

      <JobFiltersView 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApply={handleApplyFilters} 
        initialFilters={filters} 
      />
    </div>
  );
};
