
import React, { useState } from 'react';
import { 
  ChevronLeft, LayoutTemplate, Palette, Type, Save, CheckCircle2, 
  CreditCard, Loader2, Megaphone, Star, Zap, ShoppingCart, Tag, 
  Clock, ShieldCheck 
} from 'lucide-react';
import { BannerTemplateId } from '../types';

interface MerchantBannerEditorProps {
  onBack: () => void;
}

const TEMPLATES: { id: BannerTemplateId; name: string; description: string }[] = [
  { id: 'modern', name: 'Moderno', description: 'Ícone à esquerda, texto à direita. Fundo sólido.' },
  { id: 'bold', name: 'Bold', description: 'Texto centralizado e grande. Fundo sólido.' },
  { id: 'minimal', name: 'Minimal', description: 'Limpo, borda suave, ícone à direita.' },
];

const ICONS = [
  { id: 'Zap', icon: Zap },
  { id: 'Star', icon: Star },
  { id: 'Tag', icon: Tag },
  { id: 'ShoppingCart', icon: ShoppingCart },
  { id: 'Clock', icon: Clock },
  { id: 'ShieldCheck', icon: ShieldCheck },
];

const COLORS = [
  { id: 'bg-blue-600', name: 'Azul' },
  { id: 'bg-red-600', name: 'Vermelho' },
  { id: 'bg-emerald-500', name: 'Verde' },
  { id: 'bg-amber-500', name: 'Amarelo' },
  { id: 'bg-purple-600', name: 'Roxo' },
  { id: 'bg-gray-900', name: 'Preto' },
];

export const MerchantBannerEditor: React.FC<MerchantBannerEditorProps> = ({ onBack }) => {
  const [step, setStep] = useState<'template' | 'content' | 'payment' | 'success'>('template');
  const [templateId, setTemplateId] = useState<BannerTemplateId>('modern');
  
  const [content, setContent] = useState({
    title: 'Sua Oferta Aqui',
    subtitle: 'Descrição curta e atrativa',
    bgColor: 'bg-blue-600',
    textColor: 'text-white',
    iconName: 'Zap'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (step === 'template') setStep('content');
    else if (step === 'content') setStep('payment');
  };

  const handlePayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
    }, 2000);
  };

  const BannerPreview = () => {
    const Icon = ICONS.find(i => i.id === content.iconName)?.icon || Star;
    
    return (
      <div className={`relative h-32 w-full rounded-[2rem] overflow-hidden shadow-lg transition-all duration-500 flex items-center px-6 gap-5 ${content.bgColor}`}>
        {templateId === 'modern' && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/10 text-white">
              <Icon className="w-8 h-8" />
            </div>
            <div className={content.textColor}>
              <h3 className="font-black text-lg uppercase tracking-tight leading-tight">{content.title}</h3>
              <p className="text-xs font-medium opacity-80">{content.subtitle}</p>
            </div>
          </>
        )}

        {templateId === 'bold' && (
          <div className={`w-full flex flex-col items-center justify-center text-center ${content.textColor}`}>
             <h3 className="font-black text-2xl uppercase tracking-tighter leading-none mb-1">{content.title}</h3>
             <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <Icon className="w-4 h-4" />
                <p className="text-xs font-bold uppercase tracking-widest">{content.subtitle}</p>
             </div>
          </div>
        )}

        {templateId === 'minimal' && (
          <div className={`w-full flex items-center justify-between ${content.textColor}`}>
             <div>
                <h3 className="font-bold text-xl tracking-tight leading-tight">{content.title}</h3>
                <p className="text-xs opacity-70 mt-1">{content.subtitle}</p>
             </div>
             <Icon className="w-10 h-10 opacity-80" />
          </div>
        )}
      </div>
    );
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/20">
          <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Banner Contratado!</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed max-w-xs">
          Sua campanha está ativa e aparecerá na categoria selecionada pelos próximos 7 dias.
        </p>
        <button 
          onClick={onBack}
          className="w-full max-w-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
        >
          Voltar ao Painel
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 flex flex-col">
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 px-5 pt-12 pb-5 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <h1 className="font-bold text-xl text-gray-900 dark:text-white">Criar Banner</h1>
        </div>
      </div>

      <div className="flex-1 p-5 pb-32 overflow-y-auto no-scrollbar">
        
        {/* Preview Area (Always Visible) */}
        <div className="mb-8">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Pré-visualização</p>
          <BannerPreview />
        </div>

        {step === 'template' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 mb-4">
              <LayoutTemplate className="w-5 h-5 text-[#1E5BFF]" />
              <h3 className="font-bold text-gray-900 dark:text-white">Escolha o Layout</h3>
            </div>
            
            <div className="grid gap-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplateId(t.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    templateId === t.id 
                    ? 'border-[#1E5BFF] bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
                  }`}
                >
                  <span className={`font-bold text-sm block ${templateId === t.id ? 'text-[#1E5BFF]' : 'text-gray-900 dark:text-white'}`}>
                    {t.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                    {t.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'content' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Texto */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Type className="w-5 h-5 text-[#1E5BFF]" />
                <h3 className="font-bold text-gray-900 dark:text-white">Conteúdo</h3>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Título</label>
                <input 
                  value={content.title}
                  onChange={e => setContent({...content, title: e.target.value})}
                  maxLength={25}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-[#1E5BFF] outline-none transition-all dark:text-white"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Subtítulo</label>
                <input 
                  value={content.subtitle}
                  onChange={e => setContent({...content, subtitle: e.target.value})}
                  maxLength={30}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-[#1E5BFF] outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            {/* Cores */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="w-5 h-5 text-[#1E5BFF]" />
                <h3 className="font-bold text-gray-900 dark:text-white">Cor de Fundo</h3>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setContent({...content, bgColor: c.id})}
                    className={`w-10 h-10 rounded-full shrink-0 border-2 ${c.id} ${
                      content.bgColor === c.id ? 'border-white ring-2 ring-gray-400' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Ícones */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-[#1E5BFF]" />
                <h3 className="font-bold text-gray-900 dark:text-white">Ícone</h3>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {ICONS.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => setContent({...content, iconName: i.id})}
                    className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center border transition-all ${
                      content.iconName === i.id 
                      ? 'bg-[#1E5BFF] text-white border-[#1E5BFF]' 
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400'
                    }`}
                  >
                    <i.icon className="w-6 h-6" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-[#1E5BFF]" />
              <h3 className="font-bold text-gray-900 dark:text-white">Resumo do Plano</h3>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500">Duração</span>
                <span className="font-bold text-gray-900 dark:text-white">7 Dias</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500">Local</span>
                <span className="font-bold text-gray-900 dark:text-white">Topo da Categoria</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 my-4"></div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-2xl font-black text-[#1E5BFF]">R$ 49,90</span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl flex gap-3 items-start border border-blue-100 dark:border-blue-800">
              <Megaphone className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                Seu banner será exibido rotativamente para todos os usuários que acessarem a categoria.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-30 max-w-md mx-auto">
        <button 
          onClick={step === 'payment' ? handlePayment : handleNext}
          disabled={isLoading}
          className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : step === 'payment' ? (
            <>Contratar e Publicar <CheckCircle2 className="w-5 h-5" /></>
          ) : (
            <>Próximo Passo <ChevronLeft className="w-5 h-5 rotate-180" /></>
          )}
        </button>
      </div>

    </div>
  );
};
