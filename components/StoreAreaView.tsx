
import React from 'react';
import { 
  ChevronRight, 
  Megaphone, 
  LayoutGrid, 
  BarChart3, 
  MessageSquare, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  User,
  Sparkles,
  LifeBuoy,
  Crown,
  Star,
  Moon,
  Sun,
  ImageIcon,
  TrendingUp,
  Ticket,
  Video,
  Settings,
  ShoppingBag,
  Clock,
  Briefcase,
  Users,
  Tag,
  Zap,
  Store as StoreIcon,
  PieChart,
  Building,
  Handshake,
  FileText
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { InstitutionalSponsorBanner } from '@/components/InstitutionalSponsorBanner';
import { MandatoryVideoLock } from '@/components/MandatoryVideoLock';
import { useFeatures } from '@/contexts/FeatureContext';

interface StoreAreaViewProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
  user: SupabaseUser | null;
}

const NavCard: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  description?: string;
  onClick: () => void;
  isDestructive?: boolean;
  colorClass?: string;
  badge?: number;
  rightElement?: React.ReactNode;
  topRightTag?: React.ReactNode;
}> = ({ icon: Icon, label, description, onClick, isDestructive, colorClass, badge, rightElement, topRightTag }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-900/60 border-b border-blue-100/50 dark:border-white/5 last:border-b-0 active:bg-blue-50 dark:active:bg-slate-800 transition-colors group rounded-2xl mb-2 shadow-sm relative"
  >
    {topRightTag}
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-xl transition-colors relative ${
        isDestructive 
          ? 'bg-red-100 text-red-600 dark:bg-red-900/30' 
          : colorClass || 'bg-blue-50/50 dark:bg-slate-800 text-gray-400 group-hover:text-[#1E5BFF] shadow-sm'
      }`}>
        <Icon size={20} />
        {badge ? (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center animate-bounce">
            <span className="text-[10px] font-black text-white">{badge}</span>
          </div>
        ) : null}
      </div>
      <div className="text-left">
        <p className={`text-sm font-bold ${isDestructive ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'}`}>
          {label}
        </p>
        {description && (
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-tight mt-0.5 max-w-[180px]">
            {description}
          </p>
        )}
      </div>
    </div>
    {rightElement || <ChevronRight size={16} className={isDestructive ? 'text-red-300' : 'text-gray-300 group-hover:text-[#1E5BFF] transition-colors'} />}
  </button>
);

const SectionHeader: React.FC<{ title: string; icon?: React.ElementType }> = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-4 mt-8 px-2 first:mt-0">
    {Icon && <Icon size={14} className="text-[#1E5BFF]" />}
    <h2 className="text-[11px] font-black text-blue-400/80 dark:text-gray-500 uppercase tracking-[0.2em]">
      {title}
    </h2>
  </div>
);

export const StoreAreaView: React.FC<StoreAreaViewProps> = ({ onBack, onNavigate, user }) => {
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isFeatureActive } = useFeatures();

  const handleLogout = async () => {
    if (confirm('Deseja realmente sair da sua conta de lojista?')) {
      await signOut();
      onNavigate('home');
    }
  };

  const storeName = user?.user_metadata?.store_name || "Sua Loja";
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${storeName.replace(' ', '+')}&background=1E5BFF&color=fff`;

  return (
    <MandatoryVideoLock 
      videoUrl="https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4" 
      storageKey="merchant_panel"
    >
      <div className="min-h-screen bg-[#F4F7FF] dark:bg-gray-950 font-sans animate-in fade-in duration-500 pb-40">
        
        <div className="bg-white dark:bg-gray-950 px-6 pt-12 pb-8 border-b border-blue-100 dark:border-gray-800 shadow-sm mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-[2rem] border-4 border-[#F4F7FF] dark:border-slate-800 shadow-xl overflow-hidden shrink-0">
              <img src={avatarUrl} alt={storeName} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white truncate leading-tight uppercase tracking-tighter">
                {storeName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg font-black uppercase tracking-widest border border-blue-100">Painel do Parceiro</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5">
          
          <section>
            <SectionHeader title="Minha Loja" icon={Building} />
            <NavCard 
              icon={StoreIcon} 
              label="Perfil Público da Loja" 
              description="Informações visíveis, busca e dados para emissão de nota"
              onClick={() => onNavigate('store_profile')} 
            />
          </section>

          {(isFeatureActive('coupons') || isFeatureActive('banner_highlights')) && (
            <section>
                <SectionHeader title="Promoções e Vendas" icon={Tag} />
                {isFeatureActive('coupons') && (
                    <NavCard 
                    icon={Ticket} 
                    label="Cupons de Desconto" 
                    description="Crie e gerencie seus cupons"
                    onClick={() => onNavigate('merchant_coupons')}
                    colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
                    />
                )}
                {isFeatureActive('banner_highlights') && (
                    <NavCard 
                    icon={Zap} 
                    label="Promoções Ativas" 
                    description="Vitrine de ofertas especiais"
                    onClick={() => onNavigate('merchant_promotions')} 
                    />
                )}
            </section>
          )}

          <section>
            <SectionHeader title="Crescimento e Anúncios" icon={Sparkles} />
            {isFeatureActive('sponsored_ads') && (
                <NavCard 
                icon={TrendingUp} 
                label="Patrocinados" 
                description="Suba para o topo por R$ 0,90/dia"
                onClick={() => onNavigate('store_sponsored')}
                colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
                />
            )}
            {isFeatureActive('banner_highlights') && (
                <NavCard 
                icon={LayoutGrid} 
                label="Banners em Destaque" 
                description="Sua loja nas áreas nobres do bairro"
                onClick={() => onNavigate('store_ads_module')}
                colorClass="bg-purple-50 text-purple-600 dark:bg-purple-900/20"
                topRightTag={
                    <div 
                    className="absolute -top-4 -right-1 z-20 bg-yellow-400 text-slate-900 py-1.5 px-3 shadow-xl border border-yellow-500 animate-subtle-pulse flex flex-col items-center"
                    style={{
                        clipPath: 'polygon(100% 0%, 95% 5%, 100% 10%, 95% 15%, 100% 20%, 95% 25%, 100% 30%, 95% 35%, 100% 40%, 95% 45%, 100% 50%, 95% 55%, 100% 60%, 95% 65%, 100% 70%, 95% 75%, 100% 80%, 95% 85%, 100% 90%, 95% 95%, 100% 100%, 0% 100%, 5% 95%, 0% 90%, 5% 85%, 0% 80%, 5% 75%, 0% 70%, 5% 65%, 0% 60%, 5% 55%, 0% 50%, 5% 45%, 0% 40%, 5% 35%, 0% 30%, 5% 25%, 0% 20%, 5% 15%, 0% 10%, 5% 5%, 0% 0%)'
                    }}
                    >
                    <p className="text-[8px] font-black leading-none mb-0.5">💎 A PARTIR DE R$ 49,90/MÊS</p>
                    <p className="text-[7px] font-bold opacity-80 leading-none">EXCLUSIVO PARA FUNDADORES</p>
                    </div>
                }
                />
            )}
            {isFeatureActive('master_sponsor') && (
                <NavCard 
                icon={Crown} 
                label="Patrocinador Master" 
                description="Visibilidade em 90% do app"
                onClick={() => onNavigate('sponsor_info')}
                colorClass="bg-amber-50 text-amber-600 dark:bg-amber-900/20"
                />
            )}
            <NavCard 
              icon={Handshake} 
              label="JPA Connect" 
              description="Conectando lojistas do bairro"
              onClick={() => onNavigate('jpa_connect')}
              colorClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20"
              rightElement={<span className="text-[8px] font-black bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-widest">Em breve</span>}
            />
          </section>

          <section>
            <SectionHeader title="Relacionamento" icon={Users} />
            <NavCard 
              icon={Star} 
              label="Avaliações de Clientes" 
              description="Responda o que dizem sobre você"
              badge={3} 
              onClick={() => onNavigate('merchant_reviews')} 
            />
            <NavCard 
              icon={MessageSquare} 
              label="Mensagens / Chat" 
              description="Fale com interessados em serviços"
              onClick={() => onNavigate('merchant_leads')} 
            />
          </section>

          <section>
            <SectionHeader title="Conteúdo e Marca" icon={ImageIcon} />
            <NavCard 
              icon={LayoutGrid} 
              label="Feed da Loja" 
              description="Publique fotos no seu perfil"
              onClick={() => onNavigate('neighborhood_posts')} 
            />
            <NavCard 
              icon={Video} 
              label="Vídeos Explicativos" 
              description="Envie até 2 vídeos da sua loja"
              onClick={() => onNavigate('store_profile')} 
            />
          </section>

          <section>
            <SectionHeader title="Resultados" icon={BarChart3} />
            <NavCard 
              icon={PieChart} 
              label="Minha Performance" 
              description="Cliques, visualizações e alcance"
              onClick={() => onNavigate('merchant_performance')} 
            />
            <NavCard 
              icon={CreditCard} 
              label="Pagamentos e Faturas" 
              description="Extratos e planos ativos"
              onClick={() => onNavigate('store_finance')} 
            />
          </section>

          <section>
            <SectionHeader title="Suporte" icon={LifeBuoy} />
            <NavCard 
              icon={HelpCircle} 
              label="Central de Ajuda" 
              description="Dúvidas e orientações ao lojista"
              onClick={() => onNavigate('store_support')} 
            />
          </section>

          <section>
            <SectionHeader title="Preferências" icon={Settings} />
            <NavCard 
              icon={theme === 'dark' ? Moon : Sun} 
              label="Modo Noite" 
              description={theme === 'dark' ? "Ativado" : "Desativado"}
              onClick={toggleTheme}
              rightElement={
                <div className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#1E5BFF]' : 'bg-gray-300 dark:bg-gray-700'}`}>
                  <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              }
            />
            <NavCard 
              icon={LogOut} 
              label="Sair da Conta" 
              isDestructive
              onClick={handleLogout} 
            />
          </section>

          <InstitutionalSponsorBanner type="merchant" className="mt-12" />

          <div className="mt-16 text-center opacity-30 pb-12">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] leading-relaxed">
              Localizei JPA Parceiros <br/> Central de Gestão v2.0
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes subtle-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .animate-subtle-pulse {
          animation: subtle-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </MandatoryVideoLock>
  );
};
  </change>
  <change>
    <file>components/StoreSponsoredAds.tsx</file>
    <description>Standardized a relative import path for the 'MandatoryVideoLock' component to use the '@/' alias, ensuring consistent module resolution across the application.</description>
    <content><![CDATA[
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  Megaphone, 
  CheckCircle2,
  CreditCard,
  Loader2,
  Info
} from 'lucide-react';
import { MandatoryVideoLock } from '@/components/MandatoryVideoLock';

interface StoreSponsoredAdsProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
}

export const StoreSponsoredAds: React.FC<StoreSponsoredAdsProps> = ({ onBack }) => {
    const [step, setStep] = useState<'selection' | 'payment' | 'success'>('selection');
    const [duration, setDuration] = useState(7);
    const [isProcessing, setIsProcessing] = useState(false);

    const PRICE_PER_DAY = 0.99;
    const totalPrice = duration * PRICE_PER_DAY;

    const handleActivate = () => {
        setStep('payment');
    };
    
    const handlePay = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep('success');
        }, 1500);
    };

    const handleHeaderBack = () => {
        if (step === 'payment') setStep('selection');
        else onBack();
    }

    return (
        <MandatoryVideoLock 
          videoUrl="https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4" 
          storageKey="store_sponsored"
        >
          <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
              {/* CABEÇALHO FIXO PERSISTENTE (STICKY HEADER) */}
              {step !== 'success' && (
                  <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-white/5 shrink-0">
                      <button onClick={handleHeaderBack} className="p-2.5 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors">
                          <ChevronLeft className="w-6 h-6 text-white" />
                      </button>
                      <div>
                          <h1 className="font-bold text-lg leading-none">
                              {step === 'payment' ? 'Pagamento' : 'Destaque Patrocinado'}
                          </h1>
                          <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">Impulsione sua visibilidade</p>
                      </div>
                  </header>
              )}
              
              <main className="flex-1 p-6 space-y-16 pb-64 overflow-y-auto no-scrollbar">
                  {step === 'selection' && (
                      <div className="flex-1 p-6 space-y-8 animate-in fade-in pb-32">
                          <section className="text-center">
                              <div className="w-20 h-20 bg-amber-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-2 border-amber-500/20 shadow-lg shadow-amber-900/10">
                                  <Megaphone className="w-10 h-10 text-amber-400" />
                              </div>
                              <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight mb-3">Destaque Patrocinado</h2>
                              <p className="text-sm text-slate-400 max-sm mx-auto leading-relaxed">Sua empresa aparece como patrocinada antes das demais nas listas do app.</p>
                          </section>
                          
                          <section className="space-y-4">
                              <h3 className="text-sm font-bold text-slate-300 text-center">Escolha por quantos dias deseja ficar patrocinado</h3>
                              <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700">
                                  <div className="flex justify-between items-baseline mb-4">
                                      <span className="text-slate-400 font-medium">Duração selecionada:</span>
                                      <span className="text-3xl font-black text-white">{duration} dias</span>
                                  </div>
                                  <input type="range" min="7" max="30" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-lg accent-blue-500" />
                                  <div className="flex justify-between text-xs text-slate-500 mt-2"><span>7 dias</span><span>30 dias</span></div>
                              </div>
                              <div className="mt-4 text-center"><p className="text-xs text-slate-400">Custo: <span className="font-bold text-slate-200">R$ 0,99 por dia</span></p></div>
                          </section>

                          <footer className="fixed bottom-[80px] left-0 right-0 p-5 bg-slate-950/80 backdrop-blur-md border-t border-white/5 z-30 max-w-md mx-auto">
                              <div className="flex gap-3">
                                  <div className="flex-1 bg-slate-800 rounded-2xl flex flex-col items-center justify-center p-3 text-center border border-slate-700">
                                      <span className="text-[10px] text-slate-400 font-bold uppercase">Valor total</span>
                                      <span className="text-lg font-black text-white">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                                  </div>
                                  <button onClick={handleActivate} className="flex-1 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">Ativar por {duration} dias <ArrowRight size={16} /></button>
                              </div>
                          </footer>
                      </div>
                  )}

                  {step === 'payment' && (
                      <div className="flex-1 p-6 flex flex-col justify-center animate-in fade-in duration-300">
                          <div className="bg-slate-900 rounded-3xl p-6 border border-white/10 space-y-4">
                              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4"><span className="text-slate-400">Produto:</span><span className="font-bold text-white">Destaque Patrocinado</span></div>
                              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4"><span className="text-slate-400">Duração:</span><span className="font-bold text-white">{duration} dias</span></div>
                              <div className="flex justify-between items-center pt-2"><span className="text-slate-300 font-bold">Total:</span><span className="text-2xl font-black text-emerald-400">R$ {totalPrice.toFixed(2).replace('.', ',')}</span></div>
                          </div>
                          <button onClick={handlePay} disabled={isProcessing} className="w-full mt-8 bg-emerald-500 text-white font-bold py-5 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 transition-transform">{isProcessing ? <Loader2 className="animate-spin" /> : 'Pagar agora'}</button>
                      </div>
                  )}

                  {isProcessing && (
                      <div className="fixed inset-0 z-[60] bg-slate-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
                          <h2 className="text-xl font-bold text-white">Processando pagamento...</h2>
                      </div>
                  )}

                  {step === 'success' && (
                      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 border-4 border-emerald-500/20">
                              <CheckCircle2 size={48} className="text-emerald-400" />
                          </div>
                          <h2 className="text-3xl font-bold text-white mb-3">Pagamento aprovado ✅</h2>
                          <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">Parabéns! Seu Destaque Patrocinado já está ativo por {duration} dias.</p>
                          <button onClick={onBack} className="w-full max-w-xs py-4 bg-white text-slate-900 font-black rounded-2xl shadow-2xl active:scale-95 transition-transform">Ok, entendi</button>
                      </div>
                  )}
              </main>
          </div>
        </MandatoryVideoLock>
    );
};
  </change>
  <change>
    <file>lib/analytics.ts</file>
    <description>Standardized a relative import path for the Supabase client to use the '@/' alias, ensuring consistent module resolution across the application.</description>
    <content><![CDATA[import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export type OrganicEventType =
  | 'store_view'
  | 'store_click_whatsapp'
  | 'store_click_call'
  | 'store_click_instagram'
  | 'store_click_directions'
  | 'store_click_share'
  | 'store_click_favorite'
  | 'store_click_promo'
  | 'store_click_product';

/**
 * Tracks an organic user interaction event and sends it to Supabase.
 * @param eventType The type of event to track.
 * @param storeId The ID of the store the interaction is related to.
 * @param neighborhood The current neighborhood context.
 * @param user The authenticated user object, if available.
 */
export const trackOrganicEvent = async (
  eventType: OrganicEventType,
  storeId: string,
  neighborhood: string | undefined,
  user: User | null
) => {
  // Fallback for local development or if Supabase is not initialized
  if (!supabase) {
    console.log('[Analytics Event]', { eventType, storeId, neighborhood: neighborhood || 'unknown', userId: user?.id || 'anonymous' });
    return;
  }

  try {
    const { error } = await supabase.from('store_organic_events').insert({
      event_type: eventType,
      store_id: storeId,
      user_id: user?.id || null,
      neighborhood: neighborhood || 'unknown',
      source: 'organic', // Hardcoded as per requirement
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    // Log errors to the console without blocking the UI
    console.error('Error tracking organic event:', error);
  }
};

export type AdEventType = 'ad_impression' | 'ad_click';

/**
 * Tracks a paid ad interaction event and sends it to Supabase.
 */
export const trackAdEvent = async (
  eventType: AdEventType,
  bannerId: string,
  storeId: string | undefined | null,
  placement: 'home' | 'category' | 'subcategory',
  category: string | null,
  subcategory: string | null,
  neighborhood: string | undefined
) => {
  if (!supabase) {
    console.log('[Ad Event]', { eventType, bannerId, storeId, placement, category, subcategory, neighborhood });
    return;
  }

  try {
    const { error } = await supabase.from('store_ad_events').insert({
      event_type: eventType,
      banner_id: bannerId,
      store_id: storeId,
      placement,
      category,
      subcategory,
      neighborhood: neighborhood || 'unknown',
      source: 'paid', // Hardcoded as per requirement
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error tracking ad event:', error);
  }
};
]]></content>
  </change>
  <change>
    <file>components/PostCard.tsx</file>
    <description>Standardized relative import paths for 'types', 'constants', and 'ReportModal' to use the '@/' alias, resolving potential module resolution errors.</description>
    <content><![CDATA[
import React, { useState, useRef, useEffect } from 'react';
import { CommunityPost, Store, ReportReason } from '@/types';
import { User } from '@supabase/supabase-js';
import { STORES } from '@/constants';
import { 
    Bookmark, 
    Heart, 
    MessageSquare, 
    MoreHorizontal, 
    Share2, 
    Flag, 
    CheckCircle2,
    Volume2,
    VolumeX,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    AlertCircle,
    Zap 
} from 'lucide-react';
import { ReportModal } from '@/components/ReportModal';

interface PostCardProps {
  post: CommunityPost;
  onStoreClick: (store: Store) => void;
  user: User | null;
  onRequireLogin: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

// Imagens genéricas para posts sem mídia (Bairro, cotidiano, casas, serviços, pessoas, comércio local)
const PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800', // Bairro/Rua
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800', // Comércio
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800', // Pessoas/Comunidade
  'https://images.unsplash.com/photo-1534723452202-428aae1ad99d?q=80&w=800', // Mercado/Loja
  'https://images.unsplash.com/photo-1581578731522-745d05cb9704?q=80&w=800', // Serviço/Trabalho
  'https://images.unsplash.com/photo-1551632432-c735e8399527?q=80&w=800', // Parque/Verde
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800', // Moda/Cotidiano
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800', // Escritório/Pro
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800', // Interior/Casa
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800', // Prédio
];

const getPlaceholder = (id: string) => {
    // Seleção determinística baseada no ID para evitar que a imagem mude ao rolar
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return PLACEHOLDERS[Math.abs(hash) % PLACEHOLDERS.length];
};

export const PostCard: React.FC<PostCardProps> = ({ post, onStoreClick, user, onRequireLogin, isSaved, onToggleSave }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showReportSuccess, setShowReportSuccess] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  
  // Media states
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const hasMultipleImages = post.imageUrls && post.imageUrls.length > 1;

  const handleLike = () => {
    if (!user) { onRequireLogin(); return; }
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleSaveClick = () => {
    if (!user) { onRequireLogin(); return; }
    onToggleSave();
  };

  const handleVisitStore = (userName: string) => {
    const store = STORES.find(s => s.name === userName);
    if (store) onStoreClick(store);
  };

  const handleReportSubmit = (reason: ReportReason) => {
    console.log(`Reporting post ${post.id} for reason: ${reason}`);
    setIsReportModalOpen(false);
    setShowReportSuccess(true);
    setTimeout(() => setShowReportSuccess(false), 3000);
  };

  const handleAction = (action: () => void) => {
    if (!user) onRequireLogin(); else action();
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.imageUrls) {
      setCurrentImageIndex(prev => (prev + 1) % post.imageUrls!.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.imageUrls) {
      setCurrentImageIndex(prev => (prev - 1 + post.imageUrls!.length) % post.imageUrls!.length);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (videoRef.current) {
          videoRef.current.muted = !videoRef.current.muted;
          setIsMuted(videoRef.current.muted);
      }
  }

  const contentRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setIsTruncated(contentRef.current.scrollHeight > contentRef.current.clientHeight);
    }
  }, [post.content]);

  return (
    <article className="bg-white dark:bg-gray-900 sm:border border-gray-100 dark:border-gray-800 sm:rounded-2xl shadow-sm overflow-hidden">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border-2 border-blue-500 p-0.5">
            <img src={post.userAvatar} alt={post.userName} className="w-full h-full rounded-full object-cover" />
          </div>
          <div className="flex flex-col">
            <button onClick={() => handleVisitStore(post.userName)} className="font-bold text-sm text-gray-900 dark:text-white hover:underline text-left leading-tight">
                {post.userName}
            </button>
            {post.isActiveResident && (
                <div className="flex items-center gap-1 mt-0.5">
                    <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded flex items-center gap-1 border border-blue-100 dark:border-blue-800/50">
                        <Zap size={8} fill="currentColor" />
                        <span className="text-[8px] font-black uppercase tracking-wider">Morador Ativo</span>
                    </div>
                </div>
            )}
          </div>
        </div>
        <button onClick={() => setIsOptionsOpen(true)} className="p-2 text-gray-400"><MoreHorizontal size={20} /></button>
      </div>

      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 group">
          {post.videoUrl ? (
            <>
              <video 
                ref={videoRef}
                src={post.videoUrl}
                className="w-full h-full object-cover" 
                loop 
                playsInline 
                autoPlay
                muted={isMuted}
              />
              <button onClick={toggleMute} className="absolute bottom-3 right-3 bg-black/50 text-white rounded-full p-2 backdrop-blur-sm">
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </>
          ) : post.imageUrls && post.imageUrls.length > 0 ? (
            <>
              <img 
                src={post.imageUrls[currentImageIndex]} 
                alt="Conteúdo do post" 
                className="w-full h-full object-cover" 
              />
              {hasMultipleImages && (
                <>
                  <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeftIcon size={20}/></button>
                  <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRightIcon size={20}/></button>
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {post.imageUrls.map((_, index) => (
                      <div key={index} className={`h-1.5 rounded-full transition-all ${index === currentImageIndex ? 'w-3 bg-white' : 'w-1.5 bg-white/50'}`} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <img 
              src={post.imageUrl || getPlaceholder(post.id)} 
              alt="Conteúdo do post" 
              className="w-full h-full object-cover" 
            />
          )}
      </div>

      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className={`flex items-center gap-2 transition-colors ${liked ? 'text-rose-500' : 'text-gray-500 dark:text-gray-400 hover:text-rose-500'}`}>
            <Heart size={24} className={liked ? 'fill-current' : ''} />
          </button>
          <button onClick={() => handleAction(() => alert('Comentários em breve!'))} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-500">
            <MessageSquare size={24} />
          </button>
          <button onClick={() => handleAction(() => alert('Compartilhamento em breve!'))} className="text-gray-500 dark:text-gray-400 hover:text-blue-500">
            <Share2 size={24} />
          </button>
        </div>
        <button onClick={handleSaveClick} className="text-gray-500 dark:text-gray-400 hover:text-yellow-500 transition-colors">
          <Bookmark size={24} className={isSaved ? 'fill-yellow-400 text-yellow-400' : ''} />
        </button>
      </div>
      
      <div className="px-4 pb-4">
        {likesCount > 0 && <p className="text-sm font-bold mb-2">{likesCount} curtidas</p>}
        
        <p ref={contentRef} className={`text-sm text-gray-700 dark:text-gray-300 leading-relaxed ${!isTextExpanded && 'line-clamp-2'}`}>
          <span className="font-bold text-gray-900 dark:text-white mr-1.5">{post.userName}</span>
          {post.content}
        </p>

        {isTruncated && !isTextExpanded && (
          <button onClick={() => setIsTextExpanded(true)} className="text-sm text-gray-400 font-medium">
            ... mais
          </button>
        )}
        
        <p className="text-xs text-gray-400 mt-2 uppercase font-semibold tracking-wide">{post.timestamp} • {post.neighborhood}</p>
      </div>

      {isOptionsOpen && (
        <div className="fixed inset-0 z-[1001] bg-black/40 flex items-end" onClick={() => setIsOptionsOpen(false)}>
          <div className="bg-white dark:bg-gray-800 w-full rounded-t-2xl p-4 animate-in slide-in-from-bottom" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
            <button 
              onClick={() => handleAction(() => { setIsOptionsOpen(false); setIsReportModalOpen(true); })}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Flag size={20} />
              <span className="font-bold">Denunciar Publicação</span>
            </button>
            <button 
              onClick={() => setIsOptionsOpen(false)} 
              className="w-full mt-2 p-3 rounded-lg text-gray-500 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <ReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />

      {showReportSuccess && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 animate-in fade-in zoom-in-95">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <p className="text-sm font-medium">Denúncia enviada para análise.</p>
        </div>
      )}
    </article>
  );
};
]]></content>
  </change>
  <change>
    <file>components/SavedPostsView.tsx</file>
    <description>Standardized relative import paths for 'useAuth' and 'constants' to use the '@/' alias for better module resolution consistency.</description>
    <content><![CDATA[
import React from 'react';
import { ChevronLeft, Bookmark } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { MOCK_COMMUNITY_POSTS } from '@/constants';
import { PostCard } from './PostCard';
import { Store } from '@/types';

interface SavedPostsViewProps {
    onBack: () => void;
    onStoreClick: (store: Store) => void;
    onRequireLogin: () => void;
}

export const SavedPostsView: React.FC<SavedPostsViewProps> = ({ onBack, onStoreClick, onRequireLogin }) => {
    const { user } = useAuth();
    const { savedPostIds, isPostSaved, toggleSavePost } = useSavedPosts(user);

    const savedPosts = MOCK_COMMUNITY_POSTS
        .filter(post => savedPostIds.includes(post.id))
        .sort((a, b) => {
            const indexA = savedPostIds.indexOf(a.id);
            const indexB = savedPostIds.indexOf(b.id);
            return indexA - indexB;
        });

    return (
        <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in fade-in duration-500">
            <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <Bookmark className="w-5 h-5" /> Postagens Salvas
                </h1>
            </header>

            <main className="max-w-md mx-auto py-4 space-y-4 w-full px-4">
                {savedPosts.length > 0 ? (
                    savedPosts.map(post => (
                        <PostCard 
                            key={post.id}
                            post={post}
                            onStoreClick={onStoreClick}
                            user={user}
                            onRequireLogin={onRequireLogin}
                            isSaved={isPostSaved(post.id)}
                            onToggleSave={() => toggleSavePost(post.id)}
                        />
                    ))
                ) : (
                    <div className="text-center py-20 opacity-40 flex flex-col items-center">
                        <Bookmark size={48} className="mb-4" />
                        <p className="text-sm font-bold">Nenhuma postagem salva</p>
                        <p className="text-xs text-gray-500 mt-1">Toque no ícone de salvar em um post para guardá-lo aqui.</p>
                    </div>
                )}
            </main>
        </div>
    );
};
]]></content>
  </change>
  <change>
    <file>components/ClassifiedsBannerCarousel.tsx</file>
    <description>Standardized relative import paths for 'useNeighborhood' and 'constants' to use the '@/' alias, improving module resolution reliability.</description>
    <content><![CDATA[
import React, { useState, useMemo, useEffect } from 'react';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { MOCK_CLASSIFIEDS } from '@/constants';
import { Classified } from '@/types';

interface HighlightBanner {
  id: string;
  neighborhood: string;
  title: string;
  category: string;
  imageUrl: string;
  anuncioId: string;
  active: boolean;
}

const HIGHLIGHT_BANNERS: HighlightBanner[] = [
  // Freguesia
  { id: 'hb-fre-1', neighborhood: 'Freguesia', title: 'Sala Comercial Tirol', category: 'Imóveis Comerciais', anuncioId: 'cl-im-2', active: true, imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600' },
  { id: 'hb-fre-2', neighborhood: 'Freguesia', title: 'Oportunidade de Emprego', category: 'Empregos', anuncioId: 'cl-emp-2', active: true, imageUrl: 'https://images.unsplash.com/photo-1521737706145-31adb8220387?q=80&w=600' },
  // Taquara
  { id: 'hb-taq-1', neighborhood: 'Taquara', title: 'Instalação de Split', category: 'Orçamento de Serviços', anuncioId: 'cl-serv-2', active: true, imageUrl: 'https://images.unsplash.com/photo-1596541324213-981a54a48576?q=80&w=600' },
  { id: 'hb-taq-2', neighborhood: 'Taquara', title: 'Galpão na Taquara', category: 'Imóveis Comerciais', anuncioId: 'cl-im-3', active: true, imageUrl: 'https://images.unsplash.com/photo-1587022205345-66b3e6486d3b?q=80&w=600' },
  // Pechincha
  { id: 'hb-pec-1', neighborhood: 'Pechincha', title: 'iPhone 11 Desapego', category: 'Desapega JPA', anuncioId: 'cl-des-3', active: true, imageUrl: 'https://images.unsplash.com/photo-1616348436168-de43ad0e12de?q=80&w=600' },
  { id: 'hb-pec-2', neighborhood: 'Pechincha', title: 'Doação de Roupas', category: 'Doações em geral', anuncioId: 'cl-doa-1', active: true, imageUrl: 'https://images.unsplash.com/photo-160533833-2413154b54e3?q=80&w=600' },
  // Anil
  { id: 'hb-ani-1', neighborhood: 'Anil', title: 'Mesa de Jantar', category: 'Desapega JPA', anuncioId: 'cl-des-4', active: true, imageUrl: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=600' },
  { id: 'hb-ani-2', neighborhood: 'Anil', title: 'Doe Livros Infantis', category: 'Doações em geral', anuncioId: 'cl-doa-2', active: true, imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600' },
  // Tanque
  { id: 'hb-tan-1', neighborhood: 'Tanque', title: 'Adoção de Cachorrinha', category: 'Adoção de pets', anuncioId: 'cl-ado-2', active: true, imageUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=600' },
  { id: 'hb-tan-2', neighborhood: 'Tanque', title: 'Doação de Cestas', category: 'Doações em geral', anuncioId: 'cl-doa-5', active: true, imageUrl: 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=600' },
  // Curicica
  { id: 'hb-cur-1', neighborhood: 'Curicica', title: 'Montador de Móveis', category: 'Orçamento de Serviços', anuncioId: 'cl-serv-5', active: true, imageUrl: 'https://images.unsplash.com/photo-1600585152220-029e859e156b?q=80&w=600' },
  { id: 'hb-cur-2', neighborhood: 'Curicica', title: 'Motorista Categoria D', category: 'Empregos', anuncioId: 'cl-emp-4', active: true, imageUrl: 'https://images.unsplash.com/photo-1551803091-e373c2c606b2?q=80&w=600' },
  // Cidade de Deus
  { id: 'hb-cdd-1', neighborhood: 'Cidade de Deus', title: 'Apoio Alimentar', category: 'Doações em geral', anuncioId: 'cl-cdd-1', active: true, imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600' },
  { id: 'hb-cdd-2', neighborhood: 'Cidade de Deus', title: 'Vaga Limpeza', category: 'Empregos', anuncioId: 'cl-cdd-2', active: true, imageUrl: 'https://images.unsplash.com/photo-1581578731522-745d05cb9704?q=80&w=600' },
  // Gardênia Azul
  { id: 'hb-gar-1', neighborhood: 'Gardênia Azul', title: 'Aluguel Gardênia', category: 'Imóveis Comerciais', anuncioId: 'cl-gar-1', active: true, imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600' },
  { id: 'hb-gar-2', neighborhood: 'Gardênia Azul', title: 'Fogão Semi-novo', category: 'Desapega JPA', anuncioId: 'cl-gar-2', active: true, imageUrl: 'https://images.unsplash.com/photo-1584990344616-3b94b3c59230?q=80&w=600' },
  // Praça Seca
  { id: 'hb-prs-1', neighborhood: 'Praça Seca', title: 'Adoção Urgente', category: 'Adoção de pets', anuncioId: 'cl-prs-1', active: true, imageUrl: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?q=80&w=600' },
  { id: 'hb-prs-2', neighborhood: 'Praça Seca', title: 'Manicure Express', category: 'Orçamento de Serviços', anuncioId: 'cl-prs-2', active: true, imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=600' },
];

interface ClassifiedsBannerCarouselProps {
  onItemClick: (item: Classified) => void;
}

export const ClassifiedsBannerCarousel: React.FC<ClassifiedsBannerCarouselProps> = ({ onItemClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { currentNeighborhood } = useNeighborhood();

  const activeBanners = useMemo(() => {
    // Filtra por bairro. Se for "Todos", mostra os da Freguesia como destaque padrão.
    const hoodKey = currentNeighborhood === "Jacarepaguá (todos)" ? "Freguesia" : currentNeighborhood;
    const banners = HIGHLIGHT_BANNERS.filter(b => b.neighborhood === hoodKey && b.active).slice(0, 2);
    
    // Fallback caso não encontre no bairro (mostra Freguesia)
    if (banners.length === 0) {
        return HIGHLIGHT_BANNERS.filter(b => b.neighborhood === 'Freguesia' && b.active).slice(0, 2);
    }
    return banners;
  }, [currentNeighborhood]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [currentNeighborhood]);

  const handleBannerClick = (banner: HighlightBanner) => {
    const item = MOCK_CLASSIFIEDS.find(c => c.id === banner.anuncioId);
    if (item) {
        onItemClick(item);
    } else {
        console.warn("Anúncio associado ao banner não encontrado:", banner.anuncioId);
    }
  };

  if (activeBanners.length === 0) return null;

  const current = activeBanners[currentIndex];

  return (
    <div className="mb-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-1.5 mb-3 px-1">
        <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">⭐ Destaques do bairro</span>
      </div>
      
      <div 
        onClick={() => handleBannerClick(current)}
        className={`relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden shadow-xl cursor-pointer transition-all duration-300 active:scale-[0.99] bg-slate-900`}
      >
        <img 
          src={current.imageUrl} 
          alt={current.title} 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="relative h-full flex flex-col justify-end p-6 text-white">
          <div className="flex items-center gap-2 mb-1">
             <span className="bg-[#1E5BFF] text-white text-[7px] font-black px-2.5 py-1 rounded-lg uppercase tracking-[0.15em] w-fit border border-white/10 shadow-sm">
               {current.category}
             </span>
          </div>
          <h2 className="text-xl font-black uppercase tracking-tighter leading-tight mb-1">
            {current.title}
          </h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[8px] font-black uppercase tracking-widest">Ver detalhes</span>
          </div>
        </div>

        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 right-6 flex gap-1.5">
            {activeBanners.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-white' : 'w-1 bg-white/40'}`} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
]]></content>
  </change>
  <change>
    <file>components/UserStatementView.tsx</file>
    <description>Standardized a relative import path for 'InstitutionalSponsorBanner' to use the '@/' alias for consistent module resolution.</description>
    <content><![CDATA[
import React from 'react';
import { ChevronLeft, ArrowUpRight, ArrowDownLeft, Info, Coins, ArrowRight } from 'lucide-react';
import { InstitutionalSponsorBanner } from '@/components/InstitutionalSponsorBanner';

interface Transaction {
  id: string;
  storeName: string;
  amount: number;
  type: 'earn' | 'use';
  date: string;
}

interface UserStatementViewProps {
  onBack: () => void;
  onExploreStores: () => void;
  balance?: number;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', storeName: 'Açougue do Zé', amount: 3.20, type: 'earn', date: 'Hoje, 14:20' },
  { id: '2', storeName: 'Salão Beleza Pura', amount: 1.50, type: 'earn', date: 'Ontem, 10:15' },
  { id: '3', storeName: 'Padaria Imperial', amount: 5.00, type: 'use', date: '05 Nov, 08:30' },
  { id: '4', storeName: 'Hamburgueria Brasa', amount: 2.75, type: 'earn', date: '02 Nov, 20:45' },
];

export const UserStatementView: React.FC<UserStatementViewProps> = ({ 
  onBack, 
  onExploreStores,
  balance = 12.40 
}) => {
  return (
    /* Root container garantindo fundo contínuo em toda a altura da tela */
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 flex flex-col">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 h-16 flex items-center gap-4 shrink-0">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-white" />
        </button>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">Seu Cashback</h2>
      </div>

      <div className="flex-1 p-5 pb-32 bg-gray-50 dark:bg-gray-950">
        {/* Main Balance Card */}
        <div className="bg-[#1E5BFF] rounded-[32px] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden mb-8 border border-white/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="relative z-10">
            <span className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">
              Saldo Disponível
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold opacity-80">R$</span>
              <h1 className="text-5xl font-black font-display tracking-tighter">
                {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h1>
            </div>
            <div className="mt-6 flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/10 shadow-inner">
              <Coins className="w-3.5 h-3.5 text-yellow-300" />
              <p className="text-[11px] font-bold text-white">Pronto para usar no bairro</p>
            </div>
          </div>
        </div>

        {/* Statement List */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] ml-1 mb-2">
            Movimentações recentes
          </h3>
          
          <div className="bg-white dark:bg-gray-800 rounded-[28px] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            {MOCK_TRANSACTIONS.length > 0 ? MOCK_TRANSACTIONS.map((tx, idx) => (
              <div 
                key={tx.id} 
                className={`p-5 flex items-center justify-between transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                  idx !== MOCK_TRANSACTIONS.length - 1 ? 'border-b border-gray-50 dark:border-gray-700' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    tx.type === 'earn' 
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' 
                      : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
                  }`}>
                    {tx.type === 'earn' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                      {tx.type === 'earn' ? tx.storeName : `Usado em ${tx.storeName}`}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-sm ${
                    tx.type === 'earn' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    {tx.type === 'earn' ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            )) : (
              <div className="p-10 text-center">
                <p className="text-gray-400 text-sm font-medium">Nenhuma movimentação ainda.</p>
              </div>
            )}
          </div>
        </div>

        {/* Educational Section - Improved Copy */}
        <div className="mt-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl p-6 border border-blue-100/50 dark:border-blue-800/30">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-blue-900">
              <Info className="w-5 h-5 text-[#1E5BFF]" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">Como multiplicar seu ganho?</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Use seu saldo para pagar até 30% da conta e receba novo cashback sobre o restante. É economia circular!
              </p>
            </div>
          </div>
          
          <button 
            onClick={onExploreStores}
            className="w-full mt-6 bg-[#1E5BFF] text-white font-bold text-sm py-4 rounded-2xl shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Ver lojas com cashback
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Banner Patrocinador Master */}
        <InstitutionalSponsorBanner type="client" />
      </div>
    </div>
  );
};
]]></content>
  </change>
  <change>
    <file>components/JobWizard.tsx</file>
    <description>Standardized a relative import path for 'NEIGHBORHOODS' to use the '@/' alias for consistent module resolution.</description>
    <content><![CDATA[
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, X, ArrowRight, Loader2, CheckCircle2, 
  Briefcase, Building2, MapPin, Clock, Tag, Plus, 
  Info, Lock, Zap, ShieldCheck, QrCode, Copy, CreditCard,
  Check, Star, Award, Crown
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { NEIGHBORHOODS } from '@/contexts/NeighborhoodContext';

interface JobWizardProps {
  user: User | null;
  onBack: () => void;
  onComplete: () => void;
}

type Step = 'intro' | 'info' | 'limit' | 'plan' | 'highlight' | 'summary' | 'payment' | 'success';

export const JobWizard: React.FC<JobWizardProps> = ({ user, onBack, onComplete }) => {
  const [step, setStep] = useState<Step>('info');
  const [isProcessing, setIsProcessing] = useState(false);
  const [publishedCount] = useState(2); // Simulação: Já publicou 2 vagas
  
  const [formData, setFormData] = useState({
    role: '',
    company: user?.user_metadata?.store_name || '',
    description: '',
    neighborhood: 'Freguesia',
    type: 'CLT' as any,
    shift: 'Integral' as any,
    contact: '',
    highlightWeeks: 0,
    isPlanSelected: false,
    paymentMethod: 'pix' as 'pix' | 'card'
  });

  const prices = {
    single: 9.90,
    plan: 49.90,
    highlightWeek: 4.90
  };

  const totals = useMemo(() => {
    let total = 0;
    if (formData.isPlanSelected) total += prices.plan;
    else if (publishedCount >= 2) total += prices.single;
    
    total += formData.highlightWeeks * prices.highlightWeek;
    return total;
  }, [formData.isPlanSelected, formData.highlightWeeks, publishedCount]);

  const handleNext = () => {
    if (step === 'info' && publishedCount >= 2) setStep('limit');
    else if (step === 'info') setStep('highlight');
    else if (step === 'limit') setStep('highlight');
    else if (step === 'plan') setStep('highlight');
    else if (step === 'highlight') setStep('summary');
    else if (step === 'summary') {
        if (totals > 0) setStep('payment');
        else handlePublish();
    }
  };

  const handlePublish = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
    }, 2000);
  };

  const renewalDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setDate(1);
    return d.toLocaleDateString('pt-BR');
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans animate-in fade-in duration-500 overflow-x-hidden relative">
      
      {step !== 'success' && (
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <div className="flex-1 text-center">
             <h1 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Anunciar Vaga no Bairro</h1>
          </div>
          <button onClick={onBack} className="p-2 text-gray-400 hover:text-red-500"><X size={20}/></button>
        </header>
      )}

      <main className="flex-1 p-6 max-w-md mx-auto w-full pb-40 overflow-y-auto no-scrollbar">
        
        {step === 'info' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">Nova Vaga de Emprego</h2>
                    <p className="text-sm text-gray-500 font-medium">Divulgue para moradores e encontre talentos locais.</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Cargo / Função *</label>
                        <input 
                          value={formData.role} 
                          onChange={e => setFormData({...formData, role: e.target.value})}
                          placeholder="Ex: Atendente de Balcão"
                          className="w-full bg-gray-50 dark:bg-gray-800 border-none p-5 rounded-2xl outline-none font-bold dark:text-white shadow-inner"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Nome da Empresa *</label>
                        <input 
                          value={formData.company} 
                          onChange={e => setFormData({...formData, company: e.target.value})}
                          placeholder="Nome fantasia"
                          className="w-full bg-gray-50 dark:bg-gray-800 border-none p-5 rounded-2xl outline-none font-bold dark:text-white shadow-inner"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Bairro *</label>
                            <select 
                              value={formData.neighborhood}
                              onChange={e => setFormData({...formData, neighborhood: e.target.value})}
                              className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border-none outline-none font-bold dark:text-white appearance-none"
                            >
                              {NEIGHBORHOODS.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Tipo *</label>
                            <select 
                              value={formData.type}
                              onChange={e => setFormData({...formData, type: e.target.value})}
                              className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border-none outline-none font-bold dark:text-white appearance-none"
                            >
                              {['CLT', 'PJ', 'Freelancer', 'Estágio', 'Temporário'].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Descrição da Vaga *</label>
                        <textarea 
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            placeholder="Descreva as responsabilidades e requisitos..."
                            rows={5}
                            className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border-none outline-none font-medium dark:text-white resize-none shadow-inner"
                        />
                    </div>
                </div>

                <button 
                    onClick={handleNext} 
                    disabled={!formData.role || !formData.company || !formData.description}
                    className="w-full bg-[#1E5BFF] disabled:bg-gray-100 disabled:text-gray-400 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                    Avançar <ArrowRight size={18} />
                </button>
            </div>
        )}

        {step === 'limit' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
             <div className="text-center">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-[#1E5BFF] shadow-sm border border-blue-100">
                    <Info size={40} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Limite gratuito atingido</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-4 leading-relaxed">
                    Você já utilizou suas 2 vagas gratuitas neste mês.<br/>
                    Sua cota renova em <strong className="text-gray-900 dark:text-white">{renewalDate}</strong>.
                </p>
            </div>

            <div className="space-y-4">
                <button 
                    onClick={() => { setFormData({...formData, isPlanSelected: false}); handleNext(); }}
                    className="w-full bg-white dark:bg-gray-900 p-6 rounded-3xl border-2 border-gray-100 dark:border-gray-800 flex items-center justify-between group active:scale-[0.98] transition-all hover:border-blue-200"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400">
                            <Briefcase size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-sm dark:text-white">Publicação Avulsa</h3>
                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Válida por 30 dias</p>
                        </div>
                    </div>
                    <div className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">R$ 9,90</div>
                </button>

                <button 
                    onClick={() => { setFormData({...formData, isPlanSelected: true}); setStep('plan'); }}
                    className="w-full bg-indigo-600 p-6 rounded-3xl border-2 border-indigo-400 flex items-center justify-between group active:scale-[0.98] transition-all shadow-xl shadow-indigo-500/20"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                            <Crown size={24} fill="white" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-sm text-white">Plano Empresa Local</h3>
                            <p className="text-[10px] text-indigo-200 uppercase font-black tracking-widest">Vagas Ilimitadas + Selo</p>
                        </div>
                    </div>
                    <div className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">R$ 49,90</div>
                </button>
            </div>
          </div>
        )}

        {step === 'success' && (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2.5rem] flex items-center justify-center mb-8 text-emerald-600 shadow-xl shadow-emerald-500/10">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4">
                    Vaga publicada com sucesso! 🎉
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-12">
                    Moradores do bairro agora podem visualizar e se candidatar.
                </p>

                <div className="w-full space-y-4">
                    <button 
                        onClick={onComplete}
                        className="w-full bg-gray-900 dark:bg-white dark:text-black text-white font-black py-5 rounded-[2rem] shadow-xl uppercase tracking-widest text-xs active:scale-[0.98] transition-all"
                    >
                        Ver minhas vagas
                    </button>
                    <button 
                        onClick={onComplete}
                        className="w-full py-4 text-gray-400 font-bold text-xs uppercase tracking-widest"
                    >
                        Voltar para início
                    </button>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};
]]></content>
  </change>
  <change>
    <file>components/SimplePages.tsx</file>
    <description>Standardized a relative import path for the Supabase client to use the '@/' alias for consistent module resolution.</description>
    <content><![CDATA[
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
import { Store, AdType } from '@/types';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

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
      
      <div className="p-6 flex flex-col items-center pt-12">
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
        <div className="p-12 flex flex-col items-center bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-950 text-center">
          <div className="w-24 h-24 bg-[#1E5BFF] rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20">
            <MapPin className="w-12 h-12 text-white fill-white" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white font-display leading-tight tracking-tighter uppercase">
            Localizei <span className="text-[#1E5BFF]">JPA</span>
          </h2>
          <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-[0.4em] mt-4">Onde o bairro conversa</p>
        </div>

        <div className="px-6 space-y-12 pb-24">
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

            <main className="p-6 space-y-12">
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

      <main className="p-6 flex flex-col items-center justify-center pt-24 text-center">
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

      <main className="p-6 space-y-8">
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
               <Search size={32} className="text-gray-100 mb-4" />
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

      <main className="p-6 space-y-6 overflow-y-auto pb-32 no-scrollbar">
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
]]></content>
  </change>
  <change>
    <file>components/PrizeHistoryView.tsx</file>
    <description>Standardized a relative import path for the Supabase client to use the '@/' alias for better module resolution consistency.</description>
    <content><![CDATA[
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ChevronLeft, Wallet, Ticket, Meh, RefreshCw, Loader2, AlertTriangle, Dices, ArrowRight } from 'lucide-react';

// --- Tipos ---
interface PrizeHistoryViewProps {
  userId: string;
  onBack: () => void;
  onGoToSpinWheel: () => void;
}

interface Spin {
  id: string;
  spin_date: string;
  prize_type: 'cashback' | 'cupom' | 'nao_foi_dessa_vez' | 'gire_de_novo';
  prize_label: string;
  status: 'creditado' | 'expirado' | 'pendente' | 'nao_aplicavel';
  expires_at?: string | null;
}

type LoadingStatus = 'idle' | 'loading' | 'loading-more' | 'error' | 'empty' | 'success';

const PAGE_SIZE = 20;

// --- Componentes Internos ---
const StatusBadge: React.FC<{ status: Spin['status'] }> = ({ status }) => {
  const styles = {
    creditado: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    pendente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    expirado: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
    nao_aplicavel: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
  };
  return <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${styles[status]}`}>{status.replace('_', ' ')}</span>;
};

const PrizeIcon: React.FC<{ type: Spin['prize_type'] }> = ({ type }) => {
  const iconMap = {
    cashback: <Wallet className="w-4 h-4 text-green-500" />,
    cupom: <Ticket className="w-4 h-4 text-blue-500" />,
    nao_foi_dessa_vez: <Meh className="w-4 h-4 text-gray-500" />,
    gire_de_novo: <RefreshCw className="w-4 h-4 text-purple-500" />,
  };
  return <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">{iconMap[type]}</div>;
};

const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3 animate-pulse">
    <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700"></div>
    <div className="flex-1 space-y-2">
      <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
    <div className="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
  </div>
);

// --- Componente Principal ---
export const PrizeHistoryView: React.FC<PrizeHistoryViewProps> = ({ userId, onBack, onGoToSpinWheel }) => {
  const [spins, setSpins] = useState<Spin[]>([]);
  const [status, setStatus] = useState<LoadingStatus>('loading');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchSpins = useCallback(async (currentPage: number) => {
    if (!hasMore && currentPage > 0) return;

    setStatus(currentPage === 0 ? 'loading' : 'loading-more');
    
    if (!supabase) {
      setStatus('error');
      console.error("Supabase client is not available.");
      return;
    }

    try {
      const from = currentPage * PAGE_SIZE;
      const { data, error, count } = await supabase
        .from('roulette_spins')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('spin_date', { ascending: false })
        .range(from, from + PAGE_SIZE - 1);

      if (error) throw error;
      
      const newSpins = data as Spin[];
      setSpins(prev => currentPage === 0 ? newSpins : [...prev, ...newSpins]);
      
      if (newSpins.length < PAGE_SIZE || (spins.length + newSpins.length) === count) {
        setHasMore(false);
      }
      
      if ((currentPage === 0 && newSpins.length === 0) || count === 0) {
        setStatus('empty');
      } else {
        setStatus('success');
      }

    } catch (err) {
      console.error("Error fetching spin history:", err);
      setStatus('error');
    }
  }, [userId, hasMore, spins.length]);

  useEffect(() => {
    fetchSpins(0);
  }, [userId]); // Apenas na montagem inicial

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (status === 'loading-more') return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
        fetchSpins(page + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [status, hasMore, fetchSpins, page]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };
  
  const getSubtext = (spin: Spin) => {
      if (spin.prize_type === 'nao_foi_dessa_vez') return "Tente novamente amanhã!";
      if (spin.prize_type === 'cupom') return "Use nas lojas participantes.";
      if (spin.expires_at) return `Válido até ${formatDate(spin.expires_at).split(' ')[0]}`;
      return null;
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300">
      {/* Header Fixo */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md px-5 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white font-display">Histórico de Prêmios</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Seus giros na Roleta da Freguesia.</p>
          </div>
        </div>
      </header>

      <main className="p-4 pb-24">
        {status === 'loading' && (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {status === 'empty' && (
          <div className="flex flex-col items-center justify-center text-center pt-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 opacity-60">
                <Dices className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Nenhum giro encontrado</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 mb-8 text-sm">Você ainda não girou a Roleta da Freguesia.</p>
            <button onClick={onGoToSpinWheel} className="w-full max-w-xs bg-gradient-to-r from-[#1E5BFF] to-[#4D7CFF] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
              Girar pela primeira vez
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center justify-center text-center pt-12">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Ocorreu um erro</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 mb-8 text-sm">Não foi possível carregar seu histórico. Verifique sua conexão e tente novamente.</p>
            <button onClick={() => fetchSpins(0)} className="font-bold text-primary-500 text-sm">
              Tentar Novamente
            </button>
          </div>
        )}
        
        {(status === 'success' || status === 'loading-more') && (
            <div className="space-y-3">
                {spins.map((spin, index) => (
                    <div 
                        key={spin.id}
                        ref={index === spins.length - 1 ? lastElementRef : null}
                        className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3"
                    >
                        <PrizeIcon type={spin.prize_type} />
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-800 dark:text-white text-xs">{spin.prize_label}</h3>
                                <StatusBadge status={spin.status} />
                            </div>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{formatDate(spin.spin_date)}</p>
                            {getSubtext(spin) && <p className="text-[11px] text-gray-400 mt-1">{getSubtext(spin)}</p>}
                        </div>
                    </div>
                ))}

                {status === 'loading-more' && <SkeletonCard />}
            </div>
        )}
      </main>
    </div>
  );
};
]]></content>
  </change>
  <change>
    <file>components/WeeklyRewardPage.tsx</file>
    <description>Standardized a relative import path for 'useAuth' to use the '@/' alias for consistent module resolution.</description>
    <content><![CDATA[
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, Gift, ArrowRight, CheckCircle2, Tag, Info, Star, MapPin, Loader2, Lock } from 'lucide-react';
import { STORES } from '@/constants';
import { Store } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface WeeklyRewardPageProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export const WeeklyRewardPage: React.FC<WeeklyRewardPageProps> = ({ onBack, onNavigate }) => {
  const { user, userRole, loading: authLoading } = useAuth();
  const [savedLojista, setSavedLojista] = useState<string | null>(null);
  
  // TRAVA DE PERMISSÃO REAL: Se não for 'cliente', expulsa para a Home.
  useEffect(() => {
    if (!authLoading) {
      if (!user || userRole !== 'cliente') {
        onBack();
      }
    }
  }, [user, userRole, authLoading, onBack]);

  const consecutiveDays = parseInt(localStorage.getItem('reward_consecutive_days') || '1');

  // Lojas participantes mockadas da base real
  const participatingStores = useMemo(() => STORES.slice(0, 8), []);

  const handleSaveBenefit = (store: Store) => {
    if (savedLojista || !user || userRole !== 'cliente') return;

    setSavedLojista(store.id);
    
    // Salvar no "Meus Cupons" (localStorage para persistência do MVP)
    const existing = JSON.parse(localStorage.getItem('user_saved_coupons') || '[]');
    const newCoupon = {
      id: `CUP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      storeId: store.id,
      storeName: store.name,
      category: store.category,
      neighborhood: store.neighborhood || 'Freguesia',
      redeemedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
      status: 'available',
      discount: '20% OFF' // Exemplo padrão
    };
    
    localStorage.setItem('user_saved_coupons', JSON.stringify([...existing, newCoupon]));
    
    // Avançar o dia no progresso da home
    if (consecutiveDays < 5) {
      localStorage.setItem('reward_consecutive_days', (consecutiveDays + 1).toString());
    }

    setTimeout(() => {
      onNavigate('user_coupons');
    }, 1500);
  };

  // Enquanto carrega a sessão, mostra um loader clean
  if (authLoading) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-6">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Verificando acesso...</p>
        </div>
    );
  }

  // Se não houver usuário ou for lojista
  if (!user || userRole !== 'cliente') {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Lock className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Acesso Restrito</h2>
            <p className="text-sm text-gray-500 mb-8">
                Apenas moradores (perfis de usuário) podem participar da sequência e resgatar prêmios semanais.
            </p>
            <button onClick={onBack} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl">Voltar ao início</button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans flex flex-col pb-32 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0 shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Retirar Cupom - Dia {consecutiveDays}</h1>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
        
        <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="relative z-10">
                <h2 className="text-xl font-black mb-1">Escolha seu benefício</h2>
                <p className="text-blue-100 text-sm opacity-90 leading-tight">Selecione uma das lojas abaixo para garantir seu desconto exclusivo de hoje.</p>
            </div>
        </div>

        {/* Lista de Lojas */}
        <div className="grid grid-cols-1 gap-4">
            {participatingStores.map((store) => (
                <div 
                  key={store.id}
                  className="bg-white dark:bg-gray-800 p-5 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-all"
                >
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-700 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-600 shadow-inner flex items-center justify-center">
                        <img src={store.logoUrl || store.image} className="w-full h-full object-contain p-2" alt={store.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{store.name}</h4>
                        <div className="flex flex-col gap-0.5 mt-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                <MapPin size={10} /> {store.neighborhood}
                            </span>
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1">
                                <Tag size={10} /> {store.category}
                            </span>
                        </div>
                        <div className="mt-2 text-[#0E8A3A] font-black text-sm italic bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-lg w-fit border border-green-100 dark:border-green-800">
                            20% OFF
                        </div>
                    </div>
                    <button 
                      onClick={() => handleSaveBenefit(store)}
                      disabled={savedLojista !== null}
                      className={`shrink-0 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        savedLojista === store.id 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95'
                      } disabled:opacity-50`}
                    >
                        {savedLojista === store.id ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 size={12} /> Retirado
                          </div>
                        ) : 'Retirar'}
                    </button>
                </div>
            ))}
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-3xl border border-amber-100 dark:border-amber-800/30 flex gap-4">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                Todo cupom retirado fica guardado automaticamente em <strong>Menu &gt; Meus Cupons</strong>. Você tem 30 dias para utilizar no estabelecimento.
            </p>
        </div>
      </main>
    </div>
  );
};
]]></content>
  </change>
  <change>
    <file>components/ScanConfirmationScreen.tsx</file>
    <description>Standardized relative import paths for 'getStoreLogo' to use the '@/' alias for consistent module resolution.</description>
    <content><![CDATA[
import React, { useEffect, useState } from 'react';
import { Store, CheckCircle2, X } from 'lucide-react';
import { getStoreLogo } from '@/utils/mockLogos';

interface ScanConfirmationScreenProps {
  storeId: string; // ID recebido do QR
  onConfirm: () => void;
  onCancel: () => void;
}

export const ScanConfirmationScreen: React.FC<ScanConfirmationScreenProps> = ({ storeId, onConfirm, onCancel }) => {
  const [storeData, setStoreData] = useState<{ name: string; address: string; logo: string } | null>(null);

  useEffect(() => {
    // Simulação de busca dos dados da loja baseada no ID
    // Em produção, faria um fetch no Supabase: supabase.from('businesses').select('*').eq('id', storeId)
    setTimeout(() => {
        setStoreData({
            name: "Hamburgueria Brasa", // Mock
            address: "Rua Araguaia, 450 - Freguesia",
            logo: getStoreLogo(1)
        });
    }, 600);
  }, [storeId]);

  if (!storeData) {
      return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 animate-in fade-in">
              <div className="w-16 h-16 border-4 border-[#1E5BFF] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">Identificando loja...</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 animate-in zoom-in-95 duration-300">
        
        <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent pointer-events-none"></div>

            <div className="relative z-10">
                <div className="w-24 h-24 bg-white dark:bg-gray-700 rounded-2xl mx-auto mb-6 shadow-lg flex items-center justify-center p-2 border border-gray-100 dark:border-gray-600">
                    <img src={storeData.logo} alt={storeData.name} className="w-full h-full object-contain rounded-xl" />
                </div>

                <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold mb-4">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Loja Verificada
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {storeData.name}
                </h2>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-[200px] mx-auto">
                    Você está registrando uma compra nesta loja.
                </p>

                <div className="space-y-3">
                    <button 
                        onClick={onConfirm}
                        className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
                    >
                        Continuar
                    </button>
                    <button 
                        onClick={onCancel}
                        className="w-full bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>

    </div>
  );
};
]]></content>
  </change>
  <change>
    <file>components/RecomendadosPorMoradores.tsx</file>
    <description>This component does not contain any module import paths that need to be updated. No changes were made.</description>
    <content><![CDATA[
import React from 'react';
import { BadgeCheck, Star } from 'lucide-react';

interface RecomendacaoItem {
  id: string;
  nome: string;
  categoria: string;
  texto: string;
  totalRecomendacoes: number;
}

interface RecomendadosPorMoradoresProps {
  items: RecomendacaoItem[];
}

export const RecomendadosPorMoradores: React.FC<RecomendadosPorMoradoresProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x -mx-5 px-5 pb-4">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="bg-white dark:bg-gray-800 rounded-[24px] p-5 shadow-sm border border-gray-100 dark:border-gray-700 min-w-[250px] max-w-[250px] snap-center flex flex-col justify-between active:scale-[0.98] transition-transform"
        >
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-[0.12em]">
                {item.categoria}
              </span>
              <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800">
                <Star className="w-2.5 h-2.5 text-[#1E5BFF] fill-[#1E5BFF]" />
                <span className="text-[10px] font-bold text-[#1E5BFF]">{item.totalRecomendacoes}</span>
              </div>
            </div>

            <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight flex items-center gap-1 mb-2">
              {item.nome}
              <BadgeCheck className="w-3.5 h-3.5 text-[#1E5BFF] fill-blue-50 dark:fill-gray-800" />
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed line-clamp-2">
              "{item.texto}"
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">
                Recomendado por
              </p>
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                moradores da freguesia
              </p>
            </div>
            
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${item.id}${i}`} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
]]></content>
  </change>
</changes>
```