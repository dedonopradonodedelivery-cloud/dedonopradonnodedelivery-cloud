
import React from 'react';
import { Job } from '../types';
import { 
  ChevronLeft, 
  Briefcase, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Building2, 
  CheckCircle2, 
  X 
} from 'lucide-react';

interface JobDetailViewProps {
  job: Job;
  onBack: () => void;
}

export const JobDetailView: React.FC<JobDetailViewProps> = ({ job, onBack }) => {
  const handleApply = () => {
    if (!job.contactWhatsapp) {
      alert("Informações de contato não disponíveis.");
      return;
    }
    const text = `Olá! Vi a vaga de *${job.role}* no app Localizei JPA e gostaria de me candidatar.`;
    const url = `https://wa.me/${job.contactWhatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans animate-in fade-in duration-300">
      {/* Header */}
      <header className="px-6 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4 bg-white dark:bg-gray-950 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Detalhes da Vaga</h2>
      </header>

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
            <div className="h-px bg-gray-50 dark:border-gray-800"></div>
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
  );
};
