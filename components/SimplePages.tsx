
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
  Coins,
  Target,
  Eye,
  Shield,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Flag
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
      </div>
    </div>
  );
};

export const AboutView: React.FC<SimplePageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300 pb-20">
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Quem Somos</h1>
      </div>

      <div className="overflow-y-auto no-scrollbar h-[calc(100vh-64px)]">
        <div className="p-10 flex flex-col items-center bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-900">
          <div className="w-24 h-24 bg-[#1E5BFF] rounded-[2.5rem] flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/30">
            <MapPin className="w-12 h-12 text-white fill-white" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white font-display text-center leading-tight">
            Localizei <br/> <span className="text-[#1E5BFF]">JPA</span>
          </h2>
          <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-[0.3em] mt-3">Onde o bairro conversa</p>
        </div>

        <div className="px-6 space-y-10 pb-16">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500/20" />
              <h3 className="text-xs font-black text-amber-600 uppercase tracking-[0.2em]">Manifesto</h3>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/40 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed font-medium">
                  Onde o bairro conversa. <br/><br/>
                  Acreditamos que a vida acontece perto. Nos bairros, nas ruas e nas lojas de confiança. <br/><br/>
                  A Localizei JPA nasceu para aproximar quem procura de quem faz em Jacarepaguá. Queremos fortalecer o comércio local e criar conexões reais entre vizinhos.
                </p>
            </div>
          </section>

          <section className="grid gap-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-start gap-5 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-[#1E5BFF]" />
              </div>
              <div>
                <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest mb-1.5">Missão</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Conectar pessoas a serviços locais de forma simples e confiável.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-start gap-5 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                <Eye className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest mb-1.5">Visão</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Ser o super-app indispensável para quem vive e empreende em Jacarepaguá.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-start gap-5 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest mb-1.5">Valores</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Proximidade, Transparência, Impacto Local e Simplicidade.</p>
              </div>
            </div>
          </section>
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
        <div className="w-28 h-28 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-8 text-green-500 animate-bounce-short">
            <Share2 className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Indique e Ganhe</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-8 max-w-xs leading-relaxed font-medium">
            Em breve você ganhará <strong>cashback</strong> por indicar amigos. Estamos preparando essa novidade para você.
        </p>
        <div className="bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-full text-xs font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <Rocket className="w-4 h-4" /> Novidade chegando em breve
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
                            {store.image ? <img src={store.image} alt={store.name} className="w-full h-full object-cover" /> : <StoreIcon className="w-6 h-6 text-gray-400" />}
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

export const SponsorInfoView: React.FC<SimplePageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-900 font-sans animate-in slide-in-from-right duration-300 text-white">
      <div className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-800"><ChevronLeft className="w-6 h-6 text-white" /></button>
        <h1 className="font-bold text-lg">Patrocinador Master</h1>
      </div>
      
      <div className="p-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-[#1E5BFF] rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Crown className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-4 font-display text-white">Grupo Esquematiza</h2>
        <p className="text-gray-300 text-sm mb-8 leading-relaxed max-w-sm">
            O <strong>Patrocinador Master</strong> apoia o desenvolvimento e a digitalização do comércio local em Jacarepaguá.
        </p>
        <div className="w-full bg-gray-800/50 rounded-2xl p-6 border border-gray-700 text-left space-y-4 mb-8">
            <h3 className="font-bold text-yellow-400 text-sm uppercase tracking-wide">Destaque Regional</h3>
            <ul className="space-y-3 text-sm text-gray-200">
                <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    <span>Segurança e Facilities com excelência.</span>
                </li>
                <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    <span>Líder em serviços para condomínios.</span>
                </li>
            </ul>
        </div>
        <a href="https://grupoesquematiza.com.br" target="_blank" rel="noopener" className="bg-[#1E5BFF] text-white font-bold py-4 rounded-full w-full shadow-lg flex items-center justify-center gap-2">Visitar Site <ArrowRight className="w-4 h-4" /></a>
      </div>
    </div>
  );
};
