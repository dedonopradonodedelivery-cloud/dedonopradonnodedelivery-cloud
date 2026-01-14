
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
    id: 'demo-moda-fem',
    name: 'Moda Feminina',
    category: 'Moda',
    subcategory: 'Roupas',
    description: 'As melhores tendências da moda feminina.',
    logoUrl: getStoreLogo(201),
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewsCount: 120,
    distance: 'Freguesia • RJ',
    neighborhood: 'Freguesia',
    cashback: 10,
    adType: AdType.PREMIUM,
    address: 'Rua Tirol, 100',
    phone: '(21) 99999-0001',
    hours: 'Seg a Sáb • 09h às 19h',
    verified: true,
    isOpenNow: true,
    // @ts-ignore
    status: 'active',
    tags: ['moda', 'roupas', 'feminino']
  },
  {
    id: 'demo-pet',
    name: 'Pet Shop Amigo',
    category: 'Pets',
    subcategory: 'Pet Shop',
    description: 'Cuidado e carinho para o seu melhor amigo.',
    logoUrl: getStoreLogo(202),
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 89,
    distance: 'Freguesia • RJ',
    neighborhood: 'Freguesia',
    cashback: 5,
    adType: AdType.LOCAL,
    address: 'Estrada dos Três Rios, 500',
    phone: '(21) 99999-0002',
    hours: 'Seg a Dom • 08h às 20h',
    verified: true,
    isOpenNow: true,
    // @ts-ignore
    status: 'active',
    tags: ['pet', 'banho', 'tosa']
  },
  {
    id: 'demo-moda-masc',
    name: 'Moda Masculina',
    category: 'Moda',
    subcategory: 'Roupas',
    description: 'Estilo e conforto para o dia a dia.',
    logoUrl: getStoreLogo(203),
    image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=800&auto=format&fit=crop',
    rating: 4.7,
    reviewsCount: 56,
    distance: 'Freguesia • RJ',
    neighborhood: 'Freguesia',
    cashback: 10,
    adType: AdType.PREMIUM,
    address: 'Rua Geminiano Gois, 300',
    phone: '(21) 99999-0003',
    hours: 'Seg a Sáb • 10h às 20h',
    verified: true,
    isOpenNow: true,
    // @ts-ignore
    status: 'active',
    tags: ['moda', 'masculino', 'roupas']
  },
  {
    id: 'demo-papelaria',
    name: 'Papelaria & Co.',
    category: 'Serviços',
    subcategory: 'Papelaria',
    description: 'Material escolar, escritório e presentes.',
    logoUrl: getStoreLogo(204),
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=800&auto=format&fit=crop',
    rating: 4.5,
    reviewsCount: 42,
    distance: 'Freguesia • RJ',
    neighborhood: 'Freguesia',
    cashback: 5,
    adType: AdType.ORGANIC,
    address: 'Rua Araguaia, 200',
    phone: '(21) 99999-0004',
    hours: 'Seg a Sex • 08h às 18h',
    verified: true,
    isOpenNow: true,
    // @ts-ignore
    status: 'active',
    tags: ['papelaria', 'material', 'escritorio']
  },
  {
    id: 'demo-tech-fix',
    name: 'Tech Fix Freguesia',
    category: 'Serviços',
    subcategory: 'Assistência Técnica',
    description: 'Conserto de celulares, notebooks e tablets na hora.',
    logoUrl: getStoreLogo(207),
    image: 'https://images.unsplash.com/photo-1597872250449-66ca64d2558a?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 215,
    distance: 'Freguesia • RJ',
    neighborhood: 'Freguesia',
    cashback: 0,
    adType: AdType.PREMIUM, // Premium para aparecer no bloco
    address: 'Estrada dos Três Rios, 200 - Shopping',
    phone: '(21) 98888-7777',
    hours: 'Seg a Sáb • 10h às 22h',
    verified: true,
    isOpenNow: true,
    // @ts-ignore
    status: 'active',
    tags: ['celular', 'conserto', 'notebook']
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
  },
  {
    id: 'job-2',
    role: 'Vendedor(a) de Loja',
    company: 'Moda Feminina Store',
    neighborhood: 'Freguesia',
    category: 'Vendas',
    type: 'CLT',
    salary: 'R$ 1.800,00 + Comissão',
    description: 'Vaga para vendedor com experiência em moda feminina. Foco em resultados e bom atendimento.',
    requirements: ['Experiência em vendas', 'Gostar de moda', 'Proatividade'],
    schedule: 'Horário de Shopping',
    contactWhatsapp: '5521999998888',
    postedAt: 'Ontem',
    isUrgent: false,
    isSponsored: true,
    sponsoredUntil: '2099-12-31'
  },
  {
    id: 'job-3',
    role: 'Estágio em Marketing',
    company: 'Agência Criativa',
    neighborhood: 'Taquara',
    category: 'Marketing',
    type: 'Estágio',
    salary: 'R$ 1.200,00',
    description: 'Auxiliar na criação de conteúdo para redes sociais e gestão de tráfego.',
    requirements: ['Cursando Marketing ou Publicidade', 'Noções de Canva/Photoshop'],
    schedule: '6h diárias (Flexível)',
    contactWhatsapp: '5521999997777',
    postedAt: '2 dias atrás',
    isUrgent: false
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

export const quickFilters = [
  { id: 'nearby', label: 'Perto de mim', icon: 'zap' },
  { id: 'top_rated', label: 'Melhores avaliados', icon: 'star' },
  { id: 'open_now', label: 'Aberto agora', icon: 'clock' },
  { id: 'cashback', label: 'Cupom', icon: 'percent' },
];
