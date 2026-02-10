
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
  Lock, Coins, HeartHandshake
} from 'lucide-react';
import { AdType, Category, Store, Story, EditorialCollection, Job, CommunityPost, NeighborhoodCommunity, Classified, RealEstateProperty } from '../types';
import { getStoreLogo } from '@/utils/mockLogos';


export const CATEGORIES: Category[] = [
  { id: 'cat-alimentacao', name: 'Alimentação', slug: 'alimentacao', icon: <Soup />, color: 'bg-brand-blue' },
  { id: 'cat-mercado', name: 'Mercado', slug: 'mercado', icon: <ShoppingCart />, color: 'bg-brand-blue' },
  { id: 'cat-saude', name: 'Saúde', slug: 'saude', icon: <Heart />, color: 'bg-brand-blue' },
  { id: 'cat-farmacia', name: 'Farmácia', slug: 'farmacia', icon: <Pill />, color: 'bg-brand-blue' },
  { id: 'cat-beleza', name: 'Beleza', slug: 'beleza', icon: <Scissors />, color: 'bg-brand-blue' },
  { id: 'cat-moda', name: 'Moda', slug: 'moda', icon: <Shirt />, color: 'bg-brand-blue' },
  { id: 'cat-pets', name: 'Pets', slug: 'pets', icon: <PawPrint />, color: 'bg-brand-blue' },
  { id: 'cat-servicos', name: 'Serviços', slug: 'servicos', icon: <Wrench />, color: 'bg-brand-blue' },
  { id: 'cat-autos', name: 'Autos', slug: 'autos', icon: <CarFront />, color: 'bg-brand-blue' },
  { id: 'cat-educacao', name: 'Educação', slug: 'educacao', icon: <BookOpen />, color: 'bg-brand-blue' },
  { id: 'cat-esportes', name: 'Esportes', slug: 'esportes', icon: <Dumbbell />, color: 'bg-brand-blue' },
  { id: 'cat-eventos', name: 'Eventos', slug: 'eventos', icon: <PartyPopper />, color: 'bg-brand-blue' },
  { id: 'cat-lazer', name: 'Lazer', slug: 'lazer', icon: <Tent />, color: 'bg-brand-blue' },
  { id: 'cat-casa', name: 'Casa', slug: 'casa', icon: <HomeIcon />, color: 'bg-brand-blue' },
  { id: 'cat-informatica', name: 'Informática', slug: 'informatica', icon: <Monitor />, color: 'bg-brand-blue' },
  { id: 'cat-condominio', name: 'Condomínios', slug: 'condominios', icon: <Building2 />, color: 'bg-brand-blue' },
  { id: 'cat-servicos-publicos', name: 'Serviços Públicos', slug: 'servicos-publicos', icon: <Landmark />, color: 'bg-brand-blue' },
  { id: 'cat-financeiro', name: 'Financeiro & Seguros', slug: 'financeiro', icon: <Coins />, color: 'bg-brand-blue' },
  { id: 'cat-kids', name: 'Kids', slug: 'kids', icon: <Gamepad2 />, color: 'bg-brand-blue' },
  { id: 'cat-idosos', name: 'Pessoas Idosas', slug: 'idosos', icon: <HeartHandshake />, color: 'bg-brand-blue' },
  { id: 'cat-bemestar', name: 'Bem-estar', slug: 'bem-estar', icon: <Smile />, color: 'bg-brand-blue' },
  { id: 'cat-cupom', name: 'Cupom', slug: 'cupom', icon: <Ticket />, color: 'bg-brand-blue' },
];

export const SUBCATEGORIES: Record<string, { name: string; icon: React.ReactNode }[]> = {
  'Serviços': [
    { name: 'Elétrica', icon: <Zap /> },
    { name: 'Hidráulica', icon: <Droplets /> },
    { name: 'Chaveiro', icon: <Key /> },
    { name: 'Marido de Aluguel', icon: <Hammer /> },
    { name: 'Pintura', icon: <PaintRoller /> },
    { name: 'Limpeza', icon: <Sparkles /> },
    { name: 'Jardinagem', icon: <Leaf /> },
    { name: 'Montagem de Móveis', icon: <Settings /> },
  ],
  'Alimentação': [
    { name: 'Marmitas', icon: <Package /> },
    { name: 'Lanches', icon: <Sandwich /> },
    { name: 'Doces', icon: <Cake /> },
    { name: 'Salgados', icon: <Croissant /> },
    { name: 'Comida Caseira', icon: <Soup /> },
    { name: 'Bebidas', icon: <Beer /> },
    { name: 'Produtos Naturais', icon: <Apple /> },
    { name: 'Congelados', icon: <Package /> },
  ],
  'Restaurantes': [
    { name: 'Pizzarias', icon: <Pizza /> },
    { name: 'Hamburguerias', icon: <Beef /> },
    { name: 'Brasileira', icon: <Utensils /> },
    { name: 'Japonesa', icon: <Globe2 /> },
    { name: 'Italiana', icon: <Pizza /> },
    { name: 'Árabe', icon: <Globe /> },
    { name: 'Self-service', icon: <Utensils /> },
    { name: 'Delivery', icon: <Bike /> },
  ],
  'Mercados': [
    { name: 'Supermercados', icon: <ShoppingCart /> },
    { name: 'Mercadinhos', icon: <StoreIcon /> },
    { name: 'Hortifruti', icon: <Apple /> },
    { name: 'Açougue', icon: <Beef /> },
    { name: 'Peixaria', icon: <Globe /> },
    { name: 'Conveniência', icon: <Clock /> },
    { name: 'Bebidas', icon: <Beer /> },
    { name: 'Importados', icon: <Globe2 /> },
  ],
  'Farmácias': [
    { name: 'Farmácias', icon: <Pill /> },
    { name: 'Manipulados', icon: <Microscope /> },
    { name: 'Materiais Médicos', icon: <Stethoscope /> },
  ],
  'Autos': [
    { name: 'Carro', icon: <CarFront /> },
    { name: 'Moto', icon: <Bike /> },
    { name: 'Oficinas', icon: <Wrench /> },
    { name: 'Elétrica', icon: <Zap /> },
    { name: 'Lava Jato', icon: <Droplets /> },
    { name: 'Borracharia', icon: <Circle /> },
    { name: 'Guincho', icon: <Truck /> },
    { name: 'Peças', icon: <Settings /> },
    { name: 'Estética', icon: <Sparkles /> },
    { name: 'Acessórios', icon: <Star /> },
  ],
  'Moda': [
    { name: 'Feminina', icon: <Shirt /> },
    { name: 'Masculina', icon: <User /> },
    { name: 'Infantil', icon: <Baby /> },
    { name: 'Camisas', icon: <Shirt /> },
    { name: 'Calças', icon: <LayoutGrid /> },
    { name: 'Vestidos', icon: <Star /> },
    { name: 'Shorts', icon: <LayoutGrid /> },
    { name: 'Jeans', icon: <LayoutGrid /> },
    { name: 'Moda Íntima', icon: <Heart /> },
    { name: 'Moda Fitness', icon: <Dumbbell /> },
    { name: 'Moda Plus Size', icon: <User /> },
    { name: 'Calçados', icon: <Package /> },
    { name: 'Acessórios', icon: <Star /> },
  ],
  'Beleza': [
    { name: 'Salão de Cabelo', icon: <Scissors /> },
    { name: 'Manicure', icon: <Handshake /> },
    { name: 'Estética Facial', icon: <Sparkles /> },
    { name: 'Estética Corporal', icon: <User /> },
    { name: 'Barbearia', icon: <Scissors /> },
    { name: 'Maquiagem', icon: <Palette /> },
    { name: 'Depilação', icon: <Sparkles /> },
    { name: 'Massagem', icon: <Heart /> },
  ],
  'Casa': [
    { name: 'Móveis', icon: <Sofa /> },
    { name: 'Decoração', icon: <Palette /> },
    { name: 'Iluminação', icon: <Lightbulb /> },
    { name: 'Utensílios', icon: <Utensils /> },
    { name: 'Cama Mesa Banho', icon: <LayoutGrid /> },
    { name: 'Jardinagem', icon: <Flower /> },
    { name: 'Construção', icon: <Hammer /> },
    { name: 'Eletrodomésticos', icon: <Zap /> },
  ],
  'Informática': [
    { name: 'Assistência Técnica', icon: <Wrench /> },
    { name: 'Computadores', icon: <Monitor /> },
    { name: 'Celulares', icon: <Smartphone /> },
    { name: 'Acessórios', icon: <Headphones /> },
    { name: 'Redes', icon: <Wifi /> },
    { name: 'Impressoras', icon: <Printer /> },
    { name: 'Formatação', icon: <Settings /> },
    { name: 'Suporte Técnico', icon: <HelpCircle /> },
  ],
  'Pets': [
    { name: 'Pet Shop', icon: <ShoppingCart /> },
    { name: 'Banho e Tosa', icon: <Scissors /> },
    { name: 'Veterinário', icon: <Stethoscope /> },
    { name: 'Adestramento', icon: <Award /> },
    { name: 'Hospedagem', icon: <HomeIcon /> },
    { name: 'Passeador de Pets', icon: <User /> },
    { name: 'Cuidador de Pets', icon: <Heart /> },
    { name: 'Pets Perdidos', icon: <Search /> },
  ],
  'Saúde': [
    { name: 'Clínicas', icon: <Building2 /> },
    { name: 'Dentistas', icon: <Smile /> },
    { name: 'Psicologia', icon: <Brain /> },
    { name: 'Fisioterapia', icon: <Activity /> },
    { name: 'Exames e Diagnósticos', icon: <Microscope /> },
    { name: 'Nutrição', icon: <Apple /> },
    { name: 'Terapias Alternativas', icon: <Sparkles /> },
    { name: 'Saúde Preventiva', icon: <Shield /> },
  ],
  'Educação': [
    { name: 'Escolas', icon: <Building2 /> },
    { name: 'Cursos Livres', icon: <GraduationCap /> },
    { name: 'Idiomas', icon: <Globe /> },
    { name: 'Reforço Escolar', icon: <Edit3 /> },
    { name: 'Aulas Particulares', icon: <User /> },
    { name: 'Profissionalizantes', icon: <Briefcase /> },
    { name: 'Informática', icon: <Monitor /> },
    { name: 'Preparatórios', icon: <BookOpen /> },
  ],
};

export const ALL_TAGS = [
  'tênis', 'camisa', 'camiseta', 'calça', 'bermuda', 'vestido', 'saia', 'moletom', 'jaqueta', 'roupa social', 'roupa feminina', 'roupa masculina',
  'relógio', 'óculos', 'bolsa', 'mochila', 'cinto', 'pulseira', 'colar', 'boné',
  'ração', 'banho e tosa', 'brinquedo pet', 'coleira', 'petiscos', 'veterinário', 'adestramento', 'transporte pet',
  'corte de cabelo', 'manicure', 'pedicure', 'maquiagem', 'estética facial', 'sobrancelha', 'depilação', 'hidratação capilar',
  'troca de óleo', 'alinhamento', 'balanceamento', 'revisão automotiva', 'lava jato', 'auto elétrica', 'funilaria', 'vistoria veicular',
  'clínica médica', 'dentista', 'psicologia', 'fisioterapia', 'exames laboratoriais', 'nutrição', 'terapias alternativas', 'saúde preventiva',
  'eletricista', 'encanador', 'pedreiro', 'pintor', 'chaveiro', 'montagem de móveis', 'limpeza residencial', 'manutenção geral'
];

const IMG_IDS: Record<string, string[]> = {
  'Alimentação': ['1504674900247-0877df9cc836', '1555939594-58d7cb561ad1', '1565299624946-b28f40a0ae38', '1567620905732-2d1ec7ab7445', '1467003909585-63c6385cdb26', '1540189549336-e6e99c3679fe', '1568901346375-23c9450c58cd', '1484723091739-30a097e8f929'],
  'Pets': ['1516734212186-a967f81ad0d7', '1543466835-00a7907e9de1', '1537151608828-ea2b11777ee8', '1514888286974-6c27e9cce25b', '1583511655857-d19b40a7a54e', '1583337130417-3346a1be7dee'],
  'Saúde': ['1579684385127-1ef15d508118', '1584515933487-9d317552d894', '1576091160399-112ba8d25d1d', '1551076805-e2983fe3600c'],
  'Serviços': ['1581578731117-10d52b4d8051', '1621905251189-08b45d6a269e', '1504328345606-18aff0858706', '1584622024886-0a02091d3744'],
  'Beleza': ['1560066984-118c38b64a75', '1522337660859-02fbefca4702', '1562322140-8baeececf3df', '1616394584738-fc6e612e71b9'],
  'Autos': ['1486262715619-67b85e0b08d3', '1492144534655-ae79c964c9d7', '1562920618-971c26b268b6', '1503376763036-066120622c74'],
  'Mercados': ['1542838132-92c53300491e', '1578916171728-566855ce2dce', '1583258292688-d0213dc5a3a8', '1534723452202-428aae1ad99d'],
  'Casa': ['1556228453-efd6c1ff04f6', '1583847268964-b8bc40f9e2b8', '1513694203232-719a280e022f', '1493809842364-78817add7ffb'],
  'Esportes': ['1534438327276-14e5300c3a48', '1517836357463-c25dfe9495ac', '1574680096141-1c5700243a36', '1571902943202-507ec2618e8f'],
  'Lazer': ['1514525253361-bee23e63d890', '1470225620780-dba8ba36b745', '1533174072545-a8cd56c24385', '1564057865243-d343468b8d0e'],
  'Educação': ['1503676260728-1c00da094a0b', '1524178232363-1fb2b075b655', '1497633762265-9d179a990aa6', '1523240795612-9a054b0db644'],
  'Farmácia': ['1585435557343-3b092031a831', '1631549733277-628f3281783f', '1576602976047-1743ef509a18', '1587854692152-cbe660dbbb88'],
  'Moda': ['1445205170230-053b83016050', '1512436991641-6745cdb1723f', '1483985988355-763728e1935b', '1515886657613-9f3515b0c78f'],
  'Eventos': ['1511632765486-a01980e01a18', '1492684223066-81342ee5ff30', '1533174072545-a8cd56c24385', '1514525253361-bee23e63d890'],
  'Condomínios': ['1560518883-ce09059eeffa', '1486406146926-c627a92ad1ab', '1460317442991-08cf2a256144', '1497366811353-6870744d04b2']
};

const generateFakeStores = () => {
    const allStores: Store[] = [];
    const hoods = ["Freguesia", "Anil", "Taquara", "Pechincha", "Tanque", "Curicica"];
    const modifiers = ["Gourmet", "Express", "da Villa", "Master", "do Bairro", "Central"];

    Object.entries(SUBCATEGORIES).forEach(([catName, subs]) => {
        subs.forEach(sub => {
            for (let i = 1; i <= 6; i++) {
                const isSponsored = i <= 3;
                const hood = hoods[i % hoods.length];
                const rating = 4.2 + (Math.random() * 0.8);
                const catImages = IMG_IDS[catName] || ['1557804506-669a67965ba0', '1568901346375-23c9450c58cd'];
                const imgId = catImages[i % catImages.length];

                let storeTags: string[] = [];
                if (catName === 'Moda') storeTags = ['tênis', 'camisa', 'calça', 'vestido'].sort(() => 0.5 - Math.random()).slice(0, 3);
                else if (catName === 'Pets') storeTags = ['ração', 'banho e tosa', 'veterinário'].sort(() => 0.5 - Math.random()).slice(0, 2);
                else if (catName === 'Beleza') storeTags = ['corte de cabelo', 'manicure', 'maquiagem'].sort(() => 0.5 - Math.random()).slice(0, 2);
                else if (catName === 'Autos') storeTags = ['troca de óleo', 'lava jato', 'alinhamento'].sort(() => 0.5 - Math.random()).slice(0, 2);
                else if (catName === 'Saúde') storeTags = ['dentista', 'fisioterapia', 'exames laboratoriais'].sort(() => 0.5 - Math.random()).slice(0, 2);
                else if (catName === 'Serviços') storeTags = ['eletricista', 'encanador', 'chaveiro'].sort(() => 0.5 - Math.random()).slice(0, 2);

                allStores.push({
                    id: `fake-${catName.toLowerCase()}-${sub.name.toLowerCase().replace(/\s+/g,'-')}-${i}`,
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
                    isOpenNow: Math.random() > 0.2,
                    logoUrl: getStoreLogo(i * 100),
                    tags: storeTags
                });
            }
        });
    });
    return allStores;
};

const BASE_STORES: Store[] = [
  {
    id: 'grupo-esquematiza',
    name: 'Grupo Esquematiza',
    category: 'Serviços',
    subcategory: 'Segurança',
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
    isSponsored: true,
    tags: ['segurança', 'limpeza residencial', 'manutenção geral']
  },
  { id: 'f-1', name: 'Bibi Lanches', category: 'Alimentação', subcategory: 'Lanches & Hamburguerias', rating: 4.8, distance: 'Freguesia', adType: AdType.PREMIUM, description: 'Lanches clássicos e saudáveis.', isSponsored: true, image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=600&auto=format&fit=crop', tags: [] },
  { id: 'f-2', name: 'Studio Hair Vip', category: 'Beleza', subcategory: 'Salão de Cabelo', rating: 4.9, distance: 'Taquara', adType: AdType.PREMIUM, description: 'Especialista em loiros e cortes modernos.', isSponsored: true, image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&auto=format&fit=crop', tags: ['corte de cabelo', 'hidratação capilar'] },
  { id: 'f-3', name: 'Pet Shop Alegria', category: 'Pets', subcategory: 'Pet Shop', rating: 4.7, distance: 'Pechincha', adType: AdType.PREMIUM, description: 'O carinho que seu pet merece.', isSponsored: true, image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=600&auto=format&fit=crop', tags: ['ração', 'brinquedo pet'] },
  { id: 'f-4', name: 'Mecânica 24h', category: 'Autos', subcategory: 'Oficinas Mecânicas', rating: 4.5, distance: 'Anil', adType: AdType.PREMIUM, description: 'Socorro mecânico a qualquer hora.', isSponsored: true, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600&auto=format&fit=crop', tags: ['troca de óleo', 'balanceamento'] },
  { id: 'f-5', name: 'Pizzaria do Zé', category: 'Alimentação', subcategory: 'Pizzarias', rating: 4.6, distance: 'Freguesia', adType: AdType.PREMIUM, description: 'Pizza no forno a lenha.', isSponsored: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop', tags: [] },
  { id: 'f-6', name: 'Açaí da Praça', category: 'Alimentação', subcategory: 'Doces & Sobremesas', rating: 4.9, distance: 'Tanque', adType: AdType.PREMIUM, description: 'O melhor açaí da região.', isSponsored: true, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=600&auto=format&fit=crop', tags: [] },
  { id: 'f-7', name: 'Drogaria JPA', category: 'Farmácia', subcategory: 'Medicamentos', rating: 4.4, distance: 'Freguesia', adType: AdType.PREMIUM, description: 'Medicamentos e perfumaria.', isSponsored: true, image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?q=80&w=600&auto=format&fit=crop', tags: [] },
  { id: 'f-8', name: 'Academia FitBairro', category: 'Esportes', subcategory: 'Academias', rating: 4.7, distance: 'Taquara', adType: AdType.PREMIUM, description: 'Treine perto de casa.', isSponsored: true, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop', tags: [] },
  { id: 'f-9', name: 'Consultório Dra. Ana', category: 'Saúde', subcategory: 'Dentistas', rating: 5.0, distance: 'Freguesia', adType: AdType.PREMIUM, description: 'Cuidado completo com seu sorriso.', isSponsored: true, image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&auto=format&fit=crop', tags: ['dentista', 'saúde preventiva'] },
  { id: 'f-10', name: 'Boutique Chic', category: 'Moda', subcategory: 'Moda Feminina', rating: 4.3, distance: 'Anil', adType: AdType.PREMIUM, description: 'Tendências e elegância.', isSponsored: true, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop', tags: ['vestido', 'bolsa'] },
];

export const STORES: Store[] = [
  ...BASE_STORES,
  ...generateFakeStores()
];

export const CATEGORY_TOP_BANNERS: Record<string, Record<string, { image: string; storeId: string }[]>> = {
  'comida': {
    'Freguesia': [
      { image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800', storeId: 'f-5' },
      { image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=800', storeId: 'f-1' }
    ],
    'Taquara': [
      { image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800', storeId: 'fake-comida-0' },
      { image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800', storeId: 'fake-comida-1' }
    ]
  },
  'beleza': {
    'Taquara': [
      { image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=800', storeId: 'f-2' },
      { image: 'https://images.unsplash.com/photo-1560066984-118c38b64a75?q=80&w=800', storeId: 'fake-beleza-0' }
    ],
    'Freguesia': [
      { image: 'https://images.unsplash.com/photo-1521590832167-7ce633395e39?q=80&w=800', storeId: 'fake-beleza-1' },
      { image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=800', storeId: 'fake-beleza-2' }
    ]
  },
  'pets': {
    'Pechincha': [
      { image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800', storeId: 'f-3' },
      { image: 'https://images.unsplash.com/photo-1524511751214-b0a384dd932d?q=80&w=800', storeId: 'fake-pets-0' }
    ],
    'Freguesia': [
      { image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800', storeId: 'fake-pets-1' },
      { image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=800', storeId: 'fake-pets-2' }
    ]
  }
};

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
    { id: 'cl-serv-1', title: 'Eletricista Residencial 24h', advertiser: 'Sérgio Luz', category: 'Serviços', neighborhood: 'Freguesia', description: 'Atendo emergências, curto-circuito, troca de disjuntor. Orçamento rápido pelo WhatsApp.', timestamp: 'Há 15 min', contactWhatsapp: '5521999991111', typeLabel: 'Serviço', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800' },
    { id: 'cl-im-1', title: 'Alugo Sala Comercial 40m²', advertiser: 'JPA Imóveis', category: 'Imóveis Comerciais', neighborhood: 'Pechincha', description: 'Sala comercial em prédio com portaria. Sol da manhã, 1 vaga. Ideal para consultório.', timestamp: 'Há 3h', contactWhatsapp: '5521977773333', typeLabel: 'Aluguel', price: 'R$ 1.800/mês', imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800' },
];

export const MOCK_REAL_ESTATE_PROPERTIES: RealEstateProperty[] = [
  {
    id: 'res-1', type: 'Residencial', title: 'Apartamento 2 Quartos na Freguesia', description: 'Excelente apartamento com varanda, sol da manhã, em condomínio com infraestrutura completa.', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800',
    neighborhood: 'Freguesia', price: 350000, transaction: 'venda', area: 65, postedAt: 'Há 2 dias',
    bedrooms: 2, bathrooms: 2, parkingSpaces: 1, propertyTypeRes: 'Apartamento', condoFee: 650, isFurnished: false, petsAllowed: true,
  },
];

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
    content: 'Alguém conhece um chaveiro de confiança na Freguesia?',
    type: 'recommendation',
    communityId: 'comm-tips',
    neighborhood: 'Freguesia',
    timestamp: '2h',
    likes: 8,
    comments: 16
  },
];
