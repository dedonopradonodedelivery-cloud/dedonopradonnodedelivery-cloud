
import React from 'react';
import { Ticket, Clock, MapPin } from 'lucide-react';
import { MOCK_HOME_COUPONS_V2 } from '@/constants';

interface CouponCarouselProps {
  onNavigate: (view: string) => void;
}

const CouponTicket: React.FC<{ coupon: any; onResgate: () => void }> = ({ coupon, onResgate }) => {
  return (
    <div className="flex-shrink-0 w-72 snap-center">
      <div className={`relative rounded-3xl overflow-hidden shadow-lg flex flex-col group active:scale-[0.98] transition-transform ${coupon.color}`}>
        
        <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 bg-gray-100 dark:bg-black rounded-full z-10"></div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-8 bg-gray-100 dark:bg-black rounded-full z-10"></div>

        <div className="p-4 flex gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
            <img 
              src={coupon.storeLogo} 
              alt={coupon.storeName} 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col min-w-0 text-white">
            <h4 className="text-[10px] font-bold uppercase tracking-widest truncate opacity-80">
              {coupon.storeName}
            </h4>
            <p className="font-black text-4xl leading-none tracking-tighter uppercase drop-shadow-sm">
              {coupon.discount}
            </p>
            <p className="text-xs font-bold mt-1 opacity-90">{coupon.resgates}</p>
          </div>
        </div>
        
        <div className="h-px border-t border-dashed border-white/20 mx-4"></div>
        
        <div className="p-4 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4 text-white text-[10px] font-bold uppercase tracking-wider">
                <div className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
                    {coupon.code}
                </div>
                {coupon.distancia && (
                    <div className="flex items-center gap-1 opacity-80">
                        <MapPin size={12} /> {coupon.distancia}
                    </div>
                )}
                {coupon.validade && (
                    <div className="flex items-center gap-1 opacity-80">
                        <Clock size={12} /> {coupon.validade}
                    </div>
                )}
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); onResgate(); }}
                className="bg-white text-gray-900 px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow-md active:scale-90 transition-transform hover:bg-gray-50"
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
    <section className="bg-white dark:bg-gray-950 pt-4 pb-6">
      <div className="px-5 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none">Cupons do dia</h2>
        </div>
        <button 
          onClick={() => onNavigate('coupon_landing')} 
          className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline"
        >
          Ver todos
        </button>
      </div>

      <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 -mx-5 px-5">
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
