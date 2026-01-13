
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
    username: 'burgerfreguesia',
    category: 'Alimentação',
    subcategory: 'Hambúrguerias',
    description: 'Hambúrgueres artesanais com sabor de bairro.',
    logoUrl: getStoreLogo(1),
    // Foto real do produto para o card
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
    recentComments: [
      "O melhor cheddar da Freguesia! O molho secreto é viciante.",
      "Entrega super rápida, chegou quentinho.",
      "Sempre peço no fim de semana, nunca decepciona."
    ]
  },
  {
    id: 'tanque-1',
    name: 'Oficina do Tanque',
    username: 'oficinatanque',
    category: 'Autos',
    subcategory: 'Mecânica',
    description: 'Mecânica geral e elétrica.',
    logoUrl: getStoreLogo(5),
    // Foto real do serviço para o card
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewsCount: 56,
    distance: 'Tanque • RJ',
    neighborhood: 'Tanque',
    adType: AdType.ORGANIC,
    address: 'Rua Cândido Benício, 2000',
    phone: '(21) 95555-3333',
    verified: true,
    recentComments: [
      "Profissionais honestos, resolveram o barulho do meu carro rápido.",
      "Preço justo e não inventam defeito.",
      "Melhor mecânica da região do Tanque."
    ]
  },
  {
    id: 'beleza-1',
    name: 'Studio Glamour',
    username: 'studioglamour',
    category: 'Beleza',
    subcategory: 'Salão de Beleza',
    description: 'Cabelo, unhas e estética.',
    logoUrl: getStoreLogo(20),
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop',
    rating: 5.0,
    reviewsCount: 42,
    distance: 'Pechincha • RJ',
    neighborhood: 'Pechincha',
    adType: AdType.ORGANIC,
    verified: true,
    recentComments: [
      "A Gabi é maravilhosa, minhas unhas duram o mês todo!",
      "Ambiente super agradável e cafézinho delicioso.",
      "Recomendo o tratamento capilar, salvou meu cabelo."
    ]
  },
  {
    id: 'academia-1',
    name: 'Academia Iron Tech',
    username: 'irontech',
    category: 'Esportes',
    subcategory: 'Academia',
    description: 'Musculação e aulas coletivas.',
    logoUrl: getStoreLogo(33),
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    rating: 4.7,
    reviewsCount: 110,
    distance: 'Freguesia • RJ',
    neighborhood: 'Freguesia',
    adType: AdType.ORGANIC,
    verified: true,
    recentComments: [
      "Equipamentos novos e ar condicionado gelando. Top!",
      "Os professores são muito atenciosos, montaram meu treino certinho.",
      "Melhor custo benefício da região."
    ]
  },
  {
    id: 'premium-test',
    name: 'Padaria Imperial',
    username: 'padariaimperial',
    category: 'Alimentação',
    subcategory: 'Padarias',
    description: 'O melhor pão quentinho e café artesanal da Freguesia.',
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
    recentComments: [] 
  },
  {
    id: 'taquara-1',
    name: 'Pizzaria Taquara',
    username: 'pizzataquara',
    category: 'Alimentação',
    subcategory: 'Pizzarias',
    description: 'A pizza mais recheada da região.',
    logoUrl: getStoreLogo(3),
    rating: 4.7,
    reviewsCount: 89,
    distance: 'Taquara • RJ',
    neighborhood: 'Taquara',
    cashback: 8,
    adType: AdType.LOCAL,
    address: 'Estrada do Tindiba, 500',
    phone: '(21) 97777-1111',
    verified: true
  },
  {
    id: 'pechincha-1',
    name: 'Farmácia Pechincha',
    username: 'farmapechincha',
    category: 'Saúde',
    subcategory: 'Farmácias',
    description: 'Preços baixos e entrega rápida.',
    logoUrl: getStoreLogo(4),
    rating: 4.5,
    reviewsCount: 200,
    distance: 'Pechincha • RJ',
    neighborhood: 'Pechincha',
    cashback: 3,
    adType: AdType.ORGANIC,
    address: 'Av. Geremário Dantas, 1200',
    phone: '(21) 96666-2222',
    verified: true
  },
  {
    id: 'anil-1',
    name: 'Anil Pet Shop',
    username: 'anilpet',
    category: 'Pets',
    subcategory: 'Pet Shop',
    description: 'Tudo para o seu bichinho.',
    logoUrl: getStoreLogo(6),
    rating: 4.9,
    reviewsCount: 15,
    distance: 'Anil • RJ',
    neighborhood: 'Anil',
    adType: AdType.ORGANIC,
    address: 'Estrada de Jacarepaguá, 4500',
    phone: '(21) 94444-4444',
    verified: true
  },
  {
    id: 'curicica-1',
    name: 'Mercadinho Curicica',
    username: 'mercadocuricica',
    category: 'Mercado',
    subcategory: 'Mercearia',
    description: 'Frutas e verduras frescas todo dia.',
    logoUrl: getStoreLogo(7),
    rating: 4.4,
    reviewsCount: 32,
    distance: 'Curicica • RJ',
    neighborhood: 'Curicica',
    adType: AdType.LOCAL,
    address: 'Rua da Ventura, 50',
    phone: '(21) 93333-3333',
    verified: true,
    cashback: 2
  }
];

// --- VAGAS COM DADOS DE TESTE PARA PATROCÍNIO ---
const now = new Date();
const d7 = new Date(); d7.setDate(now.getDate() + 7);
const d15 = new Date(); d15.setDate(now.getDate() + 15);
const dPrev = new Date(); dPrev.setDate(now.getDate() - 1);

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-spon-valid-1',
    role: 'Gerente Comercial',
    company: 'Shopping Freguesia',
    neighborhood: 'Freguesia',
    category: 'Moda', // Fix: Added missing category
    type: 'CLT',
    salary: 'R$ 4.500,00',
    description: 'Gerenciamento de equipe e metas. Experiência em varejo de moda.',
    requirements: ['Experiência 2 anos', 'Superior Completo', 'Liderança'],
    schedule: 'Comercial',
    contactWhatsapp: '5521999998888',
    postedAt: 'Hoje',
    isSponsored: true,
    sponsoredUntil: d7.toISOString().split('T')[0] // Expira em 7 dias
  },
  {
    id: 'job-spon-valid-2',
    role: 'Recepcionista Bilíngue',
    company: 'Hotel Quality',
    neighborhood: 'Pechincha',
    category: 'Serviços', // Fix: Added missing category
    type: 'CLT',
    salary: 'R$ 2.200,00',
    description: 'Atendimento a hóspedes, check-in/out. Inglês fluente obrigatório.',
    requirements: ['Inglês fluente', 'Simpatia', 'Disponibilidade fds'],
    schedule: 'Escala 6x1',
    contactWhatsapp: '5521977776666',
    postedAt: 'Há 1 hora',
    isSponsored: true,
    sponsoredUntil: d15.toISOString().split('T')[0] // Expira em 15 dias (Deveria estar no topo se ordenado por distância de expiração)
  },
  {
    id: 'job-spon-expired',
    role: 'Vendedor Externo',
    company: 'Distribuidora JPA',
    neighborhood: 'Taquara',
    category: 'Varejo', // Fix: Added missing category
    type: 'CLT',
    salary: 'Fixo + Comissão',
    description: 'Venda de produtos alimentícios.',
    requirements: ['Cofre CNH A/B', 'Gostar de rua'],
    schedule: 'Comercial',
    contactWhatsapp: '5521955554444',
    postedAt: 'Há 3 dias',
    isSponsored: true,
    sponsoredUntil: dPrev.toISOString().split('T')[0] // EXPIRADA (ontem)
  },
  {
    id: 'job-1',
    role: 'Atendente de Balcão',
    company: 'Padaria Imperial',
    neighborhood: 'Freguesia',
    category: 'Alimentação', // Fix: Added missing category
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
    neighborhood: 'Taquara',
    category: 'Beleza', // Fix: Added missing category
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
    category: 'Alimentação', // Fix: Added missing category
    type: 'Freelancer',
    salary: 'Taxa + Produtividade',
    description: 'Entregas na região da Freguesia e Pechincha.',
    requirements: ['Moto própria', 'CNH A', 'Conhecer a região'],
    schedule: 'Noite (18h às 23h)',
    contactWhatsapp: '5521977777777',
    postedAt: 'Há 2 dias',
    isUrgent: true
  },
  {
    id: 'job-4',
    role: 'Vendedor',
    company: 'Moda Pechincha',
    neighborhood: 'Pechincha',
    category: 'Moda', // Fix: Added missing category
    type: 'CLT',
    salary: 'Comissão',
    description: 'Vendas de roupas femininas.',
    requirements: ['Experiência em vendas', 'Gostar de moda'],
    schedule: 'Comercial',
    contactWhatsapp: '5521966665555',
    postedAt: 'Hoje'
  }
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    userId: 'u1',
    userName: 'Ana Paula',
    userUsername: 'anapaula',
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
  },
  {
    id: 'post-merchant-1',
    userId: 'store-1',
    userName: 'Burger Freguesia',
    userUsername: 'burgerfreguesia',
    userAvatar: getStoreLogo(1),
    authorRole: 'merchant',
    content: 'Hoje tem promoção de combo duplo! Compre um e leve outro pela metade do preço. Vem aproveitar! 🍔🍔',
    type: 'promo',
    neighborhood: 'Freguesia',
    imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=400&auto=format&fit=crop',
    timestamp: '15 min atrás',
    likes: 45,
    comments: 8
  },
  {
    id: 'post-video-1',
    userId: 'u5',
    userName: 'Fernanda Lima',
    userUsername: 'fernandalima',
    userAvatar: 'https://i.pravatar.cc/100?u=f',
    authorRole: 'resident',
    content: 'Gente, olha que incrível o ambiente do novo bistrô na Araguaia! Super recomendo 🍷',
    type: 'recommendation',
    neighborhood: 'Freguesia',
    videoUrl: 'https://videos.pexels.com/video-files/3196236/3196236-sd_540_960_25fps.mp4',
    timestamp: '20 min atrás',
    likes: 89,
    comments: 14
  },
  {
    id: 'post-taquara-1',
    userId: 'u6',
    userName: 'Roberto Dias',
    userAvatar: 'https://i.pravatar.cc/100?u=r',
    authorRole: 'resident',
    content: 'Alguém recomenda um bom mecânico na Taquara?',
    type: 'tip',
    neighborhood: 'Taquara',
    timestamp: '1h atrás',
    likes: 5,
    comments: 12
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
