
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
  MapPin, Building, Plus, AlertTriangle, FastForward, Medal, Trophy
} from 'lucide-react';
import { AdType, Category, Store, Story, EditorialCollection, Job, CommunityPost, NeighborhoodCommunity, Classified, RealEstateProperty } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'cat-saude', name: 'Saúde', slug: 'saude', icon: <Heart />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-pets', name: 'Pets', slug: 'pets', icon: <PawPrint />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-fashion', name: 'Moda', slug: 'moda', icon: <Shirt />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-beauty', name: 'Beleza', slug: 'beleza', icon: <Scissors />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-comida', name: 'Comida', slug: 'comida', icon: <Utensils />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-coupons', name: 'Cupom', slug: 'coupon_landing', icon: <Ticket />, color: 'bg-[#1E5BFF]' },
  { id: 'cat-more', name: '+ Mais', slug: 'all_categories', icon: <Plus />, color: 'bg-gray-100 dark:bg-gray-800' },
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

export const MOCK_RADAR_BAIRRO_V2 = [
    { 
      id: 'radar-1', 
      type: 'promocao', 
      title: 'Pão francês em oferta', 
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400', 
      info_badge: 'Padaria Imperial', 
      neighborhood: 'Freguesia',
      engagement: { badge: 'hot', label: 'Voz do Bairro', views: 1240 }
    },
    { 
      id: 'radar-2', 
      type: 'aviso', 
      title: 'Vacinação amanhã', 
      image: 'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?q=80&w=400', 
      info_badge: 'Posto de Saúde', 
      neighborhood: 'Taquara',
      engagement: { badge: 'official', label: 'Utilidade', views: 3500 }
    },
    { 
      id: 'radar-3', 
      type: 'evento', 
      title: 'Feira Orgânica', 
      image: 'https://images.unsplash.com/photo-1488459739036-39ee895dd41b?q=80&w=400', 
      info_badge: 'Praça da Freguesia', 
      neighborhood: 'Freguesia',
      engagement: { badge: 'reward', label: 'Benefício Ativo', views: 890 }
    },
    { 
      id: 'radar-4', 
      type: 'achados', 
      title: 'Chave encontrada', 
      image: null, 
      info_badge: 'Rua Araguaia', 
      neighborhood: 'Freguesia',
      engagement: { badge: 'hero', label: 'Morador Ativo', views: 450 }
    },
];

export const MOCK_HOME_COUPONS_V2 = [
  { id: 'cp-1', storeName: 'Açougue do Zé', storeLogo: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=100', discount: '30% OFF', resgates: '290 resgates hoje', code: 'BIBI30', color: 'bg-rose-500', distancia: '200m • Freguesia' },
  { id: 'cp-2', storeName: 'Studio Bella', storeLogo: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=100', discount: 'R$ 15', resgates: '15 vagas sem falta', code: 'VIP15', color: 'bg-blue-600', validate: 'Válido até 16:00' },
  { id: 'cp-3', storeName: 'Pet Shop Alegria', storeLogo: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=100', discount: '10% OFF', resgates: '120 resgates hoje', code: 'PET10', color: 'bg-emerald-600', distancia: '800m • Anil' },
];

export const MOCK_ACONTECENDO_AGORA = [
    { id: 'l1', badge: 'AO VIVO', badgeColor: 'bg-emerald-500 text-white', title: 'Música no Espetto Carioca', subtitle: 'Bossa Nova na Praça da Freguesia', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600', info1_icon: Clock, info1_text: 'Agora', info2_icon: Users, info2_text: '20' },
    { id: 'l2', badge: 'PET PERDIDO', badgeColor: 'bg-amber-400 text-black', title: 'Procura-se: Golden Retriever', subtitle: 'Visto perto da Estrada dos Três Rios', image: 'https://images.unsplash.com/photo-1598875184988-5e67b1a7ea9b?q=80&w=600', info1_icon: MapPin, info1_text: 'Perto', info2_icon: MapPin, info2_text: '150m' },
];

export const STORIES: Story[] = [
  { id: 's1', name: 'Hamburgueria', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=400&auto=format&fit=crop' },
  { id: 's2', name: 'Salão Vip', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=400&auto=format&fit=crop' },
  { id: 's3', name: 'Pet Shop', image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400&auto=format&fit=crop' },
];

export const OFFICIAL_COMMUNITIES: NeighborhoodCommunity[] = [
  { id: 'comm-residents', name: 'Moradores de JPA', description: 'Comunidade oficial para troca de informações.', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800', icon: <Users />, color: 'bg-blue-500', membersCount: '12.4k', type: 'official' },
];

export const NEIGHBORHOOD_COMMUNITIES: NeighborhoodCommunity[] = [...OFFICIAL_COMMUNITIES];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  { id: 'post-1', userId: 'u1', userName: 'Taty Oliveira', userAvatar: 'https://i.pravatar.cc/100?u=taty', authorRole: 'resident', content: 'Alguém conhece um chaveiro de confiança na Freguesia?', type: 'recommendation', communityId: 'comm-tips', neighborhood: 'Freguesia', timestamp: '2h', likes: 8, comments: 16 }
];

export const MOCK_CLASSIFIEDS: Classified[] = [
    { id: 'cl-serv-1', title: 'Eletricista Residencial 24h', advertiser: 'Sérgio Luz', category: 'Orçamento de Serviços', neighborhood: 'Freguesia', description: 'Atendo emergências.', timestamp: 'Há 15 min', contactWhatsapp: '5521999991111', typeLabel: 'Serviço', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800' }
];

export const STORES: Store[] = [
  { id: 'grupo-esquematiza', name: 'Grupo Esquematiza', category: 'Serviços', subcategory: 'Segurança', description: 'Líder em segurança.', logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3dab?q=80&w=200', rating: 5.0, reviewsCount: 150, distance: 'Freguesia', adType: AdType.PREMIUM, isSponsored: true, tags: ['segurança'] }
];

export const CLASSIFIED_CATEGORIES: Category[] = [
  { id: 'cl-jobs', name: 'Empregos', slug: 'jobs', icon: <Briefcase />, color: 'bg-[#1E5BFF]' },
];
