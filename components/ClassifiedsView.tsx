
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  MapPin, 
  Clock, 
  MessageCircle, 
  AlertCircle, 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  Tag,
  Newspaper,
  Megaphone,
  Briefcase,
  ShoppingCart,
  Wrench,
  Info,
  ArrowRight,
  TrendingUp,
  LayoutGrid
} from 'lucide-react';
import { MOCK_CLASSIFIEDS } from '../constants';
import { Classified, ClassifiedCategory } from '../types';

interface ClassifiedsViewProps {
  onBack: () => void;
}

const CATEGORIES_DATA: { id: ClassifiedCategory; label: string; icon: any; color: string }[] = [
  { id: 'Empregos', label: 'Empregos', icon: Briefcase, color: 'bg-blue-600' },
  { id: 'Serviços', label: 'Serviços', icon: Wrench, color: 'bg-purple-600' },
  { id: 'Compra & Venda', label: 'Compra & Venda', icon: ShoppingCart, color: 'bg-emerald-600' },
  { id: 'Avisos', label: 'Avisos', icon: Megaphone, color: 'bg-amber-600' },
];

const SUBCATEGORIES_MAP: Record<ClassifiedCategory, string[]> = {
  'Empregos': ['CLT', 'PJ', 'Freelancer'],
  'Serviços': ['Reforma', 'Conserto', 'Aulas', 'Profissionais'],
  'Compra & Venda': ['Vende-se', 'Compra-se', 'Usados'],
  'Avisos': ['Utilidade pública', 'Comunidade', 'Informativos'],
};

const CLASSIFIEDS_BANNERS = [
  {
    id: 'b1',
    title: 'Anuncie sua Vaga',
    subtitle: 'Encontre talentos do bairro rapidamente.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800&auto=format&fit=crop',
    color: 'bg-blue-700'
  },
  {
    id: 'b2',
    title: 'Destaque seus Serviços',
    subtitle: 'Apareça para quem precisa de ajuda agora.',
    image: 'https://images.unsplash.com/photo-1581578731522-745505146317?q=80&w=800&auto=format&fit=crop',
    color: 'bg-purple-700'
  },
  {
    id: 'b3',
    title: 'Desapega Freguesia',
    subtitle: 'Venda o que não usa mais para seus vizinhos.',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop',
    color: 'bg-emerald-700'
  }
];

const BannerCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CLASSIFIEDS_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentBanner = CLASSIFIEDS_BANNERS[currentIndex];

  return (
    <div className="px-5 mt-6 mb-8">
      <div className={`relative aspect-[16/10] w-full rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 ${currentBanner.color}`}>
        <img 
          src={currentBanner.image} 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay transition-transform duration-700 hover:scale-110" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="relative h-full flex flex-col justify-center p-8 text-white">
          <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight mb-2 drop-shadow-md">
            {currentBanner.title}
          </h2>
          <p className="text-xs font-bold text-white/90 max-w-[180px] leading-tight drop-shadow-sm">
            {currentBanner.subtitle}
          </p>
        </div>
        
        {/* Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          {CLASSIFIEDS_BANNERS.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-white' : 'w-1 bg-white/40'}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ClassifiedDetailModal: React.FC<{ classified: Classified; onClose: () => void }> = ({ classified, onClose }) => {
  const handleContact = () => {
    const text = `Olá! Vi seu anúncio de *${classified.title}* nos Classificados do Localizei JPA e gostaria de mais informações.`;
    const url = `https://wa.me/${classified.contactWhatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-950 w-full max-w-md h-[90vh] rounded-t-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-950 sticky top-0 z-10">
          <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Detalhes do Anúncio</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 pb-32">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-[#1E5BFF]">
                <Tag size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{classified.title}</h3>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{classified.advertiser}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-[#1E5BFF] rounded-full text-[10px] font-black uppercase tracking-widest">
                {classified.category}
              </span>
              {classified.typeLabel && (
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {classified.typeLabel}
                </span>
              )}
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <MapPin size={10} /> {classified.neighborhood}
              </span>
            </div>
            
            {classified.price && (
                <p className="text-2xl font-black text-gray-900 dark:text-white mt-4">{classified.price}</p>
            )}
          </div>

          <section className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Descrição do anúncio</h4>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                {classified.description}
              </p>
            </div>
          </section>

          {classified.jobDetails && (
            <section className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Requisitos da Vaga</h4>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-700 dark:text-gray-200">
                        <Clock size={18} className="text-blue-500" />
                        Horário: {classified.jobDetails.schedule}
                    </div>
                    <div className="h-px bg-gray-50 dark:bg-gray-800"></div>
                    <div className="space-y-3">
                        {classified.jobDetails.requirements.map((req, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{req}</span>
                        </div>
                        ))}
                    </div>
                </div>
            </section>
          )}
        </div>

        <div className="p-6 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 sticky bottom-0">
          <button 
            onClick={handleContact}
            className="w-full bg-[#1E5BFF] hover:bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            <MessageCircle size={20} className="fill-current" />
            Enviar Mensagem
          </button>
        </div>
      </div>
    </div>
  );
};

export const ClassifiedsView: React.FC<ClassifiedsViewProps> = ({ onBack }) => {
  const [selectedClassified, setSelectedClassified] = useState<Classified | null>(null);
  const [activeCategory, setActiveCategory] = useState<ClassifiedCategory | 'Todos'>('Todos');
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);

  const filteredClassifieds = useMemo(() => {
    let list = [...MOCK_CLASSIFIEDS];
    if (activeCategory !== 'Todos') {
      list = list.filter(item => item.category === activeCategory);
      if (activeSubCategory) {
        list = list.filter(item => item.subCategory === activeSubCategory);
      }
    }
    return list;
  }, [activeCategory, activeSubCategory]);

  const handleSelectCategory = (catId: ClassifiedCategory | 'Todos') => {
    setActiveCategory(catId);
    setActiveSubCategory(null);
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto min-h-screen font-sans pb-32 animate-in fade-in duration-500 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-4 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
        <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-black text-2xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Classificados</h1>
          <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Oportunidades e Avisos Locais</p>
        </div>
      </header>

      <main className="flex flex-col">
        {/* 1. CARROSSEL DE BANNERS */}
        <BannerCarousel />

        {/* 2. CATEGORIAS VISUAIS (ESTILO HOME) */}
        <section className="px-5 mb-8">
          <div className="grid grid-cols-4 gap-3">
             {/* Opção "Todos" separada ou integrada */}
             <button 
                onClick={() => handleSelectCategory('Todos')}
                className={`flex flex-col items-center gap-2 group active:scale-95 transition-all`}
              >
                <div className={`w-full aspect-square rounded-[22px] shadow-lg flex items-center justify-center border transition-all ${
                  activeCategory === 'Todos' ? 'bg-[#1E5BFF] border-white/20' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                }`}>
                  <LayoutGrid className={`w-6 h-6 ${activeCategory === 'Todos' ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-tighter ${activeCategory === 'Todos' ? 'text-[#1E5BFF]' : 'text-gray-400'}`}>Todos</span>
              </button>

            {CATEGORIES_DATA.map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => handleSelectCategory(cat.id)}
                className={`flex flex-col items-center gap-2 group active:scale-95 transition-all`}
              >
                <div className={`w-full aspect-square rounded-[22px] shadow-lg flex items-center justify-center border transition-all ${
                  activeCategory === cat.id ? `${cat.color} border-white/20` : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                }`}>
                  {React.cloneElement(cat.icon as any, { 
                    className: `w-6 h-6 ${activeCategory === cat.id ? 'text-white' : 'text-gray-400'}` 
                  })}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-tighter ${activeCategory === cat.id ? 'text-[#1E5BFF]' : 'text-gray-400'}`}>
                  {cat.label.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 3. SUBCATEGORIAS (Contextual) */}
        {activeCategory !== 'Todos' && SUBCATEGORIES_MAP[activeCategory] && (
          <section className="px-5 mb-6 animate-in slide-in-from-left duration-300">
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
              <button 
                onClick={() => setActiveSubCategory(null)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                  activeSubCategory === null 
                  ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700'
                }`}
              >
                Tudo em {activeCategory}
              </button>
              {SUBCATEGORIES_MAP[activeCategory].map(sub => (
                <button 
                  key={sub}
                  onClick={() => setActiveSubCategory(sub)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                    activeSubCategory === sub 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
                    : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 4. FEED DE CLASSIFICADOS */}
        <section className="px-4 py-2 space-y-4">
          <div className="px-1 flex items-center justify-between">
             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                {activeCategory === 'Todos' ? 'Feed do Bairro' : `${activeCategory} em Jacarepaguá`}
             </h3>
             <span className="text-[10px] font-bold text-gray-300 uppercase">{filteredClassifieds.length} itens</span>
          </div>

          {filteredClassifieds.length > 0 ? filteredClassifieds.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedClassified(item)}
              className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.category === 'Empregos' ? 'bg-blue-50 text-[#1E5BFF]' :
                    item.category === 'Serviços' ? 'bg-purple-50 text-purple-600' :
                    item.category === 'Compra & Venda' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {item.category === 'Empregos' ? <Briefcase size={20} /> :
                     item.category === 'Serviços' ? <Wrench size={20} /> :
                     item.category === 'Compra & Venda' ? <ShoppingCart size={20} /> :
                     <Megaphone size={20} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-[#1E5BFF] transition-colors truncate">{item.title}</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest truncate">{item.advertiser}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shrink-0 ml-2 ${
                  item.category === 'Empregos' ? 'bg-blue-50 text-blue-600' :
                  item.category === 'Compra & Venda' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-gray-50 text-gray-500'
                }`}>
                  {item.subCategory || item.typeLabel}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-tight">
                  <MapPin size={12} /> {item.neighborhood}
                </div>
                <span className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest flex items-center gap-1">
                  Ver detalhes <ChevronRight size={12} />
                </span>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center flex flex-col items-center opacity-30">
              <AlertCircle size={48} className="text-gray-400 mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest leading-relaxed">Nenhum anúncio<br/>encontrado nesta categoria.</p>
            </div>
          )}
        </section>
      </main>

      {selectedClassified && <ClassifiedDetailModal classified={selectedClassified} onClose={() => setSelectedClassified(null)} />}
    </div>
  );
};
