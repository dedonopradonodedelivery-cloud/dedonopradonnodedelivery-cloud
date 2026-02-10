
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
  Key, Fan, Truck, Shovel
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

// 🔹 LISTA DE 60 TAGS INICIAIS (OBRIGATÓRIAS)
export const ALL_TAGS = [
  // 👕 MODA
  'tênis', 'camisa', 'camiseta', 'calça', 'bermuda', 'vestido', 'saia', 'moletom', 'jaqueta', 'roupa social', 'roupa feminina', 'roupa masculina',
  // ⌚ ACESSÓRIOS
  'relógio', 'óculos', 'bolsa', 'mochila', 'cinto', 'pulseira', 'colar', 'boné',
  // 🐶 PET
  'ração', 'banho e tosa', 'brinquedo pet', 'coleira', 'petiscos', 'veterinário', 'adestramento', 'transporte pet',
  // 🧴 BELEZA
  'corte de cabelo', 'manicure', 'pedicure', 'maquiagem', 'estética facial', 'sobrancelha', 'depilação', 'hidratação capilar',
  // 🚗 AUTOS
  'troca de óleo', 'alinhamento', 'balanceamento', 'revisão automotiva', 'lava jato', 'auto elétrica', 'funilaria', 'vistoria veicular',
  // 🏥 SAÚDE
  'clínica médica', 'dentista', 'psicologia', 'fisioterapia', 'exames laboratoriais', 'nutrição', 'terapias alternativas', 'saúde preventiva',
  // 🛠️ SERVIÇOS GERAIS
  'eletricista', 'encanador', 'pedreiro', 'pintor', 'chaveiro', 'montagem de móveis', 'limpeza residencial', 'manutenção geral'
];

const IMG_IDS: Record<string, string[]> = {
  'Comida': [
    '1504674900247-0877df9cc836', '1555939594-58d7cb561ad1', '1565299624946-b28f40a0ae38', '1567620905732-2d1ec7ab7445', '1467003909585-63c6385cdb26', '1540189549336-e6e99c3679fe', '1568901346375-23c9450c58cd', '1484723091739-30a097e8f929'
  ],
  'Pets': [
    '1516734212186-a967f81ad0d7', '1543466835-00a7907e9de1', '1537151608828-ea2b11777ee8', '1514888286974-6c27e9cce25b', '1583511655857-d19b40a7a54e', '1583337130417-3346a1be7dee'
  ],
  'Profissionais': [
    '1556761175-5973dc0f32e7', '1542744173-8e7e53415bb0', '1507679799938-d738f46fbcfc', '1521791136064-7986c292027b'
  ],
  'Saúde': [
    '1579684385127-1ef15d508118', '1584515933487-9d317552d894', '1576091160399-112ba8d25d1d', '1551076805-e2983fe3600c'
  ],
  'Serviços': [
    '1581578731117-10d52b4d8051', '1621905251189-08b45d6a269e', '1504328345606-18aff0858706', '1584622024886-0a02091d3744'
  ],
  'Beleza': [
    '1560066984-118c38b64a75', '1522337660859-02fbefca4702', '1562322140-8baeececf3df', '1616394584738-fc6e612e71b9'
  ],
  'Autos': [
    '1486262715619-67b85e0b08d3', '1492144534655-ae79c964c9d7', '1562920618-971c26b268b6', '1503376763036-066120622c74'
  ],
  'Mercado': [
    '1542838132-92c53300491e', '1578916171728-566855ce2dce', '1583258292688-d0213dc5a3a8', '1534723452202-428aae1ad99d'
  ],
  'Casa': [
    '1556228453-efd6c1ff04f6', '1583847268964-b8bc40f9e2b8', '1513694203232-719a280e022f', '1493809842364-78817add7ffb'
  ],
  'Esportes': [
    '1534438327276-14e5300c3a48', '1517836357463-c25dfe9495ac', '1574680096141-1c5700243a36', '1571902943202-507ec2618e8f'
  ],
  'Lazer': [
    '1514525253361-bee23e63d890', '1470225620780-dba8ba36b745', '1533174072545-a8cd56c24385', '1564057865243-d343468b8d0e'
  ],
  'Educação': [
    '1503676260728-1c00da094a0b', '1524178232363-1fb2b075b655', '1497633762265-9d179a990aa6', '1523240795612-9a054b0db644'
  ],
  'Farmácia': [
    '1585435557343-3b092031a831', '1631549733277-628f3281783f', '1576602976047-1743ef509a18', '1587854692152-cbe660dbbb88'
  ],
  'Moda': [
    '1445205170230-053b83016050', '1512436991641-6745cdb1723f', '1483985988355-763728e1935b', '1515886657613-9f3515b0c78f'
  ],
  'Eventos': [
    '1511632765486-a01980e01a18', '1492684223066-81342ee5ff30', '1533174072545-a8cd56c24385', '1514525253361-bee23e63d890'
  ],
  'Condomínio': [
    '1560518883-ce09059eeffa', '1486406146926-c627a92ad1ab', '1460317442991-08cf2a256144', '1497366811353-6870744d04b2'
  ]
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
                const catImages = IMG_IDS[catName] || ['1557804506-669a67965ba0', '1568901346375-23c9450c58cd'];
                const imgId = catImages[i % catImages.length];

                // Lógica de Tags Fakes baseada na categoria
                let storeTags: string[] = [];
                if (catName === 'Moda') storeTags = ['tênis', 'camisa', 'vestido'].sort(() => 0.5 - Math.random()).slice(0, 3);
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
    isSponsored: true,
    tags: ['segurança', 'limpeza residencial', 'manutenção geral']
  },
  { id: 'f-1', name: 'Bibi Lanches', category: 'Comida', subcategory: 'Lanches & Hamburguerias', rating: 4.8, distance: 'Freguesia', adType: AdType.PREMIUM, description: 'Lanches clássicos e saudáveis.', isSponsored: true, image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=600&auto=format&fit=crop', tags: [] },
  { id: 'f-2', name: 'Studio Hair Vip', category: 'Beleza', subcategory: 'Salão de Cabelo', rating: 4.9, distance: 'Taquara', adType: AdType.PREMIUM, description: 'Especialista em loiros e cortes modernos.', isSponsored: true, image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&auto=format&fit=crop', tags: ['corte de cabelo', 'hidratação capilar'] },
  { id: 'f-3', name: 'Pet Shop Alegria', category: 'Pets', subcategory: 'Pet Shop', rating: 4.7, distance: 'Pechincha', adType: AdType.PREMIUM, description: 'O carinho que seu pet merece.', isSponsored: true, image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=600&auto=format&fit=crop', tags: ['ração', 'brinquedo pet'] },
  { id: 'f-4', name: 'Mecânica 24h', category: 'Autos', subcategory: 'Oficinas Mecânicas', rating: 4.5, distance: 'Anil', adType: AdType.PREMIUM, description: 'Socorro mecânico a qualquer hora.', isSponsored: true, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600&auto=format&fit=crop', tags: ['troca de óleo', 'balanceamento'] },
  { id: 'f-5', name: 'Pizzaria do Zé', category: 'Comida', subcategory: 'Pizzarias', rating: 4.6, distance: 'Freguesia', adType: AdType.PREMIUM, description: 'Pizza no forno a lenha.', isSponsored: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop', tags: [] },
  { id: 'f-6', name: 'Açaí da Praça', category: 'Comida', subcategory: 'Doces & Sobremesas', rating: 4.9, distance: 'Tanque', adType: AdType.PREMIUM, description: 'O melhor açaí da região.', isSponsored: true, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=600&auto=format&fit=crop', tags: [] },
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
  },
  'saude': {
    'Freguesia': [
      { image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800', storeId: 'f-9' },
      { image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800', storeId: 'fake-saude-0' }
    ]
  },
  'autos': {
    'Anil': [
      { image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800', storeId: 'f-10' },
      { image: 'https://images.unsplash.com/photo-1470309634658-8398b2cd0d23?q=80&w=800', storeId: 'fake-autos-0' }
    ],
    'Freguesia': [
      { image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800', storeId: 'fake-moda-1' },
      { image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800', storeId: 'fake-moda-2' }
    ]
  },
  'mercado': {
    'Freguesia': [
      { image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?q=80&w=800', storeId: 'f-7' },
      { image: 'https://images.unsplash.com/photo-1534723452202-428aae1ad99d?q=80&w=800', storeId: 'fake-mercado-0' }
    ]
  },
  'esportes': {
    'Taquara': [
      { image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800', storeId: 'f-8' },
      { image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800', storeId: 'fake-esportes-0' }
    ]
  },
  'servicos': {
    'Freguesia': [
      { image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800', storeId: 'grupo-esquematiza' },
      { image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800', storeId: 'fake-servicos-0' }
    ]
  },
  'casa': {
    'Freguesia': [
      { image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800', storeId: 'fake-casa-0' },
      { image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800', storeId: 'fake-casa-1' }
    ]
  },
  'profissionais': {
    'Freguesia': [
      { image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800', storeId: 'fake-pro-0' },
      { image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800', storeId: 'fake-pro-1' }
    ]
  },
  'lazer': {
    'Freguesia': [
      { image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800', storeId: 'fake-lazer-0' },
      { image: 'https://images.unsplash.com/photo-1514525253361-bee23e63d890?q=80&w=800', storeId: 'fake-lazer-1' }
    ]
  },
  'educacao': {
    'Freguesia': [
      { image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800', storeId: 'fake-educacao-0' },
      { image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800', storeId: 'fake-educacao-1' }
    ]
  },
  'farmacia': {
    'Freguesia': [
      { image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?q=80&w=800', storeId: 'f-7' },
      { image: 'https://images.unsplash.com/photo-1628771065518-0d82f1110503?q=80&w=800', storeId: 'fake-farmacia-0' }
    ]
  },
  'moda': {
    'Anil': [
      { image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800', storeId: 'f-10' },
      { image: 'https://images.unsplash.com/photo-1470309634658-8398b2cd0d23?q=80&w=800', storeId: 'fake-autos-0' }
    ],
    'Freguesia': [
      { image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800', storeId: 'fake-moda-1' },
      { image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800', storeId: 'fake-moda-2' }
    ]
  },
  'eventos': {
    'Freguesia': [
      { image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800', storeId: 'fake-eventos-0' },
      { image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800', storeId: 'fake-eventos-1' }
    ]
  },
  'condominio': {
    'Freguesia': [
      { image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800', storeId: 'fake-condominio-0' },
      { image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800', storeId: 'fake-condominio-1' }
    ]
  }
};
