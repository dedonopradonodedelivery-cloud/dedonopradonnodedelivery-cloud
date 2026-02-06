
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { GoogleGenAI, Part, Blob as GenAIBlob } from "@google/genai";
import { 
  ChevronLeft, 
  Tag, 
  MapPin, 
  Clock, 
  Plus, 
  Search, 
  X, 
  ChevronRight, 
  ShieldCheck,
  ArrowRight,
  SlidersHorizontal,
  Check,
  Camera,
  Loader2,
  CheckCircle2,
  DollarSign,
  Sparkles,
  AlertTriangle,
  Package,
  ArrowLeftRight,
  Heart,
  Repeat,
  MessageCircle,
  ShoppingBag,
  Info
} from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';
import { Classified, Store } from '../types';
import { MOCK_CLASSIFIEDS } from '../constants';

// --- CONSTANTES & UTILS ---

const TRADE_CATEGORIES = [
  { id: 'celular', label: 'Celular' },
  { id: 'games', label: 'Videogame' },
  { id: 'notebook', label: 'Notebook' },
  { id: 'bike', label: 'Bicicleta' },
  { id: 'moveis', label: 'Móveis' },
  { id: 'roupas', label: 'Roupas' },
  { id: 'outro', label: 'Outro' }
];

const FALLBACK_ITEM_IMAGES = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800',
  'https://images.unsplash.com/photo-1585659722982-789600c7690a?q=80&w=800',
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800'
];

const getFallbackItemImage = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return FALLBACK_ITEM_IMAGES[Math.abs(hash) % FALLBACK_ITEM_IMAGES.length];
};

interface DesapegaViewProps {
  onBack: () => void;
  user: User | null;
  onRequireLogin: () => void;
  onNavigate: (view: string, data?: any) => void;
}

// --- SUB-COMPONENTES ---

const DesapegaCard: React.FC<{ item: Classified; onClick: () => void }> = ({ item, onClick }) => {
  const displayImage = item.imageUrl || getFallbackItemImage(item.id);

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-md cursor-pointer active:scale-[0.99]"
    >
      <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden">
        <img 
          src={displayImage} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {item.acceptsTrade && (
             <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] bg-purple-600 text-white shadow-lg border border-white/20 flex items-center gap-1">
                <Repeat size={10} strokeWidth={3} /> Troca
             </span>
          )}
          <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] bg-indigo-600 text-white shadow-lg border border-white/20">
            VENDA
          </span>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-black text-lg text-gray-900 dark:text-white leading-tight mb-2 truncate">
          {item.title}
        </h3>
        
        <div className="flex items-center gap-4 text-gray-400 mb-4">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
            <MapPin size={12} className="text-blue-500" />
            {item.neighborhood}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
            <Clock size={12} className="text-blue-500" />
            {item.timestamp}
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-gray-50 dark:border-gray-800 pt-4">
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Preço</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 italic leading-none">
              {item.price || 'A combinar'}
            </p>
          </div>
          <button className="bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-600 dark:text-gray-300 font-black py-3 px-6 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest text-[9px] transition-all">
            Detalhes
            <ChevronRight size={12} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

export const DesapegaView: React.FC<DesapegaViewProps> = ({ onBack, user, onRequireLogin, onNavigate }) => {
  // Navigation States
  const [viewState, setViewState] = useState<'list' | 'match_intro' | 'match_deck' | 'match_success' | 'form_media' | 'form_details' | 'form_description' | 'form_price' | 'success'>('list');
  
  // List States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [filterHood, setFilterHood] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Match States
  const [matchDeckIndex, setMatchDeckIndex] = useState(0);
  const [matchedItem, setMatchedItem] = useState<Classified | null>(null);
  const [myTradeItem, setMyTradeItem] = useState<Classified | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Outros',
    subcategory: '',
    brand: '',
    gender: '',
    condition: 'Usado',
    neighborhood: 'Freguesia',
    description: '',
    whatsapp: '',
    price: '',
    images: [] as string[],
    acceptsTrade: false,
    tradeInterests: [] as string[],
    tradeCondition: 'any' as 'direct' | 'diff_money' | 'any'
  });

  // Mock de itens do próprio usuário para troca (Simulação)
  const userItems = useMemo(() => {
      if (!user) return [];
      return [
        { 
            id: 'my-1', 
            title: 'Violão Yamaha C40', 
            price: 'R$ 600,00', 
            category: 'Instrumentos', 
            neighborhood: 'Freguesia', 
            description: 'Usado poucas vezes', 
            timestamp: 'Ontem',
            contactWhatsapp: '00',
            typeLabel: 'Venda',
            advertiser: user.email || 'Eu',
            imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=800'
        }
      ];
  }, [user]);

  // Itens disponíveis no Desapega
  const desapegaItems = useMemo(() => MOCK_CLASSIFIEDS.filter(item => item.category === 'Desapega JPA'), []);
  
  // Itens filtrados para a lista
  const filteredItems = useMemo(() => {
    return desapegaItems.filter(item => !filterHood || item.neighborhood === filterHood);
  }, [desapegaItems, filterHood]);

  // Itens para o Match (Apenas os que aceitam troca)
  const matchStack = useMemo(() => {
      const base = desapegaItems.filter(item => item.acceptsTrade);
      // Garantir 10-15 itens fake para o deck
      const extraItems: Classified[] = [
          { id: 'fake-trade-1', advertiser: 'Thiago R.', title: 'Playstation 4 Slim', category: 'Desapega JPA', neighborhood: 'Taquara', description: 'Com 2 controles', timestamp: 'Hoje', contactWhatsapp: '00', typeLabel: 'Troca', price: 'R$ 1.200', imageUrl: 'https://images.unsplash.com/photo-1506041851282-a3a9a797a7e2?q=80&w=800', acceptsTrade: true, tradeInterests: ['Xbox', 'Nintendo'] },
          { id: 'fake-trade-2', advertiser: 'Carla M.', title: 'Bicicleta Caloi Aro 29', category: 'Desapega JPA', neighborhood: 'Freguesia', description: 'Revisada', timestamp: 'Ontem', contactWhatsapp: '00', typeLabel: 'Troca', price: 'R$ 900', imageUrl: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=800', acceptsTrade: true, tradeInterests: ['Celular'] },
          { id: 'fake-trade-3', advertiser: 'João P.', title: 'Sofá Retrátil 3 Lugares', category: 'Desapega JPA', neighborhood: 'Pechincha', description: 'Confortável', timestamp: '2 dias', contactWhatsapp: '00', typeLabel: 'Troca', price: 'R$ 500', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800', acceptsTrade: true, tradeInterests: ['TV'] },
          { id: 'fake-trade-4', advertiser: 'Ana L.', title: 'iPhone 11 64GB', category: 'Desapega JPA', neighborhood: 'Anil', description: 'Bateria 85%', timestamp: 'Hoje', contactWhatsapp: '00', typeLabel: 'Troca', price: 'R$ 1.500', imageUrl: 'https://images.unsplash.com/photo-1616348436168-de43ad0e12de?q=80&w=800', acceptsTrade: true, tradeInterests: ['Android', 'PC'] },
          { id: 'fake-trade-5', advertiser: 'Pedro H.', title: 'Guitarra Giannini', category: 'Desapega JPA', neighborhood: 'Tanque', description: 'Acústica', timestamp: '3 dias', contactWhatsapp: '00', typeLabel: 'Troca', price: 'R$ 400', imageUrl: 'https://images.unsplash.com/photo-1550985543-f4423c8d32b5?q=80&w=800', acceptsTrade: true, tradeInterests: ['Teclado'] },
          { id: 'fake-trade-6', advertiser: 'Lucas S.', title: 'Cadeira Gamer', category: 'Desapega JPA', neighborhood: 'Curicica', description: 'Ergonômica', timestamp: '1 semana', contactWhatsapp: '00', typeLabel: 'Troca', price: 'R$ 350', imageUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=800', acceptsTrade: true, tradeInterests: ['Monitor'] },
          { id: 'fake-trade-7', advertiser: 'Mariana F.', title: 'Smart TV 43"', category: 'Desapega JPA', neighborhood: 'Freguesia', description: '4K UHD', timestamp: 'Ontem', contactWhatsapp: '00', typeLabel: 'Troca', price: 'R$ 1.100', imageUrl: 'https://images.unsplash.com/photo-1593784653056-143414518a92?q=80&w=800', acceptsTrade: true, tradeInterests: ['Videogame'] },
          { id: 'fake-trade-8', advertiser: 'Rafael G.', title: 'Microondas Inox', category: 'Desapega JPA', neighborhood: 'Taquara', description: '20 Litros', timestamp: 'Hoje', contactWhatsapp: '00', typeLabel: 'Troca', price: 'R$ 300', imageUrl: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=800', acceptsTrade: true, tradeInterests: ['Airfryer'] }
      ];
      return [...base, ...extraItems];
  }, [desapegaItems]);

  const currentMatchCard = matchStack[matchDeckIndex];

  // --- ACTIONS ---

  const handleEnterMatchMode = () => {
    if (!user) {
        onRequireLogin();
        return;
    }
    if (userItems.length === 0) {
        alert("Para entrar no Troca-Troca, você precisa ter pelo menos um item anunciado para oferecer.");
        return;
    }
    setMyTradeItem(userItems[0]);
    setViewState('match_intro');
  };

  const handleStartSwiping = () => {
      setViewState('match_deck');
  };

  const handleMatchLike = () => {
      const isMatch = Math.random() > 0.5;
      
      if (isMatch) {
          setMatchedItem(currentMatchCard);
          setViewState('match_success');
      } else {
          handleNextCard();
      }
  };

  const handleNextCard = () => {
      if (matchDeckIndex < matchStack.length - 1) {
          setMatchDeckIndex(prev => prev + 1);
      } else {
          setMatchDeckIndex(0); // Loop
      }
  };

  const handleOpenMatchChat = () => {
      if (matchedItem) {
          const requestId = `TRADE-${Date.now()}`;
          // Pre-inject message in mock storage for the chat view
          const chatKey = `msgs_${requestId}_admin_auditoria`; // Using a generic merchant ID for demo
          const initialMsgs = [{
              id: `sys-trade-${Date.now()}`,
              requestId,
              senderId: 'system',
              senderName: 'Localizei JPA',
              senderRole: 'merchant',
              text: "Oi! Dei match no seu item. Vamos combinar a troca?",
              timestamp: new Date().toISOString()
          }];
          localStorage.setItem(chatKey, JSON.stringify(initialMsgs));

          // Navigate to ServiceChatView (reusing it for trade chat)
          onNavigate('service_chat', { 
              requestId: requestId,
              role: 'resident',
              professionalId: 'admin_auditoria' // Mock ID
          });
      }
  };

  const handleAnunciar = () => {
    if (!user) {
      onRequireLogin();
      return;
    }
    setViewState('form_media');
  };

  // FIX: handleItemClick added to correct scope
  const handleItemClick = (item: Classified) => {
    onNavigate('classified_detail', { item });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 6 - formData.images.length) as File[];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const isFirstImage = formData.images.length === 0;
          setFormData(prev => ({ ...prev, images: [...prev.images, result] }));
          if (isFirstImage) analyzeWithIA(result);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const analyzeWithIA = async (base64Data: string) => {
    setIsAnalyzing(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const prompt = `Analise a foto deste produto para um anúncio de desapego. 
      Sugira em formato JSON: category, subcategory, brand, title, description, gender`;
      const base64Content = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
      const parts: Part[] = [{ text: prompt }, { inlineData: { mimeType: "image/jpeg", data: base64Content } as GenAIBlob }];
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts },
        config: { 
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      const suggestions = JSON.parse(response.text || '{}');
      setFormData(prev => ({ ...prev, ...suggestions }));
    } catch (error) { console.error("IA Error", error); } finally { setIsAnalyzing(false); }
  };

  const handleSubmitAd = () => {
      setIsSubmitting(true);
      setTimeout(() => {
          setIsSubmitting(false);
          setViewState('success');
      }, 2000);
  }

  // --- RENDERS ---

  if (viewState === 'match_intro') {
      return (
          <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
              <div className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-purple-500/30 animate-pulse">
                  <Repeat className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Troca-Troca do Bairro</h1>
              <p className="text-slate-300 text-sm leading-relaxed mb-10 max-w-xs mx-auto">
                  Deslize para encontrar alguém que queira o que você tem e tenha o que você quer. Sem burocracia.
              </p>
              
              <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 w-full max-w-sm mb-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg overflow-hidden shrink-0">
                      <img src={myTradeItem?.imageUrl} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Você está oferecendo</p>
                      <p className="text-sm font-bold text-white truncate">{myTradeItem?.title}</p>
                  </div>
              </div>

              <button 
                  onClick={handleStartSwiping}
                  className="w-full max-w-sm bg-purple-600 hover:bg-purple-700 text-white font-black py-5 rounded-[2rem] shadow-xl uppercase tracking-widest text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                  Começar a explorar <ArrowRight size={16} />
              </button>
              
              <button onClick={() => setViewState('list')} className="mt-6 text-slate-500 font-bold text-xs uppercase tracking-widest">Voltar</button>
          </div>
      );
  }

  if (viewState === 'match_deck' && currentMatchCard) {
      return (
          <div className="min-h-screen bg-slate-950 flex flex-col font-sans relative overflow-hidden">
              {/* Header com padding consistente */}
              <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-center">
                  <button onClick={() => setViewState('list')} className="p-2.5 bg-black/20 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-all active:scale-90">
                      <X size={24} />
                  </button>
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10">
                      <MapPin size={10} className="text-purple-400" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{currentMatchCard.neighborhood}</span>
                  </div>
              </div>

              {/* CARD AREA - Garanindo preenchimento total da largura (Stretch) */}
              <div className="flex-1 flex flex-col items-stretch pt-24 px-5 pb-6">
                  <div className="flex-1 relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 bg-slate-900 group">
                      <img 
                          src={currentMatchCard.imageUrl || getFallbackItemImage(currentMatchCard.id)} 
                          className="w-full h-full object-cover" 
                          alt={currentMatchCard.title} 
                      />
                      {/* Gradiente sutil para leitura de texto */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                          {currentMatchCard.tradeCondition === 'direct' && (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest mb-4 shadow-lg">
                                  <ArrowLeftRight size={10} strokeWidth={3} /> Troca Direta
                              </div>
                          )}
                          <h2 className="text-3xl font-black text-white leading-tight mb-2 drop-shadow-md">{currentMatchCard.title}</h2>
                          <div className="flex flex-col gap-1 mb-6">
                            <p className="text-purple-400 text-[10px] font-black uppercase tracking-widest">Tem interesse em:</p>
                            <p className="text-white/90 text-sm font-bold leading-relaxed line-clamp-2">
                                {currentMatchCard.tradeInterests?.join(', ') || 'Qualquer item do mesmo valor'}
                            </p>
                          </div>
                          <div className="h-1.5 w-12 bg-[#1E5BFF] rounded-full"></div>
                      </div>
                  </div>
              </div>

              {/* ACTION BUTTONS AREA */}
              <div className="pb-32 px-8 flex justify-between items-center w-full z-30 relative">
                  <button 
                      onClick={handleNextCard}
                      className="w-16 h-16 rounded-full bg-slate-800 text-red-500 flex items-center justify-center shadow-2xl border border-white/5 active:scale-90 transition-all hover:bg-slate-700"
                  >
                      <X size={32} strokeWidth={3} />
                  </button>
                  
                  <div className="flex flex-col items-center gap-1">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Jacarepaguá</span>
                      <Repeat size={14} className="text-slate-700" />
                  </div>

                  <button 
                      onClick={handleMatchLike}
                      className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1E5BFF] to-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-blue-500/30 active:scale-90 transition-all hover:scale-105 border-4 border-slate-950"
                  >
                      <Heart size={36} fill="currentColor" />
                  </button>
              </div>
          </div>
      );
  }

  if (viewState === 'match_success') {
      return (
          <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-slate-900"></div>
              
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 italic transform -rotate-6 mb-12 drop-shadow-2xl uppercase tracking-tighter">
                  Deu Match!
              </h1>

              <div className="flex items-center justify-center gap-4 mb-12 relative z-10 w-full px-4">
                  <div className="w-28 h-28 rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden transform -rotate-6 shrink-0">
                      <img src={myTradeItem?.imageUrl} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-14 h-14 bg-[#1E5BFF] rounded-2xl flex items-center justify-center absolute shadow-xl z-20 text-white animate-bounce-slow">
                      <Repeat size={28} />
                  </div>
                  <div className="w-28 h-28 rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden transform rotate-6 shrink-0">
                      <img src={matchedItem?.imageUrl} className="w-full h-full object-cover" />
                  </div>
              </div>

              <div className="space-y-2 mb-12 relative z-10">
                  <p className="text-white font-black text-xl uppercase tracking-tight">O vizinho curtiu seu item!</p>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto font-medium">
                      O dono de "{matchedItem?.title}" também quer trocar com você.
                  </p>
              </div>

              <div className="w-full max-w-xs space-y-3 relative z-10">
                  <button 
                      onClick={handleOpenMatchChat}
                      className="w-full bg-white text-blue-700 font-black py-5 rounded-[2rem] shadow-xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                      <MessageCircle size={18} fill="currentColor" />
                      Combinar Troca no Chat
                  </button>
                  <button 
                      onClick={() => setViewState('match_deck')}
                      className="w-full py-4 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors"
                  >
                      Continuar explorando
                  </button>
              </div>
          </div>
      );
  }

  // WIZARD DE CRIAÇÃO (MANTIDO CONFORME ORIGINAL)
  if (viewState.startsWith('form')) {
     return (
         <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col p-6 animate-in slide-in-from-right duration-300">
             <header className="flex items-center gap-4 mb-8">
                 <button onClick={() => setViewState('list')} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"><ChevronLeft size={20} /></button>
                 <h2 className="text-xl font-bold dark:text-white">Criar Anúncio</h2>
             </header>

             {viewState === 'form_media' && (
                 <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                         {formData.images.map((img, i) => (
                             <div key={i} className="aspect-square rounded-2xl overflow-hidden relative">
                                 <img src={img} className="w-full h-full object-cover" />
                             </div>
                         ))}
                         {formData.images.length < 4 && (
                             <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer">
                                 <Camera size={24} className="text-gray-400" />
                                 <span className="text-xs text-gray-500 font-bold mt-2">Adicionar</span>
                                 <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                             </label>
                         )}
                     </div>
                     {isAnalyzing && <div className="flex items-center gap-2 text-blue-500 font-bold text-sm justify-center"><Loader2 className="animate-spin" size={16} /> Analisando imagem...</div>}
                     <button onClick={() => setViewState('form_details')} disabled={formData.images.length === 0} className="w-full bg-[#1E5BFF] text-white font-bold py-4 rounded-xl disabled:opacity-50">Continuar</button>
                 </div>
             )}

             {viewState === 'form_details' && (
                 <div className="space-y-6">
                     <div>
                         <label className="text-xs font-bold text-gray-500 uppercase ml-1">Título</label>
                         <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-xl mt-1 outline-none font-bold" placeholder="O que você está vendendo?" />
                     </div>
                     <div>
                         <label className="text-xs font-bold text-gray-500 uppercase ml-1">Preço</label>
                         <input value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-xl mt-1 outline-none font-bold" placeholder="R$ 0,00" />
                     </div>
                     <div>
                         <label className="text-xs font-bold text-gray-500 uppercase ml-1">Condição</label>
                         <select value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl mt-1 outline-none font-bold">
                             <option>Novo</option>
                             <option>Usado - Como novo</option>
                             <option>Usado - Bom estado</option>
                         </select>
                     </div>
                     <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/50 cursor-pointer" onClick={() => setFormData({...formData, acceptsTrade: !formData.acceptsTrade})}>
                         <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.acceptsTrade ? 'bg-purple-600 border-purple-600' : 'border-gray-400'}`}>
                             {formData.acceptsTrade && <Check size={14} className="text-white" />}
                         </div>
                         <span className="font-bold text-purple-700 dark:text-purple-300 text-sm">Aceito Trocas</span>
                     </div>
                     <button onClick={() => setViewState('form_description')} disabled={!formData.title} className="w-full bg-[#1E5BFF] text-white font-bold py-4 rounded-xl disabled:opacity-50">Continuar</button>
                 </div>
             )}

            {viewState === 'form_description' && (
                 <div className="space-y-6">
                     <div>
                         <label className="text-xs font-bold text-gray-500 uppercase ml-1">Descrição</label>
                         <textarea rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-xl mt-1 outline-none font-medium resize-none" placeholder="Conte mais detalhes..." />
                     </div>
                     <button onClick={handleSubmitAd} disabled={isSubmitting} className="w-full bg-[#1E5BFF] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Publicar Anúncio'}
                     </button>
                 </div>
             )}
         </div>
     );
  }

  if (viewState === 'success') {
      return (
          <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 text-green-600">
                  <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Anúncio Publicado!</h2>
              <p className="text-gray-500 mb-8">Seu desapego já está visível para o bairro.</p>
              <button onClick={() => setViewState('list')} className="bg-[#1E5BFF] text-white font-bold py-3 px-8 rounded-xl">Voltar para lista</button>
          </div>
      )
  }

  // LISTA PADRÃO
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-40 animate-in slide-in-from-right duration-300 relative">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 py-6 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 transition-colors active:scale-90">
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Desapega</h1>
              <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Vendas no Bairro</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleAnunciar}
              className="px-3 py-1.5 bg-[#1E5BFF] hover:bg-blue-600 text-white font-black rounded-full shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 uppercase tracking-widest text-[9px] border border-white/10 active:scale-95 transition-all h-9"
            >
              <Plus size={12} strokeWidth={4} />
              Anunciar
            </button>
            <button 
              onClick={() => setIsFilterModalOpen(true)}
              className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-all shadow-sm"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8">
        
        {/* NOVO ENTRY POINT DO TROCA-TROCA */}
        <div 
            onClick={handleEnterMatchMode}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[2.5rem] p-6 text-white shadow-xl shadow-purple-500/20 relative overflow-hidden cursor-pointer group active:scale-[0.98] transition-all"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 mb-3">
                        <Repeat size={12} className="text-white" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Novo</span>
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2">Troca-Troca <br/> do Bairro</h2>
                    <p className="text-xs text-purple-100 font-medium max-w-[180px]">Dê match em itens que você quer e desapegue do que não usa mais.</p>
                </div>
                <div className="w-12 h-12 bg-white text-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <ArrowRight size={20} strokeWidth={3} />
                </div>
            </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredItems.map(item => (
              <DesapegaCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center animate-in fade-in duration-700">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-[2.5rem] flex items-center justify-center mb-6 text-gray-400">
              <Tag size={32} />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Nenhum item à venda</h3>
          </div>
        )}
      </main>
    </div>
  );
};
