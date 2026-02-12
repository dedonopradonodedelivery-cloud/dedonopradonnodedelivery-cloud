
import React, { useState, useEffect, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  ChevronLeft, 
  Camera, 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Loader2, 
  Save, 
  AtSign, 
  AlertCircle,
  Hash,
  Heart,
  Edit3
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { NEIGHBORHOOD_COMMUNITIES } from '@/constants';

interface EditProfileViewProps {
  user: User;
  onBack: () => void;
}

export const EditProfileView: React.FC<EditProfileViewProps> = ({ user, onBack }) => {
  const [name, setName] = useState(user.user_metadata?.full_name || '');
  const [username, setUsername] = useState(user.user_metadata?.username || '');
  const [bio, setBio] = useState('Morador da Freguesia em busca do melhor do bairro!');
  const [phone, setPhone] = useState('');
  const [email] = useState(user.email || '');
  const [neighborhood, setNeighborhood] = useState('Freguesia');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Lista de comunidades que o usuário participa (vindo do localStorage para consistência MVP)
  const joinedIds = useMemo(() => {
    const saved = localStorage.getItem('joined_communities_jpa');
    return saved ? JSON.parse(saved) : [];
  }, []);

  const joinedCommunities = useMemo(() => 
    NEIGHBORHOOD_COMMUNITIES.filter(c => joinedIds.includes(c.id)),
    [joinedIds]
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          setName(data.full_name || user.user_metadata?.full_name || '');
          setUsername(data.username || user.user_metadata?.username || '');
          setPhone(data.phone || '');
          setNeighborhood(data.neighborhood || 'Freguesia');
          if (data.bio) setBio(data.bio);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updates = { 
        full_name: name, 
        username, 
        phone, 
        neighborhood, 
        bio,
        updated_at: new Date().toISOString() 
      };
      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
      if (error) throw error;
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center"><Loader2 className="w-10 h-10 text-[#1E5BFF] animate-spin mb-4" /><p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Sincronizando Perfil...</p></div>;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in slide-in-from-right duration-300">
      {/* Header Fixo */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-20 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <ChevronLeft size={20} className="text-gray-800 dark:text-white" />
          </button>
          <div>
            <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Perfil Moderno</h1>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Identidade Localizei</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="p-3 bg-[#1E5BFF] text-white rounded-2xl shadow-lg shadow-blue-500/20 active:scale-90 transition-transform">
           {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
        </button>
      </div>

      <div className="p-6 space-y-8">
        
        {/* 1. CARTÃO DE IDENTIDADE (ESTILO ORKUT) */}
        <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 shadow-xl shadow-black/5 border border-gray-100 dark:border-gray-800 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-[#1E5BFF] to-[#4D7CFF] opacity-10"></div>
          
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-[2.5rem] bg-gray-200 dark:bg-gray-800 overflow-hidden border-4 border-white dark:border-gray-900 shadow-2xl mx-auto group">
              {user.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" /> : <UserIcon className="w-full h-full p-8 text-gray-400" />}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">{name || 'Usuário JPA'}</h2>
          <p className="text-xs text-[#1E5BFF] font-black uppercase tracking-[0.2em] mt-2 flex items-center justify-center gap-1">
             <AtSign size={12} strokeWidth={3} /> {username || 'jpanativo'}
          </p>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 relative">
             <Edit3 size={14} className="absolute top-3 right-3 text-gray-300" />
             <textarea 
               value={bio}
               onChange={(e) => setBio(e.target.value)}
               className="bg-transparent border-none w-full text-sm text-gray-600 dark:text-gray-400 text-center italic leading-relaxed outline-none resize-none"
               rows={2}
               placeholder="Sua bio curta aqui..."
             />
          </div>

          <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-50 dark:border-gray-800">
             <div className="text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Membro de</p>
                <p className="text-lg font-black text-gray-900 dark:text-white">{joinedCommunities.length}</p>
             </div>
             <div className="w-px h-8 bg-gray-100 dark:bg-gray-800"></div>
             <div className="text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Local</p>
                <p className="text-lg font-black text-gray-900 dark:text-white">{neighborhood}</p>
             </div>
          </div>
        </div>

        {/* 2. MINHAS COMUNIDADES (CARDS HORIZONTAIS) */}
        <section>
          <div className="flex items-center justify-between px-2 mb-4">
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Minhas Comunidades</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ver todas</span>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
            {joinedCommunities.length > 0 ? joinedCommunities.map((comm) => (
              <div key={comm.id} className="w-32 flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer">
                <div className={`w-20 h-20 rounded-[1.5rem] ${comm.color} shadow-lg flex items-center justify-center text-white border-2 border-white dark:border-gray-900 group-active:scale-90 transition-all`}>
                  {React.cloneElement(comm.icon as any, { size: 32, strokeWidth: 2 })}
                </div>
                <span className="text-[9px] font-black text-gray-900 dark:text-white uppercase tracking-tighter text-center line-clamp-1">
                  {comm.name}
                </span>
              </div>
            )) : (
              <div className="w-full bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 text-center flex flex-col items-center">
                 <Hash size={24} className="text-gray-200 mb-2" />
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nenhuma comunidade ainda</p>
              </div>
            )}
          </div>
        </section>

        {/* 3. FORMULÁRIO DE DADOS TÉCNICOS */}
        <section className="space-y-4">
           <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Dados de Acesso</h3>
           <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
              <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={email} readOnly className="w-full bg-gray-50 dark:bg-gray-800 text-gray-400 pl-11 pr-4 py-4 rounded-2xl border border-transparent outline-none cursor-not-allowed text-xs font-bold" />
                  </div>
              </div>

              <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1E5BFF]" />
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="(21) 99999-9999"
                      className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white pl-11 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-xs font-bold"
                    />
                  </div>
              </div>

              <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Região</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1E5BFF]" />
                    <input 
                      type="text" 
                      value={neighborhood} 
                      onChange={(e) => setNeighborhood(e.target.value)} 
                      placeholder="Freguesia, Anil..."
                      className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white pl-11 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-xs font-bold"
                    />
                  </div>
              </div>
           </div>
        </section>

        {/* 4. FOOTER SAFETY */}
        <div className="flex flex-col items-center gap-4 py-8 opacity-40 grayscale">
           <AlertCircle size={20} className="text-gray-400" />
           <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] text-center">
              Privacidade Garantida • Criptografia JPA
           </p>
        </div>

      </div>

      {showSuccess && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
           <CheckCircle2 className="w-5 h-5 text-emerald-400" />
           <span className="font-black text-xs uppercase tracking-widest">Perfil Sincronizado!</span>
        </div>
      )}
    </div>
  );
};
