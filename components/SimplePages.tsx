import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Mail, 
  Copy, 
  CheckCircle, 
  Share2, 
  MapPin, 
  Target,
  Eye,
  Shield,
  CheckCircle2,
  Users,
  Building2,
  Handshake,
  MessageSquare,
  ArrowRight,
  Heart,
  Star,
  Loader2
} from 'lucide-react';
import { Store, AdType } from '../types';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface SimplePageProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
  user?: User | null;
}

export const SupportView: React.FC<SimplePageProps> = ({ onBack }) => {
  const [copied, setCopied] = useState(false);
  const email = "contato.localizeijpa@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
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
            <p className="text-sm font-bold text-gray-800 dark:text-white mb-6 break-all text-center bg-white dark:bg-gray-700 px-4 py-2 rounded-lg border border-gray-100 dark:border-gray-700 w-full">
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
                    className="w-14 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-colors"
                    title="Copiar e-mail"
                >
                    {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export const AboutView: React.FC<SimplePageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 pb-20">
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white uppercase tracking-tight">Quem Somos</h1>
      </div>

      <div className="overflow-y-auto no-scrollbar">
        {/* Banner de Identidade */}
        <div className="p-12 flex flex-col items-center bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-950 text-center">
          <div className="w-24 h-24 bg-[#1E5BFF] rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20">
            <MapPin className="w-12 h-12 text-white fill-white" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white font-display leading-tight tracking-tighter uppercase">
            Localizei <span className="text-[#1E5BFF]">JPA</span>
          </h2>
          <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-[0.4em] mt-4">Onde o bairro conversa</p>
        </div>

        <div className="px-6 space-y-12 pb-24">
          {/* Manifesto */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-4 ml-1">Manifesto</h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed font-medium relative z-10">
                  Acreditamos que a vida acontece perto. Nos bairros, nas ruas e nas lojas de confiança. 
                  O Localizei JPA nasceu para aproximar quem procura de quem faz, fortalecendo a vida local e criando conexões reais entre vizinhos.
                  <br/><br/>
                  Nosso espaço é dedicado à valorização do comércio e dos serviços da região, colocando as pessoas no centro de cada experiência. 
                  Aqui, o pertencimento e a proximidade são os pilares que movem cada conversa.
                </p>
            </div>
          </section>

          {/* Missão e Visão */}
          <section className="grid grid-cols-1 gap-4">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 flex flex-col gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1E5BFF] shrink-0">
                <Target size={24} />
              </div>
              <div>
                <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest mb-2">Missão</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  Conectar moradores aos comércios, serviços e conversas do seu bairro, fortalecendo a vida local e o senso de comunidade.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 flex flex-col gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 shrink-0">
                <Eye size={24} />
              </div>
              <div>
                <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest mb-2">Visão</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  Ser a principal plataforma de vida local do Rio de Janeiro, começando pelos bairros e expandindo de forma orgânica e comunitária.
                </p>
              </div>
            </div>
          </section>

          {/* Valores */}
          <section className="space-y-6">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">Nossos Valores</h3>
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                {[
                  { title: "Valorização do bairro", icon: MapPin },
                  { title: "Pessoas em primeiro lugar", icon: Users },
                  { title: "Proximidade e verdade", icon: Handshake },
                  { title: "Comércio local forte", icon: Building2 },
                  { title: "Conversa e convivência", icon: MessageSquare },
                  { title: "Transparência", icon: Shield },
                  { title: "Simplicidade", icon: CheckCircle2 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 border-b border-gray-50 dark:border-gray-800 last:border-0">
                    <div className="text-blue-500">
                      <item.icon size={20} />
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tight">{item.title}</span>
                  </div>
                ))}
            </div>
          </section>
        </div>

        {/* Footer Institucional */}
        <div className="py-12 text-center opacity-30">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] leading-relaxed">
            Localizei JPA <br/> Plataforma de Vida Local
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
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Indique um Amigo</h1>
      </div>
      
      <div className="p-6 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-28 h-28 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-8 text-green-500">
            <Share2 className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Indique e Ganhe</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-8 max-w-xs leading-relaxed font-medium">
            Em breve você ganhará cashback por indicar amigos. Estamos preparando essa novidade para você.
        </p>
        <div className="bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-full text-xs font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 flex items-center gap-2">
            Novidade chegando em breve
        </div>
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

        const mappedStores: Store[] = (data || []).map((item: any) => {
          const b = item.businesses;
          return {
            id: b.id,
            name: b.name,
            category: b.category,
            subcategory: b.subCategory,
            image: b.imageUrl || 'https://via.placeholder.com/100',
            rating: b.rating || 0,
            description: b.description || '',
            distance: 'Jacarepaguá • RJ',
            adType: AdType.ORGANIC,
            reviewsCount: 0,
            verified: true 
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

  const handleRemove = async (storeId: string) => {
    if (!user || !supabase) return;
    setFavorites(prev => prev.filter(s => s.id !== storeId));
    try {
        const { error } = await supabase.from('favorites').delete().match({ user_id: user.id, business_id: storeId });
        if (error) throw error;
    } catch(err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Meus Favoritos</h1>
      </div>
      
      <div className="p-5 pb-24">
        {loading ? (
            <div className="flex justify-center pt-20"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>
        ) : favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center mt-20">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6"><Heart className="w-10 h-10 text-gray-400" /></div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sem favoritos ainda</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[240px] mb-8">Adicione seus locais preferidos para acessá-los rapidamente.</p>
                {onNavigate && <button onClick={() => onNavigate('explore')} className="bg-[#1E5BFF] text-white font-bold py-3 px-8 rounded-full">Explorar Lojas</button>}
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {favorites.map(store => (
                    <div key={store.id} className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 items-center group">
                        <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
                            {store.image ? <img src={store.image} alt={store.name} className="w-full h-full object-cover" /> : <Building2 className="w-6 h-6 text-gray-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{store.name}</h4>
                            <div className="flex items-center gap-1 mt-1 text-xs text-yellow-500"><Star className="w-3 h-3 fill-yellow-500" /><span>{store.rating || 'New'}</span></div>
                        </div>
                        <button onClick={() => handleRemove(store.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"><Heart className="w-5 h-5 fill-red-500" /></button>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
