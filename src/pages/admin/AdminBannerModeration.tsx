import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  PauseCircle, 
  Send, 
  User as UserIcon, 
  Building, 
  Clock, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCircle, 
  Info,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
// FIX: Corrected supabase import path from ../../services/supabaseClient to ../../lib/supabaseClient
import { supabase } from '../../lib/supabaseClient';

// --- Reusable Banner Rendering Components ---
const TemplateBannerRender: React.FC<{ config: any }> = ({ config }) => {
    if (!config) return <div className="p-2 text-xs text-slate-500">Configuração ausente</div>;
    const { template_id, headline, subheadline, product_image_url } = config;
    switch (template_id) {
      case 'oferta_relampago':
        return (
          <div className="w-full h-full bg-gradient-to-br from-rose-500 to-red-600 text-white p-4 flex items-center justify-between overflow-hidden relative text-xs">
            <div className="relative z-10">
              <span className="text-[10px] font-bold bg-yellow-300 text-red-700 px-2 py-0.5 rounded-full uppercase">{headline}</span>
              <h3 className="text-lg font-black mt-2 max-w-[120px] leading-tight">{subheadline}</h3>
            </div>
            <div className="relative z-10 w-16 h-16 rounded-full border-2 border-white/50 bg-gray-200 overflow-hidden flex items-center justify-center shrink-0">
              {product_image_url ? <img src={product_image_url} className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-gray-400" />}
            </div>
          </div>
        );
      case 'lancamento':
         return (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 text-white p-4 flex items-end justify-between overflow-hidden relative text-xs">
             <img src={product_image_url || 'https://via.placeholder.com/150'} className="absolute inset-0 w-full h-full object-cover opacity-30" />
             <div className="relative z-10">
                <span className="text-[8px] font-black uppercase tracking-widest text-cyan-300">{headline}</span>
                <h3 className="text-base font-bold mt-1 max-w-[150px] leading-tight">{subheadline}</h3>
             </div>
          </div>
        );
      default: return <div className="p-2 text-xs">Template desconhecido</div>;
    }
};
const CustomBannerRender: React.FC<{ config: any }> = ({ config }) => {
    if (!config) return <div className="p-2 text-xs text-slate-500">Configuração ausente</div>;
    const { background_color, text_color, title, subtitle } = config;
    return (
        <div className="w-full h-full p-4 flex flex-col justify-center text-xs" style={{ backgroundColor: background_color, color: text_color }}>
            <h3 className="font-black text-base leading-tight line-clamp-2">{title}</h3>
            <p className="opacity-80 mt-1 line-clamp-2">{subtitle}</p>
        </div>
    );
};
// --- END ---

interface AdminBannerModerationProps {
  onBack: () => void;
  user: User | null;
}

export const AdminBannerModeration: React.FC<AdminBannerModerationProps> = ({ onBack, user }) => {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionTaken, setActionTaken] = useState<{ [key: string]: 'paused' | null }>({});

  useEffect(() => {
    const fetchActiveBanners = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('published_banners')
          .select(`
            id, created_at, target, config, merchant_id,
            profiles ( full_name, email )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBanners(data || []);
      } catch (e) {
        console.error("Failed to fetch active banners", e);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveBanners();
  }, []);

  const handlePauseBanner = async (banner: any) => {
    if (confirm(`Pausar banner para "${banner.profiles.full_name || 'Loja'}"?`)) {
      try {
        if (!supabase) throw new Error("Supabase client not available");
        
        const { error: updateError } = await supabase
          .from('published_banners')
          .update({ is_active: false, updated_at: new Date().toISOString() })
          .eq('id', banner.id);
        if (updateError) throw updateError;
        
        const { error: logError } = await supabase
          .from('banner_audit_log')
          .insert({
            actor_id: user?.id,
            actor_email: user?.email,
            action: 'paused',
            banner_id: banner.id,
            details: { reason: 'Moderação manual via painel.' }
          });
        if (logError) console.error("Failed to log moderation event:", logError);

        setActionTaken(prev => ({ ...prev, [banner.id]: 'paused' }));
        setBanners(prev => prev.filter(b => b.id !== banner.id));

      } catch (e) {
        console.error("Failed to pause banner", e);
        alert("Erro ao pausar o banner.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans flex flex-col">
      <header className="bg-slate-900 border-b border-white/5 px-6 py-4 sticky top-0 z-50 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2.5 bg-[#1F2937] text-gray-400 hover:text-white transition-colors border border-white/5 rounded-xl active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-black text-lg text-white">Moderação de Banners</h1>
          <p className="text-xs text-slate-500 font-medium">Banners atualmente ativos no app</p>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto no-scrollbar pb-32">
        {loading ? (
          <div className="flex justify-center pt-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
        ) : banners.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-full pt-20">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-white/5">
              <CheckCircle size={40} className="text-slate-600" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Tudo Certo!</h2>
            <p className="text-slate-400 max-w-xs">Nenhum banner publicado por lojista para moderar no momento.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {banners.map(banner => (
              <div key={banner.id} className="bg-slate-900 rounded-3xl border border-white/5 p-5">
                <div className="flex gap-4">
                    <div className="w-48 h-24 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-slate-800">
                        {banner.config?.type === 'template' ? <TemplateBannerRender config={banner.config} /> : <CustomBannerRender config={banner.config} />}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 text-sm">
                            <UserIcon size={14} className="text-slate-400" />
                            <span className="font-bold text-white truncate">{banner.profiles?.full_name || 'Lojista'}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-2 truncate">{banner.profiles?.email}</p>
                        <div className="mt-2 text-[10px] text-slate-500 font-medium uppercase tracking-wider bg-slate-800 px-2 py-1 rounded w-fit">
                            Destino: {banner.target}
                        </div>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex gap-3">
                    <button 
                        onClick={() => handlePauseBanner(banner)}
                        className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all text-xs"
                    >
                        <PauseCircle size={16} /> Pausar Banner
                    </button>
                     <button className="w-full bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all text-xs">
                        <Send size={14} /> Contatar Lojista
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};