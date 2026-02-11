
import React from 'react';
import { Ticket, Clock, MapPin, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { MOCK_HOME_COUPONS_V2 } from '@/constants';

interface CouponCarouselProps {
  onNavigate: (view: string) => void;
}

const CouponTicket: React.FC<{ coupon: any; onResgate: () => void }> = ({ coupon, onResgate }) => {
  return (
    <div className="flex-shrink-0 w-80 snap-center p-2">
      <div className={`relative rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col group active:scale-[0.98] transition-transform ${coupon.color}`}>
        
        {/* Ticket Cutouts */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 bg-[#F8F9FC] dark:bg-black rounded-full z-10"></div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-8 bg-[#F8F9FC] dark:bg-black rounded-full z-10"></div>

        <div className="p-6 flex gap-5">
          <div className="w-20 h-20 rounded-3xl bg-white p-1 shadow-2xl shrink-0 flex items-center justify-center overflow-hidden">
            <img 
              src={coupon.storeLogo} 
              alt={coupon.storeName} 
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
          <div className="flex flex-col min-w-0 text-white">
            <div className="flex items-center gap-2 mb-1 opacity-80">
                <Sparkles size={10} className="fill-current" />
                <h4 className="text-[9px] font-black uppercase tracking-widest truncate">
                {coupon.storeName}
                </h4>
            </div>
            <p className="font-black text-5xl leading-none tracking-tighter uppercase drop-shadow-xl">
              {coupon.discount}
            </p>
            <div className="flex items-center gap-1.5 mt-3 bg-black/10 w-fit px-2 py-0.5 rounded-lg border border-white/10">
                <TrendingUp size={10} />
                <p className="text-[9px] font-black uppercase tracking-tight">{coupon.resgates}</p>
            </div>
          </div>
        </div>
        
        <div className="h-px border-t border-dashed border-white/20 mx-6"></div>
        
        <div className="p-6 flex items-center justify-between relative z-10">
            <div className="flex flex-col gap-1 text-white text-[10px] font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5 opacity-80">
                    <MapPin size={12} /> {coupon.distancia}
                </div>
                {coupon.validade && (
                    <div className="flex items-center gap-1.5 text-yellow-300">
                        <Clock size={12} /> {coupon.validade}
                    </div>
                )}
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); onResgate(); }}
                className="bg-white text-gray-900 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-90 transition-transform hover:bg-gray-50 flex items-center gap-2"
            >
                Resgatar <ArrowRight size={14} strokeWidth={3} />
            </button>
        </div>
      </div>
    </div>
  );
};

export const CouponCarousel: React.FC<CouponCarouselProps> = ({ onNavigate }) => {
  return (
    <section className="bg-white dark:bg-gray-950 pt-4 pb-8">
      <div className="px-5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.15em] leading-none">Cupons do dia 🔥</h2>
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
        </div>
        <button 
          onClick={() => onNavigate('coupon_landing')} 
          className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline"
        >
          Ver todos
        </button>
      </div>

      <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-2 -mx-5 px-5">
        <div className="w-1 shrink-0"></div>
        {MOCK_HOME_COUPONS_V2.map((coupon) => (
          <CouponTicket 
            key={coupon.id} 
            coupon={coupon} 
            onResgate={() => onNavigate('coupon_landing')} 
          />
        ))}
        <div className="w-1 shrink-0"></div>
      </div>
    </section>
  );
};
