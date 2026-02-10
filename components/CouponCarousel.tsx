
import React from 'react';
import { Ticket, ArrowRight, Store } from 'lucide-react';
import { MOCK_HOME_COUPONS } from '../constants';

interface CouponCarouselProps {
  onNavigate: (view: string) => void;
}

const CouponTicket: React.FC<{ coupon: any; onResgate: () => void }> = ({ coupon, onResgate }) => {
  return (
    <div className="flex-shrink-0 w-64 snap-center p-2">
      <div className={`relative h-44 rounded-3xl overflow-hidden shadow-xl ${coupon.color} flex flex-col group active:scale-[0.98] transition-transform`}>
        {/* Recortes Circulares do Ticket */}
        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white dark:bg-gray-950 rounded-full -translate-y-1/2 z-10"></div>
        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white dark:bg-gray-950 rounded-full -translate-y-1/2 z-10"></div>
        
        {/* Linha Pontilhada */}
        <div className="absolute top-1/2 left-4 right-4 h-px border-t border-dashed border-white/40 -translate-y-1/2 z-0"></div>

        {/* Topo do Cupom */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md p-1 border border-white/20">
              <img src={coupon.storeLogo} alt={coupon.storeName} className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[10px] font-black text-white/70 uppercase tracking-widest truncate">{coupon.storeName}</h4>
              <p className="text-white font-black text-lg leading-tight tracking-tighter uppercase">{coupon.discount}</p>
            </div>
          </div>
          <div className="mt-1">
            <p className="text-[9px] text-white/90 font-bold leading-tight line-clamp-1">{coupon.rules}</p>
          </div>
        </div>

        {/* Base do Cupom */}
        <div className="h-16 p-4 flex items-center justify-between">
          <div className="bg-black/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
            <p className="text-[10px] font-mono font-black text-white tracking-[0.2em]">{coupon.code}</p>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onResgate(); }}
            className="bg-white text-gray-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-90 transition-transform"
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
    <section className="bg-white dark:bg-gray-950 py-4 mb-2">
      <div className="px-5 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-500">
            <Ticket size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none">Cupons de Desconto</h2>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Economize no Bairro</p>
          </div>
        </div>
        <button onClick={() => onNavigate('coupon_landing')} className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
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
            className="w-full h-44 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-all group"
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
