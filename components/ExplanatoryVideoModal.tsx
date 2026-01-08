
import React from 'react';
import { X, Play } from 'lucide-react';

interface ExplanatoryVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export const ExplanatoryVideoModal: React.FC<ExplanatoryVideoModalProps> = ({ isOpen, onClose, videoUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
      
      <div className="w-full max-w-lg relative bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        
        {/* Header Flutuante */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20 bg-gradient-to-b from-black/80 to-transparent">
          <div>
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest bg-white/10 px-2 py-1 rounded-md backdrop-blur-sm">
              Vídeo Explicativo
            </span>
            <h3 className="text-white font-bold text-lg mt-1 shadow-black drop-shadow-md">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
          <video 
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      <p className="text-white/50 text-xs mt-6 font-medium text-center max-w-xs">
        Toque no X ou fora do vídeo para fechar.
      </p>
    </div>
  );
};
