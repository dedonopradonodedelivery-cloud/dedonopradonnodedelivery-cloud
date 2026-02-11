
import React from 'react';
import { Ticket, ArrowRight } from 'lucide-react';
import { MOCK_HOME_COUPONS } from '@/constants';

interface CouponCarouselProps {
  onNavigate: (view: string) => void;
}

const CouponTicket: React.FC<{ coupon: any; onResgate: () => void }> = ({ coupon, onResgate }) => {
  return (
    <div className="flex-shrink-0 w-56 snap-center p-2">
      <div className={`relative h-36 rounded-[2rem] overflow-hidden shadow-lg ${coupon.color} flex flex-col group active:scale-[0.98] transition-transform`}>
        
        {/* Cutout effect circles */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-2.5 w-5 h-5 bg-white dark:bg-gray-950 rounded-full z-10"></div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-2.5 w-5 h-5 bg-white dark:bg-gray-950 rounded-full z-10"></div>

        {/* Top part of the ticket */}
        <div className="flex-1 p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
            <img 
              src={coupon.storeLogo} 
              alt={coupon.storeName} 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="text-[9px] font-black text-white/80 uppercase tracking-widest truncate mb-0.5">
              {coupon.storeName}
            </h4>
            <p className="text-white font-black text-2xl leading-none tracking-tighter uppercase drop-shadow-sm">
              {coupon.discount}
            </p>
          </div>
        </div>

        {/* Dotted separator */}
        <div className="px-4">
            <div className="h-px border-t border-dashed border-white/20"></div>
        </div>

        {/* Bottom part of the ticket */}
        <div className="h-14 px-4 flex items-center justify-between relative z-10">
          <div className="bg-black/10 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
            <p className="text-[10px] font-mono font-bold text-white tracking-widest">{coupon.code}</p>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onResgate(); }}
            className="bg-white text-gray-900 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md active:scale-90 transition-transform hover:bg-gray-50 flex items-center gap-1"
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
    <section className="bg-white dark:bg-gray-950 py-6 mb-2 overflow-hidden">
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

      <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-3 px-3">
        {MOCK_HOME_COUPONS.map((coupon) => (
          <CouponTicket 
            key={coupon.id} 
            coupon={coupon} 
            onResgate={() => onNavigate('coupon_landing')} 
          />
        ))}
        
        {/* "Explore All" card */}
        <div className="flex-shrink-0 w-40 snap-center p-2">
          <button 
            onClick={() => onNavigate('coupon_landing')}
            className="w-full h-36 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-all group bg-gray-50/30"
          >
            <div className="p-2.5 rounded-full bg-gray-50 dark:bg-gray-900 group-hover:bg-blue-50 transition-colors">
              <ArrowRight size={20} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-center">Explorar todos<br/>os cupons</span>
          </button>
        </div>
      </div>
    </section>
  );
};
