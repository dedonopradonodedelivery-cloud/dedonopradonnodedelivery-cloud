
import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { ChevronLeft, ChevronDown, CheckCircle2, ArrowRight, Wrench, Clock, ShieldCheck, MessageCircle, Zap, Droplets, PaintRoller, Hammer, Palette, Sparkles, PartyPopper } from 'lucide-react';

interface ServicesLandingViewProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  user: User | null;
  onRequireLogin: () => void;
}

const FaqItem: React.FC<{ q: string, a: string }> = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left">
        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{q}</h4>
        <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed animate-in fade-in duration-300">
          {a}
        </p>
      )}
    </div>
  );
};

export const ServicesLandingView: React.FC<ServicesLandingViewProps> = ({ onBack, onNavigate, user, onRequireLogin }) => {
  
  const handleRequestQuote = () => {
    if (user) {
      onNavigate('services');
    } else {
      onRequireLogin();
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500"><ChevronLeft size={20}/></button>
          <div className="flex-1"><h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Orçamentos de Serviços</h1></div>
        </div>
      </header>

      <main className="pb-24">
        {/* HERO */}
        <section className="p-6 pt-10 text-center">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-[#1E5BFF] border-4 border-white dark:border-gray-900 shadow-xl">
                <Wrench size={40} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white font-display tracking-tighter leading-tight mb-4">Peça orçamentos de serviços sem dor de cabeça</h2>
            <p className="text-base text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Descreva o que precisa e receba propostas de profissionais da sua região.</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button onClick={handleRequestQuote} className="flex-1 bg-[#1E5BFF] text-white font-bold py-4 rounded-2xl shadow-lg">Pedir orçamento agora</button>
                <button onClick={() => scrollToSection('how-it-works')} className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold py-4 rounded-2xl">Como funciona</button>
            </div>
        </section>

        {/* COMO FUNCIONA */}
        <section id="how-it-works" className="px-6 py-12 bg-white dark:bg-gray-900">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center"><div className="text-3xl font-black text-blue-200 dark:text-blue-900 mb-2">1</div><h3 className="font-bold text-lg mb-1">Conte o que precisa</h3><p className="text-sm text-gray-500">Descreva o serviço em detalhes. Adicione fotos para ajudar.</p></div>
                <div className="text-center"><div className="text-3xl font-black text-blue-200 dark:text-blue-900 mb-2">2</div><h3 className="font-bold text-lg mb-1">Receba propostas</h3><p className="text-sm text-gray-500">Até 5 profissionais verificados enviam orçamentos.</p></div>
                <div className="text-center"><div className="text-3xl font-black text-blue-200 dark:text-blue-900 mb-2">3</div><h3 className="font-bold text-lg mb-1">Escolha com confiança</h3><p className="text-sm text-gray-500">Converse, negocie e feche com o melhor para você.</p></div>
            </div>
        </section>

        {/* BENEFÍCIOS */}
        <section className="px-6 py-12">
            <h3 className="text-2xl font-black text-center mb-8">Vantagens para você</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-3"><Clock size={20} className="text-blue-500" /><span className="text-sm font-semibold">Economize tempo</span></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-3"><CheckCircle2 size={20} className="text-blue-500" /><span className="text-sm font-semibold">Compare preços</span></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-3"><MessageCircle size={20} className="text-blue-500" /><span className="text-sm font-semibold">Converse antes</span></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-3"><ShieldCheck size={20} className="text-blue-500" /><span className="text-sm font-semibold">Decida com segurança</span></div>
            </div>
        </section>

        {/* TIPOS DE SERVIÇOS */}
        <section className="px-6 py-12 bg-white dark:bg-gray-900">
            <h3 className="text-2xl font-black text-center mb-8">Alguns serviços disponíveis</h3>
            <div className="flex flex-wrap justify-center gap-4 text-center">
                <div className="flex flex-col items-center gap-2 w-20"><div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center"><Zap size={24} className="text-gray-500" /></div><span className="text-xs font-bold">Elétrica</span></div>
                <div className="flex flex-col items-center gap-2 w-20"><div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center"><Droplets size={24} className="text-gray-500" /></div><span className="text-xs font-bold">Hidráulica</span></div>
                <div className="flex flex-col items-center gap-2 w-20"><div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center"><PaintRoller size={24} className="text-gray-500" /></div><span className="text-xs font-bold">Pintura</span></div>
                <div className="flex flex-col items-center gap-2 w-20"><div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center"><Hammer size={24} className="text-gray-500" /></div><span className="text-xs font-bold">Reforma</span></div>
                <div className="flex flex-col items-center gap-2 w-20"><div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center"><Palette size={24} className="text-gray-500" /></div><span className="text-xs font-bold">Design</span></div>
                <div className="flex flex-col items-center gap-2 w-20"><div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center"><Sparkles size={24} className="text-gray-500" /></div><span className="text-xs font-bold">Limpeza</span></div>
                <div className="flex flex-col items-center gap-2 w-20"><div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center"><PartyPopper size={24} className="text-gray-500" /></div><span className="text-xs font-bold">Eventos</span></div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-6">Não achou seu serviço? Descreva que a gente direciona.</p>
        </section>
        
        {/* DEPOIMENTOS */}
        <section className="px-6 py-12">
            <h3 className="text-2xl font-black text-center mb-8">Vizinhos que aprovaram</h3>
            <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">"Recebi 3 orçamentos em menos de 1 hora. Sensacional!" <span className="font-bold text-xs">- Carla M.</span></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">"Facilitou muito minha vida na hora de achar um eletricista." <span className="font-bold text-xs">- João P.</span></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">"Seguro e prático. Recomendo!" <span className="font-bold text-xs">- Fernanda S.</span></div>
            </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-12 bg-white dark:bg-gray-900">
            <h3 className="text-2xl font-black text-center mb-8">Dúvidas Frequentes</h3>
            <div className="space-y-3">
                <FaqItem q="É gratuito pedir orçamento?" a="Sim, é 100% gratuito. Você só paga diretamente ao profissional se fechar o serviço." />
                <FaqItem q="Quantas propostas vou receber?" a="Seu pedido é enviado para a rede e você pode receber até 5 propostas para comparar." />
                <FaqItem q="Quanto tempo leva?" a="A maioria dos pedidos recebe a primeira proposta em menos de 30 minutos." />
                <FaqItem q="Posso conversar antes de fechar?" a="Sim! Você terá um chat exclusivo para conversar com cada profissional, tirar dúvidas e negociar." />
                <FaqItem q="Como escolho o melhor profissional?" a="Você pode ver as avaliações de cada profissional, conversar e decidir com base no preço e confiança." />
            </div>
        </section>

        {/* CTA FINAL */}
        <section className="px-6 py-12 text-center">
            <button onClick={handleRequestQuote} className="w-full max-w-sm bg-[#1E5BFF] text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 mx-auto">
                Pedir orçamento agora <ArrowRight size={20} />
            </button>
            <p className="text-xs text-gray-400 mt-3">Leva menos de 2 minutos. Sem compromisso.</p>
        </section>

      </main>
    </div>
  );
};