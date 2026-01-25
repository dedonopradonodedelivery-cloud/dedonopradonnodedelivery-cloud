
import React, { useState, useMemo } from 'react';
import { ChevronLeft, Briefcase, MapPin, Clock, AlertCircle, ChevronRight, Filter } from 'lucide-react';
import { MOCK_JOBS } from '../constants';
import { Job } from '../types';

interface JobsViewProps {
  onBack: () => void;
  onJobClick: (job: Job) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({ onBack, onJobClick }) => {
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterHood, setFilterHood] = useState<string | null>(null);

  const neighborhoods = useMemo(() => {
    return Array.from(new Set(MOCK_JOBS.map(j => j.neighborhood)));
  }, []);

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter(job => {
      const matchType = !filterType || job.type === filterType;
      const matchHood = !filterHood || job.neighborhood === filterHood;
      return matchType && matchHood;
    });
  }, [filterType, filterHood]);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto min-h-screen font-sans pb-32 animate-in fade-in duration-500">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-4 py-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-black text-2xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Vagas de Emprego</h1>
            <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Jacarepaguá Conectada</p>
          </div>
        </div>

        {/* Filtros Rápidos */}
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
            {['CLT', 'PJ', 'Freelancer'].map(type => (
              <button 
                key={type}
                onClick={() => setFilterType(filterType === type ? null : type)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  filterType === type 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
                  : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
            <div className="flex items-center gap-2 pr-2 border-r border-gray-100 dark:border-gray-800 shrink-0">
              <MapPin size={14} className="text-gray-300" />
            </div>
            {neighborhoods.map(hood => (
              <button 
                key={hood}
                onClick={() => setFilterHood(filterHood === hood ? null : hood)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                  filterHood === hood 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20' 
                  : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700'
                }`}
              >
                {hood}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-4">
        {filteredJobs.length > 0 ? filteredJobs.map((job) => (
          <div 
            key={job.id} 
            onClick={() => onJobClick(job)}
            className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800 active:scale-[0.98] transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1E5BFF]">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-[#1E5BFF] transition-colors">{job.role}</h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{job.company}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                job.type === 'CLT' ? 'bg-blue-50 text-blue-600' :
                job.type === 'PJ' ? 'bg-purple-50 text-purple-600' :
                'bg-emerald-50 text-emerald-600'
              }`}>
                {job.type}
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-tight">
                <MapPin size={12} /> {job.neighborhood}
              </div>
              <span className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest flex items-center gap-1">
                Ver detalhes <ChevronRight size={12} />
              </span>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center flex flex-col items-center opacity-30">
            <AlertCircle size={48} className="text-gray-400 mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest leading-relaxed">Nenhuma vaga<br/>encontrada com esses filtros.</p>
          </div>
        )}
      </main>
    </div>
  );
};
