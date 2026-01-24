
import React, { useState, useMemo } from 'react';
import { ChevronLeft, Briefcase, MapPin, Clock, DollarSign, MessageCircle, AlertCircle, Building2, CheckCircle2, ChevronRight, X, Filter } from 'lucide-react';
import { MOCK_JOBS } from '../constants';
import { Job } from '../types';

interface JobsViewProps {
  onBack: () => void;
}

const JobDetailModal: React.FC<{ job: Job; onClose: () => void }> = ({ job, onClose }) => {
  const handleApply = () => {
    const text = `Olá! Vi a vaga de *${job.role}* no app Localizei JPA e gostaria de me candidatar.`;
    const url = `https://wa.me/${job.contactWhatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-950 w-full max-w-md h-[90vh] rounded-t-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Modal */}
        <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-950 sticky top-0 z-10">
          <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Detalhes da Vaga</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 pb-32">
          {/* Card Principal de Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-[#1E5BFF]">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{job.role}</h3>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{job.company}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                job.type === 'CLT' ? 'bg-blue-100 text-blue-700' :
                job.type === 'PJ' ? 'bg-purple-100 text-purple-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {job.type}
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <MapPin size={10} /> {job.neighborhood}
              </span>
            </div>
          </div>

          {/* Descrição */}
          <section className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Sobre a oportunidade</h4>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                {job.description}
              </p>
            </div>
          </section>

          {/* Requisitos */}
          <section className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Requisitos e Horário</h4>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-sm font-bold text-gray-700 dark:text-gray-200">
                <Clock size={18} className="text-blue-500" />
                {job.schedule}
              </div>
              <div className="h-px bg-gray-50 dark:bg-gray-800"></div>
              <div className="space-y-3">
                {job.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="p-6 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 sticky bottom-0">
          <button 
            onClick={handleApply}
            className="w-full bg-[#1E5BFF] hover:bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            <MessageCircle size={20} className="fill-current" />
            Entrar em contato
          </button>
        </div>
      </div>
    </div>
  );
};

export const JobsView: React.FC<JobsViewProps> = ({ onBack }) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
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
            onClick={() => setSelectedJob(job)}
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

      {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
};
