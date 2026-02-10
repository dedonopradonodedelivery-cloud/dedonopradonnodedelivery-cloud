
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
  Lock, Wind, Disc, Cpu, HeartHandshake,
  // Added missing Coins import
  Coins
} from 'lucide-react';
import { AdType, Category, Store, Story, EditorialCollection, Job, CommunityPost, NeighborhoodCommunity, Classified, RealEstateProperty } from '../types';
import { getStoreLogo } from '@/utils/mockLogos';


export const CATEGORIES: Category[] = [
  { id: 'cat-comida', name: 'Comida', slug: 'comida', icon: <Utensils />, color: 'bg-brand-blue' },
  { id: 'cat-pets', name: 'Pets', slug: 'pets', icon: <PawPrint />, color: 'bg-brand-blue' },
  { id: 'cat-pro', name: 'Profissionais', slug: 'profissionais', icon: <Briefcase />, color: 'bg-brand-blue' },
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

export const HEALTH_SPECIALTIES: Record<string, string[]> = {
  'Mulher': [
    'Ginecologia', 'Obstetrícia', 'Mastologia', 'Endocrinologia feminina', 'Reprodução humana', 
    'Fertilidade feminina', 'Planejamento familiar', 'Saúde sexual feminina', 'Saúde íntima feminina', 
    'Climatério', 'Menopausa', 'Ginecologia oncológica', 'Ginecologia endócrina', 'Uroginecologia', 
    'Colposcopia', 'Patologia do trato genital inferior', 'Medicina fetal', 'Pré-natal de alto risco', 
    'Dor pélvica crônica'
  ],
  'Homem': [
    'Urologia', 'Andrologia', 'Endocrinologia masculina', 'Saúde sexual masculina', 'Fertilidade masculina', 
    'Saúde prostática', 'Distúrbios hormonais masculinos', 'Urologia oncológica', 'Urologia funcional', 
    'Saúde do envelhecimento masculino', 'Infertilidade masculina', 'Disfunção erétil', 'Ejaculação precoce', 
    'Hipogonadismo'
  ],
  'Pediatria': [
    'Pediatria geral', 'Neonatologia', 'Puericultura', 'Pediatria preventiva', 'Alergologia pediátrica', 
    'Endocrinologia pediátrica', 'Neuropediatria', 'Gastroenterologia pediátrica', 'Pneumologia pediátrica', 
    'Cardiologia pediátrica', 'Nefrologia pediátrica', 'Hematologia pediátrica', 'Oncologia pediátrica', 
    'Infectologia pediátrica', 'Reumatologia pediátrica', 'Genética médica pediátrica', 'Psiquiatria infantil', 
    'Ortopedia pediátrica', 'Cirurgia pediátrica'
  ],
  'Geriatria': [
    'Geriatria', 'Clínica geriátrica', 'Gerontologia', 'Medicina do envelhecimento', 'Fisioterapia geriátrica', 
    'Fisioterapia domiciliar', 'Enfermagem domiciliar', 'Home care', 'Cuidados paliativos', 'Cuidados continuados', 
    'Psicologia geriátrica', 'Psiquiatria geriátrica', 'Terapia ocupacional geriátrica', 'Fonoaudiologia geriátrica', 
    'Nutrição geriátrica', 'Reabilitação geriátrica', 'Ortopedia geriátrica', 'Cardiologia geriátrica', 
    'Neurologia geriátrica', 'Avaliação multidisciplinar do idoso'
  ]
};

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
  'Profissionais': [
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
    { name: 'Manicure & Pedicure', icon: <Sparkles /> },
    { name: 'Estética', icon: <Smile /> },
  ]
};

export const SPECIALTIES: Record<string, string[]> = {
  'Chaveiro 24h': ['Abertura de portas', 'Troca de fechadura', 'Chave codificada'],
  'Desentupidora': ['Pia de cozinha', 'Vaso sanitário', 'Caixa de gordura'],
  'default': ['Geral']
};

export const ALL_TAGS = ['pizza', 'lanche', 'delivery', 'manicure', 'eletricista', 'dentista'];

export const quickFilters = [
  { id: 'top_rated', label: 'Top Avaliados', icon: <Star /> },
  { id: 'open_now', label: 'Aberto Agora', icon: <Clock /> },
  { id: 'nearby', label: 'Perto de Mim', icon: <MapPin /> },
];

export const STORIES: Story[] = [
  { id: 's1', name: 'Ofertas do Dia', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&auto=format&fit=crop' },
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    role: 'Atendente de Balcão',
    company: 'Padaria Imperial',
    neighborhood: 'Freguesia',
    category: 'Alimentação',
    type: 'CLT',
    description: 'Vaga para atendente com experiência.',
    requirements: ['Experiência em atendimento ao público'],
    postedAt: 'Há 2h'
  }
];

export const MOCK_CLASSIFIEDS: Classified[] = [
  {
    id: 'cl-1',
    title: 'Bicicleta Aro 29 seminova',
    advertiser: 'João Silva',
    category: 'Desapega JPA',
    neighborhood: 'Freguesia',
    description: 'Vendo bicicleta em ótimo estado.',
    timestamp: 'Há 2h',
    contactWhatsapp: '21999999999',
    typeLabel: 'Venda',
    price: 'R$ 850,00'
  }
];

export const MOCK_REAL_ESTATE_PROPERTIES: RealEstateProperty[] = [
  {
    id: 're-1',
    type: 'Comercial',
    title: 'Sala Comercial na Geremário Dantas',
    description: 'Sala reformada de 35m².',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600',
    neighborhood: 'Freguesia',
    price: 1800,
    transaction: 'aluguel',
    area: 35,
    postedAt: 'Há 1 dia'
  }
];

export const OFFICIAL_COMMUNITIES: NeighborhoodCommunity[] = [
  { id: 'c1', name: 'Moradores de JPA', description: 'Comunidade oficial de Jacarepaguá', image: '', icon: <Users />, color: 'bg-blue-500', membersCount: '12k' }
];

export const MOCK_USER_COMMUNITIES: NeighborhoodCommunity[] = [
  { id: 'c2', name: 'Freguesia News', description: 'Notícias da região', image: '', icon: <Users />, color: 'bg-emerald-500', membersCount: '5k' }
];

export const NEIGHBORHOOD_COMMUNITIES: NeighborhoodCommunity[] = [...OFFICIAL_COMMUNITIES, ...MOCK_USER_COMMUNITIES];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'p1',
    userId: 'u1',
    userName: 'Carlos Oliveira',
    userAvatar: 'https://i.pravatar.cc/100?u=1',
    authorRole: 'resident',
    content: 'Recomendo a Padaria Imperial, pão sempre quentinho!',
    type: 'recommendation',
    communityId: 'c1',
    timestamp: 'Há 1h',
    likes: 12,
    comments: 3
  }
];

export const STORES: Store[] = [
  {
    id: 'f-1',
    name: 'Bibi Lanches',
    category: 'Comida',
    subcategory: 'Lanches & Hamburguerias',
    rating: 4.8,
    distance: '1.2km',
    adType: AdType.PREMIUM,
    description: 'Lanches saudáveis e deliciosos.',
    verified: true,
    isOpenNow: true,
    neighborhood: 'Freguesia',
    logoUrl: 'https://ui-avatars.com/api/?name=Bibi+Lanches'
  },
  {
    id: 'grupo-esquematiza',
    name: 'Grupo Esquematiza',
    category: 'Serviços',
    subcategory: 'Segurança',
    rating: 5.0,
    distance: '0.8km',
    adType: AdType.PREMIUM,
    description: 'Segurança eletrônica e patrimonial.',
    verified: true,
    isOpenNow: true,
    neighborhood: 'Freguesia',
    logoUrl: 'https://ui-avatars.com/api/?name=Grupo+Esquematiza'
  }
];

export const CATEGORY_TOP_BANNERS: Record<string, Record<string, { image: string; storeId: string }[]>> = {
  'comida': {
    'Freguesia': [{ image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800', storeId: 'f-1' }]
  }
};

export const EDITORIAL_SERVICES: EditorialCollection[] = [
  { id: 'ed-1', title: 'Top Avaliados', subtitle: 'Serviços premium do bairro', image: '', keywords: ['serviços'] }
];
