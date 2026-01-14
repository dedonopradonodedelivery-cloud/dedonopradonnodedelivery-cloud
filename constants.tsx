
import React from 'react';
import { 
  Utensils, ShoppingCart, Scissors, Heart, PawPrint, Home, Wrench, 
  Dumbbell, CarFront, BookOpen, Monitor, Shirt, Ticket, Map as MapIcon, 
  LayoutGrid, Pill, Briefcase, Plane, Zap,
  Beef, Coffee, Pizza, Croissant, Soup, Cake, Sandwich, 
  Stethoscope, Package, Clock, Target, Settings, Dog,
  Star, Tag, Award, TrendingUp, ChevronRight
} from 'lucide-react';
import { AdType, Category, Store, Story, EditorialCollection, Job, CommunityPost } from './types';
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

export const STORES: Store[] = [
  {
    id: '1',
    name: 'Burger Freguesia',
    category: 'Alimentação',
    subcategory: 'Hambúrguerias',
    description: 'A melhor loja de hambúrguer artesanal com sabor de bairro.',
    logoUrl: getStoreLogo(1),
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 124,
    distance: 'Freguesia • RJ',
    neighborhood: 'Freguesia',
    cashback: 5,
    adType: AdType.ORGANIC,
    address: 'Rua Tirol, 1245 - Freguesia',
    phone: '(21) 99999-1111',
    hours: 'Seg a Dom • 11h às 23h',
    verified: true,
    isOpenNow: true,
    // @ts-ignore - status e tags para motor de busca
    status: 'active',
    tags: ['hamburguer', 'lanche', 'loja', 'comer']
  },
  {
    id: 'tanque-1',
    name: 'Oficina do Tanque',
    category: 'Autos',
    subcategory: 'Mecânica',
    description: 'Este estabelecimento oferece mecânica geral e elétrica com confiança.',
    logoUrl: getStoreLogo(5),
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewsCount: 56,
    distance: 'Tanque • RJ',
    neighborhood: 'Tanque',
    adType: AdType.ORGANIC,
    address: 'Rua Cândido Benício, 2000',
    phone: '(21) 95555-3333',
    verified: true,
    isOpenNow: true,
    // @ts-ignore
    status: 'active',
    tags: ['carro', 'conserto', 'oficina', 'serviço']
  },
  {
    id: 'beleza-1',
    name: 'Studio Glamour',
    category: 'Beleza',
    subcategory: 'Salão de Beleza',
    description: 'Sua loja de beleza no Pechincha. Cabelo, unhas e estética.',
    logoUrl: getStoreLogo(20),
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop',
    rating: 5.0,
    reviewsCount: 42,
    distance: 'Pechincha • RJ',
    neighborhood: 'Pechincha',
    adType: AdType.ORGANIC,
    verified: true,
    isOpenNow: true,
    // @ts-ignore
    status: 'active',
    tags: ['salao', 'unha', 'loja', 'beleza']
  },
  {
    id: 'premium-test',
    name: 'Padaria Imperial',
    category: 'Alimentação',
    subcategory: 'Padarias',
    description: 'O melhor estabelecimento para pão quentinho e café artesanal na Freguesia.',
    logoUrl: getStoreLogo(8),
    rating: 4.9,
    reviewsCount: 450,
    distance: 'Freguesia • RJ',
    neighborhood: 'Freguesia',
    cashback: 10,
    adType: AdType.PREMIUM,
    address: 'Estrada dos Três Rios, 1000',
    phone: '(21) 98888-2222',
    verified: true,
    isOpenNow: true,
    // @ts-ignore
    status: 'active',
    tags: ['pao', 'cafe', 'loja', 'padaria']
  }
];

// Fix: Added missing STORIES export for StatusView
export const STORIES: Story[] = [
  { id: '1', name: 'Padaria Imperial', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&auto=format&fit=crop' },
  { id: '2', name: 'Ana Paula', image: 'https://i.pravatar.cc/150?u=a' },
  { id: '3', name: 'Studio Glamour', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=200&auto=format&fit=crop' },
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
    isUrgent: true
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
    relatedStoreId: 'premium-test',
    relatedStoreName: 'Padaria Imperial',
    neighborhood: 'Freguesia',
    timestamp: '5 min atrás',
    likes: 12,
    comments: 2
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

// Fix: Added missing quickFilters export for ExploreView
export const quickFilters = [
  { id: 'nearby', label: 'Perto de mim', icon: 'zap' },
  { id: 'top_rated', label: 'Melhores avaliados', icon: 'star' },
  { id: 'open_now', label: 'Aberto agora', icon: 'clock' },
  { id: 'cashback', label: 'Cupom', icon: 'percent' },
];
