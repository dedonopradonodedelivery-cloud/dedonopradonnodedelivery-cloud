
import React from 'react';
import { 
  ChevronLeft, 
  Users, 
  Handshake, 
  ArrowRight,
  Lock,
  Target,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock as ClockIcon,
  Quote
} from 'lucide-react';

interface JPAConnectSalesViewProps {
  onBack: () => void;
  onJoin: () => void;
}

const BenefitItem: React.FC<{ icon: React.ElementType, title: string, description: string, iconColor: string }> = ({ icon: Icon, title, description, iconColor }) => (
  <div className="flex items-start gap-4">
    <div className={`w-10 h-10 rounded-2xl bg-${iconColor}-50 dark:bg-${iconColor}-900/20 flex items-center justify-center shrink-0 border border-${iconColor}-100 dark:border-${iconColor}-800/50`}>
        <Icon className={`w-5 h-5 text-${iconColor}-600 dark:text-${iconColor}-400`} />
    </div>
    <div>
        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{description}</p>
    </div>
  </div>
);

export const JPAConnectSalesView: React.FC<JPAConnectSalesViewProps> = ({ onBack, onJoin }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 flex flex-col relative">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">JPA Connect</h1>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-40">
        {/* Hero Section */}
        <section className="p-8 text-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border-4 border-white dark:border-gray-900 shadow-xl">
                <Handshake className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white font-display tracking-tight leading-tight mb-3">
                JPA Connect
            </h2>
            <p className="text-base font-bold text-indigo-600 dark:text-indigo-400 max-w-sm mx-auto">
                O grupo de networking exclusivo dos empresários de Jacarepaguá
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mx-auto mt-6">
                O JPA Connect é um grupo fechado de networking entre donos de negócios de Jacarepaguá, criado para gerar vendas reais através de indicação, confiança e relacionamento local.
            </p>
        </section>

        <div className="px-6 space-y-12">
            {/* Rules Section */}
            <section className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 text-center">Regras do Grupo</h3>
                <div className="space-y-5">
                    <BenefitItem icon={Lock} title="Apenas 1 por nicho" description="Garantimos exclusividade, sem concorrência interna." iconColor="purple"/>
                    <BenefitItem icon={Users} title="Grupo Seleto" description="Membros escolhidos para garantir a qualidade do networking." iconColor="blue"/>
                    <BenefitItem icon={Target} title="Foco em Negócios Reais" description="O objetivo é claro: gerar vendas e parcerias entre os membros." iconColor="emerald"/>
                </div>
            </section>
            
            {/* How it Works Section */}
            <section>
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Como Funciona</h3>
                 <div className="space-y-3">
                    <BenefitItem icon={Calendar} title="Encontros 1 vez por semana" description="Reuniões focadas para manter a conexão ativa e gerar oportunidades." iconColor="blue"/>
                    <BenefitItem icon={MapPin} title="Local: auditório" description="Nossos encontros acontecem em um local parceiro e profissional na Freguesia." iconColor="blue"/>
                    <BenefitItem icon={ClockIcon} title="Duração: 1h30min" description="Cada empresário tem 5 minutos para se apresentar, explicar seu negócio e o tipo de cliente que procura." iconColor="blue"/>
                 </div>
            </section>

            {/* Testimonial Section */}
            <section className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800/50">
                <Quote className="w-8 h-8 text-indigo-200 dark:text-indigo-700 mb-4" />
                <p className="text-base text-indigo-800 dark:text-indigo-200 leading-relaxed italic font-medium mb-6">
                    “Conheci o dono de uma loja de celular no JPA Connect. Um cliente meu apareceu com o celular quebrado. Na mesma hora, fiz a ponte com meu amigo do grupo. Ajudei meu cliente, gerei uma venda para ele e aumentei ainda mais a confiança comigo.”
                </p>
                <p className="text-xs font-black text-indigo-400 dark:text-indigo-500 uppercase tracking-widest text-right">
                    — A Mágica da Indicação Local
                </p>
            </section>

            {/* Benefits Section */}
            <section>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Benefícios Imediatos</h3>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
                    <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /><span className="text-sm font-medium text-gray-700 dark:text-gray-300">Indicações qualificadas</span></div>
                    <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /><span className="text-sm font-medium text-gray-700 dark:text-gray-300">Confiança imediata com o cliente</span></div>
                    <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /><span className="text-sm font-medium text-gray-700 dark:text-gray-300">Networking local de verdade</span></div>
                    <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /><span className="text-sm font-medium text-gray-700 dark:text-gray-300">Crescimento coletivo</span></div>
                    <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /><span className="text-sm font-medium text-gray-700 dark:text-gray-300">Autoridade no bairro</span></div>
                </div>
            </section>
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="fixed bottom-0 left-0 right-0 p-5 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-30 max-w-md mx-auto">
        <button 
            onClick={onJoin}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base py-5 rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
            Quero participar do JPA Connect
            <ArrowRight className="w-5 h-5 stroke-[3]" />
        </button>
      </footer>
    </div>
  );
};
