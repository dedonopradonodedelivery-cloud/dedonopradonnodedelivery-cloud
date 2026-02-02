
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Share2, 
  Heart, 
  MapPin, 
  Clock, 
  MessageSquare, 
  ShieldCheck, 
  Info,
  Tag,
  User as UserIcon
} from 'lucide-react';
import { Classified } from '../types';

interface ClassifiedDetailViewProps {
  item: Classified;
  onBack: () => void;
  user: any;
  onRequireLogin: () => void;
}

export const ClassifiedDetailView: React.FC<ClassifiedDetailViewProps> = ({ 
  item, 
  onBack, 
  onRequireLogin,
  user 
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleContact = () => {
    if (!user) {
      onRequireLogin();
      return;
    }
    const message = `Olá! Vi o anúncio de *${item.title}* no Localizei JPA e gostaria de mais informações.`;
    window.open(`https://wa.me/${item.contactWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getCategoryColor = () => {
    if (item.category.includes('Adoção')) return 'bg-amber-500';
    if (item.category.includes('Doações')) return 'bg-emerald-500';
    return 'bg-indigo-600';
  };

  const getCategoryLabel = () => {
    if (item.category.includes('Adoção')) return 'ADOÇÃO';
    if (item.category.includes('Doações')) return 'DOAÇÃO';
    return 'VENDA';
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-40 animate-in fade-in duration-500 relative">
      
      {/* HEADER / IMAGEM */}
      <div className="relative aspect-video w-full bg-gray-200 dark:bg-gray-800">
        <div className="absolute top-0 left-0 right-0 p-5 pt-8 z-20 flex justify-between items-center">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-all">
              <Share2 size={20} />
            </button>
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-all"
            >
              <Heart size={20} className={isFavorite ? "fill-rose-500 text-rose-500" : ""} />
            </button>
          </div>
        </div>

        <img 
          src={item.imageUrl || "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop"} 
          className="w-full h-full object-cover" 
          alt={item.title} 
        />

        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg border border-white/20 text-white ${getCategoryColor()}`}>
            {getCategoryLabel()}
          </span>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="p-6 -mt-4 bg-[#F8F9FC] dark:bg-gray-950 rounded-t-[2.5rem] relative z-20 space-y-8">
        
        <section>
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tighter">
              {item.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              <MapPin size={12} className="text-blue-500" />
              {item.neighborhood}
            </div>
          </div>

          {item.price && (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] leading-none">
                 Valor solicitado
              </p>
              <p className="text-3xl font-black text-emerald-600 italic leading-none">
                {item.price}
              </p>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Descrição</h3>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              {item.description}
            </p>
          </div>
        </section>

        <section className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-blue-600 shadow-sm border border-gray-100 dark:border-gray-700">
                    <UserIcon size={20} />
                </div>
                <div>
                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter">Anunciado por {item.advertiser}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{item.timestamp}</p>
                </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-[10px] text-blue-800 dark:text-blue-300 font-bold leading-relaxed uppercase">
                O Localizei JPA apoia conexões seguras. Sempre verifique o item ou animal pessoalmente.
              </p>
            </div>
        </section>
      </div>

      {/* FOOTER CTA */}
      <div className="fixed bottom-[80px] left-0 right-0 p-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 z-50 max-w-md mx-auto shadow-2xl">
          <button 
            onClick={handleContact}
            className="w-full bg-[#00D95F] hover:bg-[#00C254] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs shadow-xl shadow-green-500/20 active:scale-95 transition-all"
          >
            <MessageSquare size={20} fill="white" /> Falar pelo WhatsApp
          </button>
      </div>
    </div>
  );
};
