import React from 'react';
import { 
  Utensils, ShoppingCart, Scissors, Heart, PawPrint, Home, Wrench, 
  Dumbbell, CarFront, BookOpen, Monitor, Shirt, Ticket, Map as MapIcon, 
  LayoutGrid, Pill, Briefcase, Plane, Zap,
  Beef, Coffee, Pizza, Croissant, Soup, Cake, Sandwich, 
  Stethoscope, Package, Clock, Target, Settings, Dog,
  Star, Tag, Award, TrendingUp, ChevronRight, MessageSquare, Users
} from 'lucide-react';
import { AdType, Category, Store, Story, EditorialCollection, Job, CommunityPost, NeighborhoodCommunity } from './types';

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

export const NEIGHBORHOOD_COMMUNITIES: NeighborhoodCommunity[] = [
  {
    id: 'comm-services',
    name: 'Serviços & Indicações',
    description: 'Encontre os melhores profissionais do bairro indicados por quem mora aqui.',
    image: 'https://images.unsplash.com/photo-1581578731117-104f2a8d23e9?q=80&w=600&auto=format&fit=crop',
    icon: <Wrench />,
    color: 'from-blue-500 to-blue-700',
    membersCount: '2.4k'
  },
  {
    id: 'comm-jobs',
    name: 'Vagas no Bairro',
    description: 'Oportunidades de emprego e freelances exclusivos na região de Jacarepaguá.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
    icon: <Briefcase />,
    color: 'from-amber-500 to-orange-600',
    membersCount: '1.8k'
  },
  {
    id: 'comm-pets',
    name: 'Pets do Bairro',
    description: 'Dicas de veterinários, banho e tosa, e ajuda para animais perdidos.',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=600&auto=format&fit=crop',
    icon: <PawPrint />,
    color: 'from-purple-500 to-indigo-600',
    membersCount: '3.1k'
  },
  {
    id: 'comm-food',
    name: 'Comer & Beber',
    description: 'Onde comer bem? As melhores pizzarias, bares e deliveries da Freguesia.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop',
    icon: <Utensils />,
    color: 'from-red-500 to-rose-600',
    membersCount: '4.5k'
  },
  {
    id: 'comm-fit',
    name: 'Fit',
    description: 'Academias, grupos de corrida, crossfit e alimentação saudável no bairro.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    icon: <Dumbbell />,
    color: 'from-emerald-500 to-teal-600',
    membersCount: '1.2k'
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
    comments: 2
  },
  {
    id: 'post-2',
    userId: 'u2',
    userName: 'Carlos Silva',
    userAvatar: 'https://i.pravatar.cc/100?u=c',
    authorRole: 'resident',
    content: 'Indico o João Eletricista! Fez um serviço impecável aqui em casa hoje. ⚡🔌',
    type: 'recommendation',
    communityId: 'comm-services',
    neighborhood: 'Taquara',
    timestamp: '1h atrás',
    likes: 45,
    comments: 8,
    imageUrl: 'https://images.unsplash.com/photo-1621905476438-5f09f22d556c?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'post-3',
    userId: 'u3',
    userName: 'Mariana G.',
    userAvatar: 'https://i.pravatar.cc/100?u=m',
    authorRole: 'resident',
    content: 'Alguém sabe de vaga para recepcionista aqui na Freguesia? Procuro para minha sobrinha.',
    type: 'tip',
    communityId: 'comm-jobs',
    neighborhood: 'Freguesia',
    timestamp: '2h atrás',
    likes: 8,
    comments: 15
  },
  {
    id: 'post-4',
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
  },
  {
    id: 'post-5',
    userId: 'u5',
    userName: 'Juliana Fit',
    userAvatar: 'https://i.pravatar.cc/100?u=j',
    authorRole: 'resident',
    content: 'Treino de pernas concluído na Smart Fit! Quem mais tá focado hoje? 💪🔥',
    type: 'news',
    communityId: 'comm-fit',
    neighborhood: 'Pechincha',
    timestamp: '4h atrás',
    likes: 31,
    comments: 4
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
  // --- 50 FAKE STORES START ---
  { id: 'f-1', name: 'Bibi Lanches', category: 'Comida', subcategory: 'Lanches', rating: 4.8, distance: 'Freguesia', adType: AdType.PREMIUM, description: 'Lanches clássicos e saudáveis.', isSponsored: true, image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-2', name: 'Studio Hair Vip', category: 'Beleza', subcategory: 'Cabelereiro', rating: 4.9, distance: 'Taquara', adType: AdType.PREMIUM, description: 'Especialista em loiros e cortes modernos.', isSponsored: true, image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-3', name: 'Pet Shop Alegria', category: 'Pets', subcategory: 'Banho e Tosa', rating: 4.7, distance: 'Pechincha', adType: AdType.PREMIUM, description: 'O carinho que seu pet merece.', isSponsored: true, image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-4', name: 'Mecânica 24h', category: 'Autos', subcategory: 'Oficina', rating: 4.5, distance: 'Anil', adType: AdType.PREMIUM, description: 'Socorro mecânico a qualquer hora.', isSponsored: true, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-5', name: 'Pizzaria do Zé', category: 'Comida', subcategory: 'Pizzaria', rating: 4.6, distance: 'Freguesia', adType: AdType.PREMIUM, description: 'Pizza no forno a lenha.', isSponsored: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-6', name: 'Açaí da Praça', category: 'Comida', subcategory: 'Sobremesas', rating: 4.9, distance: 'Tanque', adType: AdType.PREMIUM, description: 'O melhor açaí da região.', isSponsored: true, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-7', name: 'Drogaria JPA', category: 'Farmácia', subcategory: 'Saúde', rating: 4.4, distance: 'Freguesia', adType: AdType.PREMIUM, description: 'Medicamentos e perfumaria.', isSponsored: true, image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-8', name: 'Academia FitBairro', category: 'Esportes', subcategory: 'Musculação', rating: 4.7, distance: 'Taquara', adType: AdType.PREMIUM, description: 'Treine perto de casa.', isSponsored: true, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-9', name: 'Consultório Dra. Ana', category: 'Saúde', subcategory: 'Odontologia', rating: 5.0, distance: 'Freguesia', adType: AdType.PREMIUM, description: 'Cuidado completo com seu sorriso.', isSponsored: true, image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-10', name: 'Boutique Chic', category: 'Moda', subcategory: 'Roupas', rating: 4.3, distance: 'Anil', adType: AdType.PREMIUM, description: 'Tendências e elegância.', isSponsored: true, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-11', name: 'Padaria de Luxo', category: 'Comida', subcategory: 'Padaria', rating: 4.6, distance: 'Pechincha', adType: AdType.ORGANIC, description: 'Pães artesanais e doces.', isSponsored: false, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-12', name: 'Barber Shop Retro', category: 'Beleza', subcategory: 'Barbearia', rating: 4.8, distance: 'Taquara', adType: AdType.ORGANIC, description: 'Corte e barba clássicos.', isSponsored: false, image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-13', name: 'Lavanderia Express', category: 'Serviços', subcategory: 'Limpeza', rating: 4.5, distance: 'Freguesia', adType: AdType.ORGANIC, description: 'Sua roupa limpa em 1h.', isSponsored: false, image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-14', name: 'InfoTech JPA', category: 'Tecnologia', subcategory: 'Informática', rating: 4.7, distance: 'Tanque', adType: AdType.ORGANIC, description: 'Manutenção de PC e Notebook.', isSponsored: false, image: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-15', name: 'Flores do Campo', category: 'Casa', subcategory: 'Floricultura', rating: 4.9, distance: 'Anil', adType: AdType.ORGANIC, description: 'Arranjos para todas as ocasiões.', isSponsored: false, image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-16', name: 'Sapataria Ideal', category: 'Serviços', subcategory: 'Reparos', rating: 4.4, distance: 'Pechincha', adType: AdType.ORGANIC, description: 'Conserto de sapatos e bolsas.', isSponsored: false, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-17', name: 'Escola de Inglês Top', category: 'Educação', subcategory: 'Idiomas', rating: 4.8, distance: 'Taquara', adType: AdType.ORGANIC, description: 'Fale inglês em 18 meses.', isSponsored: false, image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-18', name: 'Banca do Jornal', category: 'Lazer', subcategory: 'Revistas', rating: 4.2, distance: 'Freguesia', adType: AdType.ORGANIC, description: 'Jornais, revistas e conveniência.', isSponsored: false, image: 'https://images.unsplash.com/photo-1589239203361-299651079565?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-19', name: 'Vidraçaria Transparente', category: 'Casa', subcategory: 'Vidros', rating: 4.5, distance: 'Anil', adType: AdType.ORGANIC, description: 'Box, espelhos e vidros em geral.', isSponsored: false, image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-20', name: 'Agência de Viagens Rio', category: 'Viagem', subcategory: 'Turismo', rating: 4.7, distance: 'Tanque', adType: AdType.ORGANIC, description: 'Sua próxima aventura começa aqui.', isSponsored: false, image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-21', name: 'Frango Assado do Bairro', category: 'Comida', subcategory: 'Assados', rating: 4.6, distance: 'Freguesia', adType: AdType.ORGANIC, description: 'O melhor frango de domingo.', isSponsored: false, image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-22', name: 'Esmalteria Bella', category: 'Beleza', subcategory: 'Unhas', rating: 4.8, distance: 'Taquara', adType: AdType.ORGANIC, description: 'Manicure, pedicure e alongamento.', isSponsored: false, image: 'https://images.unsplash.com/photo-1604654894610-df4906687103?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-23', name: 'Loja de Celulares Connect', category: 'Tecnologia', subcategory: 'Acessórios', rating: 4.5, distance: 'Pechincha', adType: AdType.ORGANIC, description: 'Capas, cabos e assistência.', isSponsored: false, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-24', name: 'Chaveiro Central', category: 'Serviços', subcategory: 'Chaveiro', rating: 4.9, distance: 'Anil', adType: AdType.ORGANIC, description: 'Cópias e aberturas 24h.', isSponsored: false, image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-25', name: 'Mercado Economia', category: 'Mercado', subcategory: 'Alimentos', rating: 4.3, distance: 'Tanque', adType: AdType.ORGANIC, description: 'Preço baixo todo dia.', isSponsored: false, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-26', name: 'Papelaria Cor & Arte', category: 'Educação', subcategory: 'Material Escolar', rating: 4.6, distance: 'Freguesia', adType: AdType.ORGANIC, description: 'Tudo para estudantes e artistas.', isSponsored: false, image: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-27', name: 'Oficina de Motos Z', category: 'Autos', subcategory: 'Motos', rating: 4.7, distance: 'Taquara', adType: AdType.ORGANIC, description: 'Especializada em alta cilindrada.', isSponsored: false, image: 'https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-28', name: 'Loja de Tintas Bairro', category: 'Casa', subcategory: 'Reforma', rating: 4.5, distance: 'Pechincha', adType: AdType.ORGANIC, description: 'Cores que transformam seu lar.', isSponsored: false, image: 'https://images.unsplash.com/photo-1589939705384-5185138a04b9?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-29', name: 'Consultório Dr. Marcos', category: 'Saúde', subcategory: 'Fisioterapia', rating: 4.9, distance: 'Anil', adType: AdType.ORGANIC, description: 'Recuperação e bem-estar.', isSponsored: false, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-30', name: 'Hortifruti da Vovó', category: 'Mercado', subcategory: 'Frutas e Legumes', rating: 4.8, distance: 'Tanque', adType: AdType.ORGANIC, description: 'Produtos frescos direto do produtor.', isSponsored: false, image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-31', name: 'Sushi Express', category: 'Comida', subcategory: 'Japonês', rating: 4.7, distance: 'Freguesia', adType: AdType.ORGANIC, description: 'Combinados frescos e rápidos.', isSponsored: false, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-32', name: 'Clínica Pet Feliz', category: 'Pets', subcategory: 'Veterinária', rating: 4.9, distance: 'Taquara', adType: AdType.ORGANIC, description: 'Saúde animal com amor.', isSponsored: false, image: 'https://images.unsplash.com/photo-1599443015574-be5fe8a05783?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-33', name: 'Bicicletaria JPA', category: 'Esportes', subcategory: 'Ciclismo', rating: 4.6, distance: 'Anil', adType: AdType.ORGANIC, description: 'Venda e manutenção de bikes.', isSponsored: false, image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-34', name: 'Loja de Doces Candy', category: 'Comida', subcategory: 'Doces', rating: 4.8, distance: 'Pechincha', adType: AdType.ORGANIC, description: 'Um mundo de sabores.', isSponsored: false, image: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-35', name: 'Marido de Aluguel VIP', category: 'Serviços', subcategory: 'Reparos', rating: 4.7, distance: 'Freguesia', adType: AdType.ORGANIC, description: 'Pequenos consertos em geral.', isSponsored: false, image: 'https://images.unsplash.com/photo-1581578731117-104f2a8d23e9?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-36', name: 'Gelo e Bebidas 24h', category: 'Mercado', subcategory: 'Conveniência', rating: 4.2, distance: 'Taquara', adType: AdType.ORGANIC, description: 'Sempre aberto para salvar sua festa.', isSponsored: false, image: 'https://images.unsplash.com/photo-1544145945-f904253d0c71?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-37', name: 'Gráfica Rápida JPA', category: 'Pro', subcategory: 'Impressão', rating: 4.5, distance: 'Tanque', adType: AdType.ORGANIC, description: 'Cartões, banners e cópias.', isSponsored: false, image: 'https://images.unsplash.com/photo-1562654501-a0ccc0af3fb1?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-38', name: 'Loja de Móveis Planejados', category: 'Casa', subcategory: 'Móveis', rating: 4.8, distance: 'Freguesia', adType: AdType.ORGANIC, description: 'Seu sonho sob medida.', isSponsored: false, image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-39', name: 'Buffet Festas & Cia', category: 'Lazer', subcategory: 'Eventos', rating: 4.9, distance: 'Anil', adType: AdType.ORGANIC, description: 'Realizando grandes momentos.', isSponsored: false, image: 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-40', name: 'Distribuidora de Água', category: 'Mercado', subcategory: 'Bebidas', rating: 4.4, distance: 'Pechincha', adType: AdType.ORGANIC, description: 'Entrega rápida de galões.', isSponsored: false, image: 'https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-41', name: 'Adega Colonial', category: 'Mercado', subcategory: 'Vinhos', rating: 4.8, distance: 'Taquara', adType: AdType.ORGANIC, description: 'Rótulos exclusivos e artesanais.', isSponsored: false, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-42', name: 'Boutique do Pão', category: 'Comida', subcategory: 'Padaria', rating: 4.7, distance: 'Freguesia', adType: AdType.ORGANIC, description: 'Café da manhã completo.', isSponsored: false, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-43', name: 'Espaço Kids Recreação', category: 'Lazer', subcategory: 'Infantil', rating: 4.9, distance: 'Anil', adType: AdType.ORGANIC, description: 'Brincadeiras com segurança.', isSponsored: false, image: 'https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-44', name: 'Oficina de Ar Condicionado', category: 'Serviços', subcategory: 'Climatização', rating: 4.5, distance: 'Tanque', adType: AdType.ORGANIC, description: 'Instalação e limpeza.', isSponsored: false, image: 'https://images.unsplash.com/photo-1581094288338-2314dddb79a7?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-45', name: 'Studio de Yoga Bairro', category: 'Esportes', subcategory: 'Bem-estar', rating: 5.0, distance: 'Freguesia', adType: AdType.ORGANIC, description: 'Equilíbrio para seu dia.', isSponsored: false, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-46', name: 'Loja de Brinquedos JPA', category: 'Leisure', subcategory: 'Brinquedos', rating: 4.6, distance: 'Taquara', adType: AdType.ORGANIC, description: 'Diversão para todas as idades.', isSponsored: false, image: 'https://images.unsplash.com/photo-1533906966484-a9c978a3f090?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-47', name: 'Auto Elétrica do Anil', category: 'Autos', subcategory: 'Elétrica', rating: 4.4, distance: 'Anil', adType: AdType.ORGANIC, description: 'Baterias e reparos elétricos.', isSponsored: false, image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-48', name: 'Açaí do Parque', category: 'Comida', subcategory: 'Sobremesas', rating: 4.7, distance: 'Pechincha', adType: AdType.ORGANIC, description: 'Refrescante e delicioso.', isSponsored: false, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-49', name: 'Costureira Express', category: 'Serviços', subcategory: 'Moda', rating: 4.8, distance: 'Tanque', adType: AdType.ORGANIC, description: 'Ajustes e reformas rápidas.', isSponsored: false, image: 'https://images.unsplash.com/photo-1528570188406-47020436d418?q=80&w=400&auto=format&fit=crop' },
  { id: 'f-50', name: 'Vila dos Pets', category: 'Pets', subcategory: 'Pet Store', rating: 4.9, distance: 'Freguesia', adType: AdType.ORGANIC, description: 'Tudo para o seu melhor amigo.', isSponsored: false, image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=400&auto=format&fit=crop' },
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
];