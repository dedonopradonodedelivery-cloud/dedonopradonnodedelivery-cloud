
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  ChevronLeft, 
  Plus, 
  Repeat, 
  Trash2, 
  Edit3, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  Save,
  ImageIcon,
  Tag,
  Info,
  Package,
  X,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { TradeItem } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';

interface UserTradeItemsViewProps {
  user: User | null;
  userRole: 'cliente' | 'lojista' | null;
  onBack: () => void;
}

const TRADE_CATEGORIES = ['Eletrônicos', 'Instrumentos', 'Móveis', 'Vestuário', 'Esportes', 'Livros', 'Outros'];

export const UserTradeItemsView: React.FC<UserTradeItemsViewProps> = ({ user, userRole, onBack }) => {
  const { currentNeighborhood } = useNeighborhood();
  const [items, setItems] = useState<TradeItem[]>([]);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingItem, setEditingItem] = useState<TradeItem | null>(null);
  const [loading, setLoading] = useState(true);

  const storageKey = useMemo(() => `trade_items_${user?.id}`, [user]);

  useEffect(() => {
    if (user) {
      const savedItems = localStorage.getItem(storageKey);
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
    }
    setLoading(false);
  }, [user, storageKey]);

  const handleSaveItem = (itemData: Omit<TradeItem, 'id' | 'userId' | 'userRole'>) => {
    let updatedItems;
    if (editingItem) {
      updatedItems = items.map(item => item.id === editingItem.id ? { ...editingItem, ...itemData } : item);
    } else {
      const newItem: TradeItem = {
        id: `trade-${Date.now()}`,
        userId: user!.id,
        userRole: userRole!,
        ...itemData
      };
      updatedItems = [newItem, ...items];
    }
    setItems(updatedItems);
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
    setView('list');
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      localStorage.setItem(storageKey, JSON.stringify(updatedItems));
    }
  };

  const handleStatusChange = (id: string, status: TradeItem['status']) => {
      const updatedItems = items.map(item => item.id === id ? { ...item, status } : item);
      setItems(updatedItems);
      localStorage.setItem(storageKey, JSON.stringify(updatedItems));
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setView('form');
  };

  const handleEdit = (item: TradeItem) => {
    setEditingItem(item);
    setView('form');
  };

  if (!user) {
    // Should not happen if routed correctly, but as a safeguard
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Por favor, faça login para acessar esta área.</p>
      </div>
    );
  }

  if (view === 'form') {
    return <ItemForm onBack={() => setView('list')} onSave={handleSaveItem} item={editingItem} neighborhood={currentNeighborhood} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans animate-in fade-in duration-500">
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md px-5 h-20 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-90 transition-all">
            <ChevronLeft size={20} className="text-slate-300" />
          </button>
          <div>
            <h1 className="font-black text-xl uppercase tracking-tighter leading-none">Meus Itens de Troca</h1>
            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mt-1">Troca-Troca do Bairro</p>
          </div>
        </div>
        <button onClick={handleAddNew} className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
            <Plus size={20} strokeWidth={3} />
        </button>
      </header>
      
      <main className="flex-1 overflow-y-auto no-scrollbar p-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-full pt-20">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-8 border-4 border-slate-700">
                <Package size={40} className="text-slate-600" />
            </div>
            <h2 className="text-xl font-black mb-4 uppercase tracking-wider">Nenhum item cadastrado</h2>
            <p className="text-slate-400 max-w-xs mb-8 text-sm">Cadastre um item que você não usa mais e encontre vizinhos para trocar.</p>
            <button onClick={handleAddNew} className="flex items-center gap-2 bg-blue-600 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs">
                <Plus size={16} /> Cadastrar Item
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                userRole={userRole}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDeleteItem(item.id)}
                onStatusChange={(status) => handleStatusChange(item.id, status)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const ItemCard: React.FC<{ item: TradeItem, userRole: 'cliente' | 'lojista' | null, onEdit: () => void, onDelete: () => void, onStatusChange: (status: TradeItem['status']) => void }> = ({ item, userRole, onEdit, onDelete, onStatusChange }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const getStatusStyles = () => {
        switch(item.status) {
            case 'Disponível': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Em negociação': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'Trocado': return 'bg-slate-700 text-slate-500 border-slate-600';
            default: return 'bg-gray-500/10 text-gray-400';
        }
    }
    return (
        <div className="bg-slate-800 rounded-3xl p-5 border border-white/5 shadow-lg flex gap-5">
            <div className="w-24 h-24 bg-slate-700 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                <img src={item.imageUrl} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white text-base leading-tight truncate pr-2">{item.title}</h3>
                    <div className="relative">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 text-slate-500"><MoreVertical size={18} /></button>
                        {menuOpen && (
                            <div className="absolute top-full right-0 bg-slate-700 rounded-lg shadow-xl z-10 w-40 overflow-hidden text-xs">
                                <button onClick={() => { onEdit(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 hover:bg-slate-600 flex items-center gap-2"><Edit3 size={14}/> Editar</button>
                                <button onClick={() => { onStatusChange('Disponível'); setMenuOpen(false); }} className="w-full text-left px-3 py-2 hover:bg-slate-600">Disponível</button>
                                <button onClick={() => { onStatusChange('Em negociação'); setMenuOpen(false); }} className="w-full text-left px-3 py-2 hover:bg-slate-600">Em negociação</button>
                                <button onClick={() => { onStatusChange('Trocado'); setMenuOpen(false); }} className="w-full text-left px-3 py-2 hover:bg-slate-600">Trocado</button>
                                <button onClick={() => { onDelete(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 hover:bg-slate-600 text-red-400 flex items-center gap-2"><Trash2 size={14}/> Excluir</button>
                            </div>
                        )}
                    </div>
                </div>
                {userRole === 'lojista' && (
                    <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 inline-block mt-1">🔥 Loja Parceira</span>
                )}
                <p className="text-xs text-slate-400 mt-2 truncate">Interesse: {item.wants}</p>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${getStatusStyles()}`}>{item.status}</span>
                </div>
            </div>
        </div>
    );
};

const ItemForm: React.FC<{ onBack: () => void, onSave: (data: any) => void, item: TradeItem | null, neighborhood: string }> = ({ onBack, onSave, item, neighborhood }) => {
    const [formData, setFormData] = useState({
        title: item?.title || '',
        imageUrl: item?.imageUrl || '',
        category: item?.category || TRADE_CATEGORIES[0],
        description: item?.description || '',
        wants: item?.wants || '',
        neighborhood: item?.neighborhood || neighborhood,
        status: item?.status || 'Disponível' as TradeItem['status'],
    });
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            onSave(formData);
        }, 1000);
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setFormData({ ...formData, imageUrl: reader.result as string });
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-in fade-in duration-300">
            <header className="p-5 flex items-center justify-between border-b border-white/5">
                <button onClick={onBack}><X size={24} className="text-slate-400"/></button>
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-300">{item ? 'Editar Item' : 'Novo Item para Troca'}</h2>
                <button onClick={handleSave} disabled={!formData.title || !formData.wants || isSaving} className="bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-xl disabled:opacity-50 flex items-center gap-2">
                    {isSaving ? <Loader2 className="animate-spin" /> : <Save size={16}/>} Salvar
                </button>
            </header>
            <main className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar pb-10">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-40 h-40 rounded-3xl bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden relative group">
                        {formData.imageUrl ? <img src={formData.imageUrl} className="w-full h-full object-cover"/> : <ImageIcon size={40} className="text-slate-600"/>}
                        <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit3 size={24} className="text-white"/>
                        </button>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*"/>
                    <p className="text-xs text-slate-500 font-bold uppercase">Imagem do Item</p>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Título do Item*</label>
                    <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white" />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">O que você quer em troca?*</label>
                    <input value={formData.wants} onChange={e => setFormData({...formData, wants: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white" />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Descrição</label>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm font-medium text-white resize-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Categoria</label>
                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white appearance-none">
                            {/* FIX: Correctly map over the array of strings `TRADE_CATEGORIES`. The string `c` serves as key, value, and label. */}
                            {TRADE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bairro</label>
                        <input value={formData.neighborhood} readOnly className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm font-bold text-slate-400" />
                    </div>
                </div>
            </main>
        </div>
    );
};
