
import React from 'react';
import { Ticket, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MOCK_HOME_COUPONS } from '../constants';

interface CouponCarouselProps {
  onNavigate: (view: string) => void;
}

const CouponTicket: React.FC<{ coupon: any; onResgate: () => void }> = ({ coupon, onResgate }) => {
  return (
    <div className="flex-shrink-0 w-72 snap-center p-2">
      <div className={`relative h-44 rounded-[2.5rem] overflow-hidden shadow-xl ${coupon.color} flex flex-col group active:scale-[0.98] transition-transform`}>
        
        {/* Recortes Circulares Laterais (Efeito Ticket) */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 bg-white dark:bg-gray-950 rounded-full z-10"></div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-white dark:bg-gray-950 rounded-full z-10"></div>

        {/* Área Superior: Logo e Informações de Destaque */}
        <div className="flex-1 p-6 flex items-center gap-4">
          {/* Logo da Loja em Box Arredondado */}
          <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-lg shrink-0 flex items-center justify-center overflow-hidden">
            <img 
              src={coupon.storeLogo} 
              alt={coupon.storeName} 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          {/* Nome e Valor do Desconto */}
          <div className="flex flex-col min-w-0">
            <h4 className="text-[10px] font-black text-white/80 uppercase tracking-[0.15em] truncate mb-0.5">
              {coupon.storeName}
            </h4>
            <p className="text-white font-black text-3xl leading-none tracking-tighter uppercase drop-shadow-md">
              {coupon.discount}
            </p>
          </div>
        </div>

        {/* Linha Divisória Pontilhada Sutil */}
        <div className="px-6">
            <div className="h-px border-t border-dashed border-white/20"></div>
        </div>

        {/* Rodapé: Código e Ação */}
        <div className="h-16 px-6 flex items-center justify-between relative z-10">
          <div className="bg-black/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <p className="text-[11px] font-mono font-black text-white tracking-[0.1em]">{coupon.code}</p>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onResgate(); }}
            className="bg-white text-gray-900 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-90 transition-transform hover:bg-gray-50 flex items-center gap-1.5"
          >
            Resgatar
          </button>
        </div>
      </div>
    </div>
  );
};

export const CouponCarousel: React.FC<CouponCarouselProps> = ({ onNavigate }) => {
  return (
    <section className="bg-white dark:bg-gray-950 py-6 mb-2 overflow-visible">
      <div className="px-5 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-500 shadow-sm">
            <Ticket size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none">Cupons e Ofertas</h2>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Exclusivos para o bairro</p>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('coupon_landing')} 
          className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline"
        >
          Ver todos
        </button>
      </div>

      <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory px-3">
        {MOCK_HOME_COUPONS.map((coupon) => (
          <CouponTicket 
            key={coupon.id} 
            coupon={coupon} 
            onResgate={() => onNavigate('coupon_landing')} 
          />
        ))}
        
        {/* Card Final: Ver Todos */}
        <div className="flex-shrink-0 w-48 snap-center p-2">
          <button 
            onClick={() => onNavigate('coupon_landing')}
            className="w-full h-44 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-all group bg-gray-50/30"
          >
            <div className="p-3 rounded-full bg-gray-50 dark:bg-gray-900 group-hover:bg-blue-50 transition-colors">
              <ArrowRight size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-center">Explorar todos<br/>os cupons</span>
          </button>
        </div>
      </div>
    </section>
  );
};
