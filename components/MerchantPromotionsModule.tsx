import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ChevronLeft, 
  Plus, 
  Tag, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  CalendarDays, 
  Zap, 
  Clock, 
  ChevronRight, 
  MessageSquare,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Info
} from 'lucide-react';
import { StorePromotion, PromotionType, PromotionStatus, CommunityPost } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface MerchantPromotionsModuleProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
}

export const MerchantPromotionsModule: React.FC<MerchantPromotionsModuleProps> = ({ onBack, onNavigate }) => {
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'form'>('list');
  const [promotions, setPromotions] = useState<StorePromotion[]>([]);
  const [editingPromo, setEditingPromo] = useState<StorePromotion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<PromotionType>('Dia');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [value, setValue] = useState('');
  const [discount, setDiscount] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [publishToCommunity, setPublishToCommunity] = useState(false);

  const storeId = user?.id || 'm-123'; // Mock para id da loja
  const storageKey = `promotions_${storeId}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setPromotions(JSON.parse(saved));
    setIsLoading(false);
  }, [storeId]);

  const handleCreateNew = () => {
    setEditingPromo(null);
    setTitle('');
    setDescription('');
    setType('Dia');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setValue('');
    setDiscount('');
    setImages([]);
    setPublishToCommunity(false);
    setView('form');
  };

  const handleEdit = (promo: StorePromotion) => {
    setEditingPromo(promo);
    setTitle(promo.title);
    setDescription(promo.description);
    setType(promo.type);
    setStartDate(promo.startDate);
    setEndDate(promo.endDate);
    setValue(promo.value ? String(promo.value) : '');
    setDiscount(promo.discount ? String(promo.discount) : '');
    setImages(promo.images);
    setPublishToCommunity(false); // Sempre desativado ao editar para evitar repost automático
    setView('form');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // FIX: Cast the result of Array.from to File[] to resolve 'unknown' to 'Blob' assignment error in readAsDataURL
      const files = Array.from(e.target.files).slice(0, 6 - images.length) as File[];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSave = async () => {
    if (!title || !description || !type || !startDate || !endDate || images.length === 0) {
      alert("Por favor, preencha todos os campos obrigatórios e adicione ao menos uma imagem.");
      return;
    }

    setIsSaving(true);
    const now = new Date().getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    let status: PromotionStatus = 'active';
    if (now < start) status = 'scheduled';
    if (now > end) status = 'expired';

    const newPromo: StorePromotion = {
      id: editingPromo?.id || `promo-${Date.now()}`,
      storeId,
      title,
      description,
      type,
      startDate,
      endDate,
      value: value ? parseFloat(value) : undefined,
      discount: discount ? parseFloat(discount) : undefined,
      images,
      status,
      createdAt: editingPromo?.createdAt || new Date().toISOString()
    };

    const updated = editingPromo 
      ? promotions.map(p => p.id === editingPromo.id ? newPromo : p)
      : [newPromo, ...promotions];

    localStorage.setItem(storageKey, JSON.stringify(updated));
    setPromotions(updated);

    // Lógica de publicação no JPA Conversa
    if (publishToCommunity) {
      const savedPosts: CommunityPost[] = JSON.parse(localStorage.getItem('community_posts') || '[]');
      const post: CommunityPost = {
          id: `post-promo-${Date.now()}`,
          userId: user?.id || 'anon',
          userName: user?.user_metadata?.store_name || 'Lojista Local',
          userAvatar: user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/100?u=merchant',
          authorRole: 'merchant',
          content: `📢 NOVA PROMOÇÃO: ${title}\n\n${description}`,
          type: 'promotion',
          communityId: 'comm-residents',
          neighborhood: user?.user_metadata?.neighborhood || 'Freguesia',
          timestamp: 'Agora',
          likes: 0,
          comments: 0,
          imageUrls: images,
          storeId,
          promotionId: newPromo.id
      };
      localStorage.setItem('community_posts', JSON.stringify([post, ...savedPosts]));
    }

    setTimeout(() => {
      setIsSaving(false);
      setView('list');
    }, 1000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente excluir esta promoção?")) {
        const updated = promotions.filter(p => p.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        setPromotions(updated);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-300">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-all">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Promoções</h1>
          <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mt-1">Gestão de Ofertas</p>
        </div>
        {view === 'list' && (
            <button onClick={handleCreateNew} className="p-3 bg-[#1E5BFF] text-white rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                <Plus size={20} strokeWidth={3} />
            </button>
        )}
      </header>

      <main className="p-6 max-w-md mx-auto w-full">
        {view === 'list' ? (
          <div className="space-y-4">
            {promotions.length === 0 ? (
                <div className="py-24 text-center flex flex-col items-center opacity-30">
                    <Tag size={48} className="text-gray-300 mb-4" />
                    <p className="font-bold uppercase tracking-widest text-xs">Crie sua primeira promoção para atrair novos vizinhos!</p>
                    <button onClick={handleCreateNew} className="mt-8 bg-[#1E5BFF] text-white font-black py-4 px-8 rounded-2xl shadow-xl uppercase tracking-widest text-xs">Começar agora</button>
                </div>
            ) : promotions.map(promo => (
                <div key={promo.id} className={`bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col transition-all ${promo.status === 'paused' || promo.status === 'expired' ? 'opacity-60' : ''}`}>
                    <div className="p-6 flex gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                            <img src={promo.images[0]} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                                    promo.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    promo.status === 'scheduled' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    'bg-gray-50 text-gray-500 border-gray-200'
                                }`}>
                                    {promo.status === 'active' ? 'Ativa' : promo.status === 'scheduled' ? 'Programada' : promo.status === 'paused' ? 'Pausada' : 'Expirada'}
                                </span>
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-base mt-2 truncate">{promo.title}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{promo.type} • {new Date(promo.endDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="px-6 pb-6 pt-0 flex gap-2">
                        <button onClick={() => handleEdit(promo)} className="flex-1 py-3 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"><Edit3 size={14}/> Editar</button>
                        <button onClick={() => handleDelete(promo.id)} className="flex-1 py-3 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"><Trash2 size={14}/> Excluir</button>
                    </div>
                </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
             {/* FORMULÁRIO */}
             <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Título da Promoção *</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Combo Família - 20% OFF" className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF]" />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Descrição Completa *</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descreva o que está incluso, condições, etc..." rows={4} className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl text-sm font-medium dark:text-white outline-none focus:border-[#1E5BFF] resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Tipo de Vigência *</label>
                    <select value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl text-sm font-bold dark:text-white outline-none">
                      <option value="Dia">Oferta do Dia</option>
                      <option value="Semana">Oferta da Semana</option>
                      <option value="Mês">Oferta do Mês</option>
                      <option value="Sazonal">Sazonal / Evento</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">% Desconto (Opcional)</label>
                    <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="Ex: 20" className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl text-sm font-bold dark:text-white outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Início *</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl text-sm font-bold dark:text-white outline-none" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Término *</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl text-sm font-bold dark:text-white outline-none" />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-4 block">Fotos (1 a 6) *</label>
                    <div className="grid grid-cols-3 gap-3">
                        {images.map((img, i) => (
                            <div key={i} className="aspect-square bg-gray-200 rounded-2xl overflow-hidden relative border border-gray-100 dark:border-gray-800 shadow-inner">
                                <img src={img} className="w-full h-full object-cover" />
                                <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow-lg"><X size={10}/></button>
                            </div>
                        ))}
                        {images.length < 6 && (
                            <label className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-white transition-all">
                                <Camera size={24} />
                                <span className="text-[8px] font-black uppercase mt-1">Upload</span>
                                <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        )}
                    </div>
                </div>

                <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100 dark:border-blue-800/30">
                    <label className="flex items-center gap-4 cursor-pointer select-none">
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${publishToCommunity ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${publishToCommunity ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                        <input type="checkbox" className="hidden" checked={publishToCommunity} onChange={e => setPublishToCommunity(e.target.checked)} />
                        <div>
                            <p className="font-bold text-sm text-blue-900 dark:text-blue-200">Publicar no JPA Conversa</p>
                            <p className="text-[10px] text-blue-700 dark:text-blue-400 font-medium">Informa os vizinhos sobre a novidade automaticamente.</p>
                        </div>
                    </label>
                </div>
             </div>

             <div className="pt-8">
                <button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                    {editingPromo ? 'Salvar Alterações' : 'Publicar Promoção'}
                </button>
                <button onClick={() => setView('list')} className="w-full py-4 text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Cancelar</button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};