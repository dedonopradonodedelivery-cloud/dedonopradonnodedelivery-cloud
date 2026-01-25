
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
  MessageCircle, HelpCircle, UserCheck, Recycle
} from 'lucide-react';
import { AdType, Category, Store, Story, EditorialCollection, Job, CommunityPost, NeighborhoodCommunity, Classified } from './types';
import { getStoreLogo } from '@/utils/mockLogos';


export const CATEGORIES: Category[] = [
  { id: 'cat-comida', name: 'Comida', slug: 'comida', icon: <Utensils />, color: 'bg-brand-blue' },
  { id: 'cat-pets', name: 'Pets', slug: 'pets', icon: <PawPrint />, color: 'bg-brand-blue' },
  { id: 'cat-pro', name: 'Pro', slug: 'pro', icon: <Briefcase />, color: 'bg-brand-blue' },
  { id: 'cat-saude', name: 'Saúde', slug: 'saude', icon: <Heart />, color: 'bg-brand-blue' },
  { id: 'cat-services', name: 'Serviços', slug: 'servicos', icon: <Wrench />, color: 'bg-brand-blue' },
  { id: 'cat-imoveis', name: 'Imóveis Comerciais', slug: 'imoveis-comerciais', icon: <Building2 />, color: 'bg-brand-blue' },
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
  'Imóveis Comerciais': [
    { name: 'Aluguel de Lojas', icon: <StoreIcon /> },
    { name: 'Aluguel de Salas', icon: <Briefcase /> },
    { name: 'Venda de Lojas', icon: <Tag /> },
    { name: 'Venda de Salas', icon: <Tag /> },
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
    id: 'post-new-1',
    userId: 'u-carlos',
    userName: 'Carlos Henrique',
    userAvatar: 'https://i.pravatar.cc/100?u=carloshenrique',
    authorRole: 'resident',
    content: "Galera, trânsito totalmente parado agora na Estrada dos Três Rios, sentido Taquara. Parece que teve um acidente mais à frente. Quem puder, evita passar por aqui agora.",
    type: 'alert',
    communityId: 'comm-residents',
    neighborhood: 'Freguesia',
    timestamp: 'Agora',
    likes: 8,
    comments: 1,
    imageUrl: 'https://images.unsplash.com/photo-1570125909248-73dfa3383b18?q=80&w=600&auto=format&fit=crop',
    theme: 'utilidade'
  },
  {
    id: 'post-new-2',
    userId: 'u-juliana',
    userName: 'Juliana Mendes',
    userAvatar: 'https://i.pravatar.cc/100?u=julianamendes',
    authorRole: 'resident',
    content: "Gente, acabaram de roubar um carro aqui na Rua Joaquim Pinheiro 😔 Alguém sabe se já chamaram a polícia? Fiquem atentos.",
    type: 'alert',
    communityId: 'comm-residents',
    neighborhood: 'Freguesia',
    timestamp: '1h',
    likes: 10,
    comments: 1,
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=600&auto=format&fit=crop',
    theme: 'seguranca'
  },
  {
    id: 'post-new-3',
    userId: 'u-rafaelcosta',
    userName: 'Rafael Costa',
    userAvatar: 'https://i.pravatar.cc/100?u=rafaelcosta',
    authorRole: 'resident',
    content: "Alguém sabe me dizer qual é o dia da feira livre ali na Araguaia? Passei lá semana passada e não lembro se é terça ou quinta 😅",
    type: 'recommendation',
    communityId: 'comm-tips',
    neighborhood: 'Taquara',
    timestamp: '2h',
    likes: 5,
    comments: 1,
    imageUrl: 'https://images.unsplash.com/photo-1567332243413-56545bce13f2?q=80&w=600&auto=format&fit=crop',
    theme: 'lazer'
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
    imageUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=600&auto=format&fit=crop',
    theme: 'dicas'
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
    comments: 12,
    theme: 'utilidade'
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
    imageUrl: 'https://images.unsplash.com/photo-1585659722982-789600c7690a?q=80&w=600&auto=format&fit=crop',
    theme: 'dicas'
  },
];

// DADOS DE LOJAS FAKE COMPLETOS (REGRA OBRIGATÓRIA)
const BASE_STORES: Store[] = [
  {
    id: 'grupo-esquematiza',
    name: 'Grupo Esquematiza',
    category: 'Serviços',
    subcategory: 'Segurança e Facilities',
    rating: 5.0,
    reviewsCount: 152,
    distance: 'Freguesia',
    adType: AdType.PREMIUM,
    description: 'Líder em segurança, portaria, limpeza e facilities para condomínios e empresas em Jacarepaguá. Oferecemos soluções completas para garantir tranquilidade e eficiência.',
    isSponsored: true,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
    banner_url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop',
    logoUrl: getStoreLogo(0),
    verified: true,
    isOpenNow: true,
    neighborhood: 'Freguesia',
    rua: 'Rua Tirol',
    numero: '560',
    bairro: 'Freguesia',
    cidade: 'Rio de Janeiro',
    whatsapp_publico: '21985559480',
    telefone_fixo_publico: '2134158000',
    instagram: '@grupoesquematiza',
    payment_methods: ['Boleto', 'Transferência Bancária'],
    business_hours: {
      segunda: { open: true, start: '08:00', end: '18:00' },
      terca: { open: true, start: '08:00', end: '18:00' },
      quarta: { open: true, start: '08:00', end: '18:00' },
      quinta: { open: true, start: '08:00', end: '18:00' },
      sexta: { open: true, start: '08:00', end: '18:00' },
      sabado: { open: false, start: '', end: '' },
      domingo: { open: false, start: '', end: '' },
    },
  },
  {
    id: 'f-1',
    name: 'Bibi Lanches',
    category: 'Comida',
    subcategory: 'Lanches & Hamburguerias',
    rating: 4.8,
    reviewsCount: 188,
    distance: 'Freguesia',
    adType: AdType.PREMIUM,
    description: 'Lanches clássicos e saudáveis, com opções de sucos naturais feitos na hora. Perfeito para uma refeição rápida e deliciosa no coração da Freguesia.',
    isSponsored: true,
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=400&auto=format&fit=crop',
    banner_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop',
    logoUrl: getStoreLogo(1),
    verified: true,
    isOpenNow: true,
    neighborhood: 'Freguesia',
    rua: 'Estrada dos Três Rios',
    numero: '980',
    complemento: 'Loja B',
    bairro: 'Freguesia',
    cidade: 'Rio de Janeiro',
    whatsapp_publico: '21987654321',
    telefone_fixo_publico: '2124471234',
    instagram: '@bibilanchesjpa',
    payment_methods: ['Dinheiro', 'Pix', 'Cartão de Crédito', 'Cartão de Débito', 'VR'],
    business_hours: {
      segunda: { open: true, start: '11:00', end: '22:00' },
      terca: { open: true, start: '11:00', end: '22:00' },
      quarta: { open: true, start: '11:00', end: '22:00' },
      quinta: { open: true, start: '11:00', end: '22:00' },
      sexta: { open: true, start: '11:00', end: '23:00' },
      sabado: { open: true, start: '12:00', end: '23:00' },
      domingo: { open: false, start: '', end: '' },
    },
  },
  { 
    id: 'f-2', 
    name: 'Studio Hair Vip', 
    category: 'Beleza', 
    subcategory: 'Salão de Cabelo', 
    rating: 4.9, 
    distance: 'Taquara', 
    adType: AdType.PREMIUM, 
    description: 'Especialista em loiros e cortes modernos. Ambiente climatizado e profissionais qualificados para realçar sua beleza.', 
    isSponsored: true, 
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=400&auto=format&fit=crop',
    banner_url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=1200&auto=format&fit=crop',
    logoUrl: getStoreLogo(2),
    verified: true,
    isOpenNow: true,
    neighborhood: 'Taquara',
    rua: 'Avenida Nelson Cardoso',
    numero: '1149',
    bairro: 'Taquara',
    cidade: 'Rio de Janeiro',
    whatsapp_publico: '21988887777',
    telefone_fixo_publico: '2133925566',
    instagram: '@hairviptaquara',
    payment_methods: ['Pix', 'Cartão de Crédito'],
    business_hours: {
      segunda: { open: false, start: '', end: '' },
      terca: { open: true, start: '09:00', end: '19:00' },
      quarta: { open: true, start: '09:00', end: '19:00' },
      quinta: { open: true, start: '09:00', end: '20:00' },
      sexta: { open: true, start: '09:00', end: '20:00' },
      sabado: { open: true, start: '08:00', end: '18:00' },
      domingo: { open: false, start: '', end: '' },
    },
    reviewsCount: 215,
  },
  { 
    id: 'f-3', 
    name: 'Pet Shop Alegria', 
    category: 'Pets', 
    subcategory: 'Pet Shop', 
    rating: 4.7, 
    distance: 'Pechincha', 
    adType: AdType.PREMIUM, 
    description: 'O carinho que seu pet merece. Temos rações, acessórios, banho & tosa e consultório veterinário.', 
    isSponsored: true, 
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400&auto=format&fit=crop',
    banner_url: 'https://images.unsplash.com/photo-1524511751214-b0a384dd932d?q=80&w=1200&auto=format&fit=crop',
    logoUrl: getStoreLogo(3),
    verified: false,
    isOpenNow: false,
    neighborhood: 'Pechincha',
    rua: 'Estrada do Pau-Ferro',
    numero: '325',
    bairro: 'Pechincha',
    cidade: 'Rio de Janeiro',
    whatsapp_publico: '21977776666',
    telefone_fixo_publico: '2124251122',
    instagram: '@petalegriajpa',
    payment_methods: ['Dinheiro', 'Pix', 'Cartão de Débito'],
    business_hours: {
      segunda: { open: true, start: '09:00', end: '18:00' },
      terca: { open: true, start: '09:00', end: '18:00' },
      quarta: { open: true, start: '09:00', end: '18:00' },
      quinta: { open: true, start: '09:00', end: '18:00' },
      sexta: { open: true, start: '09:00', end: '18:00' },
      sabado: { open: true, start: '09:00', end: '14:00' },
      domingo: { open: false, start: '', end: '' },
    },
    reviewsCount: 98,
  },
];

// Gerar lojas fake para preenchimento de listas
const generateFakeStores = (count: number): Store[] => {
  const hoods = ['Freguesia', 'Taquara', 'Pechincha', 'Anil', 'Tanque', 'Curicica'];
  const categoriesList = ['Comida', 'Saúde', 'Serviços', 'Pets', 'Beleza', 'Moda'];
  const stores: Store[] = [];

  for (let i = 1; i <= count; i++) {
    const cat = categoriesList[i % categoriesList.length];
    const hood = hoods[i % hoods.length];
    stores.push({
      id: `fake-${i}`,
      name: `Loja Exemplo ${i}`,
      category: cat,
      subcategory: 'Geral',
      rating: 4.0 + (Math.random() * 1.0),
      reviewsCount: Math.floor(Math.random() * 100),
      distance: `${hood} • RJ`,
      neighborhood: hood,
      adType: AdType.ORGANIC,
      description: `Descrição breve da loja exemplo número ${i} localizada na região de ${hood}.`,
      image: `https://images.unsplash.com/photo-${1500000000000 + (i * 1000)}?q=80&w=400&auto=format&fit=crop`,
      isSponsored: false,
      isOpenNow: Math.random() > 0.3,
      verified: Math.random() > 0.5,
      rua: 'Rua Genérica',
      numero: `${i * 10}`,
      bairro: hood,
      cidade: 'Rio de Janeiro',
      whatsapp_publico: `2191234567${i%10}`,
      instagram: `@lojaexemplo${i}`,
      payment_methods: ['Pix', 'Dinheiro'],
    });
  }
  return stores;
};

export const STORES: Store[] = [
  ...BASE_STORES,
  ...generateFakeStores(60)
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
  { id: 'nearby', label: 'Perto de Mim', icon: 'zap' }
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

export const MOCK_CLASSIFIEDS: Classified[] = [
    {
        id: 'cl-1',
        title: 'Atendente de Balcão',
        advertiser: 'Padaria Imperial',
        category: 'Empregos',
        neighborhood: 'Freguesia',
        description: 'Vaga para atendimento em padaria tradicional. Horário flexível e benefícios.',
        timestamp: 'Há 2h',
        contactWhatsapp: '5521999999999',
        typeLabel: 'CLT',
        jobDetails: MOCK_JOBS[0]
    },
    {
        id: 'cl-2',
        title: 'Reforma de Estofados e Poltronas',
        advertiser: 'Tapeçaria Silva',
        category: 'Serviços',
        neighborhood: 'Taquara',
        description: 'Especialista em reformas de sofás, cadeiras e estofados em geral. Orçamento grátis no local.',
        timestamp: 'Há 5h',
        contactWhatsapp: '5521988888888',
        typeLabel: 'Serviço'
    },
    {
        id: 'cl-3',
        title: 'Venda de Balcão Refrigerado Industrial',
        advertiser: 'Padaria Imperial',
        category: 'Compra & Venda',
        neighborhood: 'Freguesia',
        description: 'Balcão em perfeito estado, revisado recentemente. Motivo: reforma total da loja.',
        timestamp: 'Ontem',
        contactWhatsapp: '5521999999999',
        price: 'R$ 1.200,00',
        typeLabel: 'Venda'
    },
    {
        id: 'cl-4',
        title: 'Interrupção de Energia para Manutenção',
        advertiser: 'Light / Comunitário',
        category: 'Avisos',
        neighborhood: 'Anil',
        description: 'Aviso aos moradores: Manutenção programada na rede elétrica domingo das 08h às 12h.',
        timestamp: 'Ontem',
        contactWhatsapp: '5521999999999',
        typeLabel: 'Utilidade'
    },
    {
        id: 'cl-5',
        title: 'Vendedor Externo',
        advertiser: 'JPA Telecom',
        category: 'Empregos',
        neighborhood: 'Taquara',
        description: 'Vendas de planos de internet. Comissionamento agressivo e ajuda de custo.',
        timestamp: 'Há 1 dia',
        contactWhatsapp: '5521988888888',
        typeLabel: 'PJ',
        jobDetails: MOCK_JOBS[1]
    }
];

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
