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
  MapPin
} from 'lucide-react';

interface PatrocinadorMasterScreenProps {
  onBack: () => void;
}

export const PatrocinadorMasterScreen: React.FC<PatrocinadorMasterScreenProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-32 animate-in slide-in-from-bottom duration-500 overflow-x-hidden">
      
      {/* Hero Header */}
      <div className="relative h-[45vh] w-full bg-slate-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop" 
          alt="Holding Business" 
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
            <div className="w-24 h-24 bg-white rounded-[2.5rem] p-4 shadow-2xl mb-6 border-4 border-slate-800">
                <img src="https://ui-avatars.com/api/?name=Grupo+Esquematiza&background=1E5BFF&color=fff&size=128" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-black text-white text-center uppercase tracking-tighter leading-none mb-2">
                Grupo Esquematiza
            </h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-400 rounded-full text-slate-900 text-[10px] font-black uppercase tracking-widest shadow-lg">
                <Award size={12} /> Patrocinador Master Localizei
            </div>
        </div>
      </div>

      <div className="px-6 py-12 space-y-12">
        
        {/* Sobre Section */}
        <section className="space-y-4">
            <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] ml-1">Institucional</h2>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-sm relative overflow-hidden">
                <Building2 className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 opacity-10 transform -rotate-12" />
                <p className="text-slate-300 text-base leading-relaxed font-medium relative z-10">
                    O Grupo Esquematiza é uma holding especializada em soluções integradas de facilities, segurança e gestão patrimonial em Jacarepaguá. <br/><br/>
                    Com décadas de experiência no mercado carioca, lideramos operações complexas que garantem a tranquilidade de milhares de moradores e empresários da região.
                </p>
            </div>
        </section>

        {/* Pilares de Atuação */}
        <section className="space-y-6">
            <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] ml-1">Principais Soluções</h2>
            <div className="grid gap-4">
                {[
                    { title: 'Segurança Patrimonial', desc: 'Proteção 24h com tecnologia de ponta.', icon: ShieldCheck },
                    { title: 'Gestão de Facilities', desc: 'Limpeza, conservação e manutenção predial.', icon: CheckCircle2 },
                    { title: 'Tecnologia Aplicada', desc: 'Monitoramento inteligente e controle de acesso.', icon: Globe }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-5 p-6 bg-slate-900 rounded-3xl border border-white/5 shadow-sm">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/20">
                            <item.icon size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">{item.title}</h4>
                            <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Contato Section */}
        <section className="space-y-6">
            <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] ml-1">Atendimento ao Cliente</h2>
            <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center p-8 bg-emerald-500/10 rounded-[2.5rem] border border-emerald-500/20 text-emerald-400 active:scale-95 transition-all">
                    <MessageSquare size={32} className="mb-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp</span>
                </button>
                <button className="flex flex-col items-center justify-center p-8 bg-blue-500/10 rounded-[2.5rem] border border-blue-500/20 text-blue-400 active:scale-95 transition-all">
                    <Phone size={32} className="mb-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Ligar</span>
                </button>
            </div>
            
            <button className="w-full py-5 rounded-[2rem] bg-white text-slate-900 font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
                <Globe size={18} />
                Visitar Site Oficial
            </button>
        </section>

        {/* Localização */}
        <section className="space-y-4">
             <div className="flex items-center gap-3 p-6 bg-slate-900 border border-white/5 rounded-3xl text-slate-400 shadow-sm">
                <MapPin size={20} className="shrink-0 text-blue-500" />
                <p className="text-xs font-bold leading-relaxed">
                    Sede Administrativa: Rua Tirol, 560 - Freguesia <br/> Jacarepaguá, Rio de Janeiro - RJ
                </p>
             </div>
        </section>

      </div>

      <div className="mt-12 text-center opacity-30 px-10">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] leading-relaxed">
          Grupo Esquematiza Holding <br/> Parceiro Estratégico Localizei JPA
        </p>
      </div>
    </div>
  );
};
