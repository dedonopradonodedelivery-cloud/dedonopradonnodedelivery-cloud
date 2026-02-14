
import React, { useMemo, useState } from 'react';
import { 
  Music, 
  Zap, 
  Search, 
  Car, 
  CloudSun, 
  PawPrint, 
  Baby, 
  HeartHandshake, 
  AlertTriangle,
  Plus,
  Flame
} from 'lucide-react';
import { StoryTheme, StoryItem } from '@/types';
import { StoryViewer } from './StoryViewer';

const MOCK_STORIES: StoryItem[] = [
  { id: '1', authorName: 'Rafael Carvalho', authorAvatar: 'https://i.pravatar.cc/100?u=raf', mediaUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800', type: 'image', timestamp: 'há 2h', summary: 'Noite de Jazz no Bar do Zeca hoje às 20h!' },
  { id: '2', authorName: 'Polícia Militar', authorAvatar: 'https://i.pravatar.cc/100?u=pm', mediaUrl: 'https://images.unsplash.com/photo-1581094371996-518296a8f15b?q=80&w=800', type: 'image', timestamp: 'há 10 min', summary: 'Blitz na Geremário Dantas sentido Freguesia.' },
  { id: '3', authorName: 'Dra. Ana Pet', authorAvatar: 'https://i.pravatar.cc/100?u=pet', mediaUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=800', type: 'image', timestamp: 'há 1h', summary: 'Visto Beagle perdido próximo ao Prezunic.' }
];

const THEMES_CONFIG: Omit<StoryTheme, 'stories'>[] = [
  { id: 'lost_child', label: 'CRIANÇA PERDIDA', icon: Baby, priority: true, placeholderSummary: 'Nenhum alerta agora' },
  { id: 'lost_pet', label: 'PET PERDIDO', icon: PawPrint, priority: true, placeholderSummary: 'Nenhum pet perdido' },
  { id: 'urgent', label: 'URGENTE NO BAIRRO', icon: Flame, priority: true, placeholderSummary: 'Tudo tranquilo em JPA' },
  { id: 'events', label: 'EVENTOS', icon: Music, priority: false },
  { id: 'utility', label: 'UTILIDADE', icon: Zap, priority: false },
  { id: 'lost_found', label: 'ACHADOS/PERDIDOS', icon: Search, priority: false },
  { id: 'traffic', label: 'TRÂNSITO', icon: Car, priority: false, isAI: true },
  { id: 'weather', label: 'ALERTA CLIMA', icon: CloudSun, priority: false, isAI: true },
  { id: 'solidarity', label: 'VIZINHANÇA SOLIDÁRIA', icon: HeartHandshake, priority: false },
  { id: 'reports', label: 'DENÚNCIAS', icon: AlertTriangle, priority: false, isModerated: true },
];

export const StoriesBlock: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<StoryTheme | null>(null);

  const activeThemes = useMemo(() => {
    return THEMES_CONFIG.map(config => {
      const themeStories = config.id === 'events' ? MOCK_STORIES.slice(0, 1) : 
                          config.id === 'traffic' ? MOCK_STORIES.slice(1, 2) : 
                          config.id === 'lost_pet' ? MOCK_STORIES.slice(2, 3) : [];
      
      return { ...config, stories: themeStories } as StoryTheme;
    }).sort((a, b) => {
      const aPoints = (a.stories.length > 0 ? 100 : 0) + (a.priority ? 50 : 0);
      const bPoints = (b.stories.length > 0 ? 100 : 0) + (b.priority ? 50 : 0);
      return bPoints - aPoints;
    });
  }, []);

  return (
    <section className="py-6">
      <div className="px-6 mb-5 flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500">Acontecendo Agora</h2>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-rose-500/10 rounded-full border border-rose-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></div>
          <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Live</span>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-4 snap-x">
        {activeThemes.map((theme) => {
          const hasContent = theme.stories.length > 0;
          return (
            <button
              key={theme.id}
              onClick={() => hasContent && setSelectedTheme(theme)}
              className={`relative flex-shrink-0 w-[120px] aspect-[9/16] rounded-2xl overflow-hidden shadow-md snap-start group transition-all active:scale-95 bg-gray-100 dark:bg-gray-900 ${
                hasContent ? '' : 'cursor-default'
              } ${
                theme.priority && hasContent ? 'ring-2 ring-rose-500 ring-offset-2 dark:ring-offset-gray-950' : ''
              }`}
            >
              {/* Background Layer */}
              {hasContent ? (
                <>
                  <img 
                    src={theme.stories[0].mediaUrl} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt="" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                </>
              ) : (
                <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900"></div>
              )}

              {/* UI Layer */}
              <div className="relative z-10 w-full h-full p-3 flex flex-col">
                {/* Top Tag */}
                <span className={`px-2 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest backdrop-blur-md border ${
                    theme.priority && hasContent 
                      ? 'bg-rose-500/90 text-white border-rose-400/30' 
                      : 'bg-black/40 text-white border-white/10'
                  }`}>
                  {theme.label}
                </span>
                
                {/* Empty State Center Content */}
                {!hasContent && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                    <theme.icon size={22} className="text-gray-400 mb-2" />
                    <p className="text-[8px] font-bold text-gray-400 uppercase leading-tight px-2">{theme.placeholderSummary || 'Sem Posts'}</p>
                  </div>
                )}
              </div>
              
              {/* Overlay for Priority */}
              {theme.priority && hasContent && (
                  <div className="absolute inset-0 border-2 border-rose-500/30 animate-pulse rounded-2xl pointer-events-none"></div>
              )}
            </button>
          );
        })}
      </div>

      {selectedTheme && (
        <StoryViewer 
          theme={selectedTheme} 
          onClose={() => setSelectedTheme(null)} 
        />
      )}
    </section>
  );
};
