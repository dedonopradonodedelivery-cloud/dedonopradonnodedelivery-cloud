import React, { useState } from 'react';
import { 
  ChevronLeft, Share2, Heart, MapPin, Maximize2, 
  Car, Building2, CheckCircle2, MessageSquare, 
  Smartphone, ShieldCheck, Info
} from 'lucide-react';
import { RealEstateProperty } from '../types';

interface RealEstateDetailViewProps {
  property: RealEstateProperty;
  onBack: () => void;
  onRequireLogin: () => void;
  user: any;
}

export const RealEstateDetailView: React.FC<RealEstateDetailViewProps> = ({ 
  property, 
  onBack, 
  onRequireLogin,
  user 
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock de galeria (usando a imagem principal repetida para o exemplo)
  const gallery = [
    property.image,
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format&fit=crop"
  ];

  const isForSale = property.transaction === 'venda';

  const handleContact = () => {
    if (!user) {
      onRequireLogin();
      return;
    }
    const message = `Olá! Vi o anúncio de *${property.title}* no Localizei JPA e gostaria de mais informações.`;
    window.open(`https://wa.me/5521999999999?text=${encodeURIComponent(message)}`, '_blank');
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

        <div className="w-full h-full">
            <img src={gallery[currentImageIndex]} className="w-full h-full object-cover" alt={property.title} />
        </div>

        {/* Indicadores do Carrossel */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-10">
          {gallery.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentImageIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>

        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg border border-white/20 text-white ${
            isForSale ? 'bg-indigo-600' : 'bg-blue-600'
          }`}>
            {isForSale ? 'VENDA' : 'ALUGUEL'}
          </span>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="p-6 -mt-4 bg-[#F8F9FC] dark:bg-gray-950 rounded-t-[2.5rem] relative z-20 space-y-8">
        
        {/* Título e Valor */}
        <section>
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tighter">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              <MapPin size={12} className="text-blue-500" />
              {property.neighborhood}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] leading-none">
               {isForSale ? 'Valor solicitado' : 'Valor do Aluguel'}
            </p>
            <p className="text-3xl font-black text-[#1E5BFF] italic leading-none">
              {property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })}
            </p>
            <div className="flex gap-4 mt-2">
               {property.condoFee && (
                 <p className="text-[10px] font-bold text-gray-400">Condomínio: <span className="text-gray-700 dark:text-gray-300">R$ {property.condoFee}</span></p>
               )}
               <p className="text-[10px] font-bold text-gray-400">IPTU: <span className="text-gray-700 dark:text-gray-300">Consultar</span></p>
            </div>
          </div>
        </section>

        {/* Informações Técnicas */}
        <section className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-900 p-5 rounded-[1.75rem] border border-gray-100 dark:border-gray-800 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                    <Maximize2 size={20} />
                </div>
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Área Útil</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white leading-none">{property.area}m²</p>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-5 rounded-[1.75rem] border border-gray-100 dark:border-gray-800 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                    <Car size={20} />
                </div>
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Vagas</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white leading-none">{property.parkingSpaces || 0}</p>
                </div>
            </div>
        </section>

        {/* Descrição */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Descrição detalhada</h3>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              {property.description}
            </p>
          </div>
        </section>

        {/* Detalhes/Comodidades */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Infraestrutura e Lazer</h3>
          <div className="grid grid-cols-1 gap-3">
             {['Portaria 24h', 'Segurança Monitorada', 'Elevadores', 'Gerador', 'Ar Condicionado Central'].map((item, i) => (
               <div key={i} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-sm">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">{item}</span>
                  <CheckCircle2 size={16} className="text-emerald-500" />
               </div>
             ))}
          </div>
        </section>

        {/* Anunciante */}
        <section className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-blue-600 font-black text-xs uppercase shadow-sm">
                    {property.postedAt.charAt(0)}
                </div>
                <div>
                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter">Publicado por {property.neighborhood}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{property.postedAt}</p>
                </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-[10px] text-blue-800 dark:text-blue-300 font-bold leading-relaxed uppercase">
                O Localizei JPA não participa da negociação. Verifique sempre a documentação do imóvel.
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
            <MessageSquare size={20} fill="white" /> Falar no WhatsApp
          </button>
      </div>
    </div>
  );
};