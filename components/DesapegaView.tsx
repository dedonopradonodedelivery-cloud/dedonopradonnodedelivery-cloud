
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { GoogleGenAI, Type, Part, Blob as GenAIBlob } from "@google/genai";
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
  Smartphone,
  Shirt,
  Baby,
  Gamepad,
  Home as HomeIcon,
  Wrench,
  BookOpen,
  Car,
  Dog,
  Repeat,
  RotateCcw,
  ArrowLeftRight
} from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';
import { Classified, Store } from '../types';
import { MOCK_CLASSIFIEDS, STORES } from '../constants';

// Dicionário de Categorias e Subcategorias
const CATEGORY_MAP: Record<string, string[]> = {
  "Moda e Beleza": ["Roupas", "Calçados", "Acessórios", "Cosméticos", "Relógios", "Outros"],
  "Eletrônicos e Celulares": ["Celulares", "Notebooks", "Tablets", "Acessórios", "Games", "TVs", "Outros"],
  "Casa e Decoração": ["Decoração", "Utensílios", "Cama, Mesa e Banho", "Iluminação", "Outros"],
  "Móveis": ["Sofás", "Camas", "Armários", "Mesas e Cadeiras", "Estantes", "Outros"],
  "Eletrodomésticos": ["Geladeiras", "Fogões", "Máquinas de Lavar", "Micro-ondas", "Ar Condicionado", "Outros"],
  "Esporte e Lazer": ["Bicicletas", "Academia", "Camping", "Instrumentos Musicais", "Outros"],
  "Infantil e Bebês": ["Brinquedos", "Carrinhos e Cadeirinhas", "Roupas", "Enxoval", "Outros"],
  "Livros e Papelaria": ["Livros", "Revistas", "Material Escolar", "Outros"],
  "Automotivo": ["Peças", "Acessórios", "Som", "Pneus", "Outros"],
  "Pet": ["Acessórios", "Casinhas", "Brinquedos", "Outros"],
  "Ferramentas e Construção": ["Elétricas", "Manuais", "Material de Construção", "Outros"],
  "Outros": ["Geral"]
};

// Categorias simplificadas para filtro de troca
const TRADE_CATEGORIES = [
  { id: 'celular', label: 'Celular' },
  { id: 'games', label: 'Videogame' },
  { id: 'notebook', label: 'Notebook' },
  { id: 'bike', label: 'Bicicleta' },
  { id: 'moveis', label: 'Móveis' },
  { id: 'roupas', label: 'Roupas' },
  { id: 'outro', label: 'Outro' }
];

interface DesapegaViewProps {
  onBack: () => void;
  user: User | null;
  onRequireLogin: () => void;
  onNavigate: (view: string, data?: any) => void;
}

// Fallback images for desapega items (Objects/Products)
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
                <ArrowLeftRight size={10} strokeWidth={3} /> Troca
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

// Componente Card de Troca (Estilo Tinder)
const TradeCard: React.FC<{ item: Classified; onPass: () => void; onMatch: () => void }> = ({ item, onPass, onMatch }) => {
    const displayImage = item.imageUrl || getFallbackItemImage(item.id);

    return (
        <div className="w-full max-w-sm h-[65vh] relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 group animate-in zoom-in-95 duration-300">
            <img src={displayImage} className="w-full h-full object-cover" alt={item.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 pb-10 flex flex-col items-center">
                <div className="w-full text-left mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-purple-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
                            Aceita Troca
                        </span>
                        <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/10 flex items-center gap-1">
                            <MapPin size={10} /> {item.neighborhood}
                        </span>
                    </div>
                    <h2 className="text-3xl font-black text-white leading-tight drop-shadow-md mb-2">{item.title}</h2>
                    {item.tradeCondition === 'direct' && (
                        <p className="text-emerald-400 text-xs font-black uppercase tracking-widest">🔄 Troca Direta (Pau a Pau)</p>
                    )}
                    {item.tradeCondition === 'diff_money' && (
                        <p className="text-amber-400 text-xs font-black uppercase tracking-widest">💰 Aceita oferta em dinheiro</p>
                    )}
                     <p className="text-white/80 text-sm font-medium mt-2 line-clamp-2">
                        Aceito troca por: {item.tradeInterests?.join(', ') || 'Algo do meu interesse'}
                    </p>
                </div>

                <div className="flex items-center gap-6 w-full justify-center">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onPass(); }}
                        className="w-16 h-16 rounded-full bg-white text-red-500 shadow-xl flex items-center justify-center hover:scale-110 transition-transform border-4 border-gray-100"
                    >
                        <X size={32} strokeWidth={3} />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onMatch(); }}
                        className="w-20 h-20 rounded-full bg-purple-600 text-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform border-4 border-purple-400 shadow-purple-500/50"
                    >
                        <Repeat size={36} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Modal de Proposta de Troca
const TradeProposalModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    targetItem: Classified; 
    myItems: Classified[]; // Mock dos itens do usuário atual
    onSendProposal: (myItem: Classified, diffType: string, diffValue: string) => void; 
}> = ({ isOpen, onClose, targetItem, myItems, onSendProposal }) => {
    const [step, setStep] = useState(1);
    const [selectedMyItem, setSelectedMyItem] = useState<Classified | null>(null);
    const [diffType, setDiffType] = useState<'none' | 'pay' | 'receive'>('none');
    const [diffValue, setDiffValue] = useState('');

    if (!isOpen) return null;

    const handleNext = () => {
        if (step === 1 && selectedMyItem) setStep(2);
        else if (step === 2) onSendProposal(selectedMyItem!, diffType, diffValue);
    };

    return (
        <div className="fixed inset-0 z-[1200] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl flex flex-col max-h-[85vh]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Propor Troca</h3>
                    <button onClick={onClose}><X className="text-gray-400" /></button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {step === 1 && (
                        <div className="space-y-6">
                            <p className="text-sm text-gray-500 font-medium">O que você oferece em troca de <strong>{targetItem.title}</strong>?</p>
                            <div className="space-y-3">
                                {myItems.length > 0 ? myItems.map(item => (
                                    <div 
                                        key={item.id} 
                                        onClick={() => setSelectedMyItem(item)}
                                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedMyItem?.id === item.id ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800'}`}
                                    >
                                        <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                                            <img src={item.imageUrl || getFallbackItemImage(item.id)} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{item.title}</h4>
                                            <p className="text-xs text-gray-500 font-bold">{item.price}</p>
                                        </div>
                                        <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMyItem?.id === item.id ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'}`}>
                                            {selectedMyItem?.id === item.id && <Check size={12} strokeWidth={4} />}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200">
                                        <p className="text-xs text-gray-500 font-bold mb-2">Você não tem itens anunciados.</p>
                                        <button className="text-purple-600 text-xs font-black uppercase underline">Anunciar agora</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                    <img src={selectedMyItem?.imageUrl || ''} className="w-full h-full object-cover" />
                                </div>
                                <ArrowRight className="text-gray-400" />
                                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                    <img src={targetItem.imageUrl || ''} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-xs font-bold text-gray-500 ml-auto">Ajuste?</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => setDiffType('none')} className={`p-3 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all ${diffType === 'none' ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-200 text-gray-500'}`}>Sem Volta</button>
                                <button onClick={() => setDiffType('pay')} className={`p-3 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all ${diffType === 'pay' ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-200 text-gray-500'}`}>Eu Pago +</button>
                                <button onClick={() => setDiffType('receive')} className={`p-3 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all ${diffType === 'receive' ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-200 text-gray-500'}`}>Recebo +</button>
                            </div>

                            {diffType !== 'none' && (
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Valor da diferença</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                                        <input 
                                            type="tel" 
                                            value={diffValue}
                                            onChange={e => setDiffValue(e.target.value)}
                                            placeholder="0,00"
                                            className="w-full bg-gray-50 dark:bg-gray-800 p-4 pl-10 rounded-2xl font-bold text-lg outline-none focus:ring-2 focus:ring-purple-500"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="pt-6 mt-4 border-t border-gray-100 dark:border-gray-800">
                    <button 
                        onClick={handleNext}
                        disabled={step === 1 && !selectedMyItem}
                        className="w-full bg-purple-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-500/20 active:scale-95 transition-all uppercase tracking-widest text-xs"
                    >
                        {step === 1 ? 'Continuar' : 'Enviar Proposta'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const DesapegaView: React.FC<DesapegaViewProps> = ({ onBack, user, onRequireLogin, onNavigate }) => {
  const [viewState, setViewState] = useState<'list' | 'troca_mode' | 'form_media' | 'form_details' | 'form_description' | 'form_price' | 'success'>('list');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [filterHood, setFilterHood] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPriceWarning, setShowPriceWarning] = useState(false);
  
  // Troca Mode States
  const [matchIndex, setMatchIndex] = useState(0);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    brand: '',
    gender: '',
    condition: 'Usado',
    neighborhood: '',
    description: '',
    whatsapp: '',
    price: '',
    acceptExchange: false,
    images: [] as string[],
    // Novos campos
    acceptsTrade: false,
    tradeInterests: [] as string[],
    tradeCondition: 'any' as 'direct' | 'diff_money' | 'any'
  });

  // Mock de itens do próprio usuário para troca
  const myMockItems = useMemo(() => [
      { 
          id: 'my-1', 
          title: 'Violão Acústico Yamaha', 
          price: 'R$ 600,00', 
          category: 'Instrumentos', 
          neighborhood: 'Freguesia', 
          description: 'Usado poucas vezes', 
          timestamp: 'Ontem',
          contactWhatsapp: '00',
          typeLabel: 'Venda',
          advertiser: 'Eu',
          imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=800'
      }
  ], []);

  const desapegaItems = useMemo(() => {
    return MOCK_CLASSIFIEDS.filter(item => item.category === 'Desapega JPA');
  }, []);

  const filteredItems = useMemo(() => {
    return desapegaItems.filter(item => !filterHood || item.neighborhood === filterHood);
  }, [desapegaItems, filterHood]);

  // Itens elegíveis para Troca-Troca
  const tradeItems = useMemo(() => {
      return desapegaItems.filter(item => item.acceptsTrade);
  }, [desapegaItems]);

  const currentTradeItem = tradeItems[matchIndex];

  const handleAnunciar = () => {
    if (!user) {
      onRequireLogin();
      return;
    }
    setViewState('form_media');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Cast the result of Array.from to File[] to fix the 'unknown[]' incompatibility error.
      const files = Array.from(e.target.files).slice(0, 6 - formData.images.length) as File[];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          
          const isFirstImage = formData.images.length === 0;

          setFormData(prev => ({
            ...prev,
            images: [...prev.images, result]
          }));
          
          // Trigger AI analysis if this is the first image being added
          if (isFirstImage) {
            analyzeWithIA(result);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const analyzeWithIA = async (base64Data: string) => {
    setIsAnalyzing(true);
    // Always use new GoogleGenAI({apiKey: process.env.API_KEY}); as per coding guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const prompt = `Analise a foto deste produto para um anúncio de desapego. 
      Sugira em formato JSON:
      1. category (escolha uma das: ${Object.keys(CATEGORY_MAP).join(', ')})
      2. subcategory (compatível com a categoria)
      3. brand (se visível ou aplicável)
      4. title (máximo 40 caracteres)
      5. description (profissional e vendedora)
      6. gender (se for Moda e Beleza: Masculino, Feminino, Unissex ou Infantil)`;

      const base64Content = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;

      // FIX: Explicitly typed parts as Part[] and used GenAIBlob alias to distinguish from browser global Blob.
      // This resolves the error where 'inlineData' was being validated against the browser's Blob interface.
      const parts: Part[] = [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: base64Content } as GenAIBlob }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              subcategory: { type: Type.STRING },
              brand: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              gender: { type: Type.STRING }
            }
          }
        }
      });

      // Getting the generated text content by accessing the .text property on the response object directly (property access, not a method).
      const text = response.text;
      const suggestions = JSON.parse(text || '{}');
      setFormData(prev => ({
        ...prev,
        category: suggestions.category || '',
        subcategory: suggestions.subcategory || '',
        brand: suggestions.brand || '',
        title: suggestions.title || '',
        description: suggestions.description || '',
        gender: suggestions.gender || ''
      }));
    } catch (error) {
      console.error("Erro na análise IA:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmitFinal = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setViewState('success');
    }, 2000);
  };

  const handleItemClick = (item: Classified) => {
    onNavigate('classified_detail', { item });
  };

  const toggleTradeInterest = (id: string) => {
      setFormData(prev => ({
          ...prev,
          tradeInterests: prev.tradeInterests.includes(id) 
            ? prev.tradeInterests.filter(i => i !== id) 
            : [...prev.tradeInterests, id]
      }));
  };

  // Troca Actions
  const nextMatch = () => {
      if (matchIndex < tradeItems.length - 1) setMatchIndex(prev => prev + 1);
      else setMatchIndex(0); // Loop for demo
  };

  const handleProposeTrade = () => {
      if (!user) { onRequireLogin(); return; }
      setIsProposalModalOpen(true);
  };

  const submitProposal = () => {
      setIsProposalModalOpen(false);
      setShowMatchAnimation(true);
      setTimeout(() => {
          setShowMatchAnimation(false);
          nextMatch();
      }, 2000);
  };

  // --- RENDER FORM STEPS ---

  if (viewState === 'form_media') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans animate-in slide-in-from-right duration-300">
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <button onClick={() => setViewState('list')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">Como vai ser o anúncio?</h1>
        </header>

        <main className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar">
          <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-[2.5rem] border border-blue-100 dark:border-blue-800/30 flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
              <Sparkles size={24} />
            </div>
            <p className="text-sm font-bold text-blue-800 dark:text-blue-300">Usar inteligência artificial para criar um anúncio incrível</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">Basta adicionar a primeira foto e nossa IA sugere os campos para você.</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fotos (Adicione até 6)</label>
              <span className="text-[10px] font-bold text-gray-400">{formData.images.length}/6</span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {formData.images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
                  <img src={img} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full transition-transform active:scale-90"><X size={10}/></button>
                </div>
              ))}
              {formData.images.length < 6 && (
                <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-all active:scale-[0.98]">
                  <Camera size={28} />
                  <span className="text-[9px] font-bold mt-2 uppercase tracking-widest">Adicionar</span>
                  <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>

          {isAnalyzing && (
            <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">A IA está analisando suas fotos...</p>
            </div>
          )}
        </main>

        <footer className="p-6 border-t border-gray-100 dark:border-gray-800">
          <button 
            disabled={formData.images.length === 0 || isAnalyzing}
            onClick={() => setViewState('form_details')}
            className="w-full bg-indigo-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-sm transition-all active:scale-95"
          >
            Continuar para detalhes <ArrowRight size={18} />
          </button>
        </footer>
      </div>
    );
  }

  if (viewState === 'form_details') {
    const showBrand = ["Eletrônicos e Celulares", "Eletromésticos", "Automotivo", "Moda e Beleza"].includes(formData.category);
    const showGender = formData.category === "Moda e Beleza";

    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans animate-in slide-in-from-right duration-300">
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <button onClick={() => setViewState('form_media')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">Características</h1>
        </header>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
           <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Categoria *</label>
                <select 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value, subcategory: ''})} 
                  className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-bold dark:text-white"
                >
                  <option value="">Selecione</option>
                  {Object.keys(CATEGORY_MAP).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              {formData.category && (
                <div className="animate-in fade-in duration-300">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Tipo / Subcategoria *</label>
                  <select 
                    value={formData.subcategory} 
                    onChange={e => setFormData({...formData, subcategory: e.target.value})} 
                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-bold dark:text-white"
                  >
                    <option value="">Selecione</option>
                    {CATEGORY_MAP[formData.category].map(sub => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                </div>
              )}

              {showBrand && (
                <div className="animate-in fade-in duration-300">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Marca (Opcional)</label>
                  <input 
                    value={formData.brand} 
                    onChange={e => setFormData({...formData, brand: e.target.value})} 
                    placeholder="Ex: Apple, Nike, Samsung..." 
                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-bold dark:text-white shadow-inner" 
                  />
                </div>
              )}

              {showGender && (
                <div className="animate-in fade-in duration-300">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Gênero *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Masculino', 'Feminino', 'Unissex', 'Infantil'].map(g => (
                      <button 
                        key={g} 
                        onClick={() => setFormData({...formData, gender: g})}
                        className={`py-3 rounded-xl text-xs font-bold border transition-all ${formData.gender === g ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 border-transparent'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Condição *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Novo', 'Seminovo', 'Usado', 'Precisa de reparo'].map(c => (
                    <button 
                      key={c} 
                      onClick={() => setFormData({...formData, condition: c})}
                      className={`py-3 rounded-xl text-xs font-bold border transition-all ${formData.condition === c ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 border-transparent'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* BLOCO DE TROCA-TROCA */}
              <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                 <div className="flex items-center justify-between mb-4">
                     <label className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                        <ArrowLeftRight className="text-purple-500" size={18} />
                        Aceita troca?
                     </label>
                     <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                        <button onClick={() => setFormData({...formData, acceptsTrade: false})} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${!formData.acceptsTrade ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`}>Não</button>
                        <button onClick={() => setFormData({...formData, acceptsTrade: true})} className={`px-4 py-1.5 text-xs font-black uppercase rounded-lg transition-all ${formData.acceptsTrade ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400'}`}>Sim</button>
                     </div>
                 </div>

                 {formData.acceptsTrade && (
                     <div className="animate-in slide-in-from-top-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Aceito trocar por:</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {TRADE_CATEGORIES.map(cat => (
                                <button 
                                    key={cat.id} 
                                    onClick={() => toggleTradeInterest(cat.label)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${formData.tradeInterests.includes(cat.label) ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 text-purple-600' : 'bg-gray-50 dark:bg-gray-800 border-transparent text-gray-500'}`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                        
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Condição da troca:</p>
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => setFormData({...formData, tradeCondition: 'direct'})} className={`py-2 rounded-xl text-[10px] font-bold border ${formData.tradeCondition === 'direct' ? 'border-purple-600 text-purple-600 bg-purple-50' : 'border-gray-200 text-gray-500'}`}>Troca Direta</button>
                            <button onClick={() => setFormData({...formData, tradeCondition: 'diff_money'})} className={`py-2 rounded-xl text-[10px] font-bold border ${formData.tradeCondition === 'diff_money' ? 'border-purple-600 text-purple-600 bg-purple-50' : 'border-gray-200 text-gray-500'}`}>Aceito Oferta $</button>
                            <button onClick={() => setFormData({...formData, tradeCondition: 'any'})} className={`py-2 rounded-xl text-[10px] font-bold border ${formData.tradeCondition === 'any' ? 'border-purple-600 text-purple-600 bg-purple-50' : 'border-gray-200 text-gray-500'}`}>Aberto</button>
                        </div>
                     </div>
                 )}
              </div>
           </div>
        </main>

        <footer className="p-6 border-t border-gray-100 dark:border-gray-800">
          <button 
            disabled={!formData.category || !formData.subcategory || (showGender && !formData.gender)}
            onClick={() => setViewState('form_description')}
            className="w-full bg-indigo-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs transition-all"
          >
            Continuar para descrição <ArrowRight size={18} />
          </button>
        </footer>
      </div>
    );
  }

  if (viewState === 'form_description') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans animate-in slide-in-from-right duration-300">
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <button onClick={() => setViewState('form_details')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">Descrição</h1>
        </header>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
           <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tighter">Crie uma descrição para seu anúncio</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Anúncios completos vendem mais rápido.</p>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Título do Anúncio *</label>
                <input 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="Ex: iPhone 13 Pro 128GB Azul" 
                  className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-bold dark:text-white shadow-inner" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Descrição Detalhada</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Conte detalhes sobre o estado do item, tempo de uso, acessórios inclusos..." 
                  rows={6} 
                  className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-medium dark:text-white resize-none shadow-inner" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Localização (Bairro) *</label>
                    <select value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-bold dark:text-white">
                      <option value="">Selecione</option>
                      {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Contato (WhatsApp) *</label>
                    <input value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} placeholder="(21) 99999-9999" className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-bold dark:text-white" />
                  </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-3xl border border-amber-200 dark:border-amber-800/30 flex gap-4">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                      <p className="text-xs text-amber-800 dark:text-amber-200 font-black uppercase tracking-widest">Atenção</p>
                      <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                        O Localizei JPA não solicita códigos, pagamentos ou comprovantes por ligação, chat ou WhatsApp. Desconfie de contatos fora da plataforma.
                      </p>
                  </div>
              </div>
           </div>
        </main>

        <footer className="p-6 border-t border-gray-100 dark:border-gray-800">
          <button 
            disabled={!formData.title || !formData.neighborhood || !formData.whatsapp}
            onClick={() => setViewState('form_price')}
            className="w-full bg-indigo-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-sm transition-all"
          >
            Continuar para preço <ArrowRight size={18} />
          </button>
        </footer>
      </div>
    );
  }

  if (viewState === 'form_price') {
    const p = parseFloat(formData.price || '0');
    const isSuspiciouslyLow = p > 0 && p < 10;

    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans animate-in slide-in-from-right duration-300">
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <button onClick={() => setViewState('form_description')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">Definir o Preço</h1>
        </header>

        <main className="flex-1 p-8 flex flex-col items-center justify-center space-y-10 overflow-y-auto no-scrollbar">
           <div className="w-full text-center">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Valor do Item</label>
              <div className="relative group max-w-xs mx-auto">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-black text-gray-300 group-focus-within:text-indigo-600 transition-colors">R$</span>
                  <input 
                    type="number" 
                    value={formData.price} 
                    onChange={e => {setFormData({...formData, price: e.target.value}); setShowPriceWarning(false);}} 
                    placeholder="0,00" 
                    className="w-full bg-white dark:bg-gray-900 border-b-4 border-gray-100 dark:border-gray-800 py-6 pl-16 pr-4 text-5xl font-black text-gray-900 dark:text-white outline-none focus:border-indigo-600 transition-all text-center" 
                  />
              </div>

              {isSuspiciouslyLow && !showPriceWarning && (
                <div className="mt-8 p-5 bg-rose-50 dark:bg-rose-900/10 rounded-3xl border border-rose-200 dark:border-rose-800/30 animate-in zoom-in duration-300 max-w-sm mx-auto">
                    <p className="text-xs text-rose-800 dark:text-rose-200 font-bold mb-3">Esse valor parece abaixo do mercado. Deseja revisar?</p>
                    <div className="flex gap-4 justify-center">
                      <button onClick={() => setFormData({...formData, price: ''})} className="text-[10px] font-black uppercase text-rose-600 underline">Ajustar valor</button>
                      <button onClick={() => setShowPriceWarning(true)} className="text-[10px] font-black uppercase text-gray-400">Continuar mesmo assim</button>
                    </div>
                </div>
              )}
           </div>

           <div className="w-full max-sm mx-auto">
             <label className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 cursor-pointer transition-all active:scale-[0.98]">
               <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${formData.acceptExchange ? 'bg-indigo-600 border-indigo-600' : 'bg-white dark:bg-gray-800 border-gray-200'}`}>
                 {formData.acceptExchange && <Check size={16} className="text-white" strokeWidth={4} />}
               </div>
               <input type="checkbox" className="hidden" checked={formData.acceptExchange} onChange={e => setFormData({...formData, acceptExchange: e.target.value})} />
               <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Aceita troca neste item?</span>
             </label>
           </div>
        </main>

        <footer className="p-6 border-t border-gray-100 dark:border-gray-800">
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-[2rem] mb-6 border border-gray-100 dark:border-gray-800 space-y-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Resumo da Publicação</p>
                <div className="flex justify-between items-center text-xs font-bold text-gray-600 dark:text-gray-400">
                    <span>Categoria: {formData.category}</span>
                    <span>Condição: {formData.condition}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-gray-600 dark:text-gray-400">
                    <span>Bairro: {formData.neighborhood}</span>
                    <span className="text-indigo-600">R$ {parseFloat(formData.price || '0').toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                </div>
            </div>
            <button 
              disabled={!formData.price || isSubmitting}
              onClick={handleSubmitFinal}
              className="w-full bg-indigo-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm transition-all"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <>Publicar anúncio <CheckCircle2 size={18}/></>}
            </button>
        </footer>
      </div>
    );
  }

  if (viewState === 'success') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2.5rem] flex items-center justify-center mb-8 text-emerald-600 shadow-xl">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4">Item anunciado!</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-12">Seu anúncio do desapega foi publicado e está disponível para os moradores.</p>
        <button onClick={() => setViewState('list')} className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl uppercase tracking-widest text-xs">Voltar para a lista</button>
      </div>
    );
  }

  // --- TROCA-TROCA MODE (TINDER STYLE) ---
  if (viewState === 'troca_mode') {
      return (
          <div className="min-h-screen bg-slate-950 flex flex-col items-center font-sans overflow-hidden">
              <header className="absolute top-0 left-0 right-0 p-5 z-20 flex justify-between items-center">
                  <button onClick={() => setViewState('list')} className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-colors">
                      <X size={20} />
                  </button>
                  <span className="text-xs font-black text-white uppercase tracking-[0.2em] bg-purple-600/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-purple-500/30">
                      Modo Troca-Troca
                  </span>
                  <div className="w-10"></div>
              </header>

              <main className="flex-1 flex flex-col items-center justify-center w-full px-4 pt-16">
                  {tradeItems.length > 0 ? (
                      <div className="relative w-full max-w-sm flex flex-col items-center">
                          <TradeCard 
                            item={currentTradeItem} 
                            onPass={nextMatch} 
                            onMatch={handleProposeTrade} 
                          />
                          
                          {showMatchAnimation && (
                              <div className="absolute inset-0 z-50 flex items-center justify-center animate-in zoom-in duration-300">
                                  <div className="bg-white p-8 rounded-full shadow-2xl animate-bounce">
                                      <CheckCircle2 size={64} className="text-green-500" />
                                  </div>
                              </div>
                          )}
                      </div>
                  ) : (
                      <div className="text-center opacity-60">
                          <AlertTriangle className="w-12 h-12 text-white mx-auto mb-4" />
                          <p className="text-white text-sm font-bold">Nenhum item disponível para troca no momento.</p>
                          <button onClick={() => setViewState('list')} className="mt-8 text-white underline text-xs uppercase font-black">Voltar para lista</button>
                      </div>
                  )}
              </main>
              
              <div className="p-6 pb-12 w-full text-center z-10">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                      O app não intermedia pagamentos • Negocie com segurança
                  </p>
              </div>

              <TradeProposalModal 
                isOpen={isProposalModalOpen} 
                onClose={() => setIsProposalModalOpen(false)}
                targetItem={currentTradeItem}
                myItems={myMockItems} // Mocked user items
                onSendProposal={submitProposal}
              />
          </div>
      );
  }

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
              onClick={() => setViewState('troca_mode')}
              className="p-2.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl active:scale-90 transition-all shadow-sm border border-purple-200 dark:border-purple-800"
              title="Modo Troca-Troca"
            >
              <Repeat size={20} strokeWidth={2.5} />
            </button>
            
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

      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsFilterModalOpen(false)}>
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] sm:rounded-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6 pb-0 flex flex-col shrink-0">
                  <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 sm:hidden"></div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Filtros Desapega</h2>
                    <button onClick={() => setIsFilterModalOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400"><X size={20}/></button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 p-6 pt-0">
                    <section>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Bairro em Jacarepaguá</h4>
                        <div className="flex flex-wrap gap-2">
                            <button 
                                onClick={() => setFilterHood(null)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${filterHood === null ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-transparent'}`}
                            >
                                Jacarepaguá (Todos)
                            </button>
                            {NEIGHBORHOODS.map(hood => (
                                <button 
                                    key={hood}
                                    onClick={() => setFilterHood(hood)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${filterHood === hood ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-transparent'}`}
                                >
                                    {hood}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
                    <button onClick={() => setIsFilterModalOpen(false)} className="w-full py-4 text-xs font-black text-white uppercase tracking-widest bg-[#1E5BFF] rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all">Aplicar Filtros</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
