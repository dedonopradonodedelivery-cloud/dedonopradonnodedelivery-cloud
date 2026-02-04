
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Star, 
  BadgeCheck, 
  MapPin, 
  Clock, 
  CreditCard, 
  User as UserIcon, 
  Calendar,
  MessageSquare,
  Zap,
  Info,
  Edit3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNeighborhood } from '../contexts/NeighborhoodContext';

interface UserProfileFullViewProps {
  onBack: () => void;
  onEdit: () => void;
}

export const UserProfileFullView: React.FC<UserProfileFullViewProps> = ({ onBack, onEdit }) => {
  const { user, userRole } = useAuth();
  const { currentNeighborhood } = useNeighborhood();

  // Mock de dados para o perfil completo (Lojista de exemplo para mostrar campos)
  const profileData = {
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0],
    rating: 4.9,
    reviewsCount: 154,
    neighborhood: currentNeighborhood === "Jacarepaguá (todos)" ? "Freguesia" : currentNeighborhood,
    bio: "Usuário ativo na comunidade do Localizei JPA. Sempre buscando as melhores dicas do bairro.",
    joinedAt: "Outubro de 2023",
    status: "Verificado",
    paymentMethods: ['Pix', 'Cartão Crédito', 'Dinheiro'],
    hours: [
      { day: 'Seg - Sex', hours: '08:00 - 18:00' },
      { day: 'Sáb', hours: '09:00 - 14:00' },
      { day: 'Dom', hours: 'Fechado' }
    ]
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-all">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Perfil Completo</h1>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Transparência Local</p>
        </div>
        <button onClick={onEdit} className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl active:scale-90 transition-all">
          <Edit3 size={18} />
        </button>
      </header>

      <main className="p-6 space-y-8 max-w-md mx-auto">
        {/* Card de Identidade Principal */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-[2rem] bg-gray-100 dark:bg-gray-800 border-4 border-white dark:border-gray-950 shadow-xl overflow-hidden mb-4">
            {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" /> : <UserIcon className="w-full h-full p-6 text-gray-300" />}
          </div>
          
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{profileData.name}</h2>
            <BadgeCheck className="text-blue-500" size={20} />
          </div>
          
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-full border border-yellow-100 dark:border-yellow-800/50">
              <Star className="text-yellow-500 fill-current" size={14} />
              <span className="text-sm font-black text-yellow-700 dark:text-yellow-400">{profileData.rating}</span>
              <span className="text-[10px] text-yellow-600/60 ml-0.5">({profileData.reviewsCount})</span>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest">
              {userRole === 'lojista' ? 'Lojista' : 'Morador'}
            </div>
          </div>
          
          <p className="mt-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium italic">"{profileData.bio}"</p>
        </section>

        {/* Informações de Localização e Tempo */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-2">
            <MapPin size={18} className="text-blue-500" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Bairro</p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{profileData.neighborhood}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-2">
            <Calendar size={18} className="text-indigo-500" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Membro desde</p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{profileData.joinedAt}</p>
          </div>
        </section>

        {/* Horários (Visíveis se for lojista ou dados preenchidos) */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Clock size={16} /> Horário de Funcionamento
          </h3>
          <div className="space-y-3">
            {profileData.hours.map((h, i) => (
              <div key={i} className="flex justify-between items-center pb-2 border-b last:border-0 border-gray-50 dark:border-gray-800">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{h.day}</span>
                <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">{h.hours}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Formas de Pagamento */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <CreditCard size={16} /> Formas de Pagamento
          </h3>
          <div className="flex flex-wrap gap-2">
            {profileData.paymentMethods.map(m => (
              <span key={m} className="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                {m}
              </span>
            ))}
          </div>
        </section>

        {/* Engajamento Local */}
        <section className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100 dark:border-blue-800/30 flex gap-4">
          <Zap className="w-8 h-8 text-[#1E5BFF] shrink-0" />
          <div>
            <h4 className="font-black text-sm text-blue-900 dark:text-blue-200 uppercase tracking-tighter">Engajamento no Bairro</h4>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 leading-relaxed">Você contribui para o bairro sendo um usuário verificado e participando das conversas locais.</p>
          </div>
        </section>

      </main>
    </div>
  );
};
