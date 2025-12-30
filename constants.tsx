
import React from 'react';
import { Utensils, ShoppingCart, Scissors, Heart, PawPrint, Home, Wrench, Dumbbell, CarFront, BookOpen, Monitor, Shirt, Ticket, Map as MapIcon, LayoutGrid } from 'lucide-react';
import { AdType, Category, Store, Story, EditorialCollection } from './types';
import { getStoreLogo } from './utils/mockLogos';

export const CATEGORIES: Category[] = [
  { 
    id: 'cat-food', 
    name: 'Comida', 
    slug: 'food', 
    icon: <Utensils />, 
    illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/3170/3170733.png',
    color: 'from-red-500 to-rose-600' 
  },
  { 
    id: 'cat-grocery', 
    name: 'Mercado', 
    slug: 'grocery', 
    icon: <ShoppingCart />, 
    illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/3081/3081840.png',
    color: 'from-emerald-500 to-teal-600'
  },
  { 
    id: 'cat-beauty', 
    name: 'Beleza', 
    slug: 'beauty', 
    icon: <Scissors />, 
    illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/2707/2707142.png',
    color: 'from-pink-500 to-fuchsia-600'
  },
  { 
    id: 'cat-pets', 
    name: 'Pets', 
    slug: 'pets', 
    icon: <PawPrint />, 
    illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/107/107831.png',
    color: 'from-purple-500 to-indigo-600'
  },
  { 
    id: 'cat-health', 
    name: 'Saúde', 
    slug: 'health', 
    icon: <Heart />, 
    illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png',
    color: 'from-orange-500 to-amber-600'
  },
  { 
    id: 'cat-home', 
    name: 'Casa', 
    slug: 'home-decor', 
    icon: <Home />, 
    illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/619/619153.png',
    color: 'from-blue-600 to-indigo-700'
  },
  { 
    id: 'cat-services', 
    name: 'Serviços', 
    slug: 'services', 
    icon: <Wrench />, 
    illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/4233/4233830.png',
    color: 'from-sky-500 to-blue-600'
  },
  { 
    id: 'cat-sports', 
    name: 'Esportes', 
    slug: 'sports', 
    icon: <Dumbbell />, 
    illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/2871/2871612.png',
    color: 'from-green-500 to-emerald-600'
  },
  { 
    id: 'cat-autos', 
    name: 'Autos', 
    slug: 'autos', 
    icon: <CarFront />, 
    illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/743/743241.png',
    color: 'from-slate-600 to-slate-800'
  }
];

// Added SUBCATEGORIES to resolve import errors in components
export const SUBCATEGORIES: Record<string, { name: string; icon: React.ReactNode }[]> = {
  'Comida': [
    { name: 'Restaurantes', icon: <Utensils /> },
    { name: 'Lanches', icon: <Utensils /> },
    { name: 'Pizzarias', icon: <Utensils /> },
    { name: 'Hambúrguerias', icon: <Utensils /> },
    { name: 'Japonês', icon: <Utensils /> },
    { name: 'Docerias', icon: <Utensils /> },
  ],
  'Alimentação': [ // Specifically for CategoriaAlimentacao.tsx
    { name: 'Restaurantes', icon: <Utensils /> },
    { name: 'Lanches', icon: <Utensils /> },
    { name: 'Pizzarias', icon: <Utensils /> },
    { name: 'Hambúrguerias', icon: <Utensils /> },
    { name: 'Japonês', icon: <Utensils /> },
    { name: 'Docerias', icon: <Utensils /> },
  ],
  'Mercado': [
    { name: 'Supermercado', icon: <ShoppingCart /> },
    { name: 'Padaria', icon: <Utensils /> },
    { name: 'Hortifruti', icon: <ShoppingCart /> },
  ],
  'Beleza': [
    { name: 'Salão de Beleza', icon: <Scissors /> },
    { name: 'Barbearia', icon: <Scissors /> },
    { name: 'Estética', icon: <Heart /> },
  ],
  'Pets': [
    { name: 'Pet Shop', icon: <PawPrint /> },
    { name: 'Veterinário', icon: <Heart /> },
    { name: 'Banho e Tosa', icon: <Scissors /> },
  ],
  'Saúde': [
    { name: 'Clínica Médica', icon: <Heart /> },
    { name: 'Dentista', icon: <Heart /> },
    { name: 'Psicologia', icon: <Heart /> },
    { name: 'Farmácia', icon: <ShoppingCart /> },
  ],
  'Casa': [
    { name: 'Decoração', icon: <Home /> },
    { name: 'Móveis', icon: <Home /> },
    { name: 'Utilidades', icon: <ShoppingCart /> },
  ],
  'Serviços': [
    { name: 'Eletricista', icon: <Wrench /> },
    { name: 'Encanador', icon: <Wrench /> },
    { name: 'Ar Condicionado', icon: <Wrench /> },
  ],
  'Esportes': [
    { name: 'Academia', icon: <Dumbbell /> },
    { name: 'Suplementos', icon: <ShoppingCart /> },
    { name: 'Artigos Esportivos', icon: <Dumbbell /> },
  ],
  'Autos': [
    { name: 'Oficina', icon: <Wrench /> },
    { name: 'Lavajato', icon: <CarFront /> },
    { name: 'Estética Automotiva', icon: <CarFront /> },
  ],
  'default': [
    { name: 'Geral', icon: <LayoutGrid /> },
  ]
};

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
    subcategory: 'Hamburgueria',
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
  },
  {
    id: 'premium-test',
    name: 'Padaria Imperial',
    category: 'Alimentação',
    subcategory: 'Padaria',
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
  },
];
