
import React from 'react';
import { 
  Utensils, ShoppingCart, Scissors, Heart, PawPrint, Home, Wrench, 
  Dumbbell, CarFront, BookOpen, Monitor, Shirt, Ticket, Map as MapIcon, 
  Store as StoreIcon,
  LayoutGrid, Pill, Briefcase, Plane, Zap,
  Beef, Coffee, Pizza, Croissant, Soup, Cake, Sandwich, 
  Stethoscope, Package, Clock, Target, Settings, Dog,
  Star, Tag, Award, TrendingUp, ChevronRight, MessageSquare, Users,
  Apple, Building2, Leaf, Shield, PaintRoller, Hammer, Droplets, Laptop,
  Baby, GraduationCap, Microscope, Brain, Sparkles, Smile, Beer, 
  Activity, Eye, FileText, Globe, Calendar, Music, PartyPopper, Globe2, Edit3, User, Bell, Search,
  Camera, Vote, Handshake, Flame, Milestone, History, Home as HomeIcon,
  MessageCircle, HelpCircle, UserCheck, Recycle, Scale, Calculator, PenTool, Ruler,
  Key, Fan, Truck, Shovel,
  Meh, ThumbsDown, Gift, RefreshCw, Accessibility, Landmark, Wallet, HeartPulse,
  MapPin, Building
} from 'lucide-react';
import { AdType, Category, Store, Story, EditorialCollection, Job, CommunityPost, NeighborhoodCommunity, Classified, RealEstateProperty } from '../types';
import { getStoreLogo } from '@/utils/mockLogos';

// Lista completa organizada para o Modal
export const CATEGORIES: Category[] = [
  // Linha Principal da Home (Primeiros 5)
  { id: 'cat-saude', name: 'Saúde', slug: 'saude', icon: <Heart />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-pets', name: 'Pets', slug: 'pets', icon: <PawPrint />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-fashion', name: 'Moda', slug: 'moda', icon: <Shirt />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-beauty', name: 'Beleza', slug: 'beleza', icon: <Scissors />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-comida', name: 'Comida', slug: 'comida', icon: <Utensils />, color: 'bg-[#1E5BFF]' },
  
  // Restante das Comerciais
  { id: 'cat-coupons', name: 'Cupom', slug: 'coupon_landing', icon: <Ticket />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-market', name: 'Mercado', slug: 'mercado', icon: <ShoppingCart />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-pharmacy', name: 'Farmácia', slug: 'farmacia', icon: <Pill />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-services', name: 'Serviços', slug: 'servicos', icon: <Wrench />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-autos', name: 'Autos', slug: 'autos', icon: <CarFront />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-edu', name: 'Educação', slug: 'educacao', icon: <BookOpen />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-sports', name: 'Esportes', slug: 'esportes', icon: <Dumbbell />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-eventos', name: 'Eventos', slug: 'eventos', icon: <PartyPopper />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-leisure', name: 'Lazer', slug: 'lazer', icon: <Plane />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-casa', name: 'Casa', slug: 'casa', icon: <HomeIcon />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-tech', name: 'Informática', slug: 'informatica', icon: <Monitor />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-condo', name: 'Condomínios', slug: 'condominio', icon: <Building2 />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-public', name: 'S. Públicos', slug: 'servicos-publicos', icon: <Landmark />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-finance', name: 'Financeiro', slug: 'financeiro', icon: <Wallet />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-kids', name: 'Kids', slug: 'kids', icon: <Baby />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-senior', name: 'Melhor Idade', slug: 'melhor-idade', icon: <Accessibility />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-wellness', name: 'Bem-estar', slug: 'bem-estar', icon: <HeartPulse />, color: 'bg-[#1E5BFF]' },
];

export const CLASSIFIED_CATEGORIES: Category[] = [
  { id: 'cl-jobs', name: 'Empregos', slug: 'jobs', icon: <Briefcase />, color: 'bg-[#1E5BFF]' },
  { id: 'cl-lost', name: 'Achados', slug: 'neighborhood_posts', icon: <Search />, color: 'bg-[#1E5BFF]' },
  { id: 'cl-trade', name: 'Desapega', slug: 'desapega', icon: <Tag />, color: 'bg-[#1E5BFF]' },
  { id: 'cl-donations', name: 'Doações', slug: 'donations', icon: <Heart />, color: 'bg-[#1E5BFF]' },
  { id: 'cl-realestate', name: 'Imóveis', slug: 'real_estate', icon: <Building />, color: 'bg-[#1E5BFF]' },
];

export const SUBCATEGORIES: Record<string, { name: string; icon: React.ReactNode }[]> = {
  'Comida': [
    { name: 'Restaurantes', icon: <Utensils /> },
    { name: 'Lanches & Hamburguerias', icon: <Beef /> },
    { name: 'Pizzarias', icon: <Pizza /> },
    { name: 'Cafés & Cafeterias', icon: <Coffee /> },
    { name: 'Delivery', icon: <Package /> },
    { name: 'Doces & Sobremesas', icon: <Cake /> },
    { name: 'Comida Caseira', icon: <Utensils /> },
    { name: 'Hortifruti & Naturais', icon: <Apple /> },
  ],
  'Saúde': [
    { name: 'Clínicas', icon: <Building2 /> },
    { name: 'Dentistas', icon: <Smile /> },
    { name: 'Psicologia', icon: <Brain /> },
    { name: 'Fisioterapia', icon: <Activity /> },
    { name: 'Exames & Diagnósticos', icon: <Microscope /> },
    { name: 'Nutrição', icon: <Apple /> },
    { name: 'Terapias Alternativas', icon: <Sparkles /> },
    { name: 'Saúde Preventiva', icon: <Shield /> },
  ],
};

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    userId: 'u1',
    userName: 'Taty Oliveira',
    userAvatar: 'https://i.pravatar.cc/100?u=taty',
    authorRole: 'resident',
    content: 'Alguém conhece um chaveiro de confiança na Freguesia? Perdi as chaves de casa agora pouco.',
    type: 'recommendation',
    communityId: 'comm-tips',
    neighborhood: 'Freguesia',
    timestamp: '2h',
    likes: 8,
    comments: 16
  }
];

export const MOCK_CLASSIFIEDS: Classified[] = [
    { id: 'cl-serv-1', title: 'Eletricista Residencial 24h', advertiser: 'Sérgio Luz', category: 'Orçamento de Serviços', neighborhood: 'Freguesia', description: 'Atendo emergências, curto-circuito, troca de disjuntor. Orçamento rápido pelo WhatsApp.', timestamp: 'Há 15 min', contactWhatsapp: '5521999991111', typeLabel: 'Serviço', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800' }
];

export const MOCK_JOBS: Job[] = [
  { id: 'job-1', role: 'Atendente de Balcão', company: 'Padaria Imperial', neighborhood: 'Freguesia', category: 'Alimentação', type: 'CLT', salary: 'R$ 1.450,00', description: 'Atendimento ao público...', requirements: ['Experiência'], postedAt: 'Há 2h', candidacy_method: 'whatsapp', modality: 'Presencial' }
];

export const MOCK_REAL_ESTATE_PROPERTIES: RealEstateProperty[] = [
  { id: 'res-1', type: 'Comercial', title: 'Sala 40m² na Freguesia', description: 'Linda sala...', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800', neighborhood: 'Freguesia', price: 350000, transaction: 'venda', area: 65, postedAt: 'Há 2 dias' }
];

export const STORES: Store[] = [
  { id: 'f-1', name: 'Bibi Lanches', category: 'Comida', subcategory: 'Lanches', rating: 4.8, distance: 'Freguesia', adType: AdType.PREMIUM, description: 'Lanches clássicos.', isSponsored: true, image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=600', tags: [] }
];

export const quickFilters = [
  { id: 'top_rated', label: 'Top Avaliados', icon: 'star' },
  { id: 'open_now', label: 'Aberto Agora', icon: 'clock' }
];
