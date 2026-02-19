
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
  Meh, ThumbsDown, Gift, RefreshCw,
  Landmark, Tent, TicketPercent, Percent, Newspaper,
  Palette, Printer, Book, Lightbulb, Bike, Sofa, Smartphone, Headphones,
  Wifi, MapPin, Trash2, ShieldAlert, Megaphone, ShieldCheck,
  Circle, Flower, Swords, Gamepad, Gamepad2, Church, Film, Mic, Bus,
  Lock, Wind, Disc, Cpu,
  Info
} from 'lucide-react';
import { AdType, Category, Store, Story, EditorialCollection, Job, CommunityPost, NeighborhoodCommunity, Classified, RealEstateProperty } from '@/types';

// Oficialmente renomeado de TUCO para LOKA
export const LOKA_MASCOT_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

export const CATEGORIES: Category[] = [
  { id: 'cat-servicos', name: 'Serviços', slug: 'servicos', icon: <Wrench />, color: 'bg-brand-blue' },
  { id: 'cat-alimentacao', name: 'Alimentação', slug: 'alimentacao', icon: <Soup />, color: 'bg-brand-blue' },
  { id: 'cat-restaurantes', name: 'Restaurantes', slug: 'restaurantes', icon: <Utensils />, color: 'bg-brand-blue' },
  { id: 'cat-mercados', name: 'Mercados', slug: 'mercados', icon: <ShoppingCart />, color: 'bg-brand-blue' },
  { id: 'cat-farmacias', name: 'Farmácias', slug: 'farmacias', icon: <Pill />, color: 'bg-brand-blue' },
  { id: 'cat-autos', name: 'Autos', slug: 'autos', icon: <CarFront />, color: 'bg-brand-blue' },
  { id: 'cat-moda', name: 'Moda', slug: 'moda', icon: <Shirt />, color: 'bg-brand-blue' },
  { id: 'cat-beleza', name: 'Beleza', slug: 'beleza', icon: <Scissors />, color: 'bg-brand-blue' },
  { id: 'cat-casa', name: 'Casa', slug: 'casa', icon: <HomeIcon />, color: 'bg-brand-blue' },
  { id: 'cat-informatica', name: 'Informática', slug: 'informatica', icon: <Monitor />, color: 'bg-brand-blue' },
  { id: 'cat-papelaria', name: 'Papelaria', slug: 'papelaria', icon: <PenTool />, color: 'bg-brand-blue' },
  { id: 'cat-pets', name: 'Pets', slug: 'pets', icon: <PawPrint />, color: 'bg-brand-blue' },
  { id: 'cat-saude', name: 'Saúde', slug: 'saude', icon: <Heart />, color: 'bg-brand-blue' },
  { id: 'cat-educacao', name: 'Educação', slug: 'educacao', icon: <BookOpen />, color: 'bg-brand-blue' },
  { id: 'cat-esporte', name: 'Esporte', slug: 'esporte', icon: <Dumbbell />, color: 'bg-brand-blue' },
  { id: 'cat-bemestar', name: 'Bem-estar', slug: 'bemestar', icon: <Smile />, color: 'bg-brand-blue' },
  { id: 'cat-infantil', name: 'Infantil', slug: 'infantil', icon: <Baby />, color: 'bg-brand-blue' },
  { id: 'cat-servicospublicos', name: 'Serviços Públicos', slug: 'servicospublicos', icon: <Landmark />, color: 'bg-brand-blue' },
  { id: 'cat-eventos', name: 'Eventos', slug: 'eventos', icon: <PartyPopper />, color: 'bg-brand-blue' },
  { id: 'cat-condominios', name: 'Condomínios', slug: 'condominios', icon: <Building2 />, color: 'bg-brand-blue' },
  { id: 'cat-lazer', name: 'Lazer', slug: 'lazer', icon: <Tent />, color: 'bg-brand-blue' },
  { id: 'cat-cupons', name: 'Cupons', slug: 'cupons', icon: <TicketPercent />, color: 'bg-brand-blue' },
  { id: 'cat-promocoes', name: 'Promoções', slug: 'promocoes', icon: <Percent />, color: 'bg-brand-blue' },
  { id: 'cat-classificados', name: 'Classificados', slug: 'classificados', icon: <Newspaper />, color: 'bg-brand-blue' },
  { id: 'cat-achados', name: 'Achados e Perdidos', slug: 'achados', icon: <Search />, color: 'bg-brand-blue' },
];

export const ACONTECENDO_AGORA_DATA = [
  { id: 1, type: 'Trânsito', image: 'https://images.unsplash.com/photo-1545147422-b96338ea878c?q=80&w=400&auto=format&fit=crop', authorName: 'CET-Rio JPA', authorAvatar: 'https://i.pravatar.cc/150?u=cetrio', timestamp: '15 min', neighborhood: 'Freguesia', icon: MapIcon },
  { id: 2, type: 'Achados', image: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?q=80&w=400&auto=format&fit=crop', authorName: 'Segurança Center', authorAvatar: 'https://i.pravatar.cc/150?u=segcenter', timestamp: '1h', neighborhood: 'Tanque', icon: Search },
  { id: 3, type: 'Pets Perdidos', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400&auto=format&fit=crop', authorName: 'Amigos dos Pets', authorAvatar: 'https://i.pravatar.cc/150?u=amigospets', timestamp: '2h', neighborhood: 'Anil', icon: PawPrint },
  { id: 4, type: 'Utilidade', image: 'https://images.unsplash.com/photo-1584515933487-9d317552d894?q=80&w=400&auto=format&fit=crop', authorName: 'Posto Saúde JPA', authorAvatar: 'https://i.pravatar.cc/150?u=postojpa', timestamp: '3h', neighborhood: 'Taquara', icon: Info },
  { id: 5, type: 'Promoção', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop', authorName: 'Pizzaria do Zé', authorAvatar: 'https://i.pravatar.cc/150?u=pizzazé', timestamp: '4h', neighborhood: 'Pechincha', icon: Flame },
];

export const SUBCATEGORIES: Record<string, { name: string; icon: React.ElementType }[]> = {
  'Serviços': [
    { name: 'Elétrica', icon: Zap },
    { name: 'Hidráulica', icon: Droplets },
    { name: 'Chaveiro', icon: Key },
    { name: 'Marido de Aluguel', icon: Hammer },
    { name: 'Pintura', icon: PaintRoller },
    { name: 'Limpeza', icon: Sparkles },
    { name: 'Jardinagem', icon: Leaf },
    { name: 'Montagem de Móveis', icon: Settings },
  ],
  'Alimentação': [
    { name: 'Marmitas', icon: Package },
    { name: 'Lanches', icon: Sandwich },
    { name: 'Doces', icon: Cake },
    { name: 'Salgados', icon: Croissant },
    { name: 'Comida Caseira', icon: Soup },
    { name: 'Bebidas', icon: Beer },
    { name: 'Produtos Naturais', icon: Apple },
    { name: 'Congelados', icon: Package },
  ],
  'Restaurantes': [
    { name: 'Pizzarias', icon: Pizza },
    { name: 'Hamburguerias', icon: Beef },
    { name: 'Brasileira', icon: Utensils },
    { name: 'Japonesa', icon: Globe2 },
    { name: 'Italiana', icon: Pizza },
    { name: 'Árabe', icon: Globe },
    { name: 'Self-service', icon: Utensils },
    { name: 'Delivery', icon: Bike },
  ],
  'Mercados': [
    { name: 'Supermercados', icon: ShoppingCart },
    { name: 'Mercadinhos', icon: StoreIcon },
    { name: 'Hortifruti', icon: Apple },
    { name: 'Açougue', icon: Beef },
    { name: 'Peixaria', icon: Globe },
    { name: 'Conveniência', icon: Clock },
    { name: 'Bebidas', icon: Beer },
    { name: 'Importados', icon: Globe2 },
  ],
  'Farmácias': [
    { name: 'Drogaria', icon: Pill },
    { name: 'Manipulação', icon: Microscope },
    { name: 'Homeopatia', icon: Stethoscope },
    { name: 'Suplementos', icon: Activity },
  ],
};

export const STORES: Store[] = [
  {
    id: 'f-1',
    name: 'Bibi Lanches',
    category: 'Alimentação',
    subcategory: 'Lanches',
    rating: 4.8,
    reviewsCount: 1240,
    distance: '1.2km',
    adType: AdType.PREMIUM,
    description: 'Os melhores lanches da Freguesia.',
    verified: true,
    isOpenNow: true,
    neighborhood: 'Freguesia',
    logoUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=200',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=800',
    business_hours: {
      segunda: { open: true, start: '10:00', end: '22:00' },
      terca: { open: true, start: '10:00', end: '22:00' },
      quarta: { open: true, start: '10:00', end: '22:00' },
      quinta: { open: true, start: '10:00', end: '22:00' },
      sexta: { open: true, start: '10:00', end: '00:00' },
      sabado: { open: true, start: '10:00', end: '00:00' },
      domingo: { open: true, start: '10:00', end: '22:00' },
    }
  },
  {
    id: 'atual-clube',
    name: 'Atual Clube',
    category: 'Serviços',
    subcategory: 'Proteção Veicular',
    rating: 5.0,
    reviewsCount: 850,
    distance: 'Freguesia',
    adType: AdType.PREMIUM,
    description: 'Proteção veicular e benefícios exclusivos para Jacarepaguá.',
    verified: true,
    isOpenNow: true,
    neighborhood: 'Freguesia',
    logoUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=200',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800'
  },
  {
    id: 'grupo-esquematiza',
    name: 'Grupo Esquematiza',
    category: 'Serviços',
    subcategory: 'Imobiliária',
    rating: 4.9,
    reviewsCount: 320,
    distance: 'Freguesia',
    adType: AdType.PREMIUM,
    description: 'Soluções imobiliárias completas em Jacarepaguá.',
    verified: true,
    isOpenNow: true,
    neighborhood: 'Freguesia',
    logoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=200',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800'
  }
];

export const STORIES: Story[] = [
  { id: 's1', name: 'Padaria Imperial', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400' },
  { id: 's2', name: 'Pet Shop Amigo', image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400' },
];

export const MOCK_CLASSIFIEDS: Classified[] = [
  {
    id: 'cl-1',
    title: 'Vendo iPhone 13 Pro',
    advertiser: 'Lucas Silva',
    category: 'Desapega JPA',
    neighborhood: 'Freguesia',
    description: 'Em perfeito estado, 128GB.',
    timestamp: 'Há 2h',
    contactWhatsapp: '21999999999',
    typeLabel: 'Venda',
    price: 'R$ 4.500',
    imageUrl: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=400',
    acceptsTrade: true,
    tradeInterests: ['Notebook', 'Videogame']
  },
  {
    id: 'cl-ado-1',
    title: 'Adoção de Filhote',
    advertiser: 'Ana Maria',
    category: 'Adoção de pets',
    neighborhood: 'Taquara',
    description: 'Filhote de 2 meses, vacinado.',
    timestamp: 'Há 5h',
    contactWhatsapp: '21988888888',
    typeLabel: 'Adoção',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400'
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    role: 'Atendente de Balcão',
    company: 'Padaria Imperial',
    neighborhood: 'Freguesia',
    category: 'Vagas',
    type: 'CLT',
    description: 'Atendimento ao público.',
    requirements: ['Ensino Médio completo'],
    postedAt: 'Há 1 dia',
    contactWhatsapp: '21977777777',
    isVerified: true
  }
];

export const NEIGHBORHOOD_COMMUNITIES: NeighborhoodCommunity[] = [
  { id: 'comm-1', name: 'Moradores da Freguesia', description: 'Grupo oficial de moradores', image: '', icon: <Users />, color: 'bg-blue-500', membersCount: '15.4k' },
];

// Corrected NEIGHBORHOODS_COMMUNITIES to NEIGHBORHOOD_COMMUNITIES
export const OFFICIAL_COMMUNITIES: NeighborhoodCommunity[] = NEIGHBORHOOD_COMMUNITIES;
export const MOCK_USER_COMMUNITIES: NeighborhoodCommunity[] = [];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    userId: 'u1',
    userName: 'João Morador',
    userAvatar: 'https://i.pravatar.cc/100?u=u1',
    authorRole: 'resident',
    content: 'Alguém sabe se a feira da praça vai acontecer amanhã?',
    type: 'poll',
    communityId: 'comm-1',
    neighborhood: 'Freguesia',
    timestamp: 'Há 10 min',
    likes: 12,
    comments: 4,
    theme: 'utilidade',
    isActiveResident: true
  }
];

export const MOCK_REAL_ESTATE_PROPERTIES: RealEstateProperty[] = [
  {
    id: 're-1',
    type: 'Comercial',
    title: 'Sala Comercial Tirol',
    description: 'Excelente localização no coração da Freguesia.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800',
    neighborhood: 'Freguesia',
    price: 1500,
    transaction: 'aluguel',
    area: 40,
    postedAt: 'Há 2 dias',
    propertyTypeCom: 'Sala comercial',
    highCeiling: true,
    loadingAccess: true
  }
];

export const CATEGORY_TOP_BANNERS: Record<string, Record<string, { storeId: string; image: string }[]>> = {
  'alimentacao': {
    'Freguesia': [{ storeId: 'f-1', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800' }],
    'Jacarepaguá (todos)': [{ storeId: 'f-1', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800' }]
  },
  'restaurantes': {
    'Freguesia': [{ storeId: 'f-1', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800' }],
    'Jacarepaguá (todos)': [{ storeId: 'f-1', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800' }]
  }
};
