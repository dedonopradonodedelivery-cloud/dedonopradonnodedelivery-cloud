
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Mail, 
  Copy, 
  CheckCircle, 
  Share2, 
  Heart, 
  MapPin, 
  Crown, 
  Rocket, 
  Star, 
  Loader2, 
  ArrowRight, 
  Store as StoreIcon,
  Compass,
  ShieldCheck,
  TrendingUp,
  Users,
  Lightbulb,
  Zap,
  Award,
  // FIX: Added 'Coins' to the import list from lucide-react.
  Coins
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Store, AdType } from '../types';
import { User } from '@supabase/supabase-js';

interface SimplePageProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
  user?: User | null;
}

export const SupportView: React.FC<SimplePageProps> = ({ onBack }) => {
  const [copied, setCopied] = useState(false);
  const email = "contato.localizeifreguesia@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Suporte</h1>
      </div>
      
      <div className="p-6 flex flex-col items-center pt-12">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 text-blue-500">
            <Mail className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">Precisa de ajuda?</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8 max-w-xs leading-relaxed">
            Fale com a equipe Localizei. Estamos prontos para te ouvir e resolver suas dúvidas.
        </p>

        <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 flex flex-col items-center shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-3">Canal Oficial</p>
            <p className="text-sm font-bold text-gray-800 dark:text-white mb-6 break-all text-center bg-white dark:bg-gray-700 px-4 py-2 rounded-lg border border-gray-100 dark:border-gray-600 w-full">
                {email}
            </p>
            
            <div className="flex gap-3 w-full">
                <a 
                    href={`mailto:${email}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center shadow-lg shadow-blue-500/20 transition-transform active:scale-95"
                >
                    Enviar e-mail
                </a>
                <button 
                    onClick={handleCopy}
                    className="w-14 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-colors"
                    title="Copiar e-mail"
                >
                    {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
            </div>
        </div>
        
        <div className="mt-8 text-center px-4">
            <p className="text-xs text-gray-400">
                Nosso atendimento é feito de segunda a sexta, em horário comercial.
            </p>
        </div>
      </div>
    </div>
  );
};

export const InviteFriendView: React.FC<SimplePageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Indique um Amigo</h1>
      </div>
      
      <div className="p-6 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-28 h-28 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-8 text-green-500 shadow-lg shadow-green-100 dark:shadow-none animate-bounce-short">
            <Share2 className="w-12 h-12" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Indique e Ganhe</h2>
        
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-8 max-w-xs leading-relaxed font-medium">
            Em breve você ganhará <strong>cashback</strong> por indicar amigos. Estamos preparando essa novidade para você.
        </p>
        
        <div className="bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-full text-xs font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            Novidade chegando em breve
        </div>
      </div>
    </div>
  );
};

export const AboutView: React.FC<SimplePageProps> = ({ onBack }) => {
  const benefits = [
    {
      icon: Compass,
      title: "Encontre tudo perto de você",
      description: "Lojas, restaurantes e serviços na palma da sua mão."
    },
    {
      icon: Award,
      title: "Descubra os favoritos do bairro",
      description: "Veja os locais mais bem avaliados pelos seus vizinhos."
    },
    {
      icon: Rocket,
      title: "Fique por dentro das novidades",
      description: "Saiba das inaugurações, eventos e promoções."
    },
    {
      icon: Coins,
      title: "Economize com cashback",
      description: "Receba parte do seu dinheiro de volta (em breve)."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300 flex flex-col relative overflow-hidden">
      
      {/* Hero section with integrated header */}
      <div className="absolute top-0 left-0 right-0 h-[45vh] bg-gradient-to-br from-sky-500 to-blue-600 rounded-b-[40px] z-0 p-6 flex flex-col justify-center items-center text-center text-white">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center mb-6 shadow-2xl">
          <MapPin className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold font-display leading-tight mb-3 drop-shadow-md">
          O guia definitivo da nossa vizinhança
        </h1>
        <p className="text-blue-100 font-medium max-w-sm">
          Conectamos você aos melhores comércios, serviços e oportunidades do bairro.
        </p>
      </div>

       {/* Back Button */}
       <div className="relative z-10 p-5 pt-6 flex items-center">
        <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
        >
            <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Content section */}
      <div className="flex-1 relative z-10 mt-[8vh] px-5 pb-32">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 space-y-6">
          {benefits.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Fixed Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-30 max-w-md mx-auto">
        <button 
          onClick={onBack}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Começar a explorar
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export const FavoritesView: React.FC<SimplePageProps> = ({ onBack, onNavigate, user }) => {
  const [favorites, setFavorites] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || !supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("businesses(*)")
          .eq("user_id", user.id);

        if (error) throw error;

        // Mapear a resposta para o formato Store
        const mappedStores: Store[] = (data || []).map((item: any) => {
          const b = item.businesses;
          return {
            id: b.id,
            name: b.name,
            category: b.category,
            subcategory: b.subCategory,
            image: b.imageUrl || 'https://via.placeholder.com/100', // Fallback image
            
            // Default values for required fields not in search result
            rating: b.rating || 0,
            description: b.description || '',
            distance: 'Freguesia • RJ', // Campo calculado/fictício por enquanto
            adType: AdType.ORGANIC,
            reviewsCount: 0,
            verified: true // Assumindo verificado por padrão na lista de favoritos
          };
        });

        setFavorites(mappedStores);
      } catch (err) {
        console.error("Erro ao buscar favoritos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  // Função para remover da lista local imediatamente ao desfavoritar
  const handleRemove = async (storeId: string) => {
    if (!user || !supabase) return;
    
    // Optimistic update
    setFavorites(prev => prev.filter(s => s.id !== storeId));

    try {
        const { error } = await supabase
            .from('favorites')
            .delete()
            .match({ user_id: user.id, business_id: storeId });
        
        if (error) throw error;
    } catch(err) {
        console.error(err);
        // Em um app real, reverteríamos o estado aqui
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Minhas lojas favoritas</h1>
      </div>
      
      <div className="p-5 pb-24">
        {loading ? (
            <div className="flex justify-center pt-20">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        ) : favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center mt-20">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-10 h-10 text-gray-400 fill-gray-200 dark:fill-gray-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 px-8">
                    Você ainda não salvou nenhuma loja.
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[240px] leading-relaxed mb-8">
                    Explore o aplicativo e adicione seus favoritos para acessá-los rapidamente aqui!
                </p>
                {onNavigate && (
                    <button 
                        onClick={() => onNavigate('explore')}
                        className="bg-[#1E5BFF] text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-500/30 flex items-center gap-2 active:scale-95 transition-transform"
                    >
                        Explorar Lojas
                        <ArrowRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {favorites.map(store => (
                    <div key={store.id} className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 items-center group">
                        <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                            {store.image ? (
                                <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <StoreIcon className="w-6 h-6" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{store.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{store.category}</p>
                            <div className="flex items-center gap-1 mt-1.5 text-xs font-medium text-yellow-500">
                                <Star className="w-3 h-3 fill-yellow-500" />
                                <span>{store.rating || 'New'}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleRemove(store.id)}
                            className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full hover:bg-red-100 transition-colors active:scale-90"
                        >
                            <Heart className="w-5 h-5 fill-red-500" />
                        </button>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export const SponsorInfoView: React.FC<SimplePageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-900 font-sans animate-in slide-in-from-right duration-300 text-white">
      <div className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-800">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="font-bold text-lg">Patrocinador Master</h1>
      </div>
      
      <div className="p-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-[#1E5BFF] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
            <Crown className="w-12 h-12 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold mb-4 font-display text-white">Seja um Destaque</h2>
        <p className="text-gray-300 text-sm mb-8 leading-relaxed max-w-sm">
            O <strong>Patrocinador Master</strong> é uma posição exclusiva para marcas que desejam visibilidade máxima e autoridade na Freguesia.
        </p>

        <div className="w-full bg-gray-800/50 rounded-2xl p-6 border border-gray-700 text-left space-y-5 mb-8">
            <h3 className="font-bold text-yellow-400 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400" />
                Benefícios Exclusivos
            </h3>
            <ul className="space-y-4 text-sm text-gray-200">
                <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 shrink-0"></div>
                    <span>Logo em destaque na abertura e cabeçalho do app.</span>
                </li>
                <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 shrink-0"></div>
                    <span>Banner fixo de alta visibilidade na tela "Explorar".</span>
                </li>
                <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 shrink-0"></div>
                    <span>Card exclusivo no Menu de todos os usuários.</span>
                </li>
            </ul>
        </div>

        <p className="text-xs text-gray-500 mb-4">
            Em breve abriremos novos planos para empresas interessadas.
        </p>

        <button 
            disabled 
            className="bg-gray-700 text-gray-400 font-bold py-4 px-8 rounded-full w-full cursor-not-allowed border border-gray-600"
        >
            Quero ser patrocinador
        </button>
      </div>
    </div>
  );
};