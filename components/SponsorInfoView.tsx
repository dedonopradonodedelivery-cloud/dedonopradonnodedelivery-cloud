
import React from 'react';
import { ChevronLeft, ArrowRight, Crown, CheckCircle2 } from 'lucide-react';

interface SponsorInfoViewProps {
  onBack: () => void;
}

export const SponsorInfoView: React.FC<SponsorInfoViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-900 font-sans animate-in slide-in-from-right duration-300 text-white">
      <div className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-800"><ChevronLeft className="w-6 h-6 text-white" /></button>
        <h1 className="font-bold text-lg">Patrocinador Master</h1>
      </div>
      
      <div className="p-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-[#1E5BFF] rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Crown className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-4 font-display text-white">Grupo Esquematiza</h2>
        <p className="text-gray-300 text-sm mb-8 leading-relaxed max-w-sm">
            O <strong>Patrocinador Master</strong> apoia o desenvolvimento e a digitalização do comércio local em Jacarepaguá.
        </p>
        <div className="w-full bg-gray-800/50 rounded-2xl p-6 border border-gray-700 text-left space-y-4 mb-8">
            <h3 className="font-bold text-yellow-400 text-sm uppercase tracking-wide">Destaque Regional</h3>
            <ul className="space-y-3 text-sm text-gray-200">
                <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    <span>Segurança e Facilities com excelência.</span>
                </li>
                <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    <span>Líder em serviços para condomínios.</span>
                </li>
            </ul>
        </div>
        <a href="https://wa.me/5521985559480" target="_blank" rel="noopener noreferrer" className="bg-[#1E5BFF] text-white font-bold py-4 rounded-full w-full shadow-lg flex items-center justify-center gap-2">Falar no WhatsApp <ArrowRight className="w-4 h-4" /></a>
      </div>
    </div>
  );
};
