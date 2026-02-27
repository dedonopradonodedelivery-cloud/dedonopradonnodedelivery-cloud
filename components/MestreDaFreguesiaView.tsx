import React from 'react';
import { ChevronLeft, Flame, Heart, Star, Zap, Shield, Play, ChevronRight, Medal } from 'lucide-react';

interface MestreDaFreguesiaViewProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
}

export const MestreDaFreguesiaView: React.FC<MestreDaFreguesiaViewProps> = ({ onBack, onNavigate }) => {
  // Mock user state
  const xp = 2450;
  const level = 3;
  const levelName = "Freguês Atento";
  const lives = 3;
  const streak = 12;
  const nextLevelXp = 3000;

  const progress = (xp / nextLevelXp) * 100;

  return (
    <div className="min-h-screen text-white pb-40 font-sans selection:bg-blue-500/30 relative">
      <style>{`
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .animate-pulse-scale {
          animation: pulse-scale 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* Fixed Full Bleed Background */}
      <div className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-gradient-to-br from-[#0A0A0A] via-[#0A0A0A] to-[#0a192f] -z-10" />
      
      {/* Background Animated Gradients */}
      <div className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-[#0A0A0A]/60 backdrop-blur-xl border-b border-white/5 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="p-2 -ml-2 text-white/70 hover:text-white transition-colors">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-lg font-black tracking-tighter uppercase">Mestre da Freguesia</h1>
            <div className="w-8" /> {/* Spacer */}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="flex items-center gap-2">
              <Heart size={18} className="text-rose-500 fill-rose-500" />
              <span className="font-bold">{lives}</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <Star size={18} className="text-blue-500 fill-blue-500" />
              <span className="font-bold">{xp}</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-orange-500 fill-orange-500" />
              <span className="font-bold">{streak}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-8">
          {/* Level Progress */}
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Nível {level}</p>
                <h2 className="text-2xl font-black tracking-tight text-blue-400">{levelName}</h2>
              </div>
              <Medal size={32} className="text-blue-500 opacity-80" />
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            <p className="text-xs font-medium text-white/40 text-right">{xp} / {nextLevelXp} Recompensa</p>
          </div>

          {/* Other Modes */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => onNavigate('quiz', { mode: 'lightning' })}
              className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col items-start gap-3 active:scale-[0.96] transition-all hover:bg-white/10"
            >
              <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-500">
                <Zap size={24} className="fill-amber-500" />
              </div>
              <div className="text-left">
                <h4 className="font-bold tracking-tight">Relâmpago</h4>
                <p className="text-xs text-white/50 mt-0.5">60 segundos</p>
              </div>
            </button>

            <button 
              className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col items-start gap-3 active:scale-[0.96] transition-all hover:bg-white/10"
            >
              <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-500">
                <Shield size={24} className="fill-purple-500" />
              </div>
              <div className="text-left">
                <h4 className="font-bold tracking-tight">Sobrevivência</h4>
                <p className="text-xs text-white/50 mt-0.5">Até errar</p>
              </div>
            </button>
          </div>

          {/* Rankings Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black tracking-tight">Ranking Semanal</h3>
              <button className="text-xs font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1">
                Ver todos <ChevronRight size={14} />
              </button>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-2">
              {[
                { pos: 1, name: "João P.", xp: 4500, isMe: false },
                { pos: 2, name: "Maria S.", xp: 4200, isMe: false },
                { pos: 3, name: "Você", xp: 2450, isMe: true },
              ].map((user, i) => (
                <div key={i} className={`flex items-center gap-4 p-3 rounded-2xl ${user.isMe ? 'bg-blue-600/20 border border-blue-500/30' : ''}`}>
                  <span className={`font-black w-6 text-center ${user.pos === 1 ? 'text-amber-400' : user.pos === 2 ? 'text-gray-300' : user.pos === 3 ? 'text-amber-700' : 'text-white/40'}`}>
                    {user.pos}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{user.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-blue-400">{user.xp}</p>
                    <p className="text-[10px] font-bold text-white/40 uppercase">Recompensa</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-24 left-0 right-0 p-6 z-50 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <button 
            onClick={() => onNavigate('quiz', { mode: 'daily' })}
            className="w-full relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-600 to-blue-500 p-6 flex items-center justify-center gap-5 group active:scale-[0.95] transition-all shadow-[0_0_40px_rgba(37,99,235,0.5)] hover:shadow-[0_0_50px_rgba(37,99,235,0.7)] animate-pulse-scale border border-blue-400/30"
          >
            <div className="absolute inset-0 bg-blue-400/20 animate-pulse" />
            <div className="absolute inset-0 bg-white/0 active:bg-white/20 transition-colors duration-300" />
            
            <Play size={36} className="text-white fill-white relative z-10 drop-shadow-lg" />
            <div className="text-left relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-1.5 drop-shadow-md">Desafio Diário</h3>
              <p className="text-[10px] font-bold text-blue-100 uppercase tracking-[0.2em] opacity-90">+50 Recompensa</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
