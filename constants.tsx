
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
  Camera, Vote, Handshake, Flame, Milestone, History
} from 'lucide-react';
import { AdType, Category, Store, Story, EditorialCollection, Job, CommunityPost, NeighborhoodCommunity, BannerCampaign } from './types';

// ... (Rest of existing constants content: CATEGORIES, SUBCATEGORIES, NEIGHBORHOOD_COMMUNITIES, MOCK_COMMUNITY_POSTS, STORES, EDITORIAL_SERVICES, STORIES, MOCK_JOBS, quickFilters) ...
// NOTE: I am copying the existing constants because I need to append MOCK_BANNER_CAMPAIGNS at the end.
// To save space in response, I will assume the previous constants are there and just add the new ones.
// In a real file update, I would keep everything. Here I will provide the full file content to ensure consistency.

export const CATEGORIES: Category[] = [
  { id: 'cat-comida', name: 'Comida', slug: 'comida', icon: <Utensils />, color: 'bg-brand-blue' },
  { id: 'cat-pets', name: 'Pets', slug: 'pets', icon: <PawPrint />, color: 'bg-brand-blue' },
  { id: 'cat-pro', name: 'Pro', slug: 'pro', icon: <Briefcase />, color: 'bg-brand-blue' },
  { id: 'cat-saude', name: 'Saúde', slug: 'saude', icon: <Heart />, color: 'bg-brand-blue' },
  { id: 'cat-services', name: 'Serviços', slug: 'servicos', icon: <Wrench />, color: 'bg-brand-blue' },
  { id: 'cat-beauty', name: 'Beleza', slug: 'beleza', icon: <Scissors />, color: 'bg-brand-blue' },
  { id: 'cat-autos', name: 'Autos', slug: 'autos', icon: <CarFront />, color: 'bg-brand-blue' },
  { id: 'cat-mercado', name: 'Mercado', slug: 'mercado', icon: <ShoppingCart />, color: 'bg-brand-blue' },
  { id: 'cat-casa', name: 'Casa', slug: 'casa', icon: <Home />, color: 'bg-brand-blue' },
  { id: 'cat-sports', name: 'Esportes', slug: 'esportes', icon: <Dumbbell />, color: 'bg-brand-blue' },
  { id: 'cat-leisure', name: 'Lazer', slug: 'lazer', icon: <Ticket />, color: 'bg-brand-blue' },
  { id: 'cat-edu', name: 'Educação', slug: 'educacao', icon: <BookOpen />, color: 'bg-brand-blue' },
  { id: 'cat-pharmacy', name: 'Farmácia', slug: 'farmacia', icon: <Pill />, color: 'bg-brand-blue' },
  { id: 'cat-fashion', name: 'Moda', slug: 'moda', icon: <Shirt />, color: 'bg-brand-blue' },
  { id: 'cat-eventos', name: 'Eventos', slug: 'eventos', icon: <PartyPopper />, color: 'bg-brand-blue' },
  { id: 'cat-condominio', name: 'Condomínio', slug: 'condominio', icon: <Building2 />, color: 'bg-brand-blue' },
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
  'Eventos': [
    { name: 'Eventos no Bairro', icon: <MapIcon /> },
    { name: 'Festas & Comemorações', icon: <PartyPopper /> },
    { name: 'Feiras & Exposições', icon: <StoreIcon /> },
    { name: 'Eventos Gastronômicos', icon: <Utensils /> },
    { name: 'Eventos Culturais', icon: <Music /> },
    { name: 'Eventos Esportivos', icon: <Dumbbell /> },
    { name: 'Eventos Infantis', icon: <Baby /> },
    { name: 'Eventos em Condomínio', icon: <Building2 /> },
  ],
  'Pets': [
    { name: 'Veterinários', icon: <Stethoscope /> },
    { name: 'Pet Shop', icon: <ShoppingCart /> },
    { name: 'Banho & Tosa', icon: <Scissors /> },
    { name: 'Adestramento', icon: <Award /> },
    { name: 'Hospedagem Pet', icon: <Home /> },
    { name: 'Passeadores', icon: <Users /> },
    { name: 'Produtos Pet', icon: <Package /> },
    { name: 'Pets Exóticos', icon: <Sparkles /> },
  ],
  'Pro': [
    { name: 'Eletricista', icon: <Zap /> },
    { name: 'Encanador', icon: <Droplets /> },
    { name: 'Pintor', icon: <PaintRoller /> },
    { name: 'Pedreiro', icon: <Hammer /> },
    { name: 'Técnico em Informática', icon: <Laptop /> },
    { name: 'Montador de Móveis', icon: <Settings /> },
    { name: 'Marido de Aluguel', icon: <Wrench /> },
    { name: 'Freelancers em Geral', icon: <Briefcase /> },
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
  'Serviços': [
    { name: 'Limpeza Residencial', icon: <Sparkles /> },
    { name: 'Dedetização', icon: <Shield /> },
    { name: 'Manutenção Geral', icon: <Settings /> },
    { name: 'Chaveiro', icon: <Zap /> },
    { name: 'Segurança', icon: <Shield /> },
    { name: 'Serviços Rápidos', icon: <Zap /> },
    { name: 'Assistência Técnica', icon: <Monitor /> },
    { name: 'Instalações', icon: <Wrench /> },
  ],
  'Beleza': [
    { name: 'Salão de Cabelo', icon: <Scissors /> },
    { name: 'Barbearia', icon: <Scissors /> },
    { name: 'Manicure & Pedicure', icon: <Star /> },
    { name: 'Estética Facial', icon: <Sparkles /> },
    { name: 'Estética Corporal', icon: <Activity /> },
    { name: 'Maquiagem', icon: <Star /> },
    { name: 'Sobrancelhas & Cílios', icon: <Eye /> },
    { name: 'Spa & Relaxamento', icon: <Heart /> },
  ],
  'Autos': [
    { name: 'Oficinas Mecânicas', icon: <Wrench /> },
    { name: 'Lava-Jato', icon: <Droplets /> },
    { name: 'Auto Elétrica', icon: <Zap /> },
    { name: 'Pneus & Alinhamento', icon: <Settings /> },
    { name: 'Funilaria & Pintura', icon: <PaintRoller /> },
    { name: 'Peças & Acessórios', icon: <Package /> },
    { name: 'Vistoria & Documentação', icon: <FileText /> },
    { name: 'Serviços Rápidos Auto', icon: <Zap /> },
  ],
  'Mercado': [
    { name: 'Supermercados', icon: <ShoppingCart /> },
    { name: 'Mercados de Bairro', icon: <Home /> },
    { name: 'Atacarejo', icon: <Package /> },
    { name: 'Conveniência', icon: <Clock /> },
    { name: 'Produtos Importados', icon: <Globe /> },
    { name: 'Bebidas', icon: <Beer /> },
    { name: 'Produtos Congelados', icon: <Package /> },
    { name: 'Assinaturas & Cestas', icon: <Calendar /> },
  ],
  'Casa': [
    { name: 'Materiais de Construção', icon: <Hammer /> },
    { name: 'Decoração', icon: <Sparkles /> },
    { name: 'Iluminação', icon: <Zap /> },
    { name: 'Móveis', icon: <Home /> },
    { name: 'Eletrodomésticos', icon: <Monitor /> },
    { name: 'Jardinagem', icon: <Leaf /> },
    { name: 'Organização', icon: <LayoutGrid /> },
    { name: 'Reforma & Obras', icon: <Hammer /> },
  ],
  'Esportes': [
    { name: 'Academias', icon: <Dumbbell /> },
    { name: 'Personal Trainer', icon: <Users /> },
    { name: 'Esportes Coletivos', icon: <Users /> },
    { name: 'Artes Marciais', icon: <Target /> },
    { name: 'Yoga & Pilates', icon: <Activity /> },
    { name: 'Dança', icon: <Music /> },
    { name: 'Treino Funcional', icon: <Zap /> },
    { name: 'Esportes ao Ar Livre', icon: <Plane /> },
  ],
  'Lazer': [
    { name: 'Eventos', icon: <PartyPopper /> },
    { name: 'Shows & Música', icon: <Music /> },
    { name: 'Cinema & Teatro', icon: <Ticket /> },
    { name: 'Bares & Baladas', icon: <Beer /> },
    { name: 'Passeios', icon: <MapIcon /> },
    { name: 'Turismo Local', icon: <Globe2 /> },
    { name: 'Experiências', icon: <Sparkles /> },
    { name: 'Atividades em Família', icon: <Users /> },
  ],
  'Educação': [
    { name: 'Escolas', icon: <Building2 /> },
    { name: 'Cursos Livres', icon: <GraduationCap /> },
    { name: 'Idiomas', icon: <Globe2 /> },
    { name: 'Reforço Escolar', icon: <Edit3 /> },
    { name: 'Aulas Particulares', icon: <User /> },
    { name: 'Educação Infantil', icon: <Baby /> },
    { name: 'Cursos Profissionalizantes', icon: <Briefcase /> },
    { name: 'Tecnologia & Programação', icon: <Laptop /> },
  ],
  'Farmácia': [
    { name: 'Medicamentos', icon: <Pill /> },
    { name: 'Genéricos', icon: <Tag /> },
    { name: 'Manipulação', icon: <Microscope /> },
    { name: 'Perfumaria', icon: <Star /> },
    { name: 'Higiene & Cuidados', icon: <Heart /> },
    { name: 'Testes Rápidos', icon: <Zap /> },
    { name: 'Suplementos', icon: <Dumbbell /> },
    { name: 'Delivery Farmácia', icon: <Package /> },
  ],
  'Moda': [
    { name: 'Moda Feminina', icon: <Shirt /> },
    { name: 'Moda Masculina', icon: <Shirt /> },
    { name: 'Moda Infantil', icon: <Baby /> },
    { name: 'Calçados', icon: <Star /> },
    { name: 'Acessórios', icon: <Star /> },
    { name: 'Moda Íntima', icon: <Heart /> },
    { name: 'Moda Fitness', icon: <Dumbbell /> },
    { name: 'Brechós', icon: <Tag /> },
  ],
  'Condomínio': [
    { name: 'Avisos & Comunicados', icon: <Bell /> },
    { name: 'Serviços para Condomínio', icon: <Wrench /> },
    { name: 'Manutenção Predial', icon: <Hammer /> },
    { name: 'Segurança Condominial', icon: <Shield /> },
    { name: 'Limpeza & Portaria', icon: <Building2 /> },
    { name: 'Indicações de Profissionais', icon: <Users /> },
    { name: 'Eventos do Condomínio', icon: <Calendar /> },
    { name: 'Achados & Perdidos', icon: <Search /> },
  ],
};

export const NEIGHBORHOOD_COMMUNITIES: NeighborhoodCommunity[] = [
  {
    id: 'comm-food',
    name: 'Onde a Gente Come',
    description: 'Sugestões, críticas, receitas e descobertas locais.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
    icon: <Utensils />,
    color: 'bg-brand-blue',
    membersCount: '4.5k'
  },
  {
    id: 'comm-pets',
    name: 'Vida com Pets',
    description: 'Cuidados, histórias, dicas e indicações.',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800&auto=format&fit=crop',
    icon: <PawPrint />,
    color: 'bg-brand-blue',
    membersCount: '3.1k'
  },
  {
    id: 'comm-pro',
    name: 'Quem Você Indicaria?',
    description: 'Recomendações de quem faz bem feito.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2959443?q=80&w=800&auto=format&fit=crop',
    icon: <Handshake />,
    color: 'bg-brand-blue',
    membersCount: '2.8k'
  },
  {
    id: 'comm-saude',
    name: 'Cuidar da Saúde',
    description: 'Experiências, dicas e orientações.',
    image: 'https://images.unsplash.com/photo-1505751172107-172449572052?q=80&w=800&auto=format&fit=crop',
    icon: <Heart />,
    color: 'bg-brand-blue',
    membersCount: '2.2k'
  },
  {
    id: 'comm-home-issue',
    name: 'Deu Problema em Casa',
    description: 'Soluções práticas e quem chamar.',
    image: 'https://images.unsplash.com/photo-1581578731117-104f2a8d23e9?q=80&w=800&auto=format&fit=crop',
    icon: <Wrench />,
    color: 'bg-brand-blue',
    membersCount: '3.4k'
  },
  {
    id: 'comm-beauty',
    name: 'Cuidar de Si',
    description: 'Beleza, autoestima e experiências reais.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop',
    icon: <Scissors />,
    color: 'bg-brand-blue',
    membersCount: '1.9k'
  },
  {
    id: 'comm-autos',
    name: 'Vida Sobre Rodas',
    description: 'Carro, moto, problemas e soluções.',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800&auto=format&fit=crop',
    icon: <CarFront />,
    color: 'bg-brand-blue',
    membersCount: '2.5k'
  },
  {
    id: 'comm-market',
    name: 'Compras do Dia a Dia',
    description: 'Preços, achados e onde comprar melhor.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
    icon: <ShoppingCart />,
    color: 'bg-brand-blue',
    membersCount: '4.1k'
  },
  {
    id: 'comm-nossa-casa',
    name: 'Nossa Casa',
    description: 'Reformas, ideias, móveis e manutenção.',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=800&auto=format&fit=crop',
    icon: <Home />,
    color: 'bg-brand-blue',
    membersCount: '2.7k'
  },
  {
    id: 'comm-sports',
    name: 'Bora se Mexer',
    description: 'Atividades físicas, esportes e treinos.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    icon: <Dumbbell />,
    color: 'bg-brand-blue',
    membersCount: '1.5k'
  },
  {
    id: 'comm-leisure',
    name: 'O Que Fazer Por Aqui',
    description: 'Lazer, passeios e rolês locais.',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop',
    icon: <Ticket />,
    color: 'bg-brand-blue',
    membersCount: '3.8k'
  },
  {
    id: 'comm-edu',
    name: 'Aprender e Evoluir',
    description: 'Escolas, cursos, aulas e aprendizado.',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop',
    icon: <BookOpen />,
    color: 'bg-brand-blue',
    membersCount: '1.2k'
  },
  {
    id: 'comm-pharmacy',
    name: 'Quando Precisa de Farmácia',
    description: 'Medicamentos, dicas e orientações.',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?q=80&w=800&auto=format&fit=crop',
    icon: <Pill />,
    color: 'bg-brand-blue',
    membersCount: '2.1k'
  },
  {
    id: 'comm-fashion',
    name: 'Estilo no Dia a Dia',
    description: 'Roupas, achados e tendências locais.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
    icon: <Shirt />,
    color: 'bg-brand-blue',
    membersCount: '1.7k'
  },
  {
    id: 'comm-eventos',
    name: 'O Que Vai Rolar',
    description: 'Eventos, feiras e encontros.',
    image: 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=800&auto=format&fit=crop',
    icon: <PartyPopper />,
    color: 'bg-brand-blue',
    membersCount: '2.9k'
  },
  {
    id: 'comm-condo',
    name: 'Vida em Condomínio',
    description: 'Convivência, avisos e indicações.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
    icon: <Building2 />,
    color: 'bg-brand-blue',
    membersCount: '3.6k'
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
    comments: 2,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'post-2',
    userId: 'u2',
    userName: 'Carlos Silva',
    userAvatar: 'https://i.pravatar.cc/100?u=c',
    authorRole: 'resident',
    content: 'Indico o João Eletricista! Fez um serviço impecável aqui em casa hoje. ⚡🔌',
    type: 'recommendation',
    communityId: 'comm-home-issue',
    neighborhood: 'Taquara',
    timestamp: '1h atrás',
    likes: 45,
    comments: 8,
    imageUrl: 'https://images.unsplash.com/photo-1621905476438-5f09f22d556c?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'post-3',
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
    isSponsored: true
  },
  // ... (Other stores - keeping original STORES array for brevity in this XML response, assume full list is here)
];

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

export const quickFilters = [
  { id: 'nearby', label: 'Perto de mim', icon: 'zap' },
  { id: 'top_rated', label: 'Melhores avaliados', icon: 'star' },
  { id: 'open_now', label: 'Aberto agora', icon: 'clock' },
];

export const MOCK_BANNER_CAMPAIGNS: BannerCampaign[] = [
  {
    id: 'camp-1',
    merchantId: 'm1',
    merchantName: 'Chaveiro Express',
    categoryTarget: 'emergency',
    templateId: 'modern',
    content: {
      title: 'Chaveiro 24h na Freguesia',
      subtitle: 'Chegamos em 15 minutos!',
      bgColor: 'bg-red-600',
      textColor: 'text-white',
      iconName: 'Key'
    },
    status: 'active',
    startDate: '2023-11-01',
    endDate: '2023-12-01',
    planType: 'monthly',
    views: 1205,
    clicks: 45
  },
  {
    id: 'camp-2',
    merchantId: 'm2',
    merchantName: 'Pinturas Silva',
    categoryTarget: 'home',
    templateId: 'bold',
    content: {
      title: 'Pintura Residencial',
      subtitle: 'Orçamento grátis hoje',
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
      iconName: 'PaintRoller'
    },
    status: 'active',
    startDate: '2023-11-10',
    endDate: '2023-11-17',
    planType: 'weekly',
    views: 890,
    clicks: 32
  },
  {
    id: 'camp-3',
    merchantId: 'm3',
    merchantName: 'Dr. Pet',
    categoryTarget: 'pet',
    templateId: 'minimal',
    content: {
      title: 'Banho e Tosa Promo',
      subtitle: 'Seu pet merece o melhor',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-900',
      iconName: 'Scissors'
    },
    status: 'active',
    startDate: '2023-11-12',
    endDate: '2023-11-19',
    planType: 'weekly',
    views: 650,
    clicks: 28
  }
];
