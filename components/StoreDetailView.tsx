
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
  ArrowRight,
  Instagram 
} from 'lucide-react';
import { Store } from '../types';
import { TrustBlock } from './TrustBlock';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { trackOrganicEvent, OrganicEventType } from '../lib/analytics';

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
    // Added missing banner_main property to fix type error at line 149
    banner_main: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
    social: { instagram: '', whatsapp: '' },
    contact: { phone: '(21) 99999-9999', address: 'Endereço não informado', hours: 'Consultar horário' },
  },
};

function mapStoreToBusiness(store?: Store | null) {
  if (!store) return storeMock.business;
  const s: any = store;
  
  // Lógica de Banner: banner_url > image > fallback por categoria
  const banner = s.banner_url || s.image || `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop`;
  
  return {
    ...storeMock.business,
    id: s.id,
    name: s.name,
    category: s.category,
    rating: s.rating,
    ratingCount: s.reviewsCount,
    description: s.description,
    logo: s.logo_url || s.logoUrl || s.image,
    banners: photoGallery(s),
    banner_main: banner,
    social: { instagram: s.instagram, whatsapp: s.phone },
    contact: { phone: s.phone, address: s.address, hours: s.hours },
  };
}

const photoGallery = (s: any) => {
    if (s.gallery && s.gallery.length > 0) return s.gallery;
    return [s.banner_url, s.image].filter(Boolean);
}

const InfoCard: React.FC<{ icon: React.ElementType; title: string; value: string; href?: string; onClick?: () => void; }> = ({ icon: Icon, title, value, href, onClick }) => {
  const Component = (href || onClick) ? 'a' : 'div';
  
  const props: any = {
    className: `bg-white dark:bg-gray-800 p-4 rounded-2xl flex items-center gap-4 shadow-lg shadow-black/5 border border-gray-100 dark:border-gray-700/50 ${href || onClick ? 'cursor-pointer transition-all active:scale-95 hover:bg-gray-50 dark:hover:bg-gray-700' : ''}`,
    onClick,
  };

  if (href) {
    props.href = href;
    props.target = "_blank";
    props.rel = "noopener noreferrer";
  }

  return (
    <Component {...props}>
      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-[#1E5BFF] shrink-0"><Icon className="w-6 h-6" /></div>
      <div>
        <p className="text-xs font-semibold text-[#6C6C6C] dark:text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="font-semibold text-[#141414] dark:text-gray-200 mt-0.5">{value}</p>
      </div>
    </Component>
  );
};

export const StoreDetailView: React.FC<{ store?: Store | null; onBack: () => void; onPay?: () => void }> = ({ store, onBack, onPay }) => {
  const { user } = useAuth();
  const { currentNeighborhood } = useNeighborhood();
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [userCredit, setUserCredit] = useState<number | null>(null);
  const business = mapStoreToBusiness(store);

  // Analytics Helper
  const track = (eventType: OrganicEventType) => {
    if (store) {
      trackOrganicEvent(eventType, store.id, currentNeighborhood, user);
    }
  };

  // Track 'store_view' on component mount
  useEffect(() => {
    track('store_view');
  }, []); 

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

  const phoneDigits = (business.contact.phone || '').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/55${phoneDigits}`;
  const phoneUrl = `tel:${phoneDigits}`;
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.contact.address)}`;
  const instagramUsername = business.social.instagram?.replace('@', '');

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-gray-950 font-sans relative">
      <main className="overflow-y-auto pb-32">
        
        {/* BANNER DE CAPA */}
        <section className="relative w-full h-[280px] bg-gray-200 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 p-4 pt-6 flex justify-between items-center z-20">
            <button onClick={onBack} className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg active:scale-90 transition-transform"><ChevronLeft className="w-6 h-6" /></button>
            <div className="flex gap-3">
              <button onClick={() => track('store_click_share')} className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-lg active:scale-90 transition-transform"><Share2 className="w-5 h-5" /></button>
              <button onClick={() => { setIsFavorite(!isFavorite); track('store_click_favorite'); }} className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-lg active:scale-90 transition-transform"><Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#1E5BFF] text-[#1E5BFF]' : ''}`} /></button>
            </div>
          </div>
          
          <img 
            src={business.banner_main} 
            className="w-full h-full object-cover" 
            alt="Capa da Loja" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
        </section>

        <div className="relative px-5 pt-7">
          
          {/* HEADER COM LOGO SOBREPOSTA */}
          <div className="flex justify-between items-start mb-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-[800] text-[#141414] dark:text-white font-sans tracking-tighter leading-tight drop-shadow-sm">
                    {business.name}
                </h1>
                <div className="flex items-center gap-2 text-sm font-medium text-[#6C6C6C] mt-2">
                    <span className="bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF] px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest">{business.category}</span>
                    <span className="text-gray-300">•</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="dark:text-gray-300">{business.rating} ({business.ratingCount ?? 0})</span>
                </div>
              </div>
              
              {/* LOGO DA LOJA */}
              <div className="w-20 h-20 rounded-[2rem] bg-white dark:bg-gray-800 shadow-2xl border-4 border-white dark:border-gray-900 flex items-center justify-center p-2 shrink-0 -mt-16 overflow-hidden relative z-10 transition-transform hover:scale-105">
                <img src={business.logo} alt="Logo" className="w-full h-full object-contain rounded-2xl" />
              </div>
          </div>

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
            <div>
                <h3 className="text-lg font-black dark:text-white mb-3 uppercase tracking-widest text-gray-400 text-[10px]">Sobre o Estabelecimento</h3>
                <p className="text-sm text-[#6C6C6C] dark:text-gray-300 leading-relaxed font-medium">{business.description}</p>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={onPay}
                className="flex-[2] bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all text-sm uppercase tracking-wider"
              >
                Pagar com Crédito
              </button>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => track('store_click_whatsapp')} className="flex-1 bg-green-50 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 active:scale-95 transition-all"><MessageSquare className="w-5 h-5" /> Zap</a>
            </div>

            <div className="space-y-4">
              <InfoCard icon={MapPin} title="Endereço" value={business.contact.address} href={gmapsUrl} onClick={() => track('store_click_directions')} />
              <InfoCard icon={Clock} title="Horário" value={business.contact.hours} />
              <InfoCard icon={Phone} title="Telefone" value={business.contact.phone} href={phoneUrl} onClick={() => track('store_click_call')} />
              {instagramUsername && (
                <InfoCard 
                    icon={Instagram} 
                    title="Instagram" 
                    value={`@${instagramUsername}`} 
                    href={`https://instagram.com/${instagramUsername}`}
                    onClick={() => track('store_click_instagram')}
                />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
