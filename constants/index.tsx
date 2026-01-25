
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
import { AdType, Category, Store, Story, EditorialCollection, Job, CommunityPost, NeighborhoodCommunity } from '../types';

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
    { name: 'Peças & Accessories', icon: <Package /> },
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

const IMG_IDS: Record<string, string> = {
  'Comida': '1504674900247-0877df9cc836',
  'Pets': '1516734212186-a967f81ad0d7',
  'Pro': '1486312338219-ce68d2c6f44d',
  'Saúde': '1588776814546-1ffcf47267a5',
  'Serviços': '1454165804606-c3d57bc86b40',
  'Beleza': '1562322140-8baeececf3df',
  'Autos': '1486262715619-67b85e0b08d3',
  'Mercado': '1587854692152-cbe660dbbb88',
  'Casa': '1524661135-423995f22d0b',
  'Esportes': '1534438327276-14e5300c3a48',
  'Lazer': '1517457373958-b7bdd4587205',
  'Educação': '1556761175-5973dc0f32e7',
  'Farmácia': '1587854692152-cbe660dbbb88',
  'Moda': '1441986300917-64674bd600d8',
  'Eventos': '1511632765486-a01980e01a18',
  'Condomínio': '1570129477492-45c003edd2be'
};

const generateFakeStores = () => {
    const allStores: Store[] = [];
    const hoods = ["Freguesia", "Anil", "Taquara", "Pechincha", "Tanque", "Curicica"];
    const modifiers = ["Gourmet", "Express", "da Villa", "Master", "do Bairro", "Central"];

    Object.entries(SUBCATEGORIES).forEach(([catName, subs]) => {
        subs.forEach(sub => {
            // Gerar 6 lojas por subcategoria
            for (let i = 1; i <= 6; i++) {
                const isSponsored = i <= 3; // Primeiras 3 patrocinadas
                const hood = hoods[i % hoods.length];
                const rating = 4.2 + (Math.random() * 0.8);
                const imgId = IMG_IDS[catName] || '1557804506-669a67965ba0';

                allStores.push({
                    id: `fake-${catName}-${sub.name}-${i}`.replace(/\s+/g, '-').toLowerCase(),
                    name: `${sub.name} ${modifiers[i-1]}`,
                    category: catName,
                    subcategory: sub.name,
                    rating: parseFloat(rating.toFixed(1)),
                    reviewsCount: Math.floor(Math.random() * 500) + 20,
                    distance: `${hood} • RJ`,
                    neighborhood: hood,
                    adType: isSponsored ? AdType.PREMIUM : AdType.ORGANIC,
                    isSponsored: isSponsored,
                    description: `O melhor em ${sub.name.toLowerCase()} de toda a região de ${hood}. Venha conhecer!`,
                    image: `https://images.unsplash.com/photo-${imgId}?q=80&w=400&auto=format&fit=crop&sig=${sub.name}-${i}`,
                    verified: Math.random() > 0.4,
                    isOpenNow: Math.random() > 0.2
                });
            }
        });
    });
    return allStores;
};

// Dados Fixos de Lojas (Preservados para consistência)
const BASE_STORES: Store[] = [
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
  }
];

export const STORES: Store[] = [
  ...BASE_STORES,
  ...generateFakeStores()
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
