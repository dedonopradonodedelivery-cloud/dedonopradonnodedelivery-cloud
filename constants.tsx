
import React from 'react';
import { 
  Utensils, ShoppingCart, Scissors, Heart, PawPrint, Home, Wrench, 
  Dumbbell, CarFront, BookOpen, Monitor, Shirt, Ticket, Map as MapIcon, 
  LayoutGrid, Pill, Briefcase, Plane, Zap,
  Beef, Coffee, Pizza, Croissant, Soup, Cake, Sandwich, 
  Stethoscope, Package, Clock, Target, Settings, Dog,
  Star, Tag, Award, TrendingUp, ChevronRight, MessageSquare, Users
} from 'lucide-react';
import { AdType, Category, Store, Story, EditorialCollection, Job, CommunityPost, NeighborhoodCommunity } from './types';
import { getStoreLogo } from './utils/mockLogos';

export const CATEGORIES: Category[] = [
  { id: 'cat-food', name: 'Comida', slug: 'food', icon: <Utensils />, color: 'from-orange-500 to-red-600', illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/3170/3170733.png' },
  { id: 'cat-beauty', name: 'Beleza', slug: 'beauty', icon: <Scissors />, color: 'from-pink-500 to-rose-600', illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/2707/2707142.png' },
  { id: 'cat-pets', name: 'Pets', slug: 'pets', icon: <PawPrint />, color: 'from-purple-500 to-indigo-600', illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/107/107831.png' },
  { id: 'cat-autos', name: 'Autos', slug: 'autos', icon: <CarFront />, color: 'from-slate-600 to-slate-800', illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/743/743241.png' },
  { id: 'cat-pro', name: 'Pro', slug: 'pro', icon: <Briefcase />, color: 'from-blue-700 to-indigo-800', illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/1063/1063376.png' },
  { id: 'cat-grocery', name: 'Mercado', slug: 'grocery', icon: <ShoppingCart />, color: 'from-emerald-500 to-teal-600', illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/3081/3081840.png' },
  { id: 'cat-health', name: 'Saúde', slug: 'health', icon: <Heart />, color: 'from-red-500 to-orange-600', illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png' },
  { id: 'cat-home', name: 'Casa', slug: 'home', icon: <Home />, color: 'from-sky-500 to-blue-600', illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/619/619153.png' },
  { id: 'cat-services', name: 'Serviços', slug: 'services', icon: <Wrench />, color: 'from-amber-500 to-orange-600', illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/4233/4233830.png' },
  { id: 'cat-sports', name: 'Esportes', slug: 'sports', icon: <Dumbbell />, color: 'from-green-500 to-emerald-600', illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/2871/2871612.png' },
  { id: 'cat-leisure', name: 'Lazer', slug: 'leisure', icon: <Ticket />, color: 'from-yellow-400 to-orange-500', illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png' },
  { id: 'cat-edu', name: 'Educação', slug: 'education', icon: <BookOpen />, color: 'from-blue-500 to-indigo-600', illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/3389/3389081.png' },
  { id: 'cat-pharmacy', name: 'Farmácia', slug: 'pharmacy', icon: <Pill />, color: 'from-rose-500 to-red-600', illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/883/883356.png' },
  { id: 'cat-fashion', name: 'Moda', slug: 'fashion', icon: <Shirt />, color: 'from-fuchsia-500 to-purple-600', illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/3050/3050225.png' },
  { id: 'cat-tech', name: 'Tecnologia', slug: 'tech', icon: <Monitor />, color: 'from-cyan-500 to-blue-600', illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/606/606203.png' },
  { id: 'cat-tourism', name: 'Viagem', slug: 'tourism', icon: <Plane />, color: 'from-sky-400 to-blue-500', illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/290/290445.png' },
];

export const NEIGHBORHOOD_COMMUNITIES: NeighborhoodCommunity[] = [
  {
    id: 'comm-services',
    name: 'Serviços & Indicações',
    description: 'Encontre os melhores profissionais do bairro indicados por quem mora aqui.',
    image: 'https://images.unsplash.com/photo-1581578731117-104f2a8d23e9?q=80&w=600&auto=format&fit=crop',
    icon: <Wrench />,
    color: 'from-blue-500 to-blue-700',
    membersCount: '2.4k'
  },
  {
    id: 'comm-jobs',
    name: 'Vagas no Bairro',
    description: 'Oportunidades de emprego e freelances exclusivos na região de Jacarepaguá.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
    icon: <Briefcase />,
    color: 'from-amber-500 to-orange-600',
    membersCount: '1.8k'
  },
  {
    id: 'comm-pets',
    name: 'Pets do Bairro',
    description: 'Dicas de veterinários, banho e tosa, e ajuda para animais perdidos.',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=600&auto=format&fit=crop',
    icon: <PawPrint />,
    color: 'from-purple-500 to-indigo-600',
    membersCount: '3.1k'
  },
  {
    id: 'comm-food',
    name: 'Comer & Beber',
    description: 'Onde comer bem? As melhores pizzarias, bares e deliveries da Freguesia.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop',
    icon: <Utensils />,
    color: 'from-red-500 to-rose-600',
    membersCount: '4.5k'
  },
  {
    id: 'comm-fit',
    name: 'Fit',
    description: 'Academias, grupos de corrida, crossfit e alimentação saudável no bairro.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    icon: <Dumbbell />,
    color: 'from-emerald-500 to-teal-600',
    membersCount: '1.2k'
  }
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    userId: 'u1',
    userName: 'Ana Paula',
    userAvatar: 'https://i.pravatar.cc/100?u=a',
    authorRole: 'resident',
    content: 'O pão da Padaria Imperial tá saindo agora! Quentinho demais 🍞😋',
    type: 'recommendation',
    communityId: 'comm-food',
    neighborhood: 'Freguesia',
    timestamp: '5 min atrás',
    likes: 12,
    comments: 2
  },
  {
    id: 'post-2',
    userId: 'u2',
    userName: 'Carlos Silva',
    userAvatar: 'https://i.pravatar.cc/100?u=c',
    authorRole: 'resident',
    content: 'Indico o João Eletricista! Fez um serviço impecável aqui em casa hoje. ⚡🔌',
    type: 'recommendation',
    communityId: 'comm-services',
    neighborhood: 'Taquara',
    timestamp: '1h atrás',
    likes: 45,
    comments: 8,
    imageUrl: 'https://images.unsplash.com/photo-1621905476438-5f09f22d556c?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'post-3',
    userId: 'u3',
    userName: 'Mariana G.',
    userAvatar: 'https://i.pravatar.cc/100?u=m',
    authorRole: 'resident',
    content: 'Alguém sabe de vaga para recepcionista aqui na Freguesia? Procuro para minha sobrinha.',
    type: 'tip',
    communityId: 'comm-jobs',
    neighborhood: 'Freguesia',
    timestamp: '2h atrás',
    likes: 8,
    comments: 15
  },
  {
    id: 'post-4',
    userId: 'u4',
    userName: 'Bruno JPA',
    userAvatar: 'https://i.pravatar.cc/100?u=b',
    authorRole: 'resident',
    content: 'Gente, perdi meu gatinho nas proximidades da Geremário Dantas. Se alguém vir, por favor me avise! 🙏🐱',
    type: 'alert',
    communityId: 'comm-pets',
    neighborhood: 'Anil',
    timestamp: '3h atrás',
    likes: 89,
    comments: 24,
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'post-5',
    userId: 'u5',
    userName: 'Juliana Fit',
    userAvatar: 'https://i.pravatar.cc/100?u=j',
    authorRole: 'resident',
    content: 'Treino de pernas concluído na Smart Fit! Quem mais tá focado hoje? 💪🔥',
    type: 'news',
    communityId: 'comm-fit',
    neighborhood: 'Pechincha',
    timestamp: '4h atrás',
    likes: 31,
    comments: 4
  }
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
    address: 'R. Cândido de Figueiredo, 204 – Tanque',
    phone: '(21) 98555-9480',
    hours: 'Seg a Sex • 08h às 18h',
    verified: true,
    isOpenNow: true,
  }
];

/* 
 * ADDED: EDITORIAL_SERVICES export to fix HomeFeed.tsx import error.
 */
export const EDITORIAL_SERVICES = [
  {
    id: 'grupo-esquematiza',
    name: 'Grupo Esquematiza',
    subcategory: 'Segurança e Facilities',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
    location: 'Freguesia'
  },
  {
    id: 'job-1',
    name: 'Padaria Imperial',
    subcategory: 'Alimentação',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop',
    location: 'Freguesia'
  }
];

export const STORIES: Story[] = [
  { id: '1', name: 'Moda Feminina', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=200&auto=format&fit=crop' },
  { id: '2', name: 'Ana Paula', image: 'https://i.pravatar.cc/150?u=a' },
  { id: '3', name: 'Pet Shop Amigo', image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=200&auto=format&fit=crop' },
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    role: 'Atendente de Balcão',
    company: 'Padaria Imperial',
    neighborhood: 'Freguesia',
    category: 'Alimentação',
    type: 'CLT',
    salary: 'R$ 1.600,00',
    description: 'Buscamos pessoa comunicativa e ágil para atendimento ao cliente e organização do balcão.',
    requirements: ['Experiência anterior', 'Disponibilidade tarde/noite', 'Simpatia'],
    schedule: '14h às 22h (Escala 6x1)',
    contactWhatsapp: '5521999999999',
    postedAt: 'Hoje',
    isUrgent: true,
    isSponsored: true,
    sponsoredUntil: '2099-12-31'
  }
];

export const SUBCATEGORIES: Record<string, { name: string; icon: React.ReactNode }[]> = {
  'Alimentação': [
    { name: 'Restaurantes', icon: <Utensils /> },
    { name: 'Padarias', icon: <Croissant /> },
    { name: 'Lanches', icon: <Sandwich /> },
    { name: 'Pizzarias', icon: <Pizza /> },
    { name: 'Cafeterias', icon: <Coffee /> },
    { name: 'Japonês / Oriental', icon: <Soup /> },
    { name: 'Churrascarias', icon: <Beef /> },
    { name: 'Doces & Sobremesas', icon: <Cake /> },
  ],
  'default': [
    { name: 'Geral', icon: <LayoutGrid /> },
    { name: 'Novidades', icon: <Zap /> },
    { name: 'Mais Procurados', icon: <Star /> },
    { name: 'Promoções', icon: <Tag /> }
  ]
};

export const quickFilters = [
  { id: 'nearby', label: 'Perto de mim', icon: 'zap' },
  { id: 'top_rated', label: 'Melhores avaliados', icon: 'star' },
  { id: 'open_now', label: 'Aberto agora', icon: 'clock' },
];
