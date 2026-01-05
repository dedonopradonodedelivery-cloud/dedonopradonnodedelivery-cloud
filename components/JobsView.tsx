
import React, { useState, useMemo } from 'react';
import { ChevronLeft, Briefcase, MapPin, Clock, DollarSign, MessageCircle, AlertCircle, Building2, CheckCircle2, ChevronDown } from 'lucide-react';
import { MOCK_JOBS } from '../constants';
import { Job } from '../types';
import { useNeighborhood } from '../contexts/NeighborhoodContext';

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
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-md h-[85vh] sm:h-auto sm:max-h-[85vh] rounded-t-[2rem] sm:rounded-3xl p-6 flex flex-col relative animate-in slide-in-from-bottom duration-300 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <span className="sr-only">Fechar</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="flex-1 overflow-y-auto pr-2 pb-20 no-scrollbar">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
              {job.type}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-1">
              {job.role}
            </h2>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium text-sm">
              <Building2 className="w-4 h-4" />
              {job.company}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Local</span>
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{job.neighborhood}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Horário</span>
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{job.schedule}</p>
            </div>
            {job.salary && (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 col-span-2">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Salário / Remuneração</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{job.salary}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">Descrição</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {job.description}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">Requisitos</h3>
              <ul className="space-y-2">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <button 
            onClick={handleApply}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Candidatar-se via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export const JobsView: React.FC<JobsViewProps> = ({ onBack }) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { currentNeighborhood, isAll, toggleSelector } = useNeighborhood();

  // Filter jobs by neighborhood
  const sortedJobs = useMemo(() => {
    let list = [...MOCK_JOBS];
    
    // Sort Priority: Local > Others
    list.sort((a, b) => {
        if (isAll) return 0; // Default order for All
        
        const aIsLocal = a.neighborhood === currentNeighborhood;
        const bIsLocal = b.neighborhood === currentNeighborhood;
        
        if (aIsLocal && !bIsLocal) return -1;
        if (!aIsLocal && bIsLocal) return 1;
        return 0;
    });

    return list;
  }, [currentNeighborhood, isAll]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300 pb-10">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div className="flex-1">
            <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#1E5BFF]" />
              Vagas de Emprego
            </h1>
            <button 
              onClick={toggleSelector}
              className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5"
            >
              <MapPin className="w-3 h-3" />
              <span>{currentNeighborhood === 'Jacarepaguá (todos)' ? 'Todo Bairro' : currentNeighborhood}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
        </div>
      </div>

      <div className="p-5">
        {sortedJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Nenhuma vaga encontrada</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mt-2">
              Não encontramos vagas no momento.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                    Todas as vagas são de empresas locais. O contato é feito diretamente com o contratante.
                </p>
            </div>

            {sortedJobs.map((job) => (
              <div 
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.98] transition-all cursor-pointer group relative overflow-hidden"
              >
                {job.isUrgent && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-bl-xl uppercase tracking-wider">
                        Urgente
                    </div>
                )}
                
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{job.role}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{job.company}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold uppercase rounded-md border border-gray-200 dark:border-gray-600">
                        {job.type}
                    </span>
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md border ${
                        job.neighborhood === currentNeighborhood && !isAll
                         ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                         : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                    }`}>
                        {job.neighborhood}
                    </span>
                    {job.salary && (
                        <span className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase rounded-md border border-green-100 dark:border-green-800">
                            {job.salary}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xs text-gray-400 font-medium">Publicado {job.postedAt}</span>
                    <span className="text-xs font-bold text-[#1E5BFF] group-hover:underline">Ver detalhes</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
};
