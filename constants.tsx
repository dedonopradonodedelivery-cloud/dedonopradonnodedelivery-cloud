
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
  MapPin, Building, Plus, AlertTriangle, FastForward
} from 'lucide-react';
import { AdType, Category, Store, Story, EditorialCollection, Job, CommunityPost, NeighborhoodCommunity, Classified, RealEstateProperty } from './types';
import { getStoreLogo } from '@/utils/mockLogos';


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

export const MOCK_OFERTAS_RELAMPAGO = [
    { id: 'or-1', storeName: 'Pizzaria do Zé', discount: '50% OFF', item: 'Pizza Grande', timeLeft: '14:20', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400' },
    { id: 'or-2', storeName: 'Bibi Lanches', discount: '30% OFF', item: 'Açaí 500ml', timeLeft: '05:45', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=400' },
];

export const MOCK_RADAR_V3 = [
    { id: 'rd-1', type: 'info', title: 'Feira da Freguesia', content: 'Confirmada para amanhã às 08h.', time: 'há 5 min' },
    { id: 'rd-2', type: 'alert', title: 'Manutenção Light', content: 'Rua Araguaia sem luz hoje até 16h.', time: 'há 15 min' },
    { id: 'rd-3', type: 'new', title: 'Nova Petshop', content: 'Seja bem-vinda "Patas & Cia" ao Anil.', time: 'há 1h' },
];

export const MOCK_MISSOES = [
    { id: 'm1', title: 'Explorador local', task: 'Visite 3 lojas esta semana', progress: 1, total: 3, reward: '100 pts' },
    { id: 'm2', title: 'Crítico do bairro', task: 'Avalie sua última compra', progress: 0, total: 1, reward: 'Badge Bronze' },
];

export const MOCK_HOME_COUPONS_V2 = [
  { id: 'cp-1', storeName: 'Açougue do Zé', storeLogo: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=100', discount: '30% OFF', resgates: '290 resgates hoje', code: 'BIBI30', color: 'bg-rose-500', distancia: '200m • Freguesia' },
  { id: 'cp-2', storeName: 'Studio Bella', storeLogo: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=100', discount: 'R$ 15', resgates: '15 vagas sem falta', code: 'VIP15', color: 'bg-blue-600', validade: 'Válido até 16:00' },
  { id: 'cp-3', storeName: 'Pet Shop Alegria', storeLogo: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=100', discount: '10% OFF', resgates: '120 resgates hoje', code: 'PET10', color: 'bg-emerald-600', distancia: '800m • Anil' },
];

export const MOCK_ACONTECENDO_AGORA = [
    { id: 'l1', badge: 'AO VIVO', badgeColor: 'bg-emerald-500 text-white', title: 'Música no Espetto Carioca', subtitle: 'Bossa Nova na Praça da Freguesia', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600', info1_icon: Clock, info1_text: 'Agora', info2_icon: Users, info2_text: '20' },
    { id: 'l2', badge: 'PET PERDIDO', badgeColor: 'bg-amber-400 text-black', title: 'Procura-se: Golden Retriever', subtitle: 'Visto perto da Estrada dos Três Rios', image: 'https://images.unsplash.com/photo-1598875184988-5e67b1a7ea9b?q=80&w=600', info1_icon: MapPin, info1_text: 'Perto', info2_icon: MapPin, info2_text: '150m' },
];

export const MOCK_RADAR_BAIRRO_V2 = [
    { id: 'radar-1', title: 'Pão francês em oferta', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400', info_badge: 'AGORA • Padaria Imperial', temei_badge: 'TEMEI' },
    { id: 'radar-2', title: 'Vacinação amanhã', image: 'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?q=80&w=400', info_badge: 'Perto do Posto de Saúde' },
];

export const CLASSIFIED_CATEGORIES: Category[] = [
  { id: 'cl-jobs', name: 'Empregos', slug: 'jobs', icon: <Briefcase />, color: 'bg-[#1E5BFF]' },
  { id: 'cl-lost', name: 'Achados', slug: 'neighborhood_posts', icon: <Search />, color: 'bg-[#1E5BFF]' },
  { id: 'cl-trade', name: 'Desapega', slug: 'desapega', icon: <Tag />, color: 'bg-[#1E5BFF]' },
  { id: 'cl-donations', name: 'Doações', slug: 'donations', icon: <Heart />, color: 'bg-[#1E5BFF]' },
  { id: 'cl-realestate', name: 'Imóveis', slug: 'real_estate', icon: <Building2 />, color: 'bg-[#1E5BFF]' },
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
  {
    id: 'grupo-esquematiza',
    name: 'Grupo Esquematiza',
    category: 'Serviços',
    subcategory: 'Segurança e Facilities',
    description: 'Líder em segurança, limpeza e facilities para condomínios e empresas.',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3dab?q=80&w=200&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
    rating: 5.0,
    reviewsCount: 150,
    distance: 'Freguesia • RJ',
    neighborhood: 'Freguesia',
    adType: AdType.PREMIUM,
    isSponsored: true,
    tags: ['segurança', 'limpeza residencial', 'manutenção geral']
  },
  { id: 'f-1', name: 'Bibi Lanches', category: 'Comida', subcategory: 'Lanches', rating: 4.8, distance: 'Freguesia', adType: AdType.PREMIUM, description: 'Lanches clássicos.', isSponsored: true, image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=600', tags: [] },
  { id: 'padaria-santo-pao', name: 'Padaria Santo Pão', category: 'Comida', subcategory: 'Padaria', rating: 4.9, distance: '3m', adType: AdType.ORGANIC, description: 'Pães artesanais e café da manhã.', isSponsored: false, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400', tags: ['10% OFF hoje'] },
  { id: 'bella-saude', name: 'Bella Saúde', category: 'Saúde', subcategory: 'Ginecologia', rating: 4.8, distance: '2.5 km', adType: AdType.ORGANIC, description: 'Clínica de saúde da mulher.', isSponsored: false, image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?q=80&w=400', tags: [] }
];

export const quickFilters = [
  { id: 'top_rated', label: 'Top Avaliados', icon: 'star' },
  { id: 'open_now', label: 'Aberto Agora', icon: 'clock' }
];

export const ALL_TAGS = ['tênis', 'camisa', 'pizzaria', 'petshop', 'chaveiro', 'manutenção'];

export const CATEGORY_TOP_BANNERS: Record<string, Record<string, { image: string; storeId: string }[]>> = {
  'comida': {
    'Freguesia': [
      { image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800', storeId: 'f-5' },
      { image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=800', storeId: 'f-1' }
    ]
  }
};

export const HOJE_NO_BAIRRO_CATEGORIES = [
    { id: 'farmacia', name: 'Farmácia', icon: Pill },
    { id: 'mercado', name: 'Mercado', icon: ShoppingCart },
    { id: 'saude', name: 'Saúde', icon: HeartPulse },
    { id: 'pets', name: 'Pets', icon: PawPrint },
    { id: 'doce', name: 'Doce', icon: Cake },
    { id: 'servicos', name: 'Oficina', icon: Wrench },
    { id: 'coupon_landing', name: 'Promoções', icon: Ticket },
];

/**
 * STORIES, OFFICIAL_COMMUNITIES, MOCK_USER_COMMUNITIES, NEIGHBORHOOD_COMMUNITIES, MOCK_COMMUNITY_POSTS
 * Added missing exported constants to resolve multiple build errors.
 */

export const STORIES: Story[] = [
  { id: 's1', name: 'Hamburgueria', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=400&auto=format&fit=crop' },
  { id: 's2', name: 'Salão Vip', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=400&auto=format&fit=crop' },
  { id: 's3', name: 'Pet Shop', image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400&auto=format&fit=crop' },
];

export const OFFICIAL_COMMUNITIES: NeighborhoodCommunity[] = [
  {
    id: 'comm-residents',
    name: 'Moradores de JPA',
    description: 'Comunidade oficial para troca de informações entre vizinhos de Jacarepaguá.',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop',
    icon: <Users />,
    color: 'bg-blue-500',
    membersCount: '12.4k',
    type: 'official'
  },
  {
    id: 'comm-tips',
    name: 'Recomendações e dicas no bairro',
    description: 'Onde encontrar the melhor serviço? Peça e dê dicas para seus vizinhos.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
    icon: <HelpCircle />,
    color: 'bg-orange-500',
    membersCount: '8.2k',
    type: 'official'
  }
];

export const MOCK_USER_COMMUNITIES: NeighborhoodCommunity[] = [
  {
    id: 'user-comm-1',
    name: 'Clube do Livro Freguesia',
    description: 'Encontros mensais para discutir literatura na Praça da Freguesia.',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop',
    icon: <BookOpen />,
    color: 'bg-amber-600',
    membersCount: '156',
    type: 'user'
  }
];

export const NEIGHBORHOOD_COMMUNITIES: NeighborhoodCommunity[] = [
  ...OFFICIAL_COMMUNITIES,
  ...MOCK_USER_COMMUNITIES
];

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
