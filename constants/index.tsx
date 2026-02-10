
import React from 'react';
import { 
  Utensils, ShoppingCart, Scissors, Heart, PawPrint, Home, Wrench, 
  Dumbbell, CarFront, BookOpen, Monitor, Shirt, Ticket, Map as MapIcon, 
  Store as StoreIcon,
  LayoutGrid, Pill, Briefcase, Plane, Zap,
  Beef, Coffee, Pizza, Croissant, Soup, Cake, Sandwich, 
  // Added Coins import to fix "Cannot find name 'Coins'" error on line 46
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
  Lock, Wind, Disc, Cpu, Coins, HeartHandshake
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