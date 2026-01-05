
import React from 'react';
import { 
  Utensils, ShoppingCart, Scissors, Heart, PawPrint, Home, Wrench, 
  Dumbbell, CarFront, BookOpen, Monitor, Shirt, Ticket, Map as MapIcon, 
  LayoutGrid, Pill, Briefcase, Plane, Zap,
  Beef, Coffee, Pizza, Croissant, Soup, Cake, Sandwich, 
  Stethoscope, Package, Clock, Target, Settings, Dog,
  Star, Tag, Award, TrendingUp, ChevronRight
} from 'lucide-react';
import { AdType, Category, Store, Story, EditorialCollection, Job } from './types';
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

export const EDITORIAL_COLLECTIONS: EditorialCollection[] = [
  {
    id: 'novo-bairro',
    title: 'Novo no Bairro',
    subtitle: 'Lugares que acabaram de chegar',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    keywords: ['novo', 'lançamento', 'estreia']
  },
  {
    id: 'top-rated',
    title: 'Melhores Avaliados',
    subtitle: 'Favoritos dos moradores',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
    keywords: ['melhor', 'top', 'favorito']
  }
];

export const quickFilters = [
  { id: 'cashback', label: 'Cashback', icon: 'percent' },
  { id: 'top_rated', label: 'Melhores', icon: 'star' },
  { id: 'open_now', label: 'Abertos', icon: 'clock' },
  { id: 'nearby', label: 'Perto', icon: 'zap' }
];

export const STORIES: Story[] = [
  { id: '1', name: 'Burger Freguesia', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop' },
  { id: '2', name: 'Padaria Imperial', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&auto=format&fit=crop' },
];

export const STORES: Store[] = [
  {
    id: '1',
    name: 'Burger Freguesia',
    category: 'Alimentação',
    subcategory: 'Hambúrguerias',
    description: 'Hambúrgueres artesanais com sabor de bairro.',
    logoUrl: getStoreLogo(1),
    rating: 4.8,
    reviewsCount: 124,
    distance: 'Freguesia • RJ',
    cashback: 5,
    adType: AdType.ORGANIC,
    address: 'Rua Tirol, 1245 - Freguesia',
    phone: '(21) 99999-1111',
    hours: 'Seg a Dom • 11h às 23h',
    verified: true,
    recentComments: [
      "O melhor cheddar da Freguesia, sem dúvidas!",
      "Entrega super rápida, chegou quentinho.",
      "Sempre peço no fim de semana, nunca decepciona."
    ]
  },
  {
    id: 'premium-test',
    name: 'Padaria Imperial',
    category: 'Alimentação',
    subcategory: 'Padarias',
    description: 'O melhor pão quentinho e café artesanal da Freguesia.',
    logoUrl: getStoreLogo(8),
    rating: 4.9,
    reviewsCount: 450,
    distance: 'Freguesia • RJ',
    cashback: 10,
    adType: AdType.PREMIUM,
    address: 'Estrada dos Três Rios, 1000',
    phone: '(21) 98888-2222',
    verified: true,
    recentComments: [
      "Pão quentinho toda hora, atendimento nota 10.",
      "O café da manhã colonial deles é imperdível.",
      "Melhor padaria do bairro, limpa e organizada."
    ]
  },
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    role: 'Atendente de Balcão',
    company: 'Padaria Imperial',
    neighborhood: 'Freguesia',
    type: 'CLT',
    salary: 'R$ 1.600,00',
    description: 'Buscamos pessoa comunicativa e ágil para atendimento ao cliente e organização do balcão.',
    requirements: ['Experiência anterior', 'Disponibilidade tarde/noite', 'Simpatia'],
    schedule: '14h às 22h (Escala 6x1)',
    contactWhatsapp: '5521999999999',
    postedAt: 'Hoje',
    isUrgent: true
  },
  {
    id: 'job-2',
    role: 'Manicure e Pedicure',
    company: 'Studio Belleza',
    neighborhood: 'Freguesia',
    type: 'PJ',
    description: 'Parceria com salão movimentado. Ótimo ambiente e clientela fidelizada.',
    requirements: ['MEI ativo', 'Material próprio', 'Experiência em unhas de gel'],
    schedule: 'Horário comercial',
    contactWhatsapp: '5521988888888',
    postedAt: 'Ontem',
  },
  {
    id: 'job-3',
    role: 'Entregador Moto',
    company: 'Burger Freguesia',
    neighborhood: 'Freguesia',
    type: 'Freelancer',
    salary: 'Taxa + Produtividade',
    description: 'Entregas na região da Freguesia e Pechincha.',
    requirements: ['Moto própria', 'CNH A', 'Conhecer a região'],
    schedule: 'Noite (18h às 23h)',
    contactWhatsapp: '5521977777777',
    postedAt: 'Há 2 dias',
    isUrgent: true
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
  'Pets': [
    { name: 'Pet Shop', icon: <Dog /> },
    { name: 'Veterinária', icon: <Stethoscope /> },
    { name: 'Banho & Tosa', icon: <Scissors /> },
    { name: 'Ração & Acessórios', icon: <Package /> },
    { name: 'Clínica 24h', icon: <Clock /> },
    { name: 'Adestramento', icon: <Target /> },
    { name: 'Pet Hotel', icon: <Home /> },
    { name: 'Serviços Pet', icon: <Settings /> },
  ],
  'Comida': [
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
    { name: 'Promoções', icon: <Tag /> },
    { name: 'Próximos', icon: <MapIcon /> },
    { name: 'Premium', icon: <Award /> },
    { name: 'Destaque', icon: <TrendingUp /> },
    { name: 'Ver Todos', icon: <ChevronRight /> }
  ]
};
