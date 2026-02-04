
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  Home, 
  LayoutGrid, 
  Zap, 
  MapPin, 
  Palette, 
  Rocket,
  Loader2,
  CheckCircle2,
  QrCode,
  Paintbrush,
  Upload,
  Calendar,
  Award,
  Image as ImageIcon,
  X,
  Info,
  CreditCard,
  Copy,
  Check,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StoreBannerEditor } from '@/components/StoreBannerEditor';

interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
  user: User | null;
  categoryName?: string;
  viewMode?: string;
  initialView?: 'sales' | 'chat';
}

const NEIGHBORHOODS = [
  "Freguesia", "Pechincha", "Anil", "Taquara", "Tanque", 
  "Curicica", "Parque Olímpico", "Gardênia", "Cidade de Deus"
];

const DURATION_OPTIONS = [
  { months: 1, label: '1 mês' },
  { months: 2, label: '2 meses' },
  { months: 3, label: '3 meses' },
  { months: 4, label: '4 meses' },
  { months: 5, label: '5 meses' },
  { months: 6, label: '6 meses' },
];

// FIX: Added getDatesForDuration utility function to calculate period strings based on the number of months.
const getDatesForDuration = (months: number) => {
  const now = new Date();
  const end = new Date(now.getTime() + months * 30 * 24 * 60 * 60 * 1000);
  const formatDate = (date: Date) => date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  return `${formatDate(now)} → ${formatDate(end)}`;
};

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user, initialView = 'sales' }) => {
  const [view, setView] = useState<'sales' | 'payment_selection' | 'processing' | 'success' | 'chat'>('sales');
  const [isEditingArt, setIsEditingArt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');

  // --- Estados do Pedido ---
  const [placement, setPlacement] = useState<{home: boolean, cat: boolean}>({ home: false, cat: false });
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [artChoice, setArtChoice] = useState<'my_art' | 'editor' | 'pro' | null>(null);
  const [uploadedBanner, setUploadedBanner] = useState<string | null>(null);

  // Refs para automações de UX
  const step2Ref = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialView === 'chat') setView('chat');
  }, [initialView]);

  // --- Precificação Original ---
  const PRICES = { HOME: 69.90, CAT: 29.90, COMBO: 89.90, PRO_ART: 89.90 };

  const summary = useMemo(() => {
    let basePrice = 0;
    if (placement.home && placement.cat) basePrice = PRICES.COMBO;
    else if (placement.home) basePrice = PRICES.HOME;
    else if (placement.cat) basePrice = PRICES.CAT;

    const hoodsCount = selectedNeighborhoods.length;
    const hoodsMultiplier = Math.max(1, hoodsCount);
    const subtotal = (basePrice * hoodsMultiplier) * selectedDuration;
    const artExtra = artChoice === 'pro' ? PRICES.PRO_ART : 0;
    const total = subtotal + artExtra;

    return {
      basePrice,
      hoodsCount,
      subtotal,
      artExtra,
      total,
      placementLabel: placement.home && placement.cat ? 'Home + Categorias' : placement.home ? 'Página Inicial' : placement.cat ? 'Categorias' : 'Escolha um plano'
    };
  }, [placement, selectedNeighborhoods, selectedDuration, artChoice]);

  const handlePlacementSelection = (choice: {home: boolean, cat: boolean}) => {
    setPlacement(choice);
    setTimeout(() => {
      step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const toggleHood = (hood: string) => {
    if (hood === 'Todos') {
      setSelectedNeighborhoods(selectedNeighborhoods.length === NEIGHBORHOODS.length ? [] : [...NEIGHBORHOODS]);
    } else {
      setSelectedNeighborhoods(prev => prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedBanner(event.target?.result as string);
        setArtChoice('my_art');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoToPayment = () => {
    if (!placement.home && !placement.cat) return alert("Selecione onde o anúncio deve aparecer.");
    if (selectedNeighborhoods.length === 0) return alert("Selecione pelo menos um bairro.");
    if (!artChoice) return alert("Escolha uma opção de arte.");
    setView('payment_selection');
    window.scrollTo(0, 0);
  };

  const handleConfirmPayment = () => {
    setIsSubmitting(true);
    setView('processing');
    
    // Simulação de delay de processamento real (API Gateway)
    setTimeout(() => {
      // Registrar Campanha e Bloquear Espaço (Simulado no LocalStorage)
      const campaignId = `CAMP-${Math.floor(1000 + Math.random() * 9000)}`;
      const activeCampaigns = JSON.parse(localStorage.getItem('active_ads_jpa') || '[]');
      activeCampaigns.push({
          id: campaignId,
          user: user?.id,
          placement,
          hoods: selectedNeighborhoods,
          duration: selectedDuration,
          total: summary.total,
          artType: artChoice,
          timestamp: new Date().toISOString()
      });
      localStorage.setItem('active_ads_jpa', JSON.stringify(activeCampaigns));

      // AUTOMAÇÃO: Se for arte PRO, preparar chat
      if (artChoice === 'pro') {
          const orderId = `DSG-${Math.floor(1000 + Math.random() * 9000)}`;
          const initialMsgs = [
              { id: 1, role: 'system', text: '🎉 Parabéns pela sua campanha!\nSeu banner será criado pelo time Localizei.', timestamp: new Date().toISOString() },
              { id: 2, role: 'system', text: 'Para começarmos a criação do seu banner, envie por aqui:\n• Nome da loja\n• Logo (se tiver)\n• Cores ou referências visuais\n• Texto promocional (se desejar)', timestamp: new Date().toISOString() },
              { id: 3, role: 'system', text: 'Caso prefira, nosso time pode criar o banner completo para você.', timestamp: new Date().toISOString() }
          ];
          localStorage.setItem(`msgs_${orderId}`, JSON.stringify(initialMsgs));
          localStorage.setItem(`designer_order_${campaignId}`, orderId);
      }

      setIsSubmitting(false);
      setView('success');
    }, 3000);
  };

  const handleGoToDesignerChat = () => {
      // Busca o ID do chat gerado no passo anterior
      const activeCampaigns = JSON.parse(localStorage.getItem('active_ads_jpa') || '[]');
      const lastCamp = activeCampaigns[activeCampaigns.length - 1];
      const orderId = localStorage.getItem(`designer_order_${lastCamp.id}`);
      
      if (orderId) {
          onNavigate('service_chat', { requestId: orderId });
      } else {
          onBack();
      }
  };

  if (isEditingArt) {
    return <StoreBannerEditor storeName={user?.user_metadata?.store_name || "Sua Loja"} onSave={() => { setIsEditingArt(false); setArtChoice('editor'); }} onBack={() => setIsEditingArt(false)} />;
  }

  // --- VIEW: PROCESSANDO ---
  if (view === 'processing') {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
          <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#1E5BFF] border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-[#1E5BFF] animate-pulse" />
              </div>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Validando Pagamento</h2>
          <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
              Estamos confirmando sua transação com o banco. <br/>Não feche esta tela.
          </p>
      </div>
    );
  }

  // --- VIEW: SUCESSO ---
  if (view === 'success') {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col animate-