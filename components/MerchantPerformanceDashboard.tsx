
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  BarChart3, 
  Eye, 
  User, 
  Phone, 
  TrendingUp, 
  PieChart, 
  Star, 
  Flame, 
  Send, 
  Tag, 
  Calendar,
  Sparkles,
  CheckCircle2,
  Trophy,
  MapPin,
  MousePointerClick,
  MessageSquare,
  Heart,
  Crown,
  LayoutGrid,
  Home,
  Clock,
  Zap,
  Award,
  Bell,
  // Added ChevronRight and Users to fix "Cannot find name" errors
  ChevronRight,
  Users
} from 'lucide-react';

interface MerchantPerformanceDashboardProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

// Auxiliar para formatar números e animá-los
const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 800;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
};

// Card Pequeno de Métrica
const MetricItem: React.FC<{ icon: React.ElementType, label: string, value: number, color: string }> = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-2">
    <div className={`w-8 h-8 rounded-xl ${color} bg-opacity-10 flex items-center justify-center`}>
      <Icon size={16} className={color.replace('bg-', 'text-')} />
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-xl font-black text-gray-900 dark:text-white">
        <AnimatedNumber value={value} />
      </p>
    </div>
  </div>
);

export const MerchantPerformanceDashboard: React.FC<MerchantPerformanceDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'destaques'>('geral');

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-500">
      {/* Header Fixo */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-6 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <button 
          onClick={onBack} 
          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 transition-all active:scale-90"
        >
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
            Minha Loja
          </h1>
          <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Desempenho e Resultados</p>
        </div>
      </header>

      <main className="p-6 space-y-10">
        
        {/* SELETOR DE VISÃO */}
        <div className="flex bg-gray-100 dark:bg-gray-900 p-1.5 rounded-[2rem] border border-gray-200 dark:border-gray-800">
          <button 
            onClick={() => setActiveTab('geral')}
            className={`flex-1 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'geral' ? 'bg-white dark:bg-gray-800 text-[#1E5BFF] shadow-lg' : 'text-gray-400'}`}
          >
            Visão Geral
          </button>
          <button 
            onClick={() => setActiveTab('destaques')}
            className={`flex-1 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'destaques' ? 'bg-white dark:bg-gray-800 text-[#1E5BFF] shadow-lg' : 'text-gray-400'}`}
          >
            Meus Destaques
          </button>
        </div>

        {activeTab === 'geral' ? (
          <>
            {/* 1️⃣ VISIBILIDADE — QUEM TE VIU */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <Eye size={18} className="text-blue-500" />
                <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Muita gente te viu aqui 👀</h2>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-[3rem] text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">Total de Visualizações</p>
                <h3 className="text-5xl font-black tracking-tighter"><AnimatedNumber value={2480} /></h3>
                <p className="text-xs font-bold mt-4 text-blue-100 flex items-center gap-2">
                   <TrendingUp size={14} /> +15% mais que na semana passada
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MetricItem icon={Home} label="Viram na Home" value={1240} color="bg-blue-500" />
                <MetricItem icon={LayoutGrid} label="Nas Categorias" value={850} color="bg-purple-500" />
                <MetricItem icon={MapPin} label="Acharam no Mapa" value={145} color="bg-emerald-500" />
                <MetricItem icon={Tag} label="Nos Cupons" value={245} color="bg-amber-500" />
              </div>
            </section>

            {/* 2️⃣ INTERESSE — QUEM CLICOU */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <MousePointerClick size={18} className="text-indigo-500" />
                <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Interesse pela sua loja 👍</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <MetricItem icon={User} label="Abriram seu perfil" value={420} color="bg-indigo-500" />
                <MetricItem icon={Heart} label="Te favoritaram" value={38} color="bg-rose-500" />
                <MetricItem icon={Bell} label="Nas Notificações" value={92} color="bg-orange-500" />
                <MetricItem icon={Clock} label="Verificaram Horários" value={110} color="bg-slate-500" />
              </div>
            </section>

            {/* 3️⃣ AÇÃO — QUEM FEZ ALGO DE VERDADE */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <Zap size={18} className="text-amber-500" />
                <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Contatos com você 🚀</h2>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 bg-opacity-10 rounded-2xl flex items-center justify-center text-green-600">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <p className="text-xl font-black text-gray-900 dark:text-white"><AnimatedNumber value={85} /></p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Chamaram no WhatsApp</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-300" />
                </div>
                
                <div className="h-px bg-gray-50 dark:bg-gray-800"></div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 bg-opacity-10 rounded-2xl flex items-center justify-center text-blue-600">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <p className="text-xl font-black text-gray-900 dark:text-white"><AnimatedNumber value={12} /></p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Salvaram seu Cupom</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-300" />
                </div>

                <div className="h-px bg-gray-50 dark:bg-gray-800"></div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500 bg-opacity-10 rounded-2xl flex items-center justify-center text-amber-600">
                      <Trophy size={24} />
                    </div>
                    <div>
                      <p className="text-xl font-black text-gray-900 dark:text-white"><AnimatedNumber value={8} /></p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Te deram Nota 5 ⭐</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-300" />
                </div>
              </div>
            </section>
          </>
        ) : (
          /* PERFORMANCE DE CAMPANHAS */
          <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
              <Crown size={18} className="text-amber-500" />
              <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Onde você mais aparece</h2>
            </div>

            {/* GRÁFICO DE ORIGEM (REPRESENTAÇÃO VISUAL) */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
              <div className="relative w-48 h-48 mb-8">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#eee" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#1E5BFF" strokeWidth="3" strokeDasharray="45 100" />
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#9333EA" strokeWidth="3" strokeDasharray="30 100" strokeDashoffset="-45" />
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="25 100" strokeDashoffset="-75" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <p className="text-2xl font-black text-gray-900 dark:text-white">Home</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Destaque</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#1E5BFF]"></div><span className="text-[10px] font-bold text-gray-500 uppercase">Banner Home</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#9333EA]"></div><span className="text-[10px] font-bold text-gray-500 uppercase">Categorias</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></div><span className="text-[10px] font-bold text-gray-500 uppercase">Patrocinado</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div><span className="text-[10px] font-bold text-gray-500 uppercase">Orgânico</span></div>
              </div>
            </div>

            {/* ESPECÍFICO POR CANAL PAGO */}
            <div className="space-y-4">
               <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border-l-4 border-l-amber-500 shadow-sm">
                  <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">Banner Home</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-[8px] font-black text-gray-400 uppercase mb-1">Viram você</p><p className="text-xl font-black text-gray-900 dark:text-white">12.4k</p></div>
                    <div><p className="text-[8px] font-black text-gray-400 uppercase mb-1">Clicaram</p><p className="text-xl font-black text-[#1E5BFF]">342</p></div>
                  </div>
               </div>

               <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border-l-4 border-l-blue-500 shadow-sm">
                  <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">Destaque Patrocinado</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-[8px] font-black text-gray-400 uppercase mb-1">Viram você</p><p className="text-xl font-black text-gray-900 dark:text-white">4.8k</p></div>
                    <div><p className="text-[8px] font-black text-gray-400 uppercase mb-1">Clicaram</p><p className="text-xl font-black text-[#1E5BFF]">185</p></div>
                  </div>
               </div>
            </div>
          </section>
        )}

        {/* 6️⃣ TEMPO & PADRÃO — QUANDO ACONTECE */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <Calendar size={18} className="text-rose-500" />
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Seu melhor dia foi sábado 🔥</h2>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-end justify-between h-32 gap-2">
              {[
                { d: 'S', h: '30%' }, { d: 'T', h: '45%' }, { d: 'Q', h: '40%' }, 
                { d: 'Q', h: '60%' }, { d: 'S', h: '85%' }, { d: 'S', h: '100%', best: true }, 
                { d: 'D', h: '75%' }
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className={`w-full rounded-full transition-all duration-1000 ${bar.best ? 'bg-[#1E5BFF]' : 'bg-gray-100 dark:bg-gray-800'}`} 
                    style={{ height: bar.h }}
                  ></div>
                  <span className={`text-[8px] font-black ${bar.best ? 'text-blue-600' : 'text-gray-400'}`}>{bar.d}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="flex flex-col items-center">
                <p className="text-2xl font-black text-gray-900 dark:text-white">18h - 21h</p>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Horário mais forte</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7️⃣ CONQUISTAS & STATUS — PARTE EMOCIONAL */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <Award size={18} className="text-purple-500" />
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Sua jornada no bairro</h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-900 aspect-square rounded-[2rem] border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center p-3 text-center shadow-sm">
              <div className="p-3 bg-amber-500 bg-opacity-10 rounded-2xl text-amber-500 mb-2">
                <Trophy size={20} />
              </div>
              <p className="text-[8px] font-black text-gray-800 dark:text-white uppercase leading-tight">Loja em Alta</p>
            </div>
            <div className="bg-white dark:bg-gray-900 aspect-square rounded-[2rem] border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center p-3 text-center shadow-sm">
              <div className="p-3 bg-emerald-50 bg-opacity-10 rounded-2xl text-emerald-500 mb-2">
                <Star size={20} />
              </div>
              <p className="text-[8px] font-black text-gray-800 dark:text-white uppercase leading-tight">Bem Avaliada</p>
            </div>
            <div className="bg-white dark:bg-gray-900 aspect-square rounded-[2rem] border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center p-3 text-center shadow-sm opacity-30 grayscale">
              <div className="p-3 bg-blue-50 bg-opacity-10 rounded-2xl text-blue-500 mb-2">
                <Users size={20} />
              </div>
              <p className="text-[8px] font-black text-gray-800 dark:text-white uppercase leading-tight">Líder do Bairro</p>
            </div>
          </div>
        </section>

        {/* 8️⃣ LINHA DO TEMPO — O QUE ACONTECEU */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <Clock size={18} className="text-slate-500" />
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">O que aconteceu recentemente</h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            {[
              { icon: Star, color: 'text-amber-500 bg-amber-50', text: 'Você recebeu uma nova nota 5! ⭐', time: 'Há 2 horas' },
              { icon: MessageSquare, color: 'text-blue-500 bg-blue-50', text: 'Alguém te chamou no WhatsApp 📲', time: 'Há 5 horas' },
              { icon: Tag, color: 'text-purple-500 bg-purple-50', text: 'Um novo cupom foi salvo por um vizinho 🎁', time: 'Ontem' },
              { icon: Trophy, color: 'text-amber-500 bg-amber-50', text: 'Conquista alcançada: Loja em Alta! 🏆', time: 'Há 2 dias' },
            ].map((event, i) => (
              <div key={i} className={`p-5 flex items-center gap-4 ${i !== 3 ? 'border-b border-gray-50 dark:border-gray-800' : ''}`}>
                <div className={`w-10 h-10 rounded-xl ${event.color} dark:bg-opacity-10 flex items-center justify-center shrink-0`}>
                  <event.icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{event.text}</p>
                  <p className="text-[9px] text-gray-400 font-medium uppercase mt-0.5">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RODAPÉ EDUCATIVO */}
        <div className="py-10 text-center opacity-40">
           <BarChart3 size={24} className="mx-auto text-gray-400 mb-2" />
           <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] leading-relaxed">
             Localizei JPA • Dados em tempo real <br/> v1.5.0
           </p>
        </div>

      </main>
    </div>
  );
};
