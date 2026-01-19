
import React from 'react';
import { 
  ChevronLeft, 
  MessageSquare, 
  Camera, 
  Video, 
  Quote, 
  UserPlus, 
  MoreHorizontal,
  MapPin,
  Heart,
  Smile,
  ShieldCheck,
  Users,
  Grid,
  Star
} from 'lucide-react';

interface OrkutViewProps {
  onBack: () => void;
}

// --- MOCK DATA ---
const USER_PROFILE = {
  name: "Fernanda Lima",
  status: "vivendo um dia de cada vez ✨",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
  scraps: 124,
  photos: 450,
  videos: 12,
  fans: 89,
  metrics: {
    trusty: 90, // Confiável
    cool: 75,   // Legal
    sexy: 100   // Sexy
  },
  about: {
    relationship: "Solteira",
    city: "Rio de Janeiro",
    bairro: "Freguesia",
    interest: "Networking, Cafés, Design",
    humor: "Ansiosa",
    aniver: "15 de Novembro"
  }
};

const FRIENDS = Array.from({ length: 9 }).map((_, i) => ({
  id: i,
  image: `https://i.pravatar.cc/150?img=${i + 10}`,
  name: ["João", "Ana", "Pedro", "Luiza", "Carlos", "Bia", "Du", "Mari", "Gui"][i]
}));

const COMMUNITIES = [
  { id: 1, name: "Eu odeio acordar cedo", image: "https://images.unsplash.com/photo-1541781777631-fa9531908431?q=80&w=200&auto=format&fit=crop" },
  { id: 2, name: "Amo Freguesia JPA", image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=200&auto=format&fit=crop" },
  { id: 3, name: "Café é vida", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=200&auto=format&fit=crop" },
  { id: 4, name: "Designers Depressivos", image: "https://images.unsplash.com/photo-1626785774573-4b799312c95d?q=80&w=200&auto=format&fit=crop" },
  { id: 5, name: "Só ouço as antigas", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&auto=format&fit=crop" },
  { id: 6, name: "Netflix & Chill", image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=200&auto=format&fit=crop" },
];

export const OrkutView: React.FC<OrkutViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 pb-24">
      
      {/* HEADER / NAVIGATION */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-white" />
          </button>
          <span className="text-[#E91C5D] font-black text-lg tracking-tight">orkut<span className="text-xs align-top bg-blue-100 text-blue-600 px-1 rounded ml-1">BETA</span></span>
        </div>
        <button className="text-gray-400">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      <div className="p-5 space-y-6">

        {/* --- COLUNA ESQUERDA (Identidade) --- */}
        <section className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl mb-4">
              <img src={USER_PROFILE.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{USER_PROFILE.name}</h1>
            <p className="text-sm text-gray-500 font-medium italic mb-6">"{USER_PROFILE.status}"</p>

            {/* Ações Principais */}
            <div className="grid grid-cols-4 gap-2 w-full mb-6">
              {[
                { label: 'Recados', icon: MessageSquare, count: USER_PROFILE.scraps },
                { label: 'Fotos', icon: Camera, count: USER_PROFILE.photos },
                { label: 'Vídeos', icon: Video, count: USER_PROFILE.videos },
                { label: 'Fãs', icon: Star, count: USER_PROFILE.fans },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF] flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">{item.label}</span>
                  <span className="text-[9px] text-gray-400 font-medium">{item.count}</span>
                </div>
              ))}
            </div>

            <button className="w-full bg-[#E91C5D] text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" />
              Adicionar Amigo
            </button>
          </div>
        </section>

        {/* --- COLUNA CENTRAL (Sobre Mim & Stats) --- */}
        <section className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
          
          {/* Métricas Modernas (Confiável / Legal / Sexy) */}
          <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${USER_PROFILE.metrics.trusty}%` }}></div>
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase">Confiável</span>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex flex-col items-center gap-1">
              <Smile className="w-6 h-6 text-amber-400" />
              <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: `${USER_PROFILE.metrics.cool}%` }}></div>
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase">Legal</span>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex flex-col items-center gap-1">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500" style={{ width: `${USER_PROFILE.metrics.sexy}%` }}></div>
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase">Sexy</span>
            </div>
          </div>

          {/* Social / About */}
          <div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
              Quem sou eu
            </h3>
            
            <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Relacionamento:</span>
                    <span className="text-gray-800 dark:text-gray-200 font-bold">{USER_PROFILE.about.relationship}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Mora em:</span>
                    <span className="text-gray-800 dark:text-gray-200 font-bold flex items-center gap-1">
                       <MapPin className="w-3 h-3 text-[#1E5BFF]" /> {USER_PROFILE.about.city}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Bairro:</span>
                    <span className="text-gray-800 dark:text-gray-200 font-bold">{USER_PROFILE.about.bairro}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Interesses:</span>
                    <span className="text-gray-800 dark:text-gray-200 font-bold text-right">{USER_PROFILE.about.interest}</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic">
                        "Apaixonada por café, design e pela vida no bairro. Sempre em busca de novos lugares na Freguesia. Me adiciona pra trocar ideia!"
                    </p>
                </div>
            </div>
          </div>
        </section>

        {/* --- COLUNA DIREITA (Social Graph) --- */}
        <section className="space-y-6">
            
            {/* Amigos */}
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        Amigos <span className="text-[#1E5BFF]">(342)</span>
                    </h3>
                    <button className="text-[10px] font-bold text-[#1E5BFF] uppercase tracking-widest hover:underline">Ver todos</button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                    {FRIENDS.map((friend) => (
                        <div key={friend.id} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#1E5BFF] transition-all">
                                <img src={friend.image} alt={friend.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate w-full text-center">{friend.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Comunidades */}
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <Grid className="w-4 h-4 text-gray-400" />
                        Comunidades <span className="text-[#1E5BFF]">(56)</span>
                    </h3>
                    <button className="text-[10px] font-bold text-[#1E5BFF] uppercase tracking-widest hover:underline">Ver todas</button>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                    {COMMUNITIES.map((comm) => (
                        <div key={comm.id} className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group">
                            <img src={comm.image} alt={comm.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                                <span className="text-[9px] font-bold text-white leading-tight line-clamp-2">{comm.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>

      </div>
    </div>
  );
};
