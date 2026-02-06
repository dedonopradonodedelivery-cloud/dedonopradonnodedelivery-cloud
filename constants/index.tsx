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
  Meh, ThumbsDown, Gift, RefreshCw
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
  'Comida': ['1504674900247-0877df9cc836', '1555939594-58d7cb561ad1', '1565299624946-b28f40a0ae38', '1567620905732-2d1ec7ab7445', '1467003909585-63c6385cdb26', '1540189549336-e6e99c3679fe', '1568901346375-23c9450c58cd', '1484723091739-30a097e8f929'],
  'Pets': ['1516734212186-a967f81ad0d7', '1543466835-00a7907e9de1', '1537151608828-ea2b11777ee8', '1514888286974-6c27e9cce25b', '1583511655857-d19b40a7a54e', '1583337130417-3346a1be7dee'],
  'Profissionais': ['1556761175-5973dc0f32e7', '1542744173-8e7e53415bb0', '1507679799938-d738f46fbcfc', '1521791136064-7986c292027b'],
  'Saúde': ['1579684385127-1ef15d508118', '1584515933487-9d317552d894', '1576091160399-112ba8d25d1d', '1551076805-e2983fe3600c'],
  'Serviços': ['1581578731117-10d52b4d8051', '1621905251189-08b45d6a269e', '1504328345606-18aff0858706', '1584622024886-0a02091d3744'],
  'Beleza': ['1560066984-118c38b64a75', '1522337660859-02fbefca4702', '1562322140-8baeececf3df', '1616394584738-fc6e612e71b9'],
  'Autos': ['1486262715619-67b85e0b08d3', '1492144534655-ae79c964c9d7', '1562920618-971c26b268b6', '1503376763036-066120622c74'],
  'Mercado': ['1542838132-92c53300491e', '1578916171728-566855ce2dce', '1583258292688-d0213dc5a3a8', '1534723452202-428aae1ad99d'],
  'Casa': ['1556228453-efd6c1ff04f6', '1583847268964-b8bc40f9e2b8', '1513694203232-719a280e022f', '1493809842364-78817add7ffb'],
  'Esportes': ['1534438327276-14e5300c3a48', '1517836357463-c25dfe9495ac', '1574680096141-1c5700243a36', '1571902943202-507ec2618e8f'],
  'Lazer': ['1514525253361-bee23e63d890', '1470225620780-dba8ba36b745', '1533174072545-a8cd56c24385', '1564057865243-d343468b8d0e'],
  'Educação': ['1503676260728-1c00da094a0b', '1524178232363-1fb2b075b655', '1497633762265-9d179a990aa6', '1523240795612-9a054b0db644'],
  'Farmácia': ['1585435557343-3b092031a831', '1631549733277-628f3281783f', '1576602976047-1743ef509a18', '1587854692152-cbe660dbbb88'],
  'Moda': ['1445205170230-053b83016050', '1512436991641-6745cdb1723f', '1483985988355-763728e1935b', '1515886657613-9f3515b0c78f'],
  'Eventos': ['1511632765486-a01980e01a18', '1492684223066-81342ee5ff30', '1533174072545-a8cd56c24385', '1514525253361-bee23e63d890'],
  'Condomínio': ['1560518883-ce09059eeffa', '1486406146926-c627a92ad1ab', '1460317442991-08cf2a256144', '1497366811353-6870744d04b2']
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
                else if (catName === 'Serviços' || catName === 'Profissionais') storeTags = ['eletricista', 'encanador', 'chaveiro'].sort(() => 0.5 - Math.random()).slice(0, 2);

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
                    isOpenNow: Math.random() > 0.2,
                    logoUrl: getStoreLogo(i * 100),
                    tags: storeTags
                });
            }
        });
    });
    return allStores;
};

export const STORES: Store[] = [
  ...generateFakeStores()
];
