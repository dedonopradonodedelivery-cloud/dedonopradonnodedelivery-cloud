
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, Search, ImageIcon, Star, BadgeCheck, ChevronRight, X, AlertCircle, Grid, Filter } from 'lucide-react';
import { SUBCATEGORIES } from '../constants';
import { Store, AdType } from '../types';

interface BannerAd {
  id: string;
  image: string;
  title: string;
  link?: string;
  merchantName?: string;
}

const generateMockFoodStores = (): Store[] => {
  const foodSubs = ['Restaurantes', 'Padarias', 'Lanches', 'Pizzarias', 'Cafeterias', 'Japonês / Oriental', 'Churrascarias', 'Doces & Sobremesas'];
  return Array.from({ length: 20 }).map((_, i) => {
    const sub = foodSubs[i % foodSubs.length];
    return {
      id: `food-store-${i}`,
      name: `${sub} ${['Gourmet', 'Express', 'da Família', 'Premium', 'do Chef'][i % 5]}`,
      category: 'Alimentação',
      subcategory: sub,
      logoUrl: '/assets/default-logo.png',
      rating: 4.0 + (Math.random()),
      reviewsCount: Math.floor(Math.random() * 500) + 10,
      description: `O melhor de ${sub} na região.`,
      distance: `${(Math.random() * 3).toFixed(1)}km`,
      adType: i % 6 === 0 ? AdType.PREMIUM : AdType.ORGANIC,
      isSponsored: i % 6 === 0,
      verified: Math.random() > 0.3,
      isOpenNow: Math.random() > 0.2
    };
  });
};

const ALL_FOOD_STORES = generateMockFoodStores();

const HighlightBanner: React.FC<{ banner: BannerAd; onClick: (id: string) => void; }> = ({ banner, onClick }) => {
  const [imageError, setImageError] = useState(false);
  return (
    <div onClick={() => onClick(banner.id)} className="snap-center flex-shrink-0 w-full h