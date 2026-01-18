
import React from 'react';
import {
  ChevronLeft,
  Share2,
  Heart,
  Star,
  MapPin,
  Clock,
  Phone,
  Instagram,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { Store } from '../types';
import { TrustBlock } from './TrustBlock';

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

export const StoreDetailView: React.FC<{ store?: Store | null; onBack: () => void; }> = ({ store, onBack }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'Sobre' | 'Avaliações'>('Sobre');
  const business = mapStoreToBusiness(store);
  const photoGallery = business.banners || [];

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-gray-950 font-sans relative">
      <main className="overflow-y-auto pb-8">
        <section className="relative w-full h-[260px] bg-gray-200">
          <div className="absolute top-0 left-0 right-0 p-4 pt-6 flex justify-between items-center z-10">
            <button onClick={onBack} className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg"><ChevronLeft className="w-6 h-6" /></button>
            <div className="flex gap-3">
              <button className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-lg"><Share2 className="w-5 h-5" /></button>
              <button onClick={() => setIsFavorite(!isFavorite)} className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-lg"><Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#1E5BFF] text-[#1E5BFF]' : ''}`} /></button>
            </div>
          </div>
          {photoGallery[0] && <img src={photoGallery[0]} className="w-full h-full object-cover" />}
        </section>

        <div className="relative px-5 pt-7">
          <h1 className="text-3xl font-[800] text-[#141414] dark:text-white font-sans tracking-tighter leading-tight mb-4">{business.name}</h1>
          <div className="flex items-center gap-2 text-sm font-medium text-[#6C6C6C] mb-6">
            <span>{business.category}</span>
            <span className="text-gray-300">•</span>
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>{business.rating} ({business.ratingCount ?? 0})</span>
          </div>

          <section className="space-y-8">
            {store && <TrustBlock store={store} />}
            <div><h3 className="text-lg font-bold dark:text-white mb-3">Sobre</h3><p className="text-sm text-[#6C6C6C] dark:text-gray-300 leading-relaxed">{business.description}</p></div>
            <div className="flex gap-4">
              <a href="#" className="flex-1 bg-gradient-to-br from-green-500 to-emerald-500 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"><MessageSquare className="w-5 h-5" /> WhatsApp</a>
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
