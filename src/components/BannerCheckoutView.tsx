

import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2, Loader2, CreditCard, Lock, Sparkles, QrCode, Landmark } from 'lucide-react';
import { BannerPlan } from '../types';
import { PROFESSIONAL_BANNER_PRICING, NEIGHBORHOOD_OPTIONS } from '../constants'; // Import NEIGHBORHOOD_OPTIONS

interface BannerCheckoutViewProps {
  onBack: () => void;
  plan: BannerPlan;
  draft: any; // The creative draft from the previous step
  onComplete: (paymentMethod: 'pix' | 'credit' | 'debit') => void; // Passa o método de pagamento
}

const formatCurrency = (cents: number) => `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;

// Re-usable Banner Preview components from StoreAdsModule
const TemplateBannerRender: React.FC<{ config: any }> = ({ config }) => {
    const { template_id, headline, subheadline, product_image_url } = config;
    if (template_id === 'oferta_relampago') return <div className="w-full h-full bg-gradient-to-br from-rose-500 to-red-600 text-white p-4 flex items-center justify-center text-center"><p className="font-bold text-sm">{headline}</p></div>;
    if (template_id === 'lancamento') return <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 text-white p-4 flex items-center justify-center text-center"><p className="font-bold text-sm">{headline}</p></div>;
    return null;
};
const CustomBannerRender: React.FC<{ config: any }> = ({ config }) => {
    const { background_color, text_color, title } = config;
    return <div className="w-full h-full p-4 flex items-center justify-center text-center" style={{ backgroundColor: background_color, color: text_color }}><p className="font-bold text-sm">{title}</p></div>;
};

export const BannerCheckoutView: React.FC<BannerCheckoutViewProps> = ({ onBack, plan, draft, onComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | 'debit'>('credit'); // Padrão

  // Custo dos espaços publicitários (já vem calculado no plano)
  const adPlacementCostCents = plan.priceCents;

  // Custo do serviço de criação de banner profissional (fixo, condicional)
  const isProfessionalServiceSelected = draft.type === 'professional_service';
  const professionalServiceCostCents = isProfessionalServiceSelected ? PROFESSIONAL_BANNER_PRICING.promoCents : 0;

  // Total geral
  const totalGeralCents = adPlacementCostCents + professionalServiceCostCents;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      // Chama o onComplete do pai, passando o método de pagamento selecionado
      setTimeout(() => onComplete(paymentMethod), 2000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-center p-8 animate-in fade-in">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border-2 border-green-500/20">
          <CheckCircle2 size={48} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-black text-white font-display uppercase tracking-tight mb-3">
          Pagamento Aprovado!
        </h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
          {isProfessionalServiceSelected 
            ? 'Pedido de banner profissional criado. Acompanhe no painel.' 
            : 'Seu banner será publicado em breve. Acompanhe o status no seu painel.'}
        </p>
      </div>
    );
  }

  // Lógica para desabilitar o botão de pagamento
  const isPaymentButtonDisabled = isProcessing || totalGeralCents <= 0;

  // Helper para montar o subtítulo dos espaços publicitários
  const getAdPlacementSubtitle = () => {
    // FIX: Safely access plan.neighborhoods which is now typed as { id: string; name: string }[]
    const neighborhoodNames = plan.neighborhoods?.map(n => {
      const option = NEIGHBORHOOD_OPTIONS.find(opt => opt.id === n.id);
      return option ? option.name : n.id;
    }).join(', ');
    
    // Concatenar os detalhes do plano
    const placementText = plan.placement === 'Todos' 
      ? 'Home + Categorias' 
      : plan.placement;
    
    const durationText = plan.durationMonths === 1 ? '1 mês' : `${plan.durationMonths} meses`;

    // FIX: Check if neighborhoods exist before displaying count
    if (!plan.neighborhoods || plan.neighborhoods.length === 0) return `${placementText} • Sem bairros selecionados • ${durationText}`;

    return `${placementText} • ${plan.neighborhoods.length} bairro(s) • ${durationText}`;
  };


  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center gap-4">
        <button onClick={onBack} className="p-2.5 bg-slate-800 text-slate-400 hover:text-white transition-colors border border-white/5 rounded-xl active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-lg leading-none">Finalizar e Pagar</h1>
          <p className="text-xs text-slate-500">Última etapa</p>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        <section>
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">Seu carrinho</h3>
          <div className="bg-slate-800 rounded-3xl p-6 border border-white/10 space-y-4">
            
            {/* ITEM 1: ESPAÇOS PUBLICITÁRIOS */}
            <div className="flex justify-between items-start pb-4 border-b border-white/10">
              <div>
                  <span className="text-sm text-white font-bold block">Espaços publicitários</span>
                  <span className="text-xs text-slate-400 mt-1">{getAdPlacementSubtitle()}</span>
              </div>
              <span className="font-bold text-white text-sm">{formatCurrency(adPlacementCostCents)}</span>
            </div>

            {/* ITEM 2: CRIAÇÃO DE BANNER PROFISSIONAL (CONDICIONAL) */}
            {isProfessionalServiceSelected && (
                 <div className="flex justify-between items-start pb-4 border-b border-white/10">
                    <div>
                        <span className="text-sm text-white font-bold block">Criação de Banner Profissional</span>
                        <span className="text-xs text-slate-400 mt-1">Serviço de design</span>
                    </div>
                    <span className="font-bold text-white text-sm">{formatCurrency(professionalServiceCostCents)}</span>
                 </div>
            )}
          </div>
        </section>

        {/* SECTION: PREVIEW DO BANNER (APENAS PARA BANNERS NORMAIS) */}
        {!isProfessionalServiceSelected && (
            <section>
            <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">Seu Banner</h3>
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-700">
                {draft.type === 'template' ? <TemplateBannerRender config={draft} /> : <CustomBannerRender config={draft} />}
            </div>
            </section>
        )}

        {/* SECTION: INFO SERVIÇO PROFISSIONAL (SE SELECIONADO) */}
        {isProfessionalServiceSelected && (
             <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-2xl flex items-start gap-3">
                 <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                 <div>
                     <p className="text-sm font-bold text-blue-100">Serviço de Design Incluso</p>
                     <p className="text-xs text-blue-300 mt-1">Após o pagamento, você será redirecionado para enviar seu logo e preferências para nossa equipe.</p>
                 </div>
             </div>
        )}

        <section>
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">Pagamento</h3>
          <div className="bg-slate-800 rounded-3xl p-6 border border-white/10 space-y-5">
            {/* Opções de Pagamento */}
            <button onClick={() => setPaymentMethod('credit')} className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'credit' ? 'bg-blue-500/10 border-blue-500' : 'bg-slate-900 border-slate-700'}`}>
                <CreditCard className={`w-5 h-5 ${paymentMethod === 'credit' ? 'text-blue-400' : 'text-slate-500'}`} />
                <span className="font-bold text-white text-sm">Cartão de Crédito</span>
            </button>
            <button onClick={() => setPaymentMethod('pix')} className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'pix' ? 'bg-blue-500/10 border-blue-500' : 'bg-slate-900 border-slate-700'}`}>
                <QrCode className={`w-5 h-5 ${paymentMethod === 'pix' ? 'text-blue-400' : 'text-slate-500'}`} />
                <span className="font-bold text-white text-sm">PIX</span>
            </button>
            <button onClick={() => setPaymentMethod('debit')} className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'debit' ? 'bg-blue-500/10 border-blue-500' : 'bg-slate-900 border-slate-700'}`}>
                <Landmark className={`w-5 h-5 ${paymentMethod === 'debit' ? 'text-blue-400' : 'text-slate-500'}`} />
                <span className="font-bold text-white text-sm">Cartão de Débito</span>
            </button>
            
            {/* Campos de Cartão (Condicional, para simulação) */}
            {paymentMethod === 'credit' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <input placeholder="Número do Cartão" className="w-full bg-slate-700 p-3 rounded-lg text-white placeholder-slate-500" />
                    <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Validade (MM/AA)" className="w-full bg-slate-700 p-3 rounded-lg text-white placeholder-slate-500" />
                        <input placeholder="CVC" className="w-full bg-slate-700 p-3 rounded-lg text-white placeholder-slate-500" />
                    </div>
                </div>
            )}
            
            <div className="flex items-center justify-center gap-2 pt-4 text-xs text-slate-500">
              <Lock size={12} />
              <span>Pagamento seguro via Stripe</span>
            </div>
          </div>
        </section>
      </main>

      <div className="p-6 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent sticky bottom-0">
        <div className="flex justify-between items-center mb-4">
          <span className="text-slate-400">Total a pagar:</span>
          <span className="text-2xl font-black text-white">{formatCurrency(totalGeralCents)}</span>
        </div>
        <button 
          onClick={handlePay}
          disabled={isPaymentButtonDisabled}
          className="w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : `Confirmar Pagamento — ${formatCurrency(totalGeralCents)}`}
        </button>
      </div>
    </div>
  );
};