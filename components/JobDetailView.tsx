
import React from 'react';
import { Job, CompatibilityResult } from '../types';
import { User } from '@supabase/supabase-js';
import { 
  ChevronLeft, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Building2, 
  CheckCircle2, 
  Info,
  DollarSign,
  Tag,
  ThumbsUp,
  AlertTriangle
} from 'lucide-react';

interface JobDetailViewProps {
  user: User | null;
  job: Job;
  compatibility?: CompatibilityResult;
  onBack: () => void;
}

const CompatibilityDetails: React.FC<{ analysis: CompatibilityResult }> = ({ analysis }) => {
    return (
        <section className="space-y-4">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] px-1">Análise de Compatibilidade</h4>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">Seu Score</h3>
                    <div className="text-4xl font-black text-emerald-500 italic">{analysis.score_total} / 100</div>
                </div>
                
                {analysis.pontos_fortes.length > 0 && (
                    <div className="space-y-3">
                        <h5 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2"><ThumbsUp size={14}/> Pontos Fortes</h5>
                        <ul className="space-y-2">
                            {analysis.pontos_fortes.map((point, i) => (
                                <li key={i} className="flex items-start gap-3 text-xs font-medium text-gray-700 dark:text-gray-300">
                                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {analysis.pontos_de_atencao.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-gray-50 dark:border-gray-800">
                        <h5 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2"><AlertTriangle size={14}/> Pontos de Atenção</h5>
                        <ul className="space-y-2">
                            {analysis.pontos_de_atencao.map((point, i) => (
                                <li key={i} className="flex items-start gap-3 text-xs font-medium text-gray-700 dark:text-gray-300">
                                    <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </section>
    );
};

export const JobDetailView: React.FC<JobDetailViewProps> = ({ user, job, compatibility, onBack }) => {
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
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 flex flex-col font-sans animate-in fade-in duration-300">
      {/* Header */}
      <header className="px-6 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4 bg-white dark:bg-gray-950 sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-all">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Detalhes da Vaga</h2>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 pb-32">
        {/* Card Principal de Info */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-[1.5rem] flex items-center justify-center text-[#1E5BFF] border border-blue-100 dark:border-blue-800/50 shadow-sm shrink-0">
              <Building2 size={32} />
            </div>
            <div>
              {job.isVerified && (
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-widest mb-1.5 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full w-fit">
                    <CheckCircle2 size={12} /> Vaga verificada
                </div>
              )}
              <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tighter">{job.role}</h3>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">{job.company}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3">
               <Tag size={16} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">{job.type}</span>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3">
               <Clock size={16} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">{job.schedule_type || 'Horário integral'}</span>
            </div>
          </div>
        </section>

        {compatibility && <CompatibilityDetails analysis={compatibility} />}

        {/* Sobre a Vaga */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] px-1">Sobre a oportunidade</h4>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              {job.description}
            </p>
            {job.salary && (
                <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Remuneração:</span>
                    <span className="text-lg font-black text-emerald-600 italic">{job.salary}</span>
                </div>
            )}
          </div>
        </section>

        {/* Requisitos */}
        {job.requirements && job.requirements.length > 0 && (
          <section className="space-y-4">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] px-1">O que buscamos</h4>
            <div className="space-y-3">
              {job.requirements.map((req, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-start gap-4 shadow-sm">
                  <div className="p-1 bg-blue-50 dark:bg-blue-900/30 rounded-md mt-0.5"><CheckCircle2 size={14} className="text-blue-500" /></div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-200 leading-relaxed">{req}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Localização e Data */}
        <section className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-800/30 space-y-4">
            <div className="flex items-center gap-3">
                <MapPin size={20} className="text-[#1E5BFF]" />
                <div>
                    <p className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest">Local de Trabalho</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-tight">{job.neighborhood}, Jacarepaguá</p>
                </div>
            </div>
            <div className="flex items-center gap-3 opacity-60">
                <Clock size={16} className="text-gray-400" />
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Publicado em {job.postedAt}</p>
            </div>
        </section>

        {/* Disclaimer */}
        <section className="px-1 flex items-start gap-3 opacity-60">
            <Info size={14} className="text-gray-400 shrink-0 mt-0.5" />
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                O Localizei JPA não participa da seleção. Toda a comunicação e contratação é feita diretamente entre empresa e candidato.
            </p>
        </section>
      </div>

      {/* Footer CTA */}
      <div className="fixed bottom-[80px] left-0 right-0 p-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 z-50 max-w-md mx-auto shadow-2xl">
        <button 
          onClick={handleApply}
          className="w-full bg-[#00D95F] hover:bg-[#00C254] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs shadow-xl shadow-green-500/20 active:scale-95 transition-all"
        >
          <MessageCircle size={20} className="fill-current" />
          Me candidatar pelo WhatsApp
        </button>
      </div>
    </div>
  );
};
