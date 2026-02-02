
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
import { AdType, Category, Store, Story, EditorialCollection, Job, CommunityPost, NeighborhoodCommunity, Classified, RealEstateProperty } from '../types';

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
  { id: 'f-10', name: 'Boutique Chic', category: 'Moda', subcategory: 'Moda Feminina', rating: 4.3, distance: 'Anil', adType: AdType.PREMIUM, description: 'Tendências e elegância.', isSponsored: true, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop' },
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
    sponsoredUntil: '2025-12-31',
    candidacy_method: 'whatsapp',
    modality: 'Presencial',
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
    isUrgent: true,
    candidacy_method: 'whatsapp',
    modality: 'Presencial',
  }
];

export const MOCK_CLASSIFIEDS: Classified[] = [
    // Orçamento de Serviços (5)
    { id: 'cl-serv-1', title: 'Eletricista Residencial 24h', advertiser: 'Sérgio Luz', category: 'Orçamento de Serviços', neighborhood: 'Freguesia', description: 'Atendo emergências, curto-circuito, troca de disjuntor. Orçamento rápido pelo WhatsApp.', timestamp: 'Há 15 min', contactWhatsapp: '5521999991111', typeLabel: 'Serviço', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800' },
    { id: 'cl-serv-2', title: 'Instalação de Ar Condicionado Split', advertiser: 'JPA Refrigeração', category: 'Orçamento de Serviços', neighborhood: 'Taquara', description: 'Instalação e manutenção de ar condicionado. Equipe qualificada e com garantia.', timestamp: 'Há 1h', contactWhatsapp: '5521988882222', typeLabel: 'Serviço', imageUrl: 'https://images.unsplash.com/photo-1596541324213-981a54a48576?q=80&w=800' },
    { id: 'cl-serv-3', title: 'Pintor Profissional', advertiser: 'Renova Cor', category: 'Orçamento de Serviços', neighborhood: 'Anil', description: 'Pintura de apartamentos, casas e fachadas. Serviço limpo e rápido.', timestamp: 'Há 2h', contactWhatsapp: '5521977773333', typeLabel: 'Serviço', imageUrl: 'https://images.unsplash.com/photo-1598252994034-2193f05b1a37?q=80&w=800' },
    { id: 'cl-serv-4', title: 'Conserto de Geladeiras e Máquinas', advertiser: 'Refrilar Assistência', category: 'Orçamento de Serviços', neighborhood: 'Pechincha', description: 'Conserto de eletrodomésticos linha branca. Visita técnica no mesmo dia.', timestamp: 'Há 4h', contactWhatsapp: '5521966664444', typeLabel: 'Serviço', imageUrl: 'https://images.unsplash.com/photo-1615897184992-3f59055955a8?q=80&w=800' },
    { id: 'cl-serv-5', title: 'Montador de Móveis', advertiser: 'Carlos Montador', category: 'Orçamento de Serviços', neighborhood: 'Curicica', description: 'Montagem e desmontagem de móveis com agilidade e perfeição. Todos os tipos de móveis.', timestamp: 'Há 8h', contactWhatsapp: '5521955555555', typeLabel: 'Serviço', imageUrl: 'https://images.unsplash.com/photo-1600585152220-029e859e156b?q=80&w=800' },

    // Imóveis (5)
    { id: 'cl-im-1', title: 'Alugo Sala Comercial 40m²', advertiser: 'JPA Imóveis', category: 'Imóveis Comerciais', neighborhood: 'Pechincha', description: 'Sala comercial em prédio com portaria. Sol da manhã, 1 vaga. Ideal para consultório.', timestamp: 'Há 3h', contactWhatsapp: '5521977773333', typeLabel: 'Aluguel', price: 'R$ 1.800/mês', imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800' },
    { id: 'cl-im-2', title: 'Vendo Loja de Rua na Freguesia', advertiser: 'Oportunidade Imóveis', category: 'Imóveis Comerciais', neighborhood: 'Freguesia', description: 'Loja com 80m² em rua movimentada. Ponto excelente para farmácia ou mercado.', timestamp: 'Ontem', contactWhatsapp: '5521988884444', typeLabel: 'Venda', price: 'R$ 450.000', imageUrl: 'https://images.unsplash.com/photo-1556742502-ec7c0f9f34b1?q=80&w=800' },
    { id: 'cl-im-3', title: 'Alugo Galpão na Taquara', advertiser: 'Direto com Proprietário', category: 'Imóveis Comerciais', neighborhood: 'Taquara', description: 'Galpão com 200m², pé direito de 6m. Ideal para pequena indústria ou estoque.', timestamp: 'Há 2 dias', contactWhatsapp: '5521999995555', typeLabel: 'Aluguel', price: 'R$ 5.000/mês', imageUrl: 'https://images.unsplash.com/photo-1587022205345-66b3e6486d3b?q=80&w=800' },
    { id: 'cl-im-4', title: 'Passo o Ponto - Lanchonete Montada', advertiser: 'Carlos Alberto', category: 'Imóveis Comerciais', neighborhood: 'Freguesia', description: 'Passo o ponto de lanchonete completa e funcionando. Clientela formada. Motivo: mudança de cidade.', timestamp: 'Há 3 dias', contactWhatsapp: '5521987651234', typeLabel: 'Venda', price: 'R$ 80.000', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800' },
    { id: 'cl-im-5', title: 'Aluga-se Quiosque em Shopping', advertiser: 'ADM Shopping Center', category: 'Imóveis Comerciais', neighborhood: 'Anil', description: 'Quiosque de 9m² em corredor de grande movimento no Center Shopping. ', timestamp: 'Há 5 dias', contactWhatsapp: '5521976549876', typeLabel: 'Aluguel', price: 'R$ 3.500/mês', imageUrl: 'https://images.unsplash.com/photo-1580820216940-6d9ac53272e2?q=80&w=800' },

    // Empregos (5)
    { id: 'cl-emp-1', title: 'Vaga para Vendedor(a) de Loja', advertiser: 'Boutique Chic', category: 'Empregos', neighborhood: 'Anil', description: 'Procuramos vendedora com experiência em moda feminina. Salário + comissão.', timestamp: 'Há 1h', contactWhatsapp: '5521988776655', typeLabel: 'CLT', imageUrl: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800' },
    { id: 'cl-emp-2', title: 'Garçom para Fim de Semana', advertiser: 'Bar do Zé', category: 'Empregos', neighborhood: 'Freguesia', description: 'Vaga para garçom/garçonete com experiência para noites de sexta e sábado.', timestamp: 'Há 6h', contactWhatsapp: '5521977665544', typeLabel: 'Freelancer', imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800' },
    { id: 'cl-emp-3', title: 'Recepcionista para Academia', advertiser: 'Academia FitBairro', category: 'Empregos', neighborhood: 'Taquara', description: 'Vaga para recepcionista no período da tarde/noite. Boa comunicação é essencial.', timestamp: 'Há 9h', contactWhatsapp: '5521966554433', typeLabel: 'CLT', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800' },
    { id: 'cl-emp-4', title: 'Motorista Categoria D', advertiser: 'JPA Entregas', category: 'Empregos', neighborhood: 'Curicica', description: 'Vaga para motorista entregador com CNH categoria D. Entregas na região de Jacarepaguá.', timestamp: 'Ontem', contactWhatsapp: '5521955443322', typeLabel: 'CLT', imageUrl: 'https://images.unsplash.com/photo-1551803091-e373c2c606b2?q=80&w=800' },
    { id: 'cl-emp-5', title: 'Designer Gráfico (Freelance)', advertiser: 'Agência Criativa', category: 'Empregos', neighborhood: 'Freguesia', description: 'Procuramos designer para projetos pontuais de social media para comércios locais.', timestamp: 'Há 2 dias', contactWhatsapp: '5521944332211', typeLabel: 'PJ', imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800' },

    // Adoção de pets (5)
    { id: 'cl-ado-1', title: 'Adoção Urgente: Gatinhos 2 meses', advertiser: 'Mariana L.', category: 'Adoção de pets', neighborhood: 'Anil', description: 'Resgate i uma ninhada e agora esses 3 bebês procuram um lar com amor. Já comem ração.', timestamp: 'Há 3 dias', contactWhatsapp: '5521966666666', typeLabel: 'Adoção', imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69841006?q=80&w=800' },
    { id: 'cl-ado-2', title: 'Cachorrinha Vira-lata Carinhosa', advertiser: 'Projeto 4 Patas', category: 'Adoção de pets', neighborhood: 'Tanque', description: 'Essa linda menina de porte médio foi resgatada e está pronta para uma família. Castrada e vacinada.', timestamp: 'Há 4 dias', contactWhatsapp: '5521955557777', typeLabel: 'Adoção', imageUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=800' },
    { id: 'cl-ado-3', title: 'Filhotes de Labrador para Adoção', advertiser: 'Canil do Bem', category: 'Adoção de pets', neighborhood: 'Freguesia', description: 'Mãe resgatada deu cria. Filhotes saudáveis procurando um lar responsável.', timestamp: 'Há 1 semana', contactWhatsapp: '5521944448888', typeLabel: 'Adoção', imageUrl: 'https://images.unsplash.com/photo-1553882159-4f77243236e7?q=80&w=800' },
    { id: 'cl-ado-4', title: 'Gato Adulto Preto e Branco', advertiser: 'Ana Paula', category: 'Adoção de pets', neighborhood: 'Pechincha', description: 'Gato muito dócil, castrado. Infelizmente preciso me mudar e não posso levá-lo. Procura um novo sofá para dormir.', timestamp: 'Há 1 semana', contactWhatsapp: '5521933339999', typeLabel: 'Adoção', imageUrl: 'https://images.unsplash.com/photo-1570824104453-508955ab7140?q=80&w=800' },
    { id: 'cl-ado-5', title: 'Hamster para adoção com gaiola', advertiser: 'Luiza F.', category: 'Adoção de pets', neighborhood: 'Taquara', description: 'Meu filho perdeu o interesse, estou doando o hamster com a gaiola completa e acessórios.', timestamp: 'Há 2 semanas', contactWhatsapp: '5521922221111', typeLabel: 'Adoção', imageUrl: 'https://images.unsplash.com/photo-1425082661705-1834bfd09d64?q=80&w=800' },

    // Doações em geral (5)
    { id: 'cl-doa-1', title: 'Doação de Roupas de Inverno', advertiser: 'Comunitário', category: 'Doações em geral', neighborhood: 'Pechincha', description: 'Arrecadando casacos e cobertores em bom estado para a campanha do agasalho. Ponto de coleta na associação.', timestamp: 'Há 4 dias', contactWhatsapp: '5521955555555', typeLabel: 'Doação', imageUrl: 'https://images.unsplash.com/photo-160533833-2413154b54e3?q=80&w=800' },
    { id: 'cl-doa-2', title: 'Doe Livros Infantis', advertiser: 'Escola Aprender', category: 'Doações em geral', neighborhood: 'Anil', description: 'Estamos montando uma biblioteca comunitária para as crianças. Aceitamos doações de livros em bom estado.', timestamp: 'Há 5 dias', contactWhatsapp: '5521944446666', typeLabel: 'Doação', imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800' },
    { id: 'cl-doa-3', title: 'Arrecadação de Ração para Abrigo', advertiser: 'Amigos dos Animais', category: 'Doações em geral', neighborhood: 'Freguesia', description: 'Nosso abrigo está precisando de ração para cães e gatos. Qualquer quantidade ajuda!', timestamp: 'Há 1 semana', contactWhatsapp: '5521933337777', typeLabel: 'Doação', imageUrl: 'https://images.unsplash.com/photo-1583232231904-4e7850550604?q=80&w=800' },
    { id: 'cl-doa-4', title: 'Doe um Brinquedo, Ganhe um Sorriso', advertiser: 'ONG Criança Feliz', category: 'Doações em geral', neighborhood: 'Curicica', description: 'Campanha de arrecadação de brinquedos novos ou usados em bom estado para o Dia das Crianças.', timestamp: 'Há 1 semana', contactWhatsapp: '5521922228888', typeLabel: 'Doação', imageUrl: 'https://images.unsplash.com/photo-1608846932299-617a653c07a3?q=80&w=800' },
    { id: 'cl-doa-5', title: 'Doação de Cesta Básica', advertiser: 'Igreja da Praça', category: 'Doações em geral', neighborhood: 'Tanque', description: 'Estamos recebendo alimentos não perecíveis para montar cestas básicas para famílias necessitadas.', timestamp: 'Há 10 dias', contactWhatsapp: '5521911119999', typeLabel: 'Doação', imageUrl: 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=800' },
    
    // Desapega JPA (5)
    { id: 'cl-des-1', title: 'Vendo Bicicleta Aro 29 Usada', advertiser: 'Pedro M.', category: 'Desapega JPA', neighborhood: 'Freguesia', description: 'Bicicleta em ótimo estado, pouquíssimo usada. Pneus novos. Apenas retirada.', timestamp: 'Há 1 dia', contactWhatsapp: '5521998765432', typeLabel: 'Venda', price: 'R$ 800,00', imageUrl: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=800' },
    { id: 'cl-des-2', title: 'Sofá 3 lugares Retrátil', advertiser: 'Fernanda R.', category: 'Desapega JPA', neighborhood: 'Taquara', description: 'Sofá confortável, precisa de limpeza, mas estrutura está perfeita. Motivo: comprei um novo.', timestamp: 'Há 2 dias', contactWhatsapp: '5521987659876', typeLabel: 'Venda', price: 'R$ 350,00', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800' },
    { id: 'cl-des-3', title: 'Vendo iPhone 11 64GB', advertiser: 'Lucas T.', category: 'Desapega JPA', neighborhood: 'Pechincha', description: 'Saúde da bateria em 85%. Tela intacta, sempre usado com película. Acompanha caixa e cabo.', timestamp: 'Há 2 dias', contactWhatsapp: '5521976541234', typeLabel: 'Venda', price: 'R$ 1.500,00', imageUrl: 'https://images.unsplash.com/photo-1616348436168-de43ad0e12de?q=80&w=800' },
    { id: 'cl-des-4', title: 'Mesa de Jantar 4 Lugares', advertiser: 'Beatriz C.', category: 'Desapega JPA', neighborhood: 'Anil', description: 'Mesa de madeira com tampo de vidro. Acompanha 4 cadeiras estofadas. Pequenas marcas de uso.', timestamp: 'Há 4 dias', contactWhatsapp: '5521965439876', typeLabel: 'Venda', price: 'R$ 400,00', imageUrl: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=800' },
    { id: 'cl-des-5', title: 'Tênis de Corrida nº 42', advertiser: 'Ricardo S.', category: 'Desapega JPA', neighborhood: 'Freguesia', description: 'Use i apenas 3 vezes, ficou grande para mim. Marca Asics. Em estado de novo.', timestamp: 'Há 5 dias', contactWhatsapp: '5521954328765', typeLabel: 'Venda', price: 'R$ 250,00', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800' },

    // Bairros Adicionais para cobrir todo Jacarepaguá (18 itens totais por categoria nos banners)
    // Cidade de Deus
    { id: 'cl-cdd-1', title: 'Doação de Cesta de Alimentos', advertiser: 'Assoc. CDD', category: 'Doações em geral', neighborhood: 'Cidade de Deus', description: 'Apoio às famílias locais.', timestamp: 'Há 2h', contactWhatsapp: '5521911110000', typeLabel: 'Doação', imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800' },
    { id: 'cl-cdd-2', title: 'Vaga para Auxiliar de Limpeza', advertiser: 'Condomínio CDD', category: 'Empregos', neighborhood: 'Cidade de Deus', description: 'Trabalho imediato.', timestamp: 'Há 4h', contactWhatsapp: '5521922220000', typeLabel: 'CLT', imageUrl: 'https://images.unsplash.com/photo-1581578731522-745d05cb9704?q=80&w=800' },
    // Gardênia Azul
    { id: 'cl-gar-1', title: 'Apartamento para Alugar Gardênia', advertiser: 'Imobiliária Azul', category: 'Imóveis Comerciais', neighborhood: 'Gardênia Azul', description: 'Próximo à praia.', timestamp: 'Há 6h', contactWhatsapp: '5521933330000', typeLabel: 'Aluguel', price: 'R$ 1.200', imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800' },
    { id: 'cl-gar-2', title: 'Vendo Fogão 4 Bocas', advertiser: 'Sandra G.', category: 'Desapega JPA', neighborhood: 'Gardênia Azul', description: 'Funcionando bem.', timestamp: 'Ontem', contactWhatsapp: '5521944440000', typeLabel: 'Venda', price: 'R$ 150', imageUrl: 'https://images.unsplash.com/photo-1584990344616-3b94b3c59230?q=80&w=800' },
    // Praça Seca
    { id: 'cl-prs-1', title: 'Cachorrinho Filhote Adoção', advertiser: 'Abrigo Seca', category: 'Adoção de pets', neighborhood: 'Praça Seca', description: 'Resgatado na praça.', timestamp: 'Há 1 dia', contactWhatsapp: '5521955550000', typeLabel: 'Adoção', imageUrl: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?q=80&w=800' },
    { id: 'cl-prs-2', title: 'Serviço de Manicure Express', advertiser: 'Studio Seca', category: 'Orçamento de Serviços', neighborhood: 'Praça Seca', description: 'Atendimento domiciliar.', timestamp: 'Há 2 dias', contactWhatsapp: '5521966660000', typeLabel: 'Serviço', imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=800' },
];

export const MOCK_REAL_ESTATE_PROPERTIES: RealEstateProperty[] = [
  // Residencial (5)
  {
    id: 'res-1', type: 'Residencial', title: 'Apartamento 2 Quartos na Freguesia', description: 'Excelente apartamento com varanda, sol da manhã, em condomínio com infraestrutura completa. Próximo a comércios e transporte.', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800',
    neighborhood: 'Freguesia', price: 350000, transaction: 'venda', area: 65, postedAt: 'Há 2 dias',
    bedrooms: 2, bathrooms: 2, parkingSpaces: 1, propertyTypeRes: 'Apartamento', condoFee: 650, isFurnished: false, petsAllowed: true,
  },
  {
    id: 'res-2', type: 'Residencial', title: 'Casa Duplex em Condomínio na Taquara', description: 'Casa espaçosa com 3 suítes, piscina privativa e área gourmet. Condomínio fechado com segurança 24h.', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800',
    neighborhood: 'Taquara', price: 890000, transaction: 'venda', area: 180, postedAt: 'Há 1 semana',
    bedrooms: 3, bathrooms: 4, parkingSpaces: 2, propertyTypeRes: 'Casa', condoFee: 800, isFurnished: false, petsAllowed: true,
  },
  {
    id: 'res-3', type: 'Residencial', title: 'Kitnet/Studio Mobiliado no Pechincha', description: 'Ótima kitnet para solteiros ou casais. Totalmente mobiliada, pronta para morar. Próximo ao Center Shopping.', image: 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?q=80&w=800',
    neighborhood: 'Pechincha', price: 1200, transaction: 'aluguel', area: 30, postedAt: 'Há 5 horas',
    bedrooms: 1, bathrooms: 1, parkingSpaces: 0, propertyTypeRes: 'Kitnet/Studio', condoFee: 300, isFurnished: true, petsAllowed: false,
  },
  {
    id: 'res-4', type: 'Residencial', title: 'Cobertura com Vista Livre no Anil', description: 'Cobertura duplex com piscina, churrasqueira e vista deslumbrante para as montanhas. 3 quartos sendo 2 suítes.', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800',
    neighborhood: 'Anil', price: 1100000, transaction: 'venda', area: 150, postedAt: 'Há 1 mês',
    bedrooms: 3, bathrooms: 3, parkingSpaces: 2, propertyTypeRes: 'Cobertura', condoFee: 1100, isFurnished: false, petsAllowed: true,
  },
  {
    id: 'res-5', type: 'Residencial', title: 'Apartamento para Alugar na Freguesia', description: 'Apartamento de 1 quarto bem localizado, ideal para quem busca praticidade. Prédio com elevador e portaria.', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=800',
    neighborhood: 'Freguesia', price: 1500, transaction: 'aluguel', area: 45, postedAt: 'Ontem',
    bedrooms: 1, bathrooms: 1, parkingSpaces: 1, propertyTypeRes: 'Apartamento', condoFee: 500, isFurnished: true, petsAllowed: false,
  },

  // Comercial (5)
  {
    id: 'com-1', type: 'Comercial', title: 'Sala Comercial no Quality Shopping', description: 'Sala de 35m² com banheiro privativo e 1 vaga. Prédio com total infraestrutura e segurança.', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800',
    neighborhood: 'Freguesia', price: 1600, transaction: 'aluguel', area: 35, postedAt: 'Há 1 dia',
    propertyTypeCom: 'Sala comercial', hasBathroom: true, parkingSpaces: 1, buildingName: 'Quality Shopping',
  },
  {
    id: 'com-2', type: 'Comercial', title: 'Loja de Rua na Estrada dos Três Rios', description: 'Loja com 100m² de frente para a rua. Ponto com grande movimento de pedestres e veículos.', image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?q=80&w=800',
    neighborhood: 'Freguesia', price: 8000, transaction: 'aluguel', area: 100, postedAt: 'Há 3 dias',
    propertyTypeCom: 'Loja', hasBathroom: true, parkingSpaces: 0,
  },
  {
    id: 'com-3', type: 'Comercial', title: 'Galpão na Taquara', description: 'Galpão com 500m², pé-direito de 8m e acesso para caminhões. Ideal para logística ou pequena indústria.', image: 'https://images.unsplash.com/photo-1587022205345-66b3e6486d3b?q=80&w=800',
    neighborhood: 'Taquara', price: 12000, transaction: 'aluguel', area: 500, postedAt: 'Há 2 semanas',
    propertyTypeCom: 'Galpão', highCeiling: true, loadingAccess: true,
  },
  {
    id: 'com-4', type: 'Comercial', title: 'Andar Corporativo para Venda', description: 'Andar inteiro com 300m² em prédio comercial moderno no Pechincha. Várias salas, copa e banheiros.', image: 'https://images.unsplash.com/photo-1600880292203-942bb68b2438?q=80&w=800',
    neighborhood: 'Pechincha', price: 1500000, transaction: 'venda', area: 300, postedAt: 'Há 1 mês',
    propertyTypeCom: 'Andar/Conjunto', hasBathroom: true, parkingSpaces: 4, buildingName: 'Pechincha Corporate',
  },
  {
    id: 'com-5', type: 'Comercial', title: 'Vende-se Terreno Comercial na Curicica', description: 'Terreno plano de 1000m² em via principal, próximo ao BRT. Ótimo para construção de lojas ou galpão.', image: 'https://images.unsplash.com/photo-1599814472223-3b1051591f?q=80&w=800',
    neighborhood: 'Curicica', price: 2000000, transaction: 'venda', area: 1000, postedAt: 'Há 1 semana',
    propertyTypeCom: 'Terreno comercial',
  },
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
    description: 'Onde encontrar the melhor serviço? Peça e dê dicas para seus vizinhos.',
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
    imageUrl: 'https://images.unsplash.com/photo-1585659722982-789600c7690a?q=80&w=600&auto=format&fit=crop'
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
