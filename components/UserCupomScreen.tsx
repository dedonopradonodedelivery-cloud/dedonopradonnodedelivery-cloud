
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
  { id: 'CUP-BIBI20', storeId: 'f-1', storeName: 'Bibi Lanches', category: 'Comida', neighborhood: 'Freguesia', redeemedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), status: 'available', discount: '20% OFF' },
  { id: 'CUP-PET10', storeId: 'f-3', storeName: 'Pet Shop Alegria', category: 'Pets', neighborhood: 'Pechincha', redeemedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), status: 'available', discount: '10% OFF' },
  { id: 'CUP-HAIR15', storeId: 'f-2', storeName: 'Studio Hair Vip', category: 'Beleza', neighborhood: 'Taquara', redeemedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'available', discount: '15% OFF' },
  { id: 'CUP-DROG5', storeId: 'f-7', storeName: 'Drogaria JPA', category: 'Farmácia', neighborhood: 'Freguesia', redeemedAt: new Date().toISOString(), expiresAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'expired', discount: '5% OFF' },
  { id: 'CUP-FIT30', storeId: 'f-8', storeName: 'Academia FitBairro', category: 'Esportes', neighborhood: 'Taquara', redeemedAt: new Date().toISOString(), expiresAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), status: 'expired', discount: '30% OFF' },
  { id: 'CUP-ZEPIZZA', storeId: 'f-5', storeName: 'Pizzaria do Zé', category: 'Comida', neighborhood: 'Freguesia', redeemedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), status: 'used', discount: '15% OFF' },
];

export const UserCupomScreen: React.FC<UserCupomScreenProps> = ({ onBack, onNavigate, onStoreClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedForUse, setSelectedForUse] = useState<any | null>(null);

  const savedCoupons = useMemo(() => {
    // Mescla cupons reais do localStorage com os Mocks
    const localSaved = JSON.parse(localStorage.getItem('user_saved_coupons') || '[]');
    const allCoupons = [...MOCK_COUPONS, ...localSaved];
    const now = new Date().getTime();

    return allCoupons.map((c: any) => {
        // Validação dinâmica de expiração para cupons 'available'
        const isExpired = new Date(c.expiresAt).getTime() < now && c.status === 'available';
        return {
            ...c,
            status: isExpired ? 'expired' : c.status
        };
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
      description: 'Esta loja é uma parceira oficial do Localizei JPA. Em breve seu perfil completo estará disponível com fotos, cardápio e promoções exclusivas.',
      adType: AdType.PREMIUM,
      rating: 5.0,
      distance: 'Freguesia • RJ',
      verified: true,
      isOpenNow: true,
      logoUrl: '/assets/default-logo.png'
    };
    onStoreClick(store as Store);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
        case 'available': return <span className="px-2 py-0.5 rounded-lg bg-green-100 text-green-700 text-[9px] font-black uppercase tracking-widest border border-green-200">Ativo</span>;
        case 'used': return <span className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-500 text-[9px] font-black uppercase tracking-widest border border-gray-200">Usado</span>;
        case 'expired': return <span className="px-2 py-0.5 rounded-lg bg-red-50 text-red-400 text-[9px] font-black uppercase tracking-widest border border-red-100">Expirado</span>;
        default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans flex flex-col pb-32 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 pt-8 pb-5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Meus Cupons</h1>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Histórico de Benefícios</p>
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

        {/* Lista de Cupons */}
        <div className="space-y-4">
            {filteredCoupons.length > 0 ? filteredCoupons.map((coupon: any) => (
                <div 
                    key={coupon.id}
                    className={`bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-all ${coupon.status !== 'available' ? 'opacity-60 grayscale' : ''}`}
                >
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">{coupon.storeName}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{coupon.neighborhood}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{coupon.category}</span>
                                </div>
                            </div>
                            {getStatusBadge(coupon.status)}
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between mb-4">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Código do Cupom</p>
                                <p className="text-lg font-black text-gray-900 dark:text-white font-mono tracking-widest">{coupon.id}</p>
                            </div>
                            <button 
                                onClick={() => handleCopyCode(coupon.id, coupon.id)}
                                className={`p-3 rounded-xl transition-all ${copiedId === coupon.id ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-gray-800 text-blue-600 border border-gray-100 dark:border-gray-700 shadow-sm active:scale-95'}`}
                            >
                                {copiedId === coupon.id ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                             <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                                <Clock size={12} />
                                <span>Válido até {new Date(coupon.expiresAt).toLocaleDateString()}</span>
                             </div>
                             {coupon.status === 'available' ? (
                                <button 
                                    onClick={() => setSelectedForUse(coupon)}
                                    className="bg-blue-600 text-white text-[10px] px-6 py-2.5 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
                                >
                                    Usar Agora <ArrowRight size={12} strokeWidth={3} />
                                </button>
                             ) : (
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {coupon.status === 'used' ? 'Já utilizado' : 'Expirado'}
                                </span>
                             )}
                        </div>
                    </div>
                </div>
            )) : (
                <div className="py-24 flex flex-col items-center justify-center text-center opacity-30">
                    <Ticket size={48} className="text-gray-400 mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest leading-relaxed">Nenhum cupom<br/>encontrado.</p>
                </div>
            )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-[2.5rem] border border-blue-100 dark:border-blue-800/30">
            <h4 className="font-bold text-blue-900 dark:text-blue-200 text-sm mb-2 flex items-center gap-2">
                <Info size={16} /> Como usar seu cupom?
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                Apresente o código acima no caixa do estabelecimento no momento do pagamento para garantir o seu benefício exclusivo Localizei JPA.
            </p>
        </div>
      </main>

      {/* MODAL / BOTTOM SHEET USAR CUPOM */}
      {selectedForUse && (
          <div className="fixed inset-0 z-[1001] bg-black/60 backdrop-blur-sm flex items-end justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedForUse(null)}>
              <div 
                className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col items-center text-center"
                onClick={e => e.stopPropagation()}
              >
                  <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-8 shrink-0"></div>
                  
                  <div className="flex flex-col items-center mb-8">
                      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-[2rem] flex items-center justify-center text-[#1E5BFF] mb-4 shadow-inner border border-blue-100/50">
                          <Ticket size={40} />
                      </div>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{selectedForUse.storeName}</h2>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">{selectedForUse.discount} de desconto</p>
                  </div>

                  <div className="space-y-6 w-full">
                      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 w-full">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Apresente este código</p>
                          <h3 className="text-4xl font-black text-gray-900 dark:text-white font-mono tracking-[0.2em] mb-6">{selectedForUse.id}</h3>
                          <button 
                            onClick={() => handleCopyCode(selectedForUse.id, selectedForUse.id)}
                            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                                copiedId === selectedForUse.id 
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                    : 'bg-white dark:bg-gray-700 text-blue-600 border border-gray-100 dark:border-gray-600 shadow-sm active:scale-95'
                            }`}
                          >
                              {copiedId === selectedForUse.id ? (
                                  <><CheckCircle2 size={16} /> Código Copiado!</>
                              ) : (
                                  <><Copy size={16} /> Copiar Código</>
                              )}
                          </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => handleGoToStore(selectedForUse.storeId, selectedForUse.storeName)}
                            className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-2 active:scale-95 transition-all shadow-sm group"
                          >
                              <StoreIcon className="text-gray-400 group-hover:text-[#1E5BFF] transition-colors" size={24} />
                              <span className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Ver Perfil</span>
                          </button>
                          <button 
                            onClick={() => window.open(`https://wa.me/5521999999999?text=${encodeURIComponent(`Olá! Vi o cupom da ${selectedForUse.storeName} no Localizei JPA e gostaria de tirar uma dúvida.`)}`, '_blank')}
                            className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-2 active:scale-95 transition-all shadow-sm group"
                          >
                              <MessageCircle className="text-gray-400 group-hover:text-emerald-500 transition-colors" size={24} />
                              <span className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Tirar Dúvida</span>
                          </button>
                      </div>

                      <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-800/30 flex gap-3">
                          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                          <p className="text-[10px] text-amber-700 dark:text-amber-300 font-bold leading-relaxed uppercase text-left">
                              Atenção: Este cupom expira em {new Date(selectedForUse.expiresAt).toLocaleDateString()}. Aproveite logo!
                          </p>
                      </div>
                  </div>

                  <button 
                    onClick={() => setSelectedForUse(null)}
                    className="mt-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-gray-600"
                  >
                      Fechar detalhes
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};
