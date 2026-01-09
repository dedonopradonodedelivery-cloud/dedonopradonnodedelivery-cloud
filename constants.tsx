
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

// --- LOGO GENERATOR HELPER ---
// Cria logotipos SVG vetoriais leves e nítidos simulando branding real
const createBrandLogo = (bgColor: string, fgColor: string, iconPath: string, text?: string) => {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="${bgColor}"/>
    <g transform="translate(100, 80) scale(8)" fill="none" stroke="${fgColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      ${iconPath}
    </g>
    ${text ? `<text x="50%" y="340" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="50" fill="${fgColor}" letter-spacing="-1">${text}</text>` : ''}
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Paths simplificados para os ícones das marcas
const PATHS = {
  burger: '<path d="M6.667 15.333h10.666a1.333 1.333 0 0 0 1.334-1.333v-1.333a1.333 1.333 0 0 0-1.334-1.334H6.667a1.333 1.333 0 0 0-1.334 1.334V14c0 .736.597 1.333 1.334 1.333Z"/><path d="M4 8.667h16"/><path d="M12 4c3.5 0 6.5 2 7.5 4.667H4.5C5.5 6 8.5 4 12 4Z"/>',
  sunWheat: '<path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a2.8 2.8 0 0 1 1.666-1.503L12 4l-5.613 7.147a2.8 2.8 0 0 1 1.667 1.503"/><path d="M12 22v-9"/>',
  pizza: '<path d="M12 2 4.5 13.5a4.8 4.8 0 0 0 2.2 6.5h10.6a4.8 4.8 0 0 0 2.2-6.5L12 2Z"/><circle cx="12" cy="13" r="1"/><circle cx="10" cy="16" r="1"/><circle cx="14" cy="16" r="1"/>',
  basket: '<path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/>',
  cross: '<path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2Z"/>'
};

// Logos Gerados (Mantidos para uso em outros contextos se necessário, mas STORES usará fotos)
const LOGOS = {
  farmacia: createBrandLogo('#EF4444', '#FFFFFF', PATHS.cross, 'SAÚDE'),
  oficina: createBrandLogo('#1E293B', '#FFFFFF', '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>', 'OFICINA'),
  pet: createBrandLogo('#8B5CF6', '#FFFFFF', '<path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 4.916-2.1 7 .66.686 1.6 1 2.6 1 1.93 0 3-1.446 3-2.828 0-1.434-1.07-2.672-3-3-1.974-.336-3.3 1.05-3 3 .15.976.995 2 2 2 .856 0 1.5-.536 1.5-1.172"/>', 'ANIL PET'),
};

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
  { id: '1', name: 'Burger Nova', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop' },
  { id: '2', name: 'Padaria Aurora', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&auto=format&fit=crop' },
];

export const STORES: Store[] = [
  {
    id: '1',
    name: 'Burger Nova',
    username: 'burgernova',
    category: 'Alimentação',
    subcategory: 'Hambúrguerias',
    description: 'Hambúrgueres artesanais com sabor de bairro.',
    logoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop', // Imagem Realista
    rating: 4.8,
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
      "O melhor cheddar da Freguesia, sem dúvidas!",
      "Entrega super rápida, chegou quentinho.",
      "Sempre peço no fim de semana, nunca decepciona."
    ]
  },
  {
    id: 'premium-test',
    name: 'Padaria Aurora',
    username: 'padariaaurora',
    category: 'Alimentação',
    subcategory: 'Padarias',
    description: 'O melhor pão quentinho e café artesanal da Freguesia.',
    logoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop', // Imagem Realista
    rating: 4.9,
    reviewsCount: 450,
    distance: 'Freguesia • RJ',
    neighborhood: 'Freguesia',
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
  {
    id: 'taquara-1',
    name: 'Pizzaria Central',
    username: 'pizzariacentral',
    category: 'Alimentação',
    subcategory: 'Pizzarias',
    description: 'A pizza mais recheada da região.',
    logoUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop', // Imagem Realista
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
    name: 'Farmácia Saúde',
    username: 'farmasaude',
    category: 'Saúde',
    subcategory: 'Farmácias',
    description: 'Preços baixos e entrega rápida.',
    logoUrl: LOGOS.farmacia,
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
    id: 'tanque-1',
    name: 'Oficina do Tanque',
    username: 'oficinatanque',
    category: 'Autos',
    subcategory: 'Mecânica',
    description: 'Mecânica geral e elétrica.',
    logoUrl: LOGOS.oficina,
    rating: 4.8,
    reviewsCount: 56,
    distance: 'Tanque • RJ',
    neighborhood: 'Tanque',
    adType: AdType.ORGANIC,
    address: 'Rua Cândido Benício, 2000',
    phone: '(21) 95555-3333',
    verified: true
  },
  {
    id: 'anil-1',
    name: 'Anil Pet Shop',
    username: 'anilpet',
    category: 'Pets',
    subcategory: 'Pet Shop',
    description: 'Tudo para o seu bichinho.',
    logoUrl: LOGOS.pet,
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
    name: 'Mercado Vale',
    username: 'mercadovale',
    category: 'Mercado',
    subcategory: 'Mercearia',
    description: 'Frutas e verduras frescas todo dia.',
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop', // Imagem Realista
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

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    role: 'Atendente de Balcão',
    company: 'Padaria Aurora',
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
    neighborhood: 'Taquara',
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
    company: 'Burger Nova',
    neighborhood: 'Freguesia',
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
    content: 'O pão da Padaria Aurora tá saindo agora! Quentinho demais 🍞😋',
    type: 'recommendation',
    relatedStoreId: 'premium-test',
    relatedStoreName: 'Padaria Aurora',
    neighborhood: 'Freguesia',
    timestamp: '5 min atrás',
    likes: 12,
    comments: 2
  },
  {
    id: 'post-merchant-1',
    userId: 'store-1',
    userName: 'Burger Nova',
    userUsername: 'burgernova',
    userAvatar: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
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
