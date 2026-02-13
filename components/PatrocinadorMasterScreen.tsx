
import React from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Building2, 
  Phone, 
  MessageSquare, 
  Globe, 
  Instagram, 
  Award,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Car,
  Heart
} from 'lucide-react';

interface PatrocinadorMasterScreenProps {
  onBack: () => void;
}

export const PatrocinadorMasterScreen: React.FC<PatrocinadorMasterScreenProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans pb-32 animate-in slide-in-from-bottom duration-500 overflow-x-hidden">
      
      {/* Hero Header */}
      <div className="relative h-[45vh] w-full bg-[#1e293b] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop" 
          alt="Clube de Benefícios" 
          className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        
        {/* Navigation */}
        <div className="absolute top-12 left-6 z-20">
          <button 
            onClick={onBack}
            className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white active:scale-90 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        {/* Floating Brand Card */}
        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-[2.5rem] p-4 shadow-2xl mb-6 border-4 border-[#FF6501] flex items-center justify-center">
                <span className="text-[#FF6501] font-black text-3xl">AC</span>
            </div>
            <h1 className="text-4xl font-black text-white text-center uppercase tracking-tighter leading-none mb-2">
                Atual Clube
            </h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-[#FF6501] rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                <Award size={12} /> Patrocinador Master Localizei
            </div>
        </div>
      </div>

      <div className="px-6 py-12 space-y-12">
        
        {/* Sobre Section */}
        <section className="space-y-4">
            <h2 className="text-[10px] font-black text-[#FF6501] uppercase tracking-[0.3em] ml-1">Quem Somos</h2>
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                <ShieldCheck className="absolute -right-8 -bottom-8 w-40 h-40 text-orange-100 dark:text-gray-800 opacity-20 transform -rotate-12" />
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed font-medium relative z-10">
                    O <strong>Atual Clube</strong> é a maior associação de benefícios de Jacarepaguá, focada em entregar tranquilidade e economia para você e sua família. <br/><br/>
                    Especialistas em proteção veicular e parcerias estratégicas, oferecemos uma rede completa de vantagens que transformam o dia a dia dos nossos associados.
                </p>
            </div>
        </section>

        {/* Pilares de Atuação */}
        <section className="space-y-6">
            <h2 className="text-[10px] font-black text-[#FF6501] uppercase tracking-[0.3em] ml-1">Nossos Diferenciais</h2>
            <div className="grid gap-4">
                {[
                    { title: 'Proteção Veicular 24h', desc: 'Assistência completa e socorro em qualquer lugar.', icon: Car },
                    { title: 'Clube de Vantagens', desc: 'Descontos reais em mais de 500 estabelecimentos.', icon: Heart },
                    { title: 'Atendimento Humanizado', desc: 'Suporte local e ágil para todas as suas necessidades.', icon: Users }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-5 p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-[#FF6501] shrink-0">
                            <item.icon size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                            <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Contato Section */}
        <section className="space-y-6">
            <h2 className="text-[10px] font-black text-[#FF6501] uppercase tracking-[0.3em] ml-1">Seja um Associado</h2>
            <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center p-8 bg-emerald-50 dark:bg-emerald-950/20 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-800 text-emerald-600 active:scale-95 transition-all">
                    <MessageSquare size={32} className="mb-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp</span>
                </button>
                <button className="flex flex-col items-center justify-center p-8 bg-orange-50 dark:bg-orange-950/20 rounded-[2.5rem] border border-orange-100 dark:border-orange-800 text-[#FF6501] active:scale-95 transition-all">
                    <Phone size={32} className="mb-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Ligar</span>
                </button>
            </div>
            
            <button className="w-full py-5 rounded-[2rem] bg-[#FF6501] text-white font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95">
                <Globe size={18} />
                Conhecer Planos
            </button>
        </section>

      </div>

      <div className="mt-12 text-center opacity-30 px-10">
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] leading-relaxed">
          Atual Clube • Clube de Benefícios <br/> Patrocinador Estratégico Localizei JPA
        </p>
      </div>
    </div>
  );
};
