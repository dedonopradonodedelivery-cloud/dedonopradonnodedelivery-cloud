
import React, { useState, useEffect } from 'react';
import { X, Heart, MapPin, Repeat, RefreshCw, Star, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { TradeItem } from '@/types';

// New mock data structure: Item as Profile
const MOCK_TRADE_ITEMS: Omit<TradeItem, 'userId' | 'userRole'>[] = [
  { id: 't1', title: 'Violão Acústico Yamaha', imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=800', category: 'Instrumentos', description: 'Em ótimo estado, usado poucas vezes. Cordas novas.', wants: 'Headphone Bluetooth, Cadeira Gamer', neighborhood: 'Freguesia', status: 'Disponível' },
  { id: 't2', title: 'Bicicleta Aro 29', imageUrl: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=800', category: 'Esportes', description: 'Bike em ótimo estado, buscando cadeira para setup.', wants: 'Cadeira Gamer, Monitor 24"', neighborhood: 'Taquara', status: 'Disponível' },
  { id: 't3', title: 'Playstation 4', imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800', category: 'Eletrônicos', description: 'PS4 funcionando perfeitamente, com 2 controles.', wants: 'Smart TV 42", Nintendo Switch', neighborhood: 'Pechincha', status: 'Disponível' },
  { id: 't4', title: 'Tênis de Corrida Nike nº 42', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800', category: 'Vestuário', description: 'Tênis novo, usado 2 vezes. Busco relógio para monitorar treinos.', wants: 'Relógio Smart, Fone de ouvido sem fio', neighborhood: 'Anil', status: 'Disponível' },
  { id: 't5', title: 'Mochila de Viagem 60L', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb68c6a62?q=80&w=800', category: 'Acessórios', description: 'Mochila grande, ideal para viagens. Pouco uso.', wants: 'Jaqueta de Couro M, Bota de trilha', neighborhood: 'Freguesia', status: 'Disponível' },
];

interface SwipeCardData {
  id: string;
  title: string;
  imageUrl: string;
  wants: string;
  description: string;
  neighborhood: string;
  isVerified: boolean;
  status: 'Disponível' | 'Em negociação' | 'Trocado';
}

const MatchModal: React.FC<{ myItem: SwipeCardData, matchedItem: SwipeCardData, onContinue: () => void, onChat: () => void }> = ({ myItem, matchedItem, onContinue, onChat }) => (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-500">
        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 italic transform -rotate-6 mb-12 drop-shadow-2xl uppercase tracking-tighter">
            Deu Match!
        </h2>

        <div className="flex items-center justify-center gap-4 mb-12 relative w-full px-4">
            <div className="w-32 h-32 rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden transform -rotate-6 shrink-0">
                <img src={myItem.imageUrl} className="w-full h-full object-cover" />
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center absolute shadow-xl z-20 text-white animate-bounce-slow">
                <Repeat size={28} />
            </div>
            <div className="w-32 h-32 rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden transform rotate-6 shrink-0">
                <img src={matchedItem.imageUrl} className="w-full h-full object-cover" />
            </div>
        </div>

        <div className="space-y-2 mb-12 text-center">
            <p className="text-white font-black text-lg uppercase tracking-tight">
                Vocês curtiram os itens um do outro!
            </p>
            <p className="text-slate-400 text-sm max-w-xs mx-auto font-medium">
                Inicie uma conversa para combinar a troca.
            </p>
        </div>

        <div className="w-full max-w-xs space-y-3">
            <button 
                onClick={onChat}
                className="w-full bg-white text-indigo-700 font-black py-5 rounded-[2rem] shadow-xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
                <MessageSquare size={18} fill="currentColor" />
                Iniciar Conversa
            </button>
            <button 
                onClick={onContinue}
                className="w-full py-4 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors"
            >
                Continuar explorando
            </button>
        </div>
    </div>
);

interface TrocaTrocaSwipeViewProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
}

export const TrocaTrocaSwipeView: React.FC<TrocaTrocaSwipeViewProps> = ({ onBack, onNavigate }) => {
    const { user } = useAuth();
    const { currentNeighborhood } = useNeighborhood();
    const [deck, setDeck] = useState<SwipeCardData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [feedback, setFeedback] = useState<'like' | 'dislike' | 'superlike' | null>(null);
    const [animation, setAnimation] = useState('');
    const [showMatch, setShowMatch] = useState<SwipeCardData | null>(null);

    // Hardcoded user's item for match simulation
    const myItemForMatch: SwipeCardData = { 
        id: 'user-item-1', 
        title: 'Meu Violão Yamaha', 
        imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=400', 
        wants: 'Headphone', 
        description: 'Troco por fone de qualidade', 
        neighborhood: 'Freguesia', 
        isVerified: false, 
        status: 'Disponível'
    };

    useEffect(() => {
        let userItemsMapped: SwipeCardData[] = [];
        if (user) {
            const userItemsJSON = localStorage.getItem(`trade_items_${user.id}`);
            if (userItemsJSON) {
                const userItems: TradeItem[] = JSON.parse(userItemsJSON);
                userItemsMapped = userItems
                    .filter(item => item.status === 'Disponível')
                    .map(item => ({
                        ...item,
                        isVerified: item.userRole === 'lojista'
                    }));
            }
        }
        
        const mockItemsMapped: SwipeCardData[] = MOCK_TRADE_ITEMS.map(item => ({
            ...item,
            userId: `mock-user-${item.id}`,
            userRole: 'cliente',
            isVerified: false
        }));

        let combinedDeck: SwipeCardData[] = [...userItemsMapped, ...mockItemsMapped];
        
        // Remove duplicates and filter by neighborhood
        const uniqueIds = new Set();
        const uniqueDeck = combinedDeck.filter(element => {
            const isDuplicate = uniqueIds.has(element.id);
            uniqueIds.add(element.id);
            return !isDuplicate;
        });

        const neighborhoodFilteredDeck = uniqueDeck.filter(item => 
            item.status === 'Disponível' && 
            (currentNeighborhood === 'Jacarepaguá (todos)' || item.neighborhood === currentNeighborhood)
        );
        
        // Shuffle the deck
        setDeck(neighborhoodFilteredDeck.sort(() => Math.random() - 0.5));
        setCurrentIndex(0);

    }, [user, currentNeighborhood]);

    const handleSwipe = (action: 'like' | 'dislike' | 'superlike') => {
        if (animation || currentIndex >= deck.length) return;

        setFeedback(action);
        setAnimation(action === 'dislike' ? 'animate-swipe-out-left' : 'animate-swipe-out-right');

        // Simulate a match on 30% of 'likes'
        const isMatch = action === 'like' && Math.random() < 0.3;

        setTimeout(() => {
            if (isMatch) {
                setShowMatch(deck[currentIndex]);
            }
            setFeedback(null);
            setAnimation('');
            if (!isMatch) {
                setCurrentIndex(prev => prev + 1);
            }
        }, 700);
    };

    const handleReload = () => {
        setCurrentIndex(0);
        setDeck(prev => [...prev].sort(() => Math.random() - 0.5));
    };

    const handleContinueFromMatch = () => {
        setShowMatch(null);
        setCurrentIndex(prev => prev + 1);
    };

    const currentItem = deck[currentIndex];

    if (showMatch) {
        return <MatchModal myItem={myItemForMatch} matchedItem={showMatch} onContinue={handleContinueFromMatch} onChat={() => onNavigate('home')} />;
    }

    if (!currentItem && deck.length > 0) {
        return (
          <div className="min-h-full bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-white animate-in fade-in">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-8 border-4 border-slate-700">
                <Repeat size={40} className="text-slate-600" />
            </div>
            <h2 className="text-2xl font-black mb-4 uppercase tracking-wider">Fim da Fila</h2>
            <p className="text-slate-400 max-w-xs mb-8">Você viu todos os itens disponíveis. Volte mais tarde ou atualize para ver novamente.</p>
            <button onClick={handleReload} className="flex items-center gap-2 bg-blue-600 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs">
                <RefreshCw size={16} /> Atualizar
            </button>
          </div>
        );
    }

    return (
        <div className="min-h-full bg-slate-950 text-white flex flex-col font-display overflow-hidden">
            <header className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-center">
                <button onClick={onBack} className="p-3 bg-black/20 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-all active:scale-90">
                <X size={24} />
                </button>
                {currentItem && (
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10">
                        <MapPin size={12} className="text-purple-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{currentItem.neighborhood}</span>
                    </div>
                )}
            </header>

            <main className="flex-1 flex flex-col p-6 pt-24 pb-40 relative">
                {deck[currentIndex + 1] && (
                    <div className="absolute inset-x-6 top-24 bottom-40 bg-slate-900 rounded-[2.5rem] border border-slate-800 transform scale-[0.95] translate-y-4 opacity-60"></div>
                )}

                {currentItem && (
                    <div className={`relative flex-1 flex flex-col transition-all duration-500 ease-in-out ${animation}`}>
                        <div className="relative flex-1 flex flex-col bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
                            <div className="flex-1 bg-slate-800 relative">
                                <img src={currentItem.imageUrl} alt={currentItem.title} className="w-full h-full object-cover"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h2 className="text-2xl font-black text-white leading-tight drop-shadow-md mb-2">{currentItem.title}</h2>
                                    <p className="text-sm font-bold text-slate-300 leading-tight">
                                        <span className="text-purple-400 font-black">QUER TROCAR POR:</span> {currentItem.wants}
                                    </p>
                                </div>
                            </div>
                            {currentItem.description && (
                                <div className="p-6 text-center">
                                    <p className="text-xs font-medium text-slate-400 leading-relaxed">{currentItem.description}</p>
                                </div>
                            )}
                        </div>
                        {feedback && (
                            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${animation ? 'opacity-100' : 'opacity-0'}`}>
                                <div className={`text-4xl font-black uppercase tracking-widest border-8 p-4 rounded-2xl transform -rotate-12 ${
                                    feedback === 'like' || feedback === 'superlike' ? 'text-blue-400 border-blue-400/50' : 'text-red-500 border-red-500/50'
                                }`}>
                                    {feedback === 'dislike' ? 'Passou' : 'Gostei'}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <footer className="absolute bottom-0 left-0 right-0 p-8 z-20 flex justify-center items-center gap-5">
                <button onClick={() => handleSwipe('dislike')} className="w-16 h-16 rounded-full bg-slate-800/80 text-red-500 flex items-center justify-center shadow-2xl border-2 border-red-500/30 backdrop-blur-lg active:scale-90 transition-all hover:bg-slate-700">
                <X size={32} strokeWidth={3} />
                </button>
                <button onClick={() => handleSwipe('like')} className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1E5BFF] to-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-blue-500/30 active:scale-90 transition-all hover:scale-105 border-4 border-slate-950">
                <Heart size={36} fill="currentColor" />
                </button>
                <button onClick={() => handleSwipe('superlike')} className="w-16 h-16 rounded-full bg-slate-800/80 text-yellow-400 flex items-center justify-center shadow-2xl border-2 border-yellow-400/30 backdrop-blur-lg active:scale-90 transition-all hover:bg-slate-700">
                <Star size={32} fill="currentColor" />
                </button>
            </footer>
            <style>{`
                @keyframes swipe-out-right { from { transform: translateX(0) rotate(0); opacity: 1; } to { transform: translateX(200%) rotate(20deg); opacity: 0; } }
                @keyframes swipe-out-left { from { transform: translateX(0) rotate(0); opacity: 1; } to { transform: translateX(-200%) rotate(-20deg); opacity: 0; } }
                .animate-swipe-out-right { animation: swipe-out-right 0.7s forwards ease-in-out; }
                .animate-swipe-out-left { animation: swipe-out-left 0.7s forwards ease-in-out; }
                @keyframes bounce-slow { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-10px) scale(1.05); } }
                .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
            `}</style>
        </div>
    );
};
