
import React, { useState, useMemo, useRef } from 'react';
import { Store, Category, CommunityPost, ServiceRequest, ServiceUrgency, Classified, AdType } from '@/types';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Ticket,
  CheckCircle2, 
  Lock, 
  Zap, 
  Loader2, 
  Hammer, 
  Plus, 
  Heart, 
  Bookmark, 
  Home as HomeIcon,
  MessageSquare, 
  MapPin, 
  Camera, 
  X, 
  Send, 
  ChevronRight,
  ChevronLeft,
  Clock,
  AlertTriangle,
  Megaphone,
  Calendar,
  MessageCircle,
  Dog,
  Key,
  Phone,
  Star,
  Scissors,
  BookOpen,
  Lightbulb,
  User as UserIcon
} from 'lucide-react';
import { LojasEServicosList } from '@/components/LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { CATEGORIES, MOCK_COMMUNITY_POSTS, MOCK_CLASSIFIEDS, STORES } from '@/constants';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { LaunchOfferBanner } from '@/components/LaunchOfferBanner';
import { HomeBannerCarousel } from '@/components/HomeBannerCarousel';
import { FifaBanner } from '@/components/FifaBanner';
import { useFeatures } from '@/contexts/FeatureContext';
import { MoreCategoriesModal } from './MoreCategoriesModal';

// Imagens de fallback realistas e variadas (Bairro, Pessoas, Comércio, Objetos)
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800', // Bairro/Rua
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800', // Rua/Comércio
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000', // Pessoas/Comunidade
  'https://images.unsplash.com/photo-1534723452202-428aae1ad99d?q=80&w=800', // Mercado/Loja
  'https://images.unsplash.com/photo-1581578731522-745d05cb9704?q=80&w=800', // Serviço/Trabalho
  'https://images.unsplash.com/photo-1551632432-c735e8399527?q=80&w=800', // Parque/Verde
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800', // Moda/Cotidiano
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800', // Escritório/Pro
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800', // Interior/Casa
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800', // Prédio
];

const getFallbackImage = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return FALLBACK_IMAGES[Math.abs(hash) % FALLBACK_IMAGES.length];
};

const GUIDES_MOCK = [
  {
    id: 'g1',
    title: 'Como pedir orçamento sem dor de cabeça no bairro',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=400&auto=format&fit=crop',
    content: [
      'Descreva o problema com detalhes e fotos.',
      'Solicite pelo menos 3 orçamentos para comparar.',
      'Pergunte sobre garantias e prazos antes de fechar.',
      'Use o chat do app para manter o registro da conversa.'
    ],
    ctaLabel: 'Pedir Orçamento',
    ctaAction: 'services_landing'
  },
  {
    id: 'g2',
    title: 'Como escolher um profissional verificado',
    image: 'https://images.unsplash.com/photo-1581578731117-10d52b4d8051?q=80&w=400&auto=format&fit=crop',
    content: [
      'Procure pelo selo azul de verificado no perfil.',
      'Leia as avaliações de outros vizinhos.',
      'Verifique se o perfil tem fotos de trabalhos anteriores.',
      'Dê preferência a quem responde rápido no chat.'
    ],
    ctaLabel: 'Ver Profissionais',
    ctaAction: 'explore'
  },
  {
    id: 'g3',
    title: 'Quando vale a pena usar cupons no bairro',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=400&auto=format&fit=crop',
    content: [
      'Ideal para experimentar novos lugares.',
      'Ótimo para dias de semana com movimento menor.',
      'Verifique sempre a validade e as regras de uso.',
      'Use o cupom para apoiar o comércio local.'
    ],
    ctaLabel: 'Ver Cupons',
    ctaAction: 'coupon_landing'
  },
  {
    id: 'g4',
    title: 'Diferença entre anúncios, cupons e classificados',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=400&auto=format&fit=crop',
    content: [
      'Anúncios (Home): Destaques de lojas patrocinadas.',
      'Cupons: Descontos diretos para usar no caixa.',
      'Classificados: Vendas, trocas e vagas entre moradores.',
      'Perfil da Loja: Informações fixas e catálogo.'
    ],
    ctaLabel: 'Explorar Tudo',
    ctaAction: 'explore'
  },
  {
    id: 'g5',
    title: 'Como economizar no seu bairro todos os meses',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=400&auto=format&fit=crop',
    content: [
      'Acompanhe a aba "Cupons" semanalmente.',
      'Participe do "Desapega" para comprar itens usados.',
      'Prefira serviços locais para evitar taxas de deslocamento.',
      'Ative notificações para ofertas relâmpago.'
    ],
    ctaLabel: 'Ver Ofertas',
    ctaAction: 'coupon_landing'
  }
];

const HAPPENING_NOW_MOCK = [
  {
    id: 'hn-1',
    type: 'promotion',
    title: 'Rodízio de Pizza',
    subtitle: 'Pizzaria do Zé',
    timeRemaining: 'Até as 23h',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'hn-2',
    type: 'event',
    title: 'Feira Orgânica',
    subtitle: 'Praça da Freguesia',
    timeRemaining: 'Termina em 1h',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'hn-3',
    type: 'alert',
    title: 'Trânsito Intenso',
    subtitle: 'Est. Três Rios',
    timeRemaining: 'Reportado agora',
    image: null
  },
  {
    id: 'hn-4',
    type: 'promotion',
    title: 'Happy Hour 50%',
    subtitle: 'Bar do Zé',
    timeRemaining: 'Inicia às 18h',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?q=80&w=200&auto=format&fit=crop'
  }
];

const COUPONS_MOCK = [
  {
    id: 'cp-1',
    storeName: 'Bibi Lanches',
    logo: 'https://ui-avatars.com/api/?name=Bibi+Lanches&background=FF6B00&color=fff',
    initials: 'BL',
    discount: '15% OFF',
    storeId: 'f-1'
  },
  {
    id: 'cp-2',
    storeName: 'Studio Hair',
    logo: 'https://ui-avatars.com/api/?name=Studio+Hair&background=BC1F66&color=fff',
    initials: 'SH',
    discount: 'R$ 20,00',
    storeId: 'f-2'
  },
  {
    id: 'cp-3',
    storeName: 'Pizzaria do Zé',
    logo: 'https://ui-avatars.com/api/?name=Pizzaria+Ze&background=22C55E&color=fff',
    initials: 'PZ',
    discount: 'Entrega Grátis',
    storeId: 'f-5'
  },
  {
    id: 'cp-4',
    storeName: 'Pet Shop Alegria',
    logo: 'https://ui-avatars.com/api/?name=Pet+Alegria&background=0EA5E9&color=fff',
    initials: 'PA',
    discount: '10% OFF',
    storeId: 'f-3'
  },
  {
    id: 'cp-5',
    storeName: 'Academia Fit',
    logo: 'https://ui-avatars.com/api/?name=Academia+Fit&background=4F46E5&color=fff',
    initials: 'AF',
    discount: '1ª Mês Grátis',
    storeId: 'f-8'
  }
];

interface Talent {
    id: string;
    title: string;
    image: string;
    neighborName: string;
    neighborAvatar: string;
    whatsapp: string;
    category: string;
}

const TALENTS_MOCK: Talent[] = [
  {
    id: 't1',
    title: 'Bolos da Dona Cida',
    image: 'https://images.unsplash.com/photo-1563729768601-d6fa48b04873?q=80&w=400&auto=format&fit=crop',
    neighborName: 'Maria Aparecida',
    neighborAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop',
    whatsapp: '5521999999999',
    category: 'Doces Caseiros'
  },
  {
    id: 't2',
    title: 'Reparos Rápidos do Jorge',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format&fit=crop',
    neighborName: 'Jorge Silva',
    neighborAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
    whatsapp: '5521999999999',
    category: 'Marido de Aluguel'
  },
  {
    id: 't3',
    title: 'Unhas da Carol',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=400&auto=format&fit=crop',
    neighborName: 'Carolina Mendes',
    neighborAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
    whatsapp: '5521999999999',
    category: 'Manicure'
  },
  {
    id: 't4',
    title: 'Passeio com Cães',
    image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea92d5?q=80&w=400&auto=format&fit=crop',
    neighborName: 'Matheus Oliveira',
    neighborAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop',
    whatsapp: '5521999999999',
    category: 'Dog Walker'
  }
];

const LOST_AND_FOUND_MOCK = [
  {
    id: 'lf1',
    type: 'lost_pet',
    title: 'Cachorro Pinscher - Totó',
    description: 'Fugiu perto da Praça Seca. Coleira azul. Dócil mas assustado. Atende pelo nome de Totó.',
    location: 'Praça Seca',
    time: 'Há 2h',
    image: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=600&auto=format&fit=crop',
    contact: '5521999999999'
  },
  {
    id: 'lf2',
    type: 'found_item',
    title: 'Chaves de Carro',
    description: 'Encontradas na calçada da Padaria Imperial. Chaveiro do Flamengo. Deixei no balcão da padaria.',
    location: 'Freguesia',
    time: 'Há 5h',
    image: 'https://images.unsplash.com/photo-1583574883377-2f3b9220556b?q=80&w=600&auto=format&fit=crop',
    contact: '5521999999999'
  },
  {
    id: 'lf3',
    type: 'lost_pet',
    title: 'Gato Siamês - Mimi',
    description: 'Visto pela última vez no telhado do vizinho na Rua Araguaia. Tem uma mancha branca no nariz.',
    location: 'Freguesia',
    time: 'Ontem',
    image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=600&auto=format&fit=crop',
    contact: '5521999999999'
  }
];

const MiniPostCard: React.FC<{ post: CommunityPost; onNavigate: (view: string) => void; }> = ({ post, onNavigate }) => {
  const postImage = post.imageUrl || (post.imageUrls && post.imageUrls.length > 0 ? post.imageUrls[0] : getFallbackImage(post.id));
  
  return (
    <div className="flex-shrink-0 w-28 snap-center p-1">
      <div 
        onClick={() => onNavigate('neighborhood_posts')}
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col group cursor-pointer h-full"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <img src={postImage} alt={post.content} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-1 left-1.5 right-1">
            <p className="text-[9px] font-bold text-white drop-shadow-md truncate">{post.userName}</p>
          </div>
        </div>
        <div className="p-2 pt-1.5 flex-1">
            <p className="text-[9px] text-gray-600 dark:text-gray-300 leading-snug line-clamp-2 font-medium">
                {post.content}
            </p>
        </div>
      </div>
    </div>
  );
};

const TalentCard: React.FC<{ talent: Talent }> = ({ talent }) => {
    const handleWhatsapp = () => {
        const text = encodeURIComponent(`Olá ${talent.neighborName}, vi seu anúncio "${talent.title}" no app do bairro!`);
        window.open(`https://wa.me/${talent.whatsapp}?text=${text}`, '_blank');
    };

    return (
        <div className="flex-shrink-0 w-56 snap-center">
            <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-full group">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    <img src={talent.image} alt={talent.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        {talent.category}
                    </div>
                </div>
                
                <div className="p-3 flex flex-col gap-3 flex-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight line-clamp-1">
                        {talent.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-50 dark:border-gray-800">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm shrink-0">
                            <img src={talent.neighborAvatar} alt={talent.neighborName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 leading-none">{talent.neighborName}</span>
                            <span className="text-[9px] text-green-600 dark:text-green-400 font-bold mt-0.5 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Feito pelo vizinho
                            </span>
                        </div>
                    </div>

                    <button 
                        onClick={handleWhatsapp}
                        className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors active:scale-95 shadow-sm mt-1"
                    >
                        <MessageCircle size={14} className="fill-white" />
                        <span className="text-[10px] font-black uppercase tracking-wide">Falar no WhatsApp</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const TalentsSection: React.FC = () => {
    return (
        <section className="py-6 border-t border-gray-100 dark:border-gray-800">
            <div className="px-5 mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-none mb-1">Talentos do Bairro</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Feito pelo vizinho</p>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x px-5 pb-2">
                {TALENTS_MOCK.map(t => <TalentCard key={t.id} talent={t} />)}
            </div>
        </section>
    );
};

const LostAndFoundDetailModal: React.FC<{ item: typeof LOST_AND_FOUND_MOCK[0] | null, onClose: () => void }> = ({ item, onClose }) => {
    if (!item) return null;
    const isLost = item.type === 'lost_pet';
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/20 text-white rounded-full backdrop-blur-md">
                    <X size={20} />
                </button>
                <div className="relative aspect-square w-full">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 ${isLost ? 'bg-orange-500' : 'bg-emerald-500'}`}>
                            {isLost ? 'Perdido' : 'Encontrado'}
                        </span>
                        <h2 className="text-2xl font-bold leading-tight">{item.title}</h2>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                        <div className="flex items-center gap-1.5">
                            <MapPin size={16} className="text-[#1E5BFF]" />
                            {item.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={16} className="text-[#1E5BFF]" />
                            {item.time}
                        </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-medium mb-8">
                        {item.description}
                    </p>
                    <button 
                        onClick={() => window.open(`https://wa.me/${item.contact}`, '_blank')}
                        className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-white font-bold uppercase tracking-widest text-xs shadow-lg active:scale-[0.98] transition-all ${isLost ? 'bg-orange-500 shadow-orange-500/30' : 'bg-emerald-500 shadow-emerald-500/30'}`}
                    >
                        <Phone size={16} /> Entrar em Contato
                    </button>
                </div>
            </div>
        </div>
    );
};

const GuideDetailModal: React.FC<{ guide: any, onClose: () => void, onNavigate: (view: string) => void }> = ({ guide, onClose, onNavigate }) => {
    if (!guide) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/20 text-white rounded-full backdrop-blur-md">
                    <X size={20} />
                </button>
                <div className="relative aspect-video w-full">
                    <img src={guide.image} alt={guide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-lg">
                                <BookOpen size={14} className="text-white" />
                             </div>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">Guia Prático</span>
                        </div>
                        <h2 className="text-xl font-bold leading-tight">{guide.title}</h2>
                    </div>
                </div>
                <div className="p-6">
                    <ul className="space-y-4 mb-8">
                        {guide.content.map((point: string, i: number) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">{i + 1}</span>
                                </div>
                                {point}
                            </li>
                        ))}
                    </ul>
                    <button 
                        onClick={() => { onClose(); onNavigate(guide.ctaAction); }}
                        className="w-full py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs transition-colors"
                    >
                        {guide.ctaLabel} <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const NeighborhoodGuidesBlock: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
    const [selectedGuide, setSelectedGuide] = useState<any>(null);

    return (
        <>
            <div className="py-6 border-b border-gray-100 dark:border-gray-800">
                <div className="px-5 mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-none mb-1">Dicas pro Bairro</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Dicas rápidas para usar melhor o app</p>
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x px-5 pb-2">
                    {GUIDES_MOCK.map((guide) => (
                        <div 
                            key={guide.id} 
                            onClick={() => setSelectedGuide(guide)}
                            className="flex-shrink-0 w-48 aspect-[4/3] bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer relative group snap-center active:scale-95 transition-transform"
                        >
                            <img src={guide.image} alt={guide.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="text-xs font-bold text-white leading-tight line-clamp-2 drop-shadow-md">
                                    {guide.title}
                                </h3>
                                <div className="flex items-center gap-1 mt-2 text-[9px] font-bold text-white/80 uppercase tracking-wide">
                                    <Lightbulb size={10} className="text-yellow-400" /> Dica rápida
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <GuideDetailModal guide={selectedGuide} onClose={() => setSelectedGuide(null)} onNavigate={onNavigate} />
        </>
    );
};

const LostAndFoundSection: React.FC<{ onItemClick: (item: typeof LOST_AND_FOUND_MOCK[0]) => void }> = ({ onItemClick }) => {
    return (
        <section className="py-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
            <div className="px-5 mb-3 flex items-center justify-between">
               <div>
                  <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-1">Achados e Perdidos</h2>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Pets e objetos que o bairro procura</p>
               </div>
            </div>
            
            <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x px-5 pb-2">
                {LOST_AND_FOUND_MOCK.map((item) => {
                    const isLost = item.type === 'lost_pet';
                    const Icon = isLost ? Dog : Key;
                    
                    return (
                        <div 
                            key={item.id}
                            onClick={() => onItemClick(item)}
                            className="flex-shrink-0 w-40 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col cursor-pointer active:scale-95 transition-all group snap-center overflow-hidden shadow-sm"
                        >
                            <div className="h-28 bg-gray-100 dark:bg-gray-800 relative">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider text-white shadow-sm ${isLost ? 'bg-red-500' : 'bg-emerald-500'}`}>
                                    {isLost ? 'Perdido' : 'Achado'}
                                </div>
                            </div>
                            <div className="p-3 flex flex-col gap-1">
                                <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                                    <Icon size={10} />
                                    <span className="text-[8px] font-bold uppercase tracking-wide">{isLost ? 'Animal' : 'Objeto'}</span>
                                </div>
                                <h3 className="font-bold text-xs text-gray-900 dark:text-white truncate leading-tight">{item.title}</h3>
                                <div className="flex flex-col gap-0.5 mt-0.5">
                                    <div className="flex items-center gap-1 text-[9px] text-gray-500 dark:text-gray-400 font-medium truncate">
                                        <MapPin size={9} className="shrink-0" /> {item.location}
                                    </div>
                                    <div className="flex items-center gap-1 text-[9px] text-gray-500 dark:text-gray-400 font-medium">
                                        <Clock size={9} className="shrink-0" /> {item.time}
                                    </div>
                                </div>
                                <span className="text-[9px] font-bold text-[#1E5BFF] mt-1.5 group-hover:underline">Ver detalhes</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

const CouponsBlock: React.FC<{ onNavigate: (view: string) => void; user: User | null; userRole: string | null }> = ({ onNavigate, user, userRole }) => {
  
  const handleCouponClick = () => {
    if (user) {
        onNavigate(userRole === 'lojista' ? 'merchant_coupons' : 'user_coupons');
    } else {
        onNavigate('coupon_landing');
    }
  };

  return (
    <div className="py-2">
       <div className="flex items-center justify-between mb-1 px-5">
         <div>
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-1">Cupons</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Para você economizar</p>
         </div>
         <button onClick={handleCouponClick} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline active:opacity-60">Ver todos</button>
       </div>
       
       <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x px-5 pt-6 pb-4">
          {COUPONS_MOCK.map((coupon) => (
            <div 
              key={coupon.id} 
              onClick={handleCouponClick}
              className="relative flex-shrink-0 w-36 snap-center cursor-pointer group"
            >
               {/* Floating Logo */}
               <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 p-0.5 shadow-md border border-gray-100 dark:border-gray-700">
                     <img src={coupon.logo} alt="" className="w-full h-full rounded-full object-cover" />
                  </div>
               </div>

               {/* Card Body - Original Blue Solid Style */}
               <div className="w-full h-44 bg-[#1E5BFF] rounded-3xl shadow-lg relative overflow-hidden active:scale-95 transition-transform flex flex-col">
                  
                  {/* Side Holes aligned with Dotted Line */}
                  <div className="absolute top-[74px] -left-2 w-4 h-4 rounded-full bg-white dark:bg-gray-950 z-10"></div>
                  <div className="absolute top-[74px] -right-2 w-4 h-4 rounded-full bg-white dark:bg-gray-950 z-10"></div>

                  {/* Top Section - Discount */}
                  <div className="flex flex-col items-center justify-center h-[82px] pt-4 px-3 text-center">
                      <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">CUPOM</span>
                      <span className="text-xl font-black text-white leading-none tracking-tight">
                         {coupon.discount}
                      </span>
                  </div>

                  {/* Dotted Line - Perfect center alignment with side holes */}
                  <div className="w-full px-0">
                    <div className="w-full h-px border-t-2 border-dashed border-white/30"></div>
                  </div>

                  {/* Bottom Section - CTA com alinhamento vertical equilibrado */}
                  <div className="flex-1 flex flex-col justify-center p-3 pb-6">
                     <button className="w-full bg-white text-[#1E5BFF] text-[10px] font-black uppercase tracking-widest py-3 rounded-xl shadow-sm transition-colors">
                         Pegar cupom
                     </button>
                  </div>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

const HappeningNowSection: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="px-5 pt-4 pb-4 bg-white dark:bg-gray-950">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
            Acontecendo Agora 
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            </h2>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Tempo real no bairro</p>
        </div>
        <button 
          onClick={() => alert("Funcionalidade de alerta rápido em breve!")}
          className="flex items-center justify-center w-7 h-7 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400 hover:text-blue-500 transition-colors"
        >
            <Plus size={16} />
        </button>
      </div>
      
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar snap-x -mx-5 px-5">
        {HAPPENING_NOW_MOCK.map((item) => (
            <div key={item.id} className="snap-center flex-shrink-0 w-44 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-2.5 flex gap-2.5 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95">
                <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden relative flex items-center justify-center">
                    {item.image ? (
                        <img src={item.image} className="w-full h-full object-cover" alt="" />
                    ) : (
                        <div className="text-amber-500">
                             {item.type === 'alert' ? <AlertTriangle size={24} /> : <Zap size={24} />}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md flex items-center gap-1 ${
                            item.type === 'promotion' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                            item.type === 'event' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' :
                            'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                        }`}>
                            {item.type === 'promotion' && <Megaphone size={8} />}
                            {item.type === 'event' && <Calendar size={8} />}
                            {item.type === 'alert' && <AlertTriangle size={8} />}
                            {item.type === 'promotion' ? 'Promoção' : item.type === 'event' ? 'Evento' : 'Aviso'}
                        </span>
                    </div>
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white truncate leading-tight">{item.title}</h3>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate mb-1">{item.subtitle}</p>
                    <div className="flex items-center gap-1 text-[9px] text-blue-600 dark:text-blue-400 font-bold">
                        <Clock size={10} /> {item.timeRemaining}
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  )
};

interface HomeFeedProps {
  onNavigate: (view: string, data?: any) => void;
  onSelectCategory: (category: Category) => void;
  onStoreClick: (store: Store) => void;
  stores: Store[];
  user: User | null;
  userRole: 'cliente' | 'lojista' | null;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({ 
  onNavigate, 
  onSelectCategory, 
  onStoreClick, 
  stores, 
  user, 
  userRole 
}) => {
  const [listFilter, setListFilter] = useState<'all' | 'top_rated' | 'open_now'>('all');
  const { currentNeighborhood } = useNeighborhood();
  const { isFeatureActive } = useFeatures();
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [currentCategoryPage, setCurrentCategoryPage] = useState(0);
  const itemsPerPage = 8; 
  
  // State for the "More" modal
  const [isMoreCategoriesOpen, setIsMoreCategoriesOpen] = useState(false);

  const orderedCategories = useMemo(() => {
    // Definindo as 8 categorias principais para a primeira página
    const firstPageIds = [
      'cat-servicos', 
      'cat-alimentacao', 
      'cat-restaurantes', 
      'cat-mercados', 
      'cat-farmacias', 
      'cat-autos', 
      'cat-moda', 
      'cat-beleza'
    ];
    
    const firstPage = firstPageIds.map(id => CATEGORIES.find(c => c.id === id)).filter((c): c is Category => !!c);
    const remaining = CATEGORIES.filter(c => !firstPageIds.includes(c.id));
    return [...firstPage, ...remaining];
  }, []);

  const categoryPages = useMemo(() => {
    // Configurar para 2 páginas: 15 categorias + botão Mais (total 16 itens, 8 por página)
    const visibleCategories = orderedCategories.slice(0, 15);
    
    // Adicionar o botão "Mais" como último item
    const moreItem: Category = { 
        id: 'more-trigger', 
        name: 'Mais', 
        slug: 'more', 
        icon: <Plus />, 
        color: 'bg-gray-100 dark:bg-gray-800' 
    };
    
    const allItems = [...visibleCategories, moreItem];
    
    const pages = [];
    for (let i = 0; i < allItems.length; i += itemsPerPage) {
        pages.push(allItems.slice(i, i + itemsPerPage));
    }
    
    return pages;
  }, [orderedCategories]);

  const [wizardStep, setWizardStep] = useState(0);
  const [selectedLostItem, setSelectedLostItem] = useState<typeof LOST_AND_FOUND_MOCK[0] | null>(null);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      {userRole === 'lojista' && isFeatureActive('banner_highlights') && <section className="px-4 py-4 bg-white dark:bg-gray-950"><LaunchOfferBanner onClick={() => onNavigate('store_ads_module')} /></section>}
      
      {isFeatureActive('explore_guide') && (
        <section className="w-full bg-white dark:bg-gray-950 pt-4 pb-0 relative z-10">
            <div ref={categoryScrollRef} className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth" onScroll={() => { if (categoryScrollRef.current) setCurrentCategoryPage(Math.round(categoryScrollRef.current.scrollLeft / categoryScrollRef.current.clientWidth)); }}>
            {categoryPages.map((pageCategories, pageIndex) => (
                <div key={pageIndex} className="min-w-full px-4 pb-2 snap-center">
                <div className="grid grid-cols-4 gap-1.5">
                    {pageCategories.map((cat, index) => {
                        // RENDERIZAÇÃO ESPECIAL PARA O BOTÃO "MAIS"
                        if (cat.id === 'more-trigger') {
                            return (
                                <button 
                                   key={cat.id} 
                                   onClick={() => setIsMoreCategoriesOpen(true)}
                                   className="flex flex-col items-center group active:scale-95 transition-all w-full"
                                >
                                    <div className={`w-full aspect-square rounded-[22px] shadow-sm flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700`}> 
                                       {/* Styling to look like "Add/More" */}
                                       <div className="flex-1 flex items-center justify-center w-full mb-1">
                                         <Plus className="w-9 h-9 text-gray-400 dark:text-gray-500" strokeWidth={2.5} />
                                       </div>
                                       <span className="block w-full text-[8.5px] font-black text-gray-500 dark:text-gray-400 text-center uppercase tracking-tighter leading-none truncate">
                                         Mais
                                       </span>
                                    </div>
                                </button>
                            );
                        }

                        // RENDERIZAÇÃO PADRÃO DE CATEGORIA
                        return (
                        <button key={`${cat.id}-${pageIndex}-${index}`} onClick={() => onSelectCategory(cat)} className="flex flex-col items-center group active:scale-95 transition-all w-full">
                            <div className={`w-full aspect-square rounded-[22px] shadow-sm flex flex-col items-center justify-center p-3 ${cat.color || 'bg-blue-600'} border border-white/20`}>
                              <div className="flex-1 flex items-center justify-center w-full mb-1">
                                {React.cloneElement(cat.icon as any, { className: "w-9 h-9 text-white drop-shadow-md", strokeWidth: 2.5 })}
                              </div>
                              <span className="block w-full text-[8.5px] font-black text-white text-center uppercase tracking-tighter leading-none truncate">
                                {cat.name}
                              </span>
                            </div>
                        </button>
                        );
                    })}
                </div>
                </div>
            ))}
            </div>
            
            <div className="flex justify-center gap-1.5 pb-6 pt-2">
            {categoryPages.map((_, idx) => <div key={idx} className={`rounded-full transition-all duration-300 ${idx === currentCategoryPage ? 'bg-gray-800 dark:bg-white w-1.5 h-1.5' : 'bg-gray-300 dark:bg-gray-700 w-1.5 h-1.5'}`} />)}
            </div>
        </section>
      )}

      {isFeatureActive('banner_highlights') && (
        <section className="bg-white dark:bg-gray-950 w-full"><HomeBannerCarousel onStoreClick={onStoreClick} onNavigate={onNavigate} /></section>
      )}
      
      {/* CUPONS BLOCK */}
      <CouponsBlock onNavigate={onNavigate} user={user} userRole={userRole} />

      {/* ACONTECENDO AGORA BLOCK */}
      <HappeningNowSection onNavigate={onNavigate} />

      {/* NOVO POSICIONAMENTO: BLOCO DE ORÇAMENTOS */}
      {isFeatureActive('service_chat') && (
        <section className="py-6 border-t border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="px-5 mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-none">Receba até 5 orçamentos gratuitos</h2>
          </div>
          <div className="px-5">
            <FifaBanner onClick={() => setWizardStep(1)} />
          </div>
        </section>
      )}

      {/* NOVO POSICIONAMENTO: ACHADOS E PERDIDOS */}
      <LostAndFoundSection onItemClick={setSelectedLostItem} />

      {/* NOVO POSICIONAMENTO: GUIAS DO BAIRRO */}
      <NeighborhoodGuidesBlock onNavigate={onNavigate} />

      {/* NOVO POSICIONAMENTO: EXPLORAR BAIRRO */}
      {isFeatureActive('explore_guide') && (
        <div className="w-full bg-white dark:bg-gray-900 pt-1 pb-10">
            <div className="px-5">
            <SectionHeader icon={Compass} title="Explorar Bairro" subtitle="Tudo o que você precisa" onSeeMore={() => onNavigate('explore')} />
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit mb-4">
                {['all', 'top_rated'].map((f) => <button key={f} onClick={() => setListFilter(f as any)} className={`text-[8px] font-black uppercase px-4 py-1.5 rounded-lg transition-all ${listFilter === f ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}>{f === 'all' ? 'Tudo' : 'Top'}</button>)}
            </div>
            <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter as any} user={user} onNavigate={onNavigate} premiumOnly={false} />
            </div>
        </div>
      )}

      {/* TALENTOS DO BAIRRO BLOCK (MOVIDO PARA O FINAL) */}
      <TalentsSection />

      {/* JPA CONVERSA (MOVIDO PARA O FINAL) */}
      {isFeatureActive('community_feed') && (
        <section className="bg-white dark:bg-gray-950 pt-2 pb-6 relative px-5">
            <div className="flex items-center justify-between mb-3"><h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">JPA Conversa<div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div></h2><button onClick={() => onNavigate('neighborhood_posts')} className="text-xs font-bold text-blue-500">Ver tudo</button></div>
            <div className="relative group"><div className="flex overflow-x-auto no-scrollbar snap-x -mx-1 pb-2">{MOCK_COMMUNITY_POSTS.slice(0, 5).map((post) => <MiniPostCard key={post.id} post={post} onNavigate={onNavigate} />)}</div></div>
        </section>
      )}
      
      {wizardStep > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 -mt-4 mx-5 mb-10 animate-in slide-in-from-bottom duration-500 border border-gray-100 dark:border-slate-800 shadow-2xl relative overflow-hidden z-50">
          <button onClick={() => setWizardStep(0)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-slate-800 rounded-full"><X size={20} /></button>
          {wizardStep === 1 && (
            <div className="text-center animate-in fade-in zoom-in-95 duration-300">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">Que tipo de serviço?</h3>
              <div className="grid grid-cols-2 gap-4">
                {[{l: 'Obras', i: Hammer}, {l: 'Reparos', i: Zap}, {l: 'Casa', i: HomeIcon}, {l: 'Outros', i: Sparkles}].map(s => (
                  <button key={s.l} onClick={() => setWizardStep(2)} className="p-6 bg-gray-50 dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 flex flex-col items-center gap-3 transition-all hover:border-blue-600 active:scale-95">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center text-blue-600"><s.i size={24} /></div>
                    <p className="text-[10px] font-black text-gray-800 dark:text-slate-200 uppercase tracking-tighter">{s.l}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          {wizardStep === 4 && (
            <div className="text-center py-8 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-xl"><CheckCircle2 size={40} /></div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Tudo pronto!</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-10 font-medium">Profissionais notificados.</p>
                <button onClick={() => setWizardStep(0)} className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-xl uppercase tracking-widest text-xs active:scale-[0.98] transition-all">Ver propostas</button>
            </div>
          )}
        </section>
      )}

      {/* Modal para detalhes de Achados e Perdidos */}
      <LostAndFoundDetailModal 
          item={selectedLostItem} 
          onClose={() => setSelectedLostItem(null)} 
      />

      {/* Modal de Mais Categorias */}
      <MoreCategoriesModal 
          isOpen={isMoreCategoriesOpen}
          onClose={() => setIsMoreCategoriesOpen(false)}
          onSelectCategory={(category: Category) => {
              setIsMoreCategoriesOpen(false);
              onSelectCategory(category);
          }}
      />
    </div>
  );
};

const SectionHeader: React.FC<{ icon: React.ElementType; title: string; subtitle: string; onSeeMore?: () => void }> = ({ icon: Icon, title, subtitle, onSeeMore }) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white shadow-sm"><Icon size={18} strokeWidth={2.5} /></div><div><h2 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.15em] leading-none mb-1">{title}</h2><p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">{subtitle}</p></div></div>
    <button onClick={onSeeMore} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline active:opacity-60">Ver mais</button>
  </div>
);
