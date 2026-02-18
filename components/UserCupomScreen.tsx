
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Ticket, 
  Tag, 
  Info, 
  X, 
  Search, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Copy, 
  ArrowRight,
  Store as StoreIcon,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { Store, AdType } from '../types';
import { STORES } from '../constants';

interface UserCupomScreenProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
  onStoreClick: (store: Store) => void;
}

// MOCK LOCAL DE CUPONS (Regra: 3 ATIVO, 2 EXPIRADO, 1 USADO)
const MOCK_COUPONS = [
  { id: 'CUP-BIBI20', storeId: 'f-1', storeName: 'Bibi Lanches', title: 'Hambúrguer Gourmet', category: 'Comida', neighborhood: 'Freguesia', redeemedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), status: 'available', discount: '20% OFF', color: 'from-orange-500 to-rose-500' },
  { id: 'CUP-PET10', storeId: 'f-3', storeName: 'Pet Shop Alegria', title: 'Banho e Tosa', category: 'Pets', neighborhood: 'Pechincha', redeemedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), status: 'available', discount: '10% OFF', color: 'from-emerald-500 to-teal-600' },
  { id: 'CUP-HAIR15', storeId: 'f-2', storeName: 'Studio Hair Vip', title: 'Corte VIP', category: 'Beleza', neighborhood: 'Taquara', redeemedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'available', discount: '15% OFF', color: 'from-blue-600 to-indigo-700' },
  { id: 'CUP-DROG5', storeId: 'f-7', storeName: 'Drogaria JPA', title: 'Medicamentos', category: 'Farmácia', neighborhood: 'Freguesia', redeemedAt: new Date().toISOString(), expiresAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'expired', discount: '5% OFF', color: 'from-blue-500 to-blue-700' },
];

export const UserCupomScreen: React.FC<UserCupomScreenProps> = ({ onBack, onNavigate, onStoreClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedForUse, setSelectedForUse] = useState<any | null>(null);

  const savedCoupons = useMemo(() => {
    const localSaved = JSON.parse(localStorage.getItem('user_saved_coupons') || '[]');
    const allCoupons = [...MOCK_COUPONS, ...localSaved];
    const now = new Date().getTime();

    return allCoupons.map((c: any) => {
        const isExpired = new Date(c.expiresAt).getTime() < now && c.status === 'available';
        return { ...c, status: isExpired ? 'expired' : c.status };
    }).sort((a: any, b: any) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime());
  }, []);

  const filteredCoupons = useMemo(() => {
    if (!searchTerm) return savedCoupons;
    return savedCoupons.filter((c: any) => c.storeName.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [savedCoupons, searchTerm]);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGoToStore = (storeId: string, storeName: string) => {
    setSelectedForUse(null);
    const store = STORES.find(s => s.id === storeId) || {
      id: storeId,
      name: storeName || 'Loja Parceira',
      category: 'Parceiro Local',
      adType: AdType.PREMIUM,
      rating: 5.0,
      verified: true,
      logoUrl: '/assets/default-logo.png'
    };
    onStoreClick(store as Store);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
        case 'available': return <span className="px-2 py-0.5 rounded-lg bg-green-100 text-green-700 text-[8px] font-black uppercase tracking-widest border border-green-200">Ativo</span>;
        case 'used': return <span className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-500 text-[8px] font-black uppercase tracking-widest border border-gray-200">Usado</span>;
        case 'expired': return <span className="px-2 py-0.5 rounded-lg bg-red-50 text-red-400 text-[8px] font-black uppercase tracking-widest border border-red-100">Expirado</span>;
        default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans flex flex-col pb-32 animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 pt-8 pb-5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Meus Cupons</h1>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Benefícios Ativos</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por loja..."
                className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 py-4 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none focus:border-blue-500 transition-all shadow-sm dark:text-white"
            />
        </div>

        <div className="space-y-4">
            {filteredCoupons.length > 0 ? filteredCoupons.map((coupon: any) => (
                <button 
                    key={coupon.id}
                    onClick={() => coupon.status === 'available' && setSelectedForUse(coupon)}
                    className={`w-full h-[140px] relative flex bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-all text-left group ${coupon.status !== 'available' ? 'opacity-50 grayscale' : 'active:scale-[0.98]'}`}
                >
                    {/* Lado Esquerdo: Valor */}
                    <div className={`w-[30%] bg-gradient-to-br ${coupon.color} flex flex-col items-center justify-center text-center relative`}>
                        <p className="text-[8px] font-black text-white/70 uppercase tracking-widest mb-1">{coupon.category}</p>
                        <h4 className="text-xl font-black text-white leading-none drop-shadow-md">{coupon.discount}</h4>
                        
                        {/* Cortes laterais estilo ingresso */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#F8F9FC] dark:bg-gray-950 z-10 shadow-inner"></div>
                        <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-[#F8F9FC] dark:bg-gray-950 z-10 shadow-inner"></div>
                    </div>

                    {/* Linha Picotada */}
                    <div className="h-full border-l-2 border-dashed border-gray-100 dark:border-gray-800 relative z-10"></div>

                    {/* Lado Direito: Detalhes */}
                    <div className="flex-1 bg-slate-50/80 dark:bg-gray-800/40 p-5 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="min-w-0 flex-1">
                                <h5 className="text-[12px] font-black text-slate-800 dark:text-white uppercase truncate tracking-tight mb-0.5">{coupon.title}</h5>
                                <p className="text-[10px] font-bold text-[#1E5BFF] uppercase tracking-tighter truncate">{coupon.storeName}</p>
                            </div>
                            {getStatusBadge(coupon.status)}
                        </div>

                        <div className="mt-auto flex items-end justify-between">
                            <div className="flex flex-col">
                                <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Código:</span>
                                <span className="text-xs font-black text-slate-800 dark:text-slate-300 font-mono tracking-widest">{coupon.id}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Válido até</span>
                                <span className="text-[9px] font-bold text-gray-600 dark:text-gray-400">{new Date(coupon.expiresAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </button>
            )) : (
                <div className="py-24 flex flex-col items-center justify-center text-center opacity-30">
                    <Ticket size={48} className="text-gray-400 mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest">Nenhum cupom aqui.</p>
                </div>
            )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-[2.5rem] border border-blue-100 dark:border-blue-800/30">
            <h4 className="font-bold text-blue-900 dark:text-blue-200 text-sm mb-2 flex items-center gap-2">
                <Info size={16} /> Como utilizar?
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                Selecione o cupom ativo e apresente o código gerado no caixa da loja física para garantir seu benefício Localizei JPA.
            </p>
        </div>
      </main>

      {/* MODAL DE USO (BOTTOM SHEET) */}
      {selectedForUse && (
          <div className="fixed inset-0 z-[1001] bg-black/60 backdrop-blur-sm flex items-end justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedForUse(null)}>
              <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col items-center text-center" onClick={e => e.stopPropagation()}>
                  <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-8"></div>
                  <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-[2rem] flex items-center justify-center text-[#1E5BFF] mb-4 shadow-inner">
                      <Ticket size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-8">{selectedForUse.storeName}</h2>

                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 w-full mb-8">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Apresente no caixa</p>
                      <h3 className="text-4xl font-black text-gray-900 dark:text-white font-mono tracking-[0.2em] mb-6">{selectedForUse.id}</h3>
                      <button 
                        onClick={() => handleCopyCode(selectedForUse.id, selectedForUse.id)}
                        className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${copiedId === selectedForUse.id ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-gray-700 text-blue-600 border border-gray-100 dark:border-gray-600 active:scale-95'}`}
                      >
                          {copiedId === selectedForUse.id ? <><CheckCircle2 size={16} /> Copiado!</> : <><Copy size={16} /> Copiar Código</>}
                      </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 w-full">
                      <button onClick={() => handleGoToStore(selectedForUse.storeId, selectedForUse.storeName)} className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-2 active:scale-95 transition-all shadow-sm">
                          <StoreIcon className="text-gray-400" size={24} />
                          <span className="text-[9px] font-black text-gray-500 uppercase">Ver Perfil</span>
                      </button>
                      <button onClick={() => window.open('https://wa.me/5521999999999', '_blank')} className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-2 active:scale-95 transition-all shadow-sm">
                          <MessageCircle className="text-gray-400" size={24} />
                          <span className="text-[9px] font-black text-gray-500 uppercase">WhatsApp</span>
                      </button>
                  </div>
                  <button onClick={() => setSelectedForUse(null)} className="mt-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Fechar detalhes</button>
              </div>
          </div>
      )}
    </div>
  );
};
