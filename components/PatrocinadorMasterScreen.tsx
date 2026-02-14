
import React from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Phone, 
  MessageSquare, 
  ExternalLink,
  Car,
  Heart,
  FileText,
  Clock,
  Zap,
  CheckCircle2,
  Navigation2,
  MapPin,
  Smartphone,
  ShieldAlert,
  // Added missing Building icon
  Building
} from 'lucide-react';

interface PatrocinadorMasterScreenProps {
  onBack: () => void;
}

const BenefitCard: React.FC<{ icon: React.ElementType, title: string, color: string }> = ({ icon: Icon, title, color }) => (
  <div className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center text-center gap-3 active:scale-95 transition-all cursor-pointer">
    <div className={`w-12 h-12 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center ${color.replace('bg-', 'text-')}`}>
      <Icon size={24} />
    </div>
    <span className="text-[10px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-tight">{title}</span>
  </div>
);

const ContactCard: React.FC<{ city: string, phone: string, isWhatsApp?: boolean }> = ({ city, phone, isWhatsApp }) => (
  <div className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isWhatsApp ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-[#FF6501]'}`}>
        {isWhatsApp ? <MessageSquare size={18} /> : <Phone size={18} />}
      </div>
      <div>
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{city}</p>
        <p className="text-sm font-bold text-gray-900 dark:text-white">{phone}</p>
      </div>
    </div>
    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-300 group-hover:text-[#FF6501] transition-colors">
      <ChevronLeft size={16} className="rotate-180" />
    </div>
  </div>
);

export const PatrocinadorMasterScreen: React.FC<PatrocinadorMasterScreenProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-500 overflow-x-hidden">
      
      {/* 1️⃣ HEADER PREMIUM */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button 
          onClick={onBack}
          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-500 active:scale-90 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[#FF6501] font-black text-lg tracking-tighter uppercase">Atual Clube</span>
        </div>
        <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
            <ShieldCheck size={20} className="text-[#FF6501]" />
        </div>
      </header>

      <main className="p-6 space-y-12 max-w-md mx-auto">
        
        {/* 2️⃣ HERO SECTION */}
        <section className="text-center pt-4 animate-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-3xl font-display font-black text-gray-900 dark:text-white leading-[1.1] tracking-tighter uppercase mb-3">
                Aconteceu um imprevisto <br/> na estrada?
            </h1>
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                Nossa Assistência 24h vai te ajudar! 🚀
            </p>
        </section>

        {/* 3️⃣ BLOCO DE CONTATO / AÇÃO RÁPIDA */}
        <section className="space-y-4 animate-in slide-in-from-bottom-6 duration-700 delay-100">
            <div className="bg-gradient-to-br from-[#FF6501] to-[#FF8C00] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-orange-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 animate-premium-glow"></div>
                
                <div className="relative z-10 space-y-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b border-white/20 pb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Assistência Principal</span>
                            <Phone size={16} className="opacity-60" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-black tracking-tighter">0800 729 0130</p>
                            <p className="text-3xl font-black tracking-tighter">0800 20 20 123</p>
                        </div>
                    </div>

                    <button className="w-full bg-white text-[#FF6501] font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm active:scale-[0.98] transition-all">
                        Ligar agora
                        <ArrowRight size={18} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </section>

        {/* 4️⃣ BLOCO SOBRE NÓS */}
        <section className="space-y-6 animate-in fade-in duration-1000 delay-200">
            <div className="flex items-center gap-3 px-1">
                <div className="w-1.5 h-4 bg-[#FF6501] rounded-full"></div>
                <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Sobre a Atual Clube</h2>
            </div>
            
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                        Somos uma <strong>Associação de Benefícios</strong> sem fins lucrativos. Diferente de uma seguradora, nosso modelo se baseia no mutualismo: a união de pessoas em prol de proteção coletiva e economia.
                    </p>
                    <div className="grid grid-cols-1 gap-4 mt-8">
                        <div className="flex items-center gap-4">
                            <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                            <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Respaldo Jurídico & Legalidade</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                            <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Conformidade com a SUSEP</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                            <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Transparência Total nos Processos</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 5️⃣ BLOCO DE BENEFÍCIOS */}
        <section className="space-y-6 animate-in fade-in duration-1000 delay-300">
            <div className="flex items-center gap-3 px-1">
                <div className="w-1.5 h-4 bg-[#FF6501] rounded-full"></div>
                <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Como podemos te ajudar</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <BenefitCard icon={FileText} title="2ª Via de Boleto" color="bg-blue-500" />
                <BenefitCard icon={Car} title="Reboque" color="bg-orange-500" />
                <BenefitCard icon={ShieldAlert} title="Informe seu Evento" color="bg-rose-500" />
                <BenefitCard icon={Heart} title="Atual Saúde" color="bg-emerald-500" />
            </div>
        </section>

        {/* 6️⃣ BLOCO FALE CONOSCO */}
        <section className="space-y-6 animate-in fade-in duration-1000 delay-400">
            <div className="flex items-center gap-3 px-1">
                <div className="w-1.5 h-4 bg-[#FF6501] rounded-full"></div>
                <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Fale Conosco</h2>
            </div>

            <div className="space-y-4">
                <ContactCard city="Rio de Janeiro" phone="(21) 3268-3069" />
                <ContactCard city="Belo Horizonte" phone="(31) 3360-1550" />
                <ContactCard city="WhatsApp Oficial" phone="55 21 99999-9999" isWhatsApp />
            </div>
        </section>

        {/* 7️⃣ RODAPÉ PREMIUM */}
        <footer className="pt-10 pb-8 text-center border-t border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                <Building size={16} className="text-[#FF6501]" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                Atual Clube de Benefícios
            </p>
            <p className="text-[8px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest">
                CNPJ: 26.198.696/0001-04
            </p>
        </footer>

      </main>
    </div>
  );
};
