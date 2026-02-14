
import React, { useState, useEffect, useRef, useCallback } from 'react';
// Added missing Heart icon to lucide-react imports
import { X, Send, MoreHorizontal, MessageCircle, Share2, AlertTriangle, Play, Pause, Heart } from 'lucide-react';

interface StoryItem {
  id: number;
  type: string;
  image: string;
  videoUrl?: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
}

interface StoryViewerProps {
  stories: StoryItem[];
  initialIndex: number;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ stories, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [message, setMessage] = useState('');
  
  const progressTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number>(0);
  
  const STORY_DURATION = 15000; // 15 segundos por story

  const goNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
      pausedAtRef.current = 0;
      startTimeRef.current = null;
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
      pausedAtRef.current = 0;
      startTimeRef.current = null;
    } else {
      setProgress(0);
      pausedAtRef.current = 0;
      startTimeRef.current = null;
    }
  }, [currentIndex]);

  // Lógica de animação do progresso
  useEffect(() => {
    if (isPaused) {
      if (progressTimerRef.current) cancelAnimationFrame(progressTimerRef.current);
      return;
    }

    const animate = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time - pausedAtRef.current;
      
      const elapsed = time - startTimeRef.current;
      const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);
      
      setProgress(newProgress);
      pausedAtRef.current = elapsed;

      if (newProgress < 100) {
        progressTimerRef.current = requestAnimationFrame(animate);
      } else {
        goNext();
      }
    };

    progressTimerRef.current = requestAnimationFrame(animate);
    return () => {
      if (progressTimerRef.current) cancelAnimationFrame(progressTimerRef.current);
    };
  }, [currentIndex, isPaused, goNext]);

  const handleInteractionStart = () => setIsPaused(true);
  const handleInteractionEnd = () => setIsPaused(false);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const charCode = 'clientX' in e ? e.clientX : (e as React.TouchEvent).touches[0].clientX;
    const screenWidth = window.innerWidth;
    
    if (charCode < screenWidth * 0.3) {
      goPrev();
    } else {
      goNext();
    }
  };

  const activeStory = stories[currentIndex];

  return (
    <div className="fixed inset-0 z-[3000] bg-black flex flex-col animate-in fade-in zoom-in-95 duration-300 overflow-hidden select-none">
      {/* Background Media */}
      <div className="absolute inset-0 flex items-center justify-center">
        {activeStory.videoUrl ? (
          <video 
            src={activeStory.videoUrl} 
            autoPlay 
            muted={false} 
            playsInline 
            className="w-full h-full object-cover"
            onEnded={goNext}
          />
        ) : (
          <img 
            src={activeStory.image} 
            alt={activeStory.type} 
            className="w-full h-full object-cover" 
          />
        )}
      </div>

      {/* Overlays decorativos */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none"></div>

      {/* Top Interface */}
      <div className="relative z-10 p-4 pt-6 space-y-4">
        {/* Progress Bars */}
        <div className="flex gap-1.5 px-1">
          {stories.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-none"
                style={{ 
                  width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%' 
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-white/20 p-0.5 overflow-hidden shadow-lg">
              <img src={activeStory.authorAvatar} alt={activeStory.authorName} className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white drop-shadow-md uppercase tracking-tighter">{activeStory.authorName}</span>
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{activeStory.timestamp}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-full text-white active:scale-90 transition-transform"
          >
            <X size={24} />
          </button>
        </div>

        {/* Story Type Label */}
        <div className="px-1">
            <span className="inline-flex bg-blue-600/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-[8px] font-black text-white uppercase tracking-[0.2em] shadow-lg">
                {activeStory.type}
            </span>
        </div>
      </div>

      {/* Invisible Tap Areas */}
      <div 
        className="absolute inset-0 z-0 flex"
        onMouseDown={handleInteractionStart}
        onMouseUp={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        onClick={handleTap}
      >
        <div className="w-[30%] h-full cursor-pointer" title="Anterior"></div>
        <div className="w-[70%] h-full cursor-pointer" title="Próximo"></div>
      </div>

      {/* Footer Interface */}
      <div className="mt-auto relative z-10 p-6 pb-10 space-y-6">
        <div className="flex items-center gap-3">
            <div className="flex-1 relative group">
                <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onFocus={handleInteractionStart}
                    onBlur={handleInteractionEnd}
                    placeholder="Enviar mensagem..."
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full py-4 px-6 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/30 transition-all shadow-2xl"
                />
                <button 
                    disabled={!message.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-lg active:scale-90 transition-all disabled:opacity-0 disabled:scale-50"
                >
                    <Send size={18} fill="currentColor" className="ml-0.5" />
                </button>
            </div>
            
            <div className="flex items-center gap-2">
                <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/10 active:scale-90 transition-all">
                    <Heart size={20} />
                </button>
                <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/10 active:scale-90 transition-all">
                    <Share2 size={20} />
                </button>
                <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/10 active:scale-90 transition-all">
                    <AlertTriangle size={20} className="text-amber-400" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
