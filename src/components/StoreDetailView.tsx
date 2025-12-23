

import React, { useState } from 'react';
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
} from 'lucide-react';
import { Store } from '@/types';

const storeMock = {
  business: {
    id: 1,
    name: 'Loja Exemplo',
    category: 'Geral',
    rating: 0,
    ratingCount: 0,
    description: 'Descrição indisponível.',
    logo: '/assets/default-logo.png',
    banners: [
      'https://placehold.co/800x600?text=Banner',
    ],
    social: {
      instagram: '',
      whatsapp: '',
    },
    contact: {
      phone: '(21) 99999-9999',
      address: 'Endereço não informado',
      hours: 'Consultar horário',
    },
    location: {
      lat: -22.936,
      lng: -43.355,
    },
  },
};

function mapStoreToBusiness(store?: Store | null) {
  if (!store) return storeMock.business;

  const s: any = store;

  return {
    ...storeMock.business,

    id: s.id ?? storeMock.business.id,
    name: s.nome ?? s.name ?? storeMock.business.name,
    category: s.categoria ?? s.category ?? storeMock.business.category,
    rating: s.rating ?? storeMock.business.rating,
    ratingCount: s.reviewsCount ?? s.total_reviews ?? s.ratingCount ?? storeMock.business.ratingCount,
    description: s.descricao ?? s.description ?? storeMock.business.description,

    logo: s.logoUrl ?? s.image ?? s.image_url ?? storeMock.business.logo,
    banners:
      s.banners && Array.isArray(s.banners) && s.banners.length > 0
        ? s.banners
        : s.image || s.image_url
        ? [s.image || s.image_url]
        : storeMock.business.banners,

    social: {
      instagram: s.instagram ?? storeMock.business.social.instagram,
      whatsapp: s.whatsapp ?? storeMock.business.social.whatsapp,
    },

    contact: {
      phone: s.telefone ?? s.phone ?? storeMock.business.contact.phone,
      address: s.endereco ?? s.address ?? storeMock.business.contact.address,
      hours: s.horario_funcionamento ?? s.hours ?? storeMock.business.contact.hours,
    },

    location: {
      lat: s.latitude ?? storeMock.business.location.lat,
      lng: s.longitude ?? storeMock.business.location.lng,
    },
  };
}

const HeaderButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg shadow-black/10 hover:bg-white transition-colors active:scale-95"
  >
    {children}
  </button>
);

const InfoCard: React.FC<{
  icon: React.ElementType;
  title: string;
  value: string;
}> = ({ icon: Icon, title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl flex items-center gap-4 shadow-lg shadow-black/5 border border-gray-100 dark:border-gray-700/50">
    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-[#1E5BFF] flex-shrink-0">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-xs font-semibold text-[#6C6C6C] dark:text-gray-400 uppercase tracking-wider">
        {title}
      </p>
      <p className="font-semibold text-[#141414] dark:text-gray-200 mt-0.5">
        {value}
      </p>
    </div>
  </div>
);

const Tabs: React.FC<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: string[];
}> = ({ activeTab, setActiveTab, tabs }) => {
  const activeIndex = tabs.indexOf(activeTab);
  return (
    <div className="relative flex bg-[#F3F3F3] dark:bg-gray-800 p-1.5 rounded-full">
      <div
        className="absolute top-1.5 bottom-1.5 w-1/2 bg-white dark:bg-gray-700 rounded-full shadow-lg shadow-black/10 transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className="relative z-10 w-1/2 py-3 text-sm font-bold text-center transition-colors"
        >
          <span
            className={
              activeTab === tab
                ? 'text-[#141414] dark:text-white'
                : 'text-[#6C6C6C] dark:text-gray-400'
            }
          >
            {tab}
          </span>
        </button>
      ))}
    </div>
  );
};

interface StoreDetailViewProps {
  store?: Store | null;
  onBack: () => void;
  onOpenCashback?: () => void;
}

export const StoreDetailView: React.FC<StoreDetailViewProps> = ({
  store,
  onBack,
