

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
  MessageCircle, HelpCircle, UserCheck, Recycle,
  Navigation,
  Newspaper,
  Rocket 
} from 'lucide-react';
import { AdType, Category, Store, Story, EditorialCollection, Job, CommunityPost, NeighborhoodCommunity, BairroPost } from './types';
import { getStoreLogo } from './utils/mockLogos'; 

// --- VALIDATION HELPERS (Moved from StoreAdsModule.tsx) ---
export const FORBIDDEN_WORDS = ['palavrão', 'inapropriado', 'violação'];
export const CHAR_LIMITS = {
  template_headline: 25,
  template_subheadline: 50,
  editor_title: 40,
  editor_subtitle: 120,
};
export const MIN_CONTRAST_RATIO = 4.5;

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
};

export const getLuminance = (r: number, g: number, b: number): number => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

export const getContrastRatio = (hex1: string, hex2: string): number => {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 1;
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (lightest + 0.05) / (darkest + 0.05);
};
// --- END VALIDATION HELPERS ---

// NOVO: Mock de Posts do Bairro
export const MOCK_BAIRRO_POSTS: BairroPost[] = [
  {
    id: 'bp1',
    storeId: 'f-1',
    storeName: 'Bibi Lanches',
    storeLogoUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1626202456388-7578b9b8b21c?q=80&w=600&auto=format&fit=crop',
    content: 'Obrigado por nos visitar! Em breve teremos novos sabores de suco natural fresquinho. Fiquem ligados!',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id: 'bp2',
    storeId: 'f-3',
    storeName: 'Pet Shop Alegria',
    storeLogoUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1544973347-19815049389c?q=80&w=600&auto=format&fit=crop',
    content: 'Chegaram novas coleiras personalizadas e brinquedos ecológicos para seu pet! Venha conferir as novidades.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 'bp3',
    storeId: 'f-2',
    storeName: 'Studio Hair Vip',
    storeLogoUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1596465492061-f3b3d4f8f4a0?q=80&w=600&auto=format&fit=crop',
    content: 'Hoje é dia de cuidar dos cabelos! Nossa equipe está pronta para um novo visual. Agende seu horário e arrase!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: 'bp4',
    storeId: 'f-5',
    storeName: 'Pizzaria do Zé',
    storeLogoUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1593560704563-f1a66f2fa402?q=80&w=600&auto=format&fit=crop',
    content: 'Nosso forno a lenha está a todo vapor! Qual o seu sabor preferido para hoje? Peça agora e receba quentinho.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
];

export const CATEGORIES: Category[] = [
  { id: 'cat-comida', name: 'Comida', slug: 'comida', icon: <Utensils />, color: 'bg-brand-blue' },
  { id: 'cat-pets', name: 'Pets', slug: 'pets', icon: <PawPrint />, color: 'bg-brand-blue' },
  { id: 'cat-pro', name: 'Pro', slug: 'pro', icon: <Briefcase />, color: 'bg-brand-blue' },
  { id: 'cat-saude', name: 'Saúde', slug: 'saude', icon: <Heart />, color: 'bg-brand-blue' },
  { id: 'cat-services', name: 'Serviços', slug: 'servicos', icon: <Wrench />, color: 'bg-brand-blue' },
  { id: 'cat-beauty', name: 'Beleza', slug: 'beleza', icon: <Scissors />, color: 'bg-brand-blue' },
  { id: 'cat-autos', name: 'Autos', slug: 'autos', icon: <CarFront />, color: 'bg-brand-blue' },
  { id: 'cat-mercado', name: 'Mercado', slug: 'mercado', icon: <ShoppingCart />, color: 'bg-brand-blue' },
  { id: 'cat-casa', name: 'Casa', slug: 'casa', icon: <HomeIcon />, color: 'bg-brand-blue' },
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
    { name: 'Hospedagem Pet', icon: <HomeIcon /> },
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
    { name: 'Mercados de Bairro', icon: <HomeIcon /> },
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
    { name: 'Móveis', icon: <HomeIcon /> },
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
    description: 'Onde encontrar o melhor serviço? Peça e dê dicas para seus vizinhos.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
    icon: <HelpCircle />,
    color: 'bg-orange-500',
    membersCount: '8.2k',
    type: 'official'
  },
  {
    id: 'comm-jobs',
    name: 'Vagas de empregos',
    description: 'Encontre ou anuncie oportunidades de trabalho em Jacarepaguá.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800&auto=format&fit=crop',
    icon: <Briefcase />,
    color: 'bg-emerald-500',
    membersCount: '15.1k',
    type: 'official'
  },
  {
    id: 'comm-real-estate',
    name: 'Aluguéis e vendas de imóveis',
    description: 'Sua casa nova em JPA está aqui. Anúncios diretos e imobiliárias locais.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
    icon: <HomeIcon />,
    color: 'bg-purple-500',
    membersCount: '5.4k',
    type: 'official'
  },
  {
    id: 'comm-desapega',
    name: 'Desapega – venda e troca',
    description: 'Venda o que não usa mais ou encontre achados incríveis perto de você.',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop',
    icon: <Recycle />,
    color: 'bg-[#1E5BFF]',
    membersCount: '22.3k',
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
  },
  {
    id: 'post-2',
    userId: 'u2',
    userName: 'Tiago Santos',
    userAvatar: 'https://i.pravatar.cc/100?u=tiago',
    authorRole: 'resident',
    content: 'Olha esse hambúrguer top na casa de carnes aqui do bairro! 🍔🔥 Quem já experimentou?',
    type: 'recommendation',
    communityId: 'comm-tips',
    neighborhood: 'Anil',
    timestamp: '3h',
    likes: 45,
    comments: 8,
    imageUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'post-3',
    userId: 'u3',
    userName: 'Bruno Rocha',
    userAvatar: 'https://i.pravatar.cc/100?u=bruno',
    authorRole: 'resident',
    content: 'Alguém sabe se a feira de domingo vai acontecer amanhã mesmo com a chuva?',
    type: 'event',
    communityId: 'comm-residents',
    neighborhood: 'Freguesia',
    timestamp: '4h',
    likes: 12,
    comments: 4
  },
  {
    id: 'post-4',
    userId: 'u4',
    userName: 'Mariana Luz',
    userAvatar: 'https://i.pravatar.cc/100?u=mari',
    authorRole: 'resident',
    content: 'Vaga aberta para recepcionista em clínica odontológica na Taquara. Interessados, inbox!',
    type: 'recommendation',
    communityId: 'comm-jobs',
    neighborhood: 'Taquara',
    timestamp: '5h',
    likes: 24,
    comments: 12
  },
  {
    id: 'post-5',
    userId: 'u5',
    userName: 'Ricardo Souza',
    userAvatar: 'https://i.pravatar.cc/100?u=ricardo',
    authorRole: 'resident',
    content: 'Cuidado pessoal: semáforo da Geremário Dantas com problema, tá um caos o trânsito agora.',
    type: 'alert',
    communityId: 'comm-residents',
    neighborhood: 'Freguesia',
    timestamp: '6h',
    likes: 38,
    comments: 14
  },
  {
    id: 'post-6',
    userId: 'u6',
    userName: 'Luciana Melo',
    userAvatar: 'https://i.pravatar.cc/100?u=luciana',
    authorRole: 'resident',
    content: 'Estou desapegando dessa fritadeira elétrica, funcionando perfeitamente! R$ 150,00 para retirar no Anil.',
    type: 'recommendation',
    communityId: 'comm-desapega',
    neighborhood: 'Anil',
    timestamp: '8h',
    likes: 24,
    comments: 31,
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'post-7',
    userId: 'u7',
    userName: 'Felipe Costa',
    userAvatar: 'https://i.pravatar.cc/100?u=felipe',
    authorRole: 'merchant',
    content: 'Pessoal, abri uma vaga de emprego na minha loja de tintas no Tanque. Interessados, inbox!',
    type: 'event',
    communityId: 'comm-jobs',
    neighborhood: 'Tanque',
    timestamp: '12h',
    likes: 15,
    comments: 22
  },
  {
    id: 'post-8',
    userId: 'u8',
    userName: 'Amanda Silva',
    userAvatar: 'https://i.pravatar.cc/100?u=amanda',
    authorRole: 'resident',
    content: 'Apartamento disponível para aluguel na Freguesia, 2 quartos, direto com proprietário.',
    type: 'recommendation',
    communityId: 'comm-real-estate',
    neighborhood: 'Freguesia',
    timestamp: '14h',
    likes: 18,
    comments: 45
  },
  {
    id: 'post-9',
    userId: 'u9',
    userName: 'Rafael Lima',
    userAvatar: 'https://i.pravatar.cc/100?u=rafael',
    authorRole: 'resident',
    content: 'Alguém para dividir frete de mudança saindo da Freguesia para o Recreio este mês?',
    type: 'recommendation',
    communityId: 'comm-tips',
    neighborhood: 'Freguesia',
    timestamp: '1d',
    likes: 5,
    comments: 7
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
  { id: 'f-1', name: 'Bibi Lanches', category: 'Comida', subcategory: 'Lanches & Hamburguerias', rating: 4.8, distance: 'Freguesia', adType: AdType.PREMIUM, description: 'Lanches clássicos e saudáveis.', isSponsored: true, image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-2', name: 'Studio Hair Vip', category: 'Beleza', subcategory: 'Salão de Cabelo', rating: 4.9, distance: 'Taquara', adType: AdType.PREMIUM, description: 'Especialista em loiros e cortes modernos.', isSponsored: true, image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-3', name: 'Pet Shop Alegria', category: 'Pets', subcategory: 'Pet Shop', rating: 4.7, distance: 'Pechincha', adType: AdType.PREMIUM, description: 'O carinho que seu pet merece.', isSponsored: true, image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-4', name: 'Mecânica 24h', category: 'Autos', subcategory: 'Oficinas Mecânicas', rating: 4.5, distance: 'Anil', adType: AdType.PREMIUM, description: 'Socorro mecânico a qualquer hora.', isSponsored: true, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-5', name: 'Pizzaria do Zé', category: 'Comida', subcategory: 'Pizzarias', rating: 4.6, distance: 'Freguesia', adType: AdType.PREMIUM, description: 'Pizza no forno a lenha.', isSponsored: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-6', name: 'Açaí da Praça', category: 'Comida', subcategory: 'Doces & Sobremesas', rating: 4.9, distance: 'Tanque', adType: AdType.PREMIUM, description: 'O melhor açaí da região.', isSponsored: true, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-7', name: 'Drogaria JPA', category: 'Farmácia', subcategory: 'Medicamentos', rating: 4.4, distance: 'Freguesia', adType: AdType.PREMIUM, description: 'Medicamentos e perfumaria.', isSponsored: true, image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-8', name: 'Academia FitBairro', category: 'Esportes', subcategory: 'Academias', rating: 4.7, distance: 'Taquara', adType: AdType.PREMIUM, description: 'Treine perto de casa.', isSponsored: true, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-9', name: 'Consultório Dra. Ana', category: 'Saúde', subcategory: 'Dentistas', rating: 5.0, distance: 'Freguesia', adType: AdType.PREMIUM, description: 'Cuidado completo com seu sorriso.', isSponsored: true, image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-10', name: 'Boutique Chic', category: 'Moda', subcategory: 'Moda Feminina', rating: 4.3, distance: 'Anil', adType: AdType.PREMIUM, description: 'Roupas e acessórios para mulheres que não abrem mão da elegância e do estilo. Peças selecionadas que acompanham as tendências da moda nacional e internacional.', isSponsored: true, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop' },
  // NOVOS MOCK STORES PARA BANNERS
  {
    id: 'restaurante-sabor-bairro',
    name: 'Restaurante Sabor do Bairro',
    category: 'Comida',
    subcategory: 'Restaurantes',
    logoUrl: getStoreLogo(100), // Unique index for logo
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edab74dad?q=80&w=800&auto=format&fit=crop',
    rating: 4.9, distance: 'Freguesia', adType: AdType.ORGANIC, description: 'Pratos caseiros feitos na hora.',
    verified: true, isOpenNow: true, isSponsored: false
  },
  {
    id: 'loja-estilo-urbano',
    name: 'Loja Estilo Urbano',
    category: 'Moda',
    subcategory: 'Moda Feminina',
    logoUrl: getStoreLogo(101),
    image: 'https://images.unsplash.com/photo-1596753040212-0761e3894458?q=80&w=800&auto=format&fit=crop',
    rating: 4.7, distance: 'Taquara', adType: AdType.ORGANIC, description: 'Peças exclusivas no bairro.',
    verified: true, isOpenNow: true, isSponsored: false
  },
  {
    id: 'oficina-auto-jpa',
    name: 'Oficina Auto JPA',
    category: 'Autos',
    subcategory: 'Oficinas Mecânicas',
    logoUrl: getStoreLogo(102),
    image: 'https://images.unsplash.com/photo-1582236371300-84a1e9c5f87b?q=80&w=800&auto=format&fit=crop',
    rating: 4.8, distance: 'Pechincha', adType: AdType.ORGANIC, description: 'Revisão e manutenção.',
    verified: true, isOpenNow: true, isSponsored: false
  }
];

export const EDITORIAL_SERVICES: EditorialCollection[] = [
  {
    id: 'culinaria-jpa',
    title: 'Melhores de JPA',
    subtitle: 'Onde comer bem no bairro',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
    keywords: ['comida', 'restaurante', 'lanches', 'pizza']
  },
  {
    id: 'servicos-confianca',
    title: 'Serviços de Confiança',
    subtitle: 'Profissionais avaliados por vizinhos',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
    keywords: ['serviços', 'reformas', 'consertos']
  }
];

export const quickFilters = [
  { id: 'top_rated', label: 'Top Avaliados', icon: 'star' },
  { id: 'open_now', label: 'Aberto Agora', icon: 'clock' },
  { id: 'nearby', label: 'Perto de Mim', icon: 'zap' },
  { id: 'cashback', label: 'Com Cashback', icon: 'percent' }
];

export const STORIES: Story[] = [
  { id: 's1', name: 'Hamburgueria', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=400&auto=format&fit=crop' },
  { id: 's2', name: 'Salão Vip', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=400&auto=format&fit=crop' },
  { id: 's3', name: 'Pet Shop', image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400&auto=format&fit=crop' },
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    role: 'Atendente de Balcão',
    company: 'Padaria Imperial',
    neighborhood: 'Freguesia',
    category: 'Alimentação',
    type: 'CLT',
    salary: 'R$ 1.450,00',
    description: 'Atendimento ao público, organização e limpeza do local.',
    requirements: ['Experiência anterior', 'Boa comunicação'],
    schedule: '6x1',
    contactWhatsapp: '5521999999999',
    postedAt: 'Há 2h',
    isSponsored: true,
    sponsoredUntil: '2025-12-31'
  },
  {
    id: 'job-2',
    role: 'Vendedor Externo',
    company: 'JPA Telecom',
    neighborhood: 'Taquara',
    category: 'Vendas',
    type: 'PJ',
    salary: 'Comissão + Ajuda de Custo',
    description: 'Vendas de planos de internet e TV a cabo.',
    requirements: ['Carro próprio', 'Experiência com vendas'],
    schedule: 'Seg-Sex',
    contactWhatsapp: '5521988888888',
    postedAt: 'Há 1 dia',
    isUrgent: true
  }
];

// Added to fix import error in StoreProfileEdit.tsx
export type TaxonomyType = 'category' | 'subcategory' | 'specialty';

export const SPECIALTIES: Record<string, string[]> = {
  'Chaveiro 24h': ['Abertura de portas', 'Troca de fechadura', 'Chave codificada', 'Abertura de cofre', 'Cópia de chaves', 'Instalação de tetra chave'],
  'Desentupidora': ['Pia de cozinha', 'Vaso sanitário', 'Caixa de gordura', 'Ralo de banheiro', 'Rede de esgoto externa', 'Limpeza de fossa'],
  'Guincho': ['Reboque leve (carro)', 'Reboque pesado', 'Pane seca', 'Troca de pneu', 'Recarga de bateria'],
  'Eletricista 24h': ['Queda de energia total', 'Curto-circuito', 'Disjuntor desarmando', 'Cheiro de queimado', 'Tomada em curto'],
  'Eletricista': ['Instalação de chuveiro', 'Troca de fiação', 'Instalação de tomadas', 'Instalação de ventilador', 'Iluminação e lustres'],
  'Encanador': ['Vazamento em cano', 'Troca de torneira', 'Instalação de filtro', 'Reparo em descarga', 'Limpeza de caixa d\'água'],
  'Pedreiro': ['Pequenos reparos', 'Reboco e alvenaria', 'Colocação de piso/azulejo', 'Construção de muro', 'Reforma completa'],
  'Pintor': ['Pintura interna', 'Pintura externa', 'Texturas e efeitos', 'Tratamento de mofo', 'Pintura de portas e janelas'],
  'Marido de Aluguel': ['Instalação de cortina/persiana', 'Montagem de prateleiras', 'Troca de lâmpadas', 'Instalação de suporte de TV', 'Pequenos reparos gerais'],
  'Mecânico': ['Revisão geral', 'Troca de óleo', 'Suspensão e freios', 'Motor e câmbio', 'Diagnóstico eletrônico'],
  'Funilaria e Pintura': ['Martelinho de ouro', 'Polimento e cristalização', 'Pintura de peças', 'Reparo de para-choque'],
  'Auto Elétrica': ['Troca de bateria', 'Alternador e motor de arranque', 'Instalação de som/multimídia', 'Lâmpadas e faróis'],
  'Conserto de Celular': ['Troca de tela', 'Troca de bateria', 'Não carrega', 'Recuperação de sistema', 'Limpeza de água'],
  'Informática': ['Formatação', 'Remoção de vírus', 'Upgrade de memória/SSD', 'Limpeza interna', 'Configuração de rede'],
  'default': ['Consultoria', 'Orçamento geral', 'Manutenção preventiva', 'Reparo específico', 'Instalação']
};

// NOVO: Palavras proibidas para posts do bairro
export const FORBIDDEN_POST_WORDS = [
  'promoção', 'oferta', 'desconto', 'cupom', 'r$', '% off', 'grátis', 'barato', 'imperdível', 'liquidação', 'black friday'
];

export const NEIGHBORHOODS = [
  "Freguesia", "Pechincha", "Anil", "Taquara", "Tanque", 
  "Curicica", "Parque Olímpico", "Gardênia", "Cidade de Deus"
];

export const MOCK_OCCUPANCY: Record<string, Record<string, boolean>> = {
  "Freguesia": { "periodo_1": true },
  "Taquara": { "periodo_2": true },
};

export const DISPLAY_MODES = [
  { 
    id: 'home', 
    label: 'Home', 
    icon: HomeIcon, 
    price: 49.90,
    originalPrice: 199.90,
    description: 'Exibido no carrossel da página inicial para todos os usuários.',
    whyChoose: 'Ideal para máxima visibilidade imediata.'
  },
  { 
    id: 'cat', 
    label: 'Categorias', 
    icon: LayoutGrid, 
    price: 29.90,
    originalPrice: 149.90,
    description: 'Exibido no topo das buscas por produtos ou serviços específicos.',
    whyChoose: 'Impacta o cliente no momento da decisão.'
  },
  { 
    id: 'combo', 
    label: 'Home + Categorias', 
    icon: Zap, 
    price: 69.90,
    originalPrice: 349.80,
    description: 'Destaque na página inicial e em todas as categorias.',
    whyChoose: 'Mais alcance, cliques e chances de venda.'
  },
];