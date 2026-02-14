
import React from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Car,
  Heart,
  FileText,
  CheckCircle2,
  Building,
  ShieldAlert,
  Zap,
  Globe,
  // Fix: Adding missing Handshake and MapPin imports from lucide-react
  Handshake,
  MapPin
} from 'lucide-react';

interface PatrocinadorMasterScreenProps {
  onBack: () => void;
}

const ServiceCard: React.FC<{ icon: React.ElementType, title: string, color: string }> = ({ icon: Icon, title, color }) => (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none flex flex-col items-center text-center gap-4 active:scale-95 hover:scale-[1.02] transition-all cursor-pointer group">
    <div className={`w-14 h-14 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center ${color.replace('bg-', 'text-')} group-hover:scale-110 transition-transform`}>
      <Icon size={28} strokeWidth={2.5} />
    </div>
    <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tighter leading-tight">{title}</span>
  </div>
);

const CityContact: React.FC<{ city: string, phone: string, isWhatsApp?: boolean }> = ({ city, phone, isWhatsApp }) => (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isWhatsApp ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-[#FF6501]'}`}>
        {isWhatsApp ? <MessageSquare size={22} /> : <Phone size={22} />}
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{city}</p>
        <p className="text-base font-bold text-gray-900 dark:text-white">{phone}</p>
      </div>
    </div>
    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-300">
      <ChevronLeft size={18} className="rotate-180" />
    </div>
  </div>
);

export const PatrocinadorMasterScreen: React.FC<PatrocinadorMasterScreenProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans pb-40 animate-in fade-in duration-700 overflow-x-hidden">
      
      {/* 1️⃣ HEADER PREMIUM STICKY */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-6 h-20 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <button 
          onClick={onBack}
          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-500 active:scale-90 transition-all shadow-inner"
        >
          <ChevronLeft size={20} strokeWidth={3} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[#FF6501] font-black text-xl tracking-tighter uppercase leading-none">Atual Clube</span>
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">Patrocinador Master</span>
        </div>
        <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
            <ShieldCheck size={20} className="text-[#FF6501]" />
        </div>
      </header>

      {/* 2️⃣ HERO SECTION CINEMATOGRÁFICA */}
      <section className="relative w-full h-[400px] overflow-hidden group">
         {/* Imagem de Fundo Lifestyle */}
         <img 
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1200&auto=format&fit=crop" 
            alt="Assistência Estrada"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-10000 group-hover:scale-110"
         />
         {/* Overlay de Profundidade */}
         <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent dark:from-gray-950 dark:via-gray-950/60"></div>
         
         <div className="relative z-10 h-full flex flex-col justify-end p-8 text-center animate-in slide-in-from-bottom-10 duration-1000">
            <h1 className="text-4xl font-display font-black text-gray-900 dark:text-white leading-[1.1] tracking-tighter uppercase mb-3 drop-shadow-sm">
                Aconteceu um imprevisto <br/> na estrada?
            </h1>
            <p className="text-xl font-medium text-gray-600 dark:text-gray-300 opacity-90">
                Nossa Assistência 24h vai te ajudar. 🚀
            </p>
         </div>
      </section>

      <main className="px-6 space-y-16 max-w-md mx-auto -mt-4 relative z-20">
        
        {/* 3️⃣ BLOCO DE AÇÃO RÁPIDA (DOMINANTE) */}
        <section className="animate-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="bg-gradient-to-br from-[#FF6501] via-[#FF6501] to-[#E65B00] rounded-[3rem] p-10 text-white shadow-2xl shadow-orange-500/30 relative overflow-hidden group">
                {/* Efeito Glow Sutil */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 animate-premium-glow"></div>
                
                <div className="relative z-10 space-y-8">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between border-b border-white/20 pb-4">
                            <div className="flex items-center gap-2">
                                <Zap size={16} fill="white" className="text-white" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Canais de Emergência</span>
                            </div>
                            <Phone size={18} className="opacity-60" />
                        </div>
                        <div className="space-y-4">
                            <p className="text-4xl font-black tracking-tighter flex items-center justify-center gap-2">
                                0800 729 0130
                            </p>
                            <p className="text-4xl font-black tracking-tighter flex items-center justify-center gap-2">
                                0800 20 20 123
                            </p>
                        </div>
                    </div>

                    <button className="w-full bg-white text-[#FF6501] font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-sm active:scale-[0.98] transition-all hover:bg-orange-50 group/btn overflow-hidden relative">
                        <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                        Ligar agora
                        <ArrowRight size={20} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>

        {/* 4️⃣ BLOCO SOBRE A ATUAL CLUBE (MODERNO) */}
        <section className="space-y-8">
            <div className="flex flex-col items-center text-center gap-2">
                <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.3em]">Sobre a Atual Clube</h2>
                <div className="h-1 w-12 bg-[#FF6501] rounded-full"></div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 space-y-8">
                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    Somos uma <strong>Associação de Benefícios</strong> sem fins lucrativos comprometida com a proteção coletiva. Nosso modelo se baseia no mutualismo, garantindo segurança com transparência e economia real para nossos membros.
                </p>
                
                <div className="grid grid-cols-1 gap-6">
                    {[
                        { icon: ShieldCheck, text: "Respaldo Jurídico & Legalidade" },
                        { icon: Globe, text: "Conformidade total com a SUSEP" },
                        { icon: Handshake, text: "Transparência total nos processos" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-emerald-500 shadow-sm border border-gray-100 dark:border-gray-700">
                                <item.icon size={20} strokeWidth={2.5} />
                            </div>
                            <p className="text-xs font-black text-gray-700 dark:text-gray-200 uppercase tracking-tight">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* 5️⃣ BLOCO COMO PODEMOS TE AJUDAR (BENTO GRID) */}
        <section className="space-y-8">
            <div className="flex flex-col items-center text-center gap-2">
                <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.3em]">Como podemos ajudar</h2>
                <div className="h-1 w-12 bg-[#FF6501] rounded-full"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <ServiceCard icon={FileText} title="2ª Via de Boleto" color="bg-blue-500" />
                <ServiceCard icon={Car} title="Reboque 24h" color="bg-orange-500" />
                <ServiceCard icon={ShieldAlert} title="Informe Evento" color="bg-rose-500" />
                <ServiceCard icon={Heart} title="Atual Saúde" color="bg-emerald-500" />
            </div>
        </section>

        {/* 6️⃣ BLOCO FALE CONOSCO (CITY CARDS) */}
        <section className="space-y-8">
            <div className="flex flex-col items-center text-center gap-2">
                <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.3em]">Fale Conosco</h2>
                <div className="h-1 w-12 bg-[#FF6501] rounded-full"></div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unidade Rio de Janeiro</span>
                </div>
                <CityContact city="Rio de Janeiro" phone="(21) 3268-3069" />
                <CityContact city="WhatsApp Oficial" phone="+55 21 99999-9999" isWhatsApp />
                
                <div className="pt-4 flex items-center gap-3 px-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unidade Minas Gerais</span>
                </div>
                <CityContact city="Belo Horizonte" phone="(31) 3360-1550" />
            </div>
        </section>

        {/* 7️⃣ RODAPÉ PREMIUM MINIMALISTA */}
        <footer className="pt-16 pb-12 text-center border-t border-gray-100 dark:border-gray-800 opacity-60">
            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building size={20} className="text-gray-400" />
            </div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">
                Atual Clube de Benefícios
            </p>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                CNPJ: 26.198.696/0001-04
            </p>
            <p className="text-[7px] text-gray-300 dark:text-gray-600 mt-8 font-medium">
                © 2024 Todos os direitos reservados.
            </p>
        </footer>

      </main>

      <style>{`
        @keyframes premium-glow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.2); }
        }
        .animate-premium-glow {
          animation: premium-glow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
