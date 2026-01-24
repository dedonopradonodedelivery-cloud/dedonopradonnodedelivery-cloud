
import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useProfile } from '../hooks/useProfile';
import { User as UserIcon, Smartphone, ChevronRight, CheckCircle2 } from 'lucide-react';

interface QuickRegisterProps {
  user: User;
  onComplete: () => void;
}

export const QuickRegister: React.FC<QuickRegisterProps> = ({ user, onComplete }) => {
  const { saveProfile, isSaving, error } = useProfile();
  const [name, setName] = useState(user.user_metadata?.full_name || '');
  const [phone, setPhone] = useState('');
  const BRAND_BLUE = '#2D6DF6';

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 10) value = value.replace(/^(\d\d)(\d{5})(\d{4}).*/, '($1) $2-$3');
    setPhone(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10 || name.trim().length < 2) return;
    const success = await saveProfile({
      firebase_uid: user.id,
      email: user.email ?? null,
      avatar_url: user.user_metadata?.avatar_url,
      nome: name,
      telefone: phone,
      role: 'cliente'
    });
    if (success) onComplete();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quase lá!</h1>
        <p className="text-gray-500 text-sm">Precisamos saber como te chamar e seu contato oficial.</p>
      </div>
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group"><label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Nome Completo</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 text-gray-800 py-4 px-4 rounded-2xl border border-gray-100 focus:bg-white outline-none font-medium" required /></div>
          <div className="group"><label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">WhatsApp / Celular</label><input type="tel" value={phone} onChange={handlePhoneChange} placeholder="(21) 99999-9999" className="w-full bg-gray-50 text-gray-800 py-4 px-4 rounded-2xl border border-gray-100 focus:bg-white outline-none font-medium" required /></div>
          <button type="submit" disabled={isSaving} style={{ backgroundColor: BRAND_BLUE }} className="w-full text-white font-bold py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 mt-8 disabled:opacity-70">{isSaving ? 'Salvando...' : 'Continuar'}</button>
        </form>
      </div>
    </div>
  );
};
