
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
  Loader2, 
  Info, 
  ShieldCheck, 
  History, 
  AlertCircle, 
  FileText, 
  Lock, 
  Search,
  Package,
  ArrowRight as ArrowRightIcon,
  ChevronRight
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
      
      <div className="p-5 flex flex-col items-center pt-12">
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
        <div className="py-12 px-5 flex flex-col items-center bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-950 text-center">
          <div className="w-24 h-24 bg-[#1E5BFF] rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20">
            <MapPin className="w-12 h-12 text-white fill-white" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white font-display leading-tight tracking-tighter uppercase">
            Localizei <span className="text-[#1E5BFF]">JPA</span>
          </h2>
          <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-[0.4em] mt-4">Onde o bairro conversa</p>
        </div>

        <div className="px-5 space-y-12 pb-24">
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
        </div>
      </div>
    </div>
  );
};

export const AboutAppView: React.FC<SimplePageProps> = ({ onBack }) => {
    const steps = [
      {
        title: "Onde o bairro conversa.",
        description: "Descubra o que está acontecendo em Jacarepaguá, converse com pessoas do seu bairro e fique por dentro de tudo que acontece perto de você.",
        image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200&auto=format&fit=crop"
      },
      {
        title: "Tudo o que você precisa, perto de você.",
        description: "Encontre comércios, serviços, cupons, classificados e novidades dos bairros de Jacarepaguá em um só lugar.",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
      },
      {
        title: "Use, participe e aproveite.",
        description: "Interaja no JPA Conversa, resgate cupons, contrate serviços e faça parte da vida do seu bairro.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
      }
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 pb-20">
            <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white uppercase tracking-tight">Como funciona</h1>
            </header>

            <main className="p-5 space-y-12">
                {steps.map((step, idx) => (
                    <div key={idx} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${idx * 200}ms` }}>
                        <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
                            <img src={step.image} className="w-full h-full object-cover" alt={step.title} />
                        </div>
                        <div className="px-2">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none mb-3">
                                {step.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}

                <div className="pt-8 pb-12">
                    <button 
                        onClick={onBack}
                        className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                    >
                        Entendi, vamos lá <ArrowRightIcon size={16} />
                    </button>
                </div>
            </main>
        </div>
    );
};

export const FavoritesView: React.FC<SimplePageProps> = ({ onBack, onNavigate, user }) => {
  const [favorites, setFavorites] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
        setLoading(false);
        setFavorites([]);
    }, 800);
  }, []);

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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Sem favoritos ainda</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[240px] mb-8">Marque lojas e anúncios para encontrá-los aqui rapidamente.</p>
                {onNavigate && <button onClick={() => onNavigate('home')} className="bg-[#1E5BFF] text-white font-black py-4 px-8 rounded-2xl shadow-xl uppercase tracking-widest text-xs">Explorar o bairro</button>}
            </div>
        ) : null}
      </div>
    </div>
  );
};

export const UserActivityView: React.FC<{ type: string; onBack: () => void }> = ({ type, onBack }) => {
  const titles: Record<string, string> = {
    comentarios: 'Meus Comentários',
    anuncios: 'Meus Anúncios',
    avaliacoes: 'Minhas Avaliações'
  };

  const icons: Record<string, any> = {
    comentarios: MessageSquare,
    anuncios: Package,
    avaliacoes: Star
  };

  const Icon = icons[type] || History;

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-all shadow-sm shrink-0">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{titles[type] || 'Atividade'}</h1>
      </header>

      <main className="p-5 flex flex-col items-center justify-center pt-24 text-center">
        <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-sm border border-gray-100 dark:border-gray-800">
           <Icon size={40} className="text-gray-200" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Ainda não há registros</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed mb-10">Sua atividade recente no bairro aparecerá aqui para você consultar quando quiser.</p>
        <button onClick={onBack} className="w-full max-w-xs bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-xl uppercase tracking-widest text-xs">Entendido</button>
      </main>
    </div>
  );
};

export const MyNeighborhoodsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-all shadow-sm shrink-0">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Meus Bairros</h1>
      </header>

      <main className="p-5 space-y-8">
        <section>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 mb-4">Bairro Principal</h3>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1E5BFF]"><MapPin size={24}/></div>
                <div><h4 className="font-black text-gray-900 dark:text-white uppercase">Freguesia</h4><p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Definido no cadastro</p></div>
            </div>
        </section>

        <section>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 mb-4">Interesses</h3>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 text-center flex flex-col items-center">
               <Search size={32} className="text-gray-200 mb-4" />
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Você ainda não marcou outros bairros de interesse.</p>
            </div>
        </section>
      </main>
    </div>
  );
};

export const PrivacyView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-all shadow-sm shrink-0">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Privacidade</h1>
      </header>

      <main className="p-5 space-y-6 overflow-y-auto pb-32 no-scrollbar">
         <section className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-6 border-b border-gray-50 dark:border-gray-800"><ShieldCheck className="text-blue-500" size={28} /><h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter text-xl">Seus dados estão seguros</h3></div>
            
            <div className="space-y-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                <p>No Localizei JPA, respeitamos sua privacidade. Seus dados de contato só são compartilhados com lojistas ou profissionais quando você inicia uma solicitação explícita.</p>
                
                <div className="space-y-4">
                    <div className="flex items-start gap-3"><div className="p-1 bg-blue-50 dark:bg-blue-900/20 rounded mt-1"><CheckCircle2 size={16} className="text-[#1E5BFF]" /></div><p>Criptografia de ponta a ponta em todos os chats de serviço.</p></div>
                    <div className="flex items-start gap-3"><div className="p-1 bg-blue-50 dark:bg-blue-900/20 rounded mt-1"><CheckCircle2 size={16} className="text-[#1E5BFF]" /></div><p>Você decide quais notificações deseja receber nas configurações do aparelho.</p></div>
                    <div className="flex items-start gap-3"><div className="p-1 bg-blue-50 dark:bg-blue-900/20 rounded mt-1"><CheckCircle2 size={16} className="text-[#1E5BFF]" /></div><p>Sua localização exata nunca é compartilhada sem sua permissão.</p></div>
                </div>

                <div className="pt-6 border-t border-gray-50 dark:border-gray-800">
                    <button className="text-blue-600 font-bold underline">Ler Termos de Uso completos</button>
                </div>
            </div>
         </section>
      </main>
    </div>
  );
};
