
import React from 'react';
import { 
  Utensils, ShoppingCart, Scissors, Heart, PawPrint, Wrench, 
  Dumbbell, CarFront, BookOpen, Monitor, Shirt, Ticket, Map as MapIcon, 
  Store as StoreIcon, LayoutGrid, Pill, Briefcase, Plane, Zap,
  Beef, Coffee, Pizza, Croissant, Soup, Cake, Sandwich, 
  Stethoscope, Package, Clock, Target, Settings, Dog,
  Star, Tag, Award, TrendingUp, ChevronRight, MessageSquare, Users,
  Apple, Building2, Leaf, Shield, PaintRoller, Hammer, Droplets, Laptop,
  Baby, GraduationCap, Microscope, Brain, Sparkles, Smile, Beer, 
  Activity, Eye, FileText, Globe, Calendar, Music, PartyPopper, Globe2, Edit3, User, Bell, Search,
  Camera, Vote, Handshake, Flame, Milestone, History, Home as HomeIcon,
  MessageCircle, HelpCircle, UserCheck, Recycle, Scale, Calculator, PenTool,
  // Added missing Fish icon
  Fish
} from 'lucide-react';
import { Category, Store, Story, EditorialCollection, Job, CommunityPost, NeighborhoodCommunity } from './types';

export const CATEGORIES: Category[] = [
  { id: 'cat-comida', name: 'Comida', slug: 'comida', icon: <Utensils />, color: 'bg-brand-blue' },
  { id: 'cat-saude', name: 'Saúde', slug: 'saude', icon: <Heart />, color: 'bg-brand-blue' },
  { id: 'cat-services', name: 'Serviços & Reparos', slug: 'servicos', icon: <Wrench />, color: 'bg-brand-blue' },
  { id: 'cat-pets', name: 'Pets', slug: 'pets', icon: <PawPrint />, color: 'bg-brand-blue' },
  { id: 'cat-pro', name: 'Profissionais (Pro)', slug: 'pro', icon: <Briefcase />, color: 'bg-brand-blue' },
  { id: 'cat-beauty', name: 'Beleza & Estética', slug: 'beleza', icon: <Scissors />, color: 'bg-brand-blue' },
  { id: 'cat-autos', name: 'Autos', slug: 'autos', icon: <CarFront />, color: 'bg-brand-blue' },
  { id: 'cat-mercado', name: 'Mercado', slug: 'mercado', icon: <ShoppingCart />, color: 'bg-brand-blue' },
  { id: 'cat-casa', name: 'Casa & Decor', slug: 'casa', icon: <HomeIcon />, color: 'bg-brand-blue' },
  { id: 'cat-fashion', name: 'Moda', slug: 'moda', icon: <Shirt />, color: 'bg-brand-blue' },
];

export const SUBCATEGORIES: Record<string, { name: string; icon: React.ReactNode }[]> = {
  'Comida': [
    { name: 'Restaurante', icon: <Utensils /> },
    { name: 'Pizzaria', icon: <Pizza /> },
    { name: 'Hamburgueria', icon: <Beef /> },
    { name: 'Cafeteria', icon: <Coffee /> },
    { name: 'Doceria & Sobremesas', icon: <Cake /> },
    { name: 'Japonês', icon: <Fish /> },
  ],
  'Saúde': [
    { name: 'Dentista', icon: <Smile /> },
    { name: 'Médico', icon: <Stethoscope /> },
    { name: 'Psicólogo', icon: <Brain /> },
    { name: 'Fisioterapeuta', icon: <Activity /> },
    { name: 'Nutricionista', icon: <Apple /> },
  ],
  'Serviços & Reparos': [
    { name: 'Eletricista', icon: <Zap /> },
    { name: 'Encanador', icon: <Droplets /> },
    { name: 'Marido de Aluguel', icon: <Wrench /> },
    { name: 'Pintor', icon: <PaintRoller /> },
    { name: 'Pedreiro', icon: <Hammer /> },
    { name: 'Técnico de Informática', icon: <Monitor /> },
  ],
  'Profissionais (Pro)': [
    { name: 'Advogado', icon: <Scale /> },
    { name: 'Contador', icon: <Calculator /> },
    { name: 'Arquiteto', icon: <PenTool /> },
    { name: 'Designer', icon: <PenTool /> },
    { name: 'Fotógrafo', icon: <Camera /> },
  ],
  'Pets': [
    { name: 'Veterinário', icon: <Stethoscope /> },
    { name: 'Pet Shop', icon: <ShoppingCart /> },
    { name: 'Banho & Tosa', icon: <Scissors /> },
    { name: 'Adestrador', icon: <Dog /> },
  ]
};

export const SPECIALTIES: Record<string, string[]> = {
  // Comida
  'Restaurante': ['Self-service', 'À la carte', 'Delivery', 'Comida Caseira', 'Churrascaria', 'Vegano'],
  'Pizzaria': ['Forno a lenha', 'Rodízio', 'Artesanal', 'Borda Recheada'],
  'Hamburgueria': ['Artesanal', 'Smash Burger', 'Veggie', 'Combos'],
  
  // Saúde
  'Dentista': ['Ortodontia', 'Implantes', 'Clareamento', 'Odontopediatria', 'Estética'],
  'Psicólogo': ['TCC', 'Psicanálise', 'Infantil', 'Casal', 'Ansiedade'],
  
  // Serviços
  'Eletricista': ['Residencial', 'Predial', 'Instalação de Ar', 'Quadro de Luz', 'Emergência 24h'],
  'Encanador': ['Vazamentos', 'Desentupimento', 'Instalação Hidráulica', 'Caixa d\'água'],
  'Técnico de Informática': ['Formatação', 'Hardware', 'Redes/Wifi', 'Macbook/iPhone', 'Remoção de Vírus'],

  // Pro
  'Advogado': ['Cível', 'Criminal', 'Trabalhista', 'Família', 'Imobiliário', 'Previdenciário'],
  'Contador': ['MEI', 'Imposto de Renda', 'Abertura de Empresa', 'Assessoria Mensal', 'Consultoria'],
  
  // Pets
  'Veterinário': ['Clínica Geral', 'Castração', 'Exames', 'Vacinação', 'Especialista'],
  'Pet Shop': ['Rações', 'Acessórios', 'Farmácia Pet', 'Hospedagem'],

  'default': ['Consultoria', 'Orçamento Geral', 'Manutenção', 'Instalação']
};

export const OFFICIAL_COMMUNITIES: NeighborhoodCommunity[] = [
  { id: 'comm-residents', name: 'Moradores de JPA', description: 'Troca de informações entre vizinhos.', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800', icon: <Users />, color: 'bg-blue-500', membersCount: '12.4k', type: 'official' },
  { id: 'comm-desapega', name: 'Desapega JPA', description: 'Venda e troca local.', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800', icon: <Recycle />, color: 'bg-[#1E5BFF]', membersCount: '22.3k', type: 'official' }
];

// Added missing MOCK_USER_COMMUNITIES
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
  },
  {
    id: 'user-comm-2',
    name: 'Vizinhos do Anil (Reserva)',
    description: 'Grupo específico para moradores do condomínio Reserva do Anil.',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop',
    icon: <Building2 />,
    color: 'bg-blue-400',
    membersCount: '482',
    type: 'user'
  },
  {
    id: 'user-comm-3',
    name: 'Trilhas em Jacarepaguá',
    description: 'Para quem ama explorar o Maciço da Tijuca e arredores aos finais de semana.',
    image: 'https://images.unsplash.com/photo-1551632432-c735e8399527?q=80&w=800&auto=format&fit=crop',
    icon: <MapIcon />,
    color: 'bg-green-600',
    membersCount: '890',
    type: 'user'
  },
  {
    id: 'user-comm-4',
    name: 'Donos de Golden Retriever JPA',
    description: 'Troca de experiências e encontros de pets no Parque de Jacarepaguá.',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800&auto=format&fit=crop',
    icon: <Dog />,
    color: 'bg-yellow-500',
    membersCount: '312',
    type: 'user'
  }
];

export const NEIGHBORHOOD_COMMUNITIES: NeighborhoodCommunity[] = [...OFFICIAL_COMMUNITIES, ...MOCK_USER_COMMUNITIES];
export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [];
export const STORES: Store[] = [];
export const EDITORIAL_SERVICES: EditorialCollection[] = [];
export const quickFilters = [];
export const STORIES: Story[] = [];
export const MOCK_JOBS: Job[] = [];
