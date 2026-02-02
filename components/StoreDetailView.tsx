
import React, { useEffect, useState, useMemo } from 'react';
import {
  ChevronLeft,
  Share2,
  Heart,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  ArrowRight,
  Instagram,
  ImageIcon,
  Building2,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Quote,
  ThumbsUp,
  Loader2,
  Map as MapIcon,
  Navigation,
  Navigation2,
  Send,
  User as UserIcon,
  CornerDownRight,
  BadgeCheck,
  Coins,
  Ticket,
  Zap,
  ChevronRight as ChevronRightIcon,
  Construction,
  Newspaper
} from 'lucide-react';
import { Store, BusinessHour, StoreReview } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { trackOrganicEvent, OrganicEventType } from '../lib/analytics';
import { MOCK_COMMUNITY_POSTS } from '../constants';
import { PostCard } from './PostCard';
import { useSavedPosts } from '@/hooks/useSavedPosts';

const WEEK_DAYS_LABELS: Record<string, string> = {
  segunda: 'Segunda-feira',
  terca: 'Terça-feira',
  quarta: 'Quarta-feira',
  quinta: 'Quarta-feira',
  sexta: 'Sexta-feira',
  sabado: 'Sábado',
  domingo: 'Domingo',
};

const MOCK_REVIEWS: StoreReview[] = [
  {
    id: 'rev-1',
    user_id: 'u1',
    user_name: 'Anônimo',
    rating: 5,
    comment: 'Comida excelente e entrega rápida! Recomendo a todos.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    merchant_response: {
      text: 'Muito obrigado pelo feedback! Ficamos felizes que tenha gostado.',
      responded_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString()
    }
  },
  {
    id: 'rev-2',
    user_id: 'u2',
    user_name: 'Anônimo',
    rating: 4,
    comment: 'Muito bom, mas a pizza poderia vir um pouco mais quente.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  }
];

const PixIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g fill="currentColor">
      <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm47.78 131.45-31.11-31.11a12 12 0 0 0-17 0l-31.11 31.11a12 12 0 0 1-18.33-15.43l31.11-31.11a12 12 0 0 0 0-17l-31.11-31.11a12 12 0 0 1 17-17l31.11 31.11a12 12 0 0 0 17 0l31.11-31.11a12 12 0 1 1 17 17l-31.11 31.11a12 12 0 0 0 0 17l31.11 31.11a12 12 0 1 1-15.44 18.33Z"/>
    </g>
  </svg>
);

const paymentIconMap: Record<string, React.ElementType> = {
  'Dinheiro': Coins,
  'Pix': PixIcon,
  'Cartão de Crédito': CreditCard,
  'Cartão de Débito': CreditCard,
  'VR': Ticket,
  'VA': Ticket,
  'Vale Refeição / Alimentação': Ticket,
};


export const StoreDetailView: React.FC<{ 
  store: Store; 
  onBack: () => void; 
  onPay?: () => void;
  onClaim?: () => void;
}> = ({ store, onBack, onPay, onClaim }) => {
  const { user } = useAuth();
  const { currentNeighborhood } = useNeighborhood();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'feed' | 'reviews' | 'hours'>('description');
  const [isClosedReporting, setIsClosedReporting] = useState(false);
  const [closedReported, setClosedReported] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hook para salvar posts, passado para o PostCard
  const { isPostSaved, toggleSavePost } = useSavedPosts(user);

  // Perfil Fake/Construção
  const isPlaceholder = store.name === 'Loja Parceira';

  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState('');

  const images = useMemo(() => {
    const gallery = store.gallery?.slice(0, 6) || [];
    if (gallery.length > 0) return gallery;
    return [store.banner_url || store.image || "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop"];
  }, [store]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const goToNext = () => setCurrentSlide(prev => (prev + 1) % images.length);
  const goToPrev = () => setCurrentSlide(prev => (prev - 1 + images.length) % images.length);

  const track = (eventType: OrganicEventType) => {
    if (store) {
      trackOrganicEvent(eventType, store.id, currentNeighborhood, user);
    }
  };

  useEffect(() => {
    track('store_view');
  }, []);

  const handleReportClosed = () => {
    setIsClosedReporting(true);
    setTimeout(() => {
        setIsClosedReporting(false);
        setClosedReported(true);
    }, 1200);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRating === 0) return;
    setIsSubmittingReview(true);
    setTimeout(() => {
      setIsSubmittingReview(false);
      setReviewSuccessMessage('Avaliação enviada (modo teste)');
      setUserRating(0);
      setUserComment('');
      setTimeout(() => setReviewSuccessMessage(''), 3000);
    }, 1500);
  };

  const logoImg = store.logo_url || store.logoUrl || '/assets/default-logo.png';
  
  const phoneDigits = (store.whatsapp_publico || store.phone || '').replace(/\D/g, '');
  
  const addressFormatted = useMemo(() => {
    if (store.rua) {
        return `${store.rua}, ${store.numero}${store.complemento ? ` - ${store.complemento}` : ''} - ${store.bairro}`;
    }
    return store.address || 'Endereço não informado';
  }, [store]);

  const hasAddress = addressFormatted !== 'Endereço não informado';
  const encodedAddress = encodeURIComponent(addressFormatted);
  const gmapsRouteUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  const wazeRouteUrl = `https://waze.com/ul?q=${encodedAddress}&navigate=yes`;
  const instagramUrl = store.instagram ? `https://instagram.com/${store.instagram.replace('@', '')}` : '#';

  const reviewsToDisplay = useMemo(() => {
    return isPlaceholder ? [] : MOCK_REVIEWS;
  }, [isPlaceholder]);

  // Filtra posts do JPA Conversa que pertencem a esta loja e têm a flag ativada
  const storeFeedPosts = useMemo(() => {
    return MOCK_COMMUNITY_POSTS.filter(post => 
      post.showOnStoreProfile &&
      post.authorRole === 'merchant' &&
      // Lógica de match simples para o MVP. Em produção seria via ID.
      (post.userName === store.name || store.name.includes(post.userName) || (store.id === 'f-1' && post.userName === 'Padaria Imperial') /* Mock hack for specific demo */)
    );
  }, [store.name, store.id]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans relative overflow-x-hidden">
      <main className="pb-24">
        
        {/* --- CAROUSEL DE IMAGENS --- */}
        <section className="relative w-full aspect-[16/9] sm:aspect-[2/1] bg-gray-100 dark:bg-gray-800 group">
          <div className="absolute top-0 left-0 right-0 p-4 pt-6 flex justify-between items-center z-40">
            <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center shadow-md active:scale-90 transition-transform">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex gap-2">
              <button onClick={() => track('store_click_share')} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center shadow-md active:scale-90 transition-transform">
                <Share2 className="w-5 h-5 text-white" />
              </button>
              <button onClick={() => { setIsFavorite(!isFavorite); track('store_click_favorite'); }} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center shadow-md active:scale-90 transition-transform">
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
              </button>
            </div>
          </div>

          <div className="relative w-full h-full overflow-hidden">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Imagem da loja ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          
          {images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-30">
              {images.map((_, index) => (
                <button key={index} onClick={() => setCurrentSlide(index)} className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-4 bg-white shadow-md' : 'w-1.5 bg-white/50'}`}></button>
              ))}
            </div>
          )}
        </section>

        <div className="px-5 relative">
          
          {/* --- LOGO CENTRALIZADA --- */}
          <div className="flex justify-center -mt-12 z-20 relative">
            <div className="w-24 h-24 rounded-[28px] bg-white dark:bg-gray-800 p-1 shadow-lg border-4 border-white dark:border-gray-900 overflow-hidden">
              <img src={logoImg} alt="Logo" className="w-full h-full object-contain rounded-[24px]" />
            </div>
          </div>

          {/* CARD DE INFORMAÇÕES */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 pt-16 -mt-12 text-center shadow-lg