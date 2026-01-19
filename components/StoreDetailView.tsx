
import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  Share2,
  Heart,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Coins,
  ArrowRight
} from 'lucide-react';
import { Store, StoreCredit } from '../types';
import { TrustBlock } from './TrustBlock';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const storeMock = {
  business: {
    id: 1,
    name: 'Loja Exemplo',
    category: 'Geral',
    rating: 0,
    ratingCount: 0,
    description: 'Descrição indisponível.',
    logo: '/assets/default-logo.png',
    banners: ['https://placehold.co/800x600?text=Banner'],
    social: { instagram: '', whatsapp: '' },
    contact: { phone: '(21) 99999-9999', address: 'Endereço não informado', hours: 'Consultar horário' },
  },
};

function mapStoreToBusiness(store?: Store | null) {
  if (!store) return storeMock.business;
  const s: any = store;
  return {
    ...storeMock.business,
    id: s.id,
    name: s.name,
    category: s.category,
    rating: s.rating,
    ratingCount: s.reviewsCount,
    description: s.description,
    logo: s.logoUrl || s.image,
    banners: s.gallery && s.gallery.length > 0 ? s.gallery : [s.image].filter(Boolean),
    social: { instagram: s.instagram, whatsapp: s.phone },
    contact: { phone: s.phone, address: s.address, hours: s.hours },
  };
}

const InfoCard: React.FC<{ icon: React.ElementType; title: string; value: string; }> = ({ icon: Icon, title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl flex items-center gap-4 shadow-lg shadow-black/5 border border-gray-100 dark:border-gray-700/50">
    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-[#1E5BFF] shrink-0"><Icon className="w-6 h-6" /></div>
    <div>
      <p className="text-xs font-semibold text-[#6C6C6C] dark:text-gray-400 uppercase tracking-wider">{title}</p>
      <p className="font-semibold text-[#141414] dark:text-gray-200 mt-0.5">{value}</p>
    </div>
  </div>
);

export const StoreDetailView: React.FC<{ store?: Store | null; onBack: () => void; onPay?: () => void }> = ({ store, onBack, onPay }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [userCredit, setUserCredit] = useState<number | null>(null);
  const business = mapStoreToBusiness(store);
  const photoGallery = business.banners || [];

  useEffect(() => {
    const fetchUserCredit = async () => {
        if (!user || !store || !supabase) return;
        try {
            const { data } = await supabase
                .from('store_credits')
                .select('balance_cents')
                .eq('user_id', user.id)
                .eq('store_id', store.id)
                .maybeSingle();
            
            if (data) setUserCredit(data.balance_cents / 100);
            else setUserCredit(0);
        } catch (e) { console.error(e); }
    };
    fetchUserCredit();
  }, [user, store]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-gray-950 font-sans relative">
      <main className="overflow-y-auto pb-32">
        <section className="relative w-full h-[260px] bg-gray-200">
          <div className="absolute top-0 left-0 right-0 p-4 pt-6 flex justify-between items-center z-10">
            <button onClick={onBack} className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg"><ChevronLeft className="w-6 h-6" /></button>
            <div className="flex gap-3">
              <button className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-lg"><Share2 className="w-5 h-5" /></button>
              <button onClick={() => setIsFavorite(!isFavorite)} className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-lg"><Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#1E5BFF] text-[#1E5BFF]' : ''}`} /></button>
            </div>
          </div>
          {photoGallery[0] && <img src={photoGallery[0]} className="w-full h-full object-cover" alt="" />}
        </section>

        <div className="relative px-5 pt-7">
          <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-[800] text-[#141414] dark:text-white font-sans tracking-tighter leading-tight">{business.name}</h1>
                <div className="flex items-center gap-2 text-sm font-medium text-[#6C6C6C] mt-2">
                    <span>{business.category}</span>
                    <span className="text-gray-300">•</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{business.rating} ({business.ratingCount ?? 0})</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center p-2 shrink-0 -mt-12 overflow-hidden">
                <img src={business.logo} alt="Logo" className="w-full h-full object-contain" />
              </div>
          </div>

          {/* User Specific Credit Block */}
          {user && userCredit !== null && (
              <div className="bg-gradient-to-r from-[#1E5BFF] to-[#4D7CFF] rounded-3xl p-5 mb-8 text-white shadow-xl shadow-blue-500/20 flex items-center justify-between overflow-hidden relative group active:scale-[0.98] transition-all cursor-pointer" onClick={onPay}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
                  <div className="flex items-center gap-4 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                          <Coins className="w-5 h-5 text-white" />
                      </div>
                      <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Seu Crédito nesta loja</p>
                          <h3 className="text-xl font-black">R$ {userCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                      </div>
                  </div>
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                    <ArrowRight className="w-4 h-4" />
                  </div>
              </div>
          )}

          <section className="space-y-8">
            {store && <TrustBlock store={store} />}
            <div><h3 className="text-lg font-bold dark:text-white mb-3">Sobre</h3><p className="text-sm text-[#6C6C6C] dark:text-gray-300 leading-relaxed">{business.description}</p></div>
            
            <div className="flex gap-4">
              <button 
                onClick={onPay}
                className="flex-[2] bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all text-sm uppercase tracking-wider"
              >
                Pagar com Crédito
              </button>
              <a href="#" className="flex-1 bg-green-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 active:scale-95 transition-all"><MessageSquare className="w-5 h-5" /> Zap</a>
            </div>

            <div className="space-y-4">
              <InfoCard icon={MapPin} title="Endereço" value={business.contact.address} />
              <InfoCard icon={Clock} title="Horário" value={business.contact.hours} />
              <InfoCard icon={Phone} title="Telefone" value={business.contact.phone} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
