
import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  ChevronLeft, 
  Camera, 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Loader2, 
  Save, 
  AtSign, 
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface EditProfileViewProps {
  user: User;
  onBack: () => void;
}

const RESERVED_USERNAMES = ['admin', 'suporte', 'freguesia', 'localizei', 'oficial', 'moderacao', 'staff'];

export const EditProfileView: React.FC<EditProfileViewProps> = ({ user, onBack }) => {
  const [name, setName] = useState(user.user_metadata?.full_name || '');
  const [username, setUsername] = useState(user.user_metadata?.username || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user.email || '');
  const [birthDate, setBirthDate] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Username validation states
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [usernameError, setUsernameError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          setName(data.full_name || user.user_metadata?.full_name || '');
          setUsername(data.username || user.user_metadata?.username || '');
          setPhone(data.phone || '');
          setBirthDate(data.birth_date || '');
          setNeighborhood(data.neighborhood || 'Freguesia');
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 10) value = value.replace(/^(\d\d)(\d{5})(\d{4}).*/, '($1) $2-$3');
    else if (value.length > 5) value = value.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    else if (value.length > 2) value = value.replace(/^(\d\d)(\d{0,5}).*/, '($1) $2');
    else value = value.replace(/^(\d*)/, '($1');
    setPhone(value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/\s/g, '');
    setUsername(val);
    const regex = /^[a-z0-9._]{3,20}$/;
    if (!val || val.length < 3 || RESERVED_USERNAMES.includes(val) || !regex.test(val)) {
      setUsernameStatus('invalid');
      setUsernameError('Nome de usuário inválido ou reservado.');
      return;
    }
    setUsernameStatus('available');
    setUsernameError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updates = { full_name: name, username, phone, birth_date: birthDate, neighborhood, updated_at: new Date().toISOString() };
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
    return <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center"><Loader2 className="w-10 h-10 text-[#1E5BFF] animate-spin mb-4" /><p className="text-gray-500 font-medium">Carregando perfil...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300 pb-20">
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" /></button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Meu Perfil</h1>
        <div className="w-10"></div>
      </div>

      <div className="p-6">
        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg relative">
            {user.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" /> : <UserIcon className="w-full h-full p-6 text-gray-400" />}
            <div className="absolute bottom-0 right-0 bg-[#1E5BFF] text-white p-2 rounded-full border-2 border-white dark:border-gray-900"><Camera className="w-4 h-4" /></div>
          </div>
          <h2 className="mt-4 font-bold text-gray-900 dark:text-white text-xl">{name || 'Usuário Localizei'}</h2>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">ID: {user.id.slice(0,8)}</p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">E-mail (Login)</label>
            <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={email} readOnly className="w-full bg-gray-100 dark:bg-gray-800/50 text-gray-400 pl-12 pr-4 py-4 rounded-2xl border border-transparent outline-none cursor-not-allowed" /></div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Nome Completo</label>
            <div className="relative"><UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Não informado" className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:border-[#1E5BFF] outline-none transition-all" /></div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Telefone / WhatsApp</label>
            <div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="tel" value={phone} onChange={handlePhoneChange} placeholder="Não informado" className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:border-[#1E5BFF] outline-none transition-all" /></div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Bairro / Região</label>
            <div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Ex: Freguesia, Anil..." className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:border-[#1E5BFF] outline-none transition-all" /></div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={isSaving} className="w-full bg-gradient-to-r from-[#1E5BFF] to-[#4D7CFF] text-white font-bold text-lg py-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-70">
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Salvar Alterações</>}
            </button>
          </div>
        </form>
      </div>

      {showSuccess && <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2 z-50"><CheckCircle2 className="w-5 h-5 text-green-400" /><span className="font-bold text-sm">Perfil atualizado!</span></div>}
    </div>
  );
};
