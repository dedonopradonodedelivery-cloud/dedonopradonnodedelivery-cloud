
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  Eye, 
  User, 
  MousePointerClick, 
  BarChart, 
  Clock, 
  Tag, 
  Sparkles, 
  Star, 
  Award, 
  Newspaper, 
  MessageSquare, 
  CheckCircle2,
  ThumbsUp,
  Flame,
  ArrowRight,
  Home,
  LayoutGrid,
  MapPin,
  Ticket,
  Heart // Added Heart import
} from 'lucide-react';

interface MerchantPerformanceDashboardViewProps {
  onBack: () => void;
}

// --- MOCK DE DADOS DO DASHBOARD ---
const MOCK_DASHBOARD_DATA = {
  storeName: "Hamburgueria Brasa",
  logoUrl: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=200&auto=format&fit=crop",
  overallScore: 8.5, // 0-10
  currentWeek: {
    views: 1250,
    visits: 820,
    clicks: 110,
    favorites: 35,
    couponsViewed: 80,
    couponsUsed: 15,
    postsPublished: 3,
    postEngagement: 250, // likes/comments combined
    reviewsReceived: 5,
    averageRating: 4.8,
  },
  lastWeek: {
    views: 1000,
    visits: 650,
    clicks: 90,
    favorites: 28,
    couponsViewed: 60,
    couponsUsed: 10,
    postsPublished: 2,
    postEngagement: 180,
    reviewsReceived: 3,
    averageRating: 4.5,
  },
  trafficSources: {
    home: 40,
    categories: 25,
    bairroPosts: 15,
    coupons: 10,
    banners: 10,
  },
  dailyPerformance: [
    { day: 'Seg', views: 150, clicks: 15 },
    { day: 'Ter', views: 200, clicks: 20 },
    { day: 'Qua', views: 250, clicks: 25 },
    { day: 'Qui', views: 300, clicks: 30 },
    { day: 'Sex', views: 350, clicks: 40 },
    { day: 'Sáb', views: 400, clicks: 45 },
    { day: 'Dom', views: 280, clicks: 20 },
  ],
  hourlyPerformance: [
    { hour: '09h', visits: 30 }, { hour: '10h', visits: 50 }, { hour: '11h', visits: 70 },
    { hour: '12h', visits: 120 }, { hour: '13h', visits: 100 }, { hour: '14h', visits: 80 },
    { hour: '15h', visits: 60 }, { hour: '16h', visits: 50 }, { hour: '17h', visits: 40 },
    { hour: '18h', visits: 30 }, { hour: '19h', visits: 20 }, { hour: '20h', visits: 10 },
  ],
  recentActivity: [
    { type: 'post', desc: 'Publicou "Novidade no cardápio!"', date: '5m' },
    { type: 'coupon_used', desc: 'Cupom de 10% usado por Maria S.', date: '1h' },
    { type: 'review', desc: 'Recebeu 5 estrelas de João C.', date: '3h' },
    { type: 'post', desc: 'Compartilhou "Bastidores da Cozinha!"', date: '1d' },
  ],
  achievements: [
    { id: 'top_views_week', name: 'Mais Vista da Semana', icon: Eye, color: 'bg-indigo-500' },
    { id: 'high_rating', name: 'Super Aprovada', icon: Star, color: 'bg-amber-500' },
    { id: 'coupon_master', name: 'Mestra em Cupons', icon: Tag, color: 'bg-emerald-500' },
    { id: 'community_star', name: 'Voz do Bairro', icon: Newspaper, color: 'bg-purple-500' },
  ]
};

// --- SUB-COMPONENTES DE VISUALIZAÇÃO ---

// 1. Cartão Grande (Retangular)
const StatCard: React.FC<{ icon: React.ElementType; title: string; value: string | number; color: string; bgColor: string }> = ({ icon: Icon, title, value, color, bgColor }) => (
  <div className={`rounded-3xl p-6 shadow-lg relative overflow-hidden flex flex-col justify-between h-36 ${bgColor} text-${color}-900`}>
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
      <Icon className={`w-16 h-16 text-${color}-900`} />
    </div>
    <p className={`text-[10px] font-black uppercase tracking-widest text-${color}-800 mb-1`}>{title}</p>
    <h3 className="text-4xl font-black text-white leading-none">{value}</h3>
    <Icon className={`w-10 h-10 text-${color}-900 absolute bottom-3 right-3 opacity-20`} />
  </div>
);

// 2. Círculo / Medidor (Radial)
const RadialProgressCard: React.FC<{ title: string; value: number; unit: string; delta?: number; color: string }> = ({ title, value, unit, delta, color }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const arrow = delta && delta > 0 ? '▲' : delta && delta < 0 ? '▼' : '';
  const deltaColor = delta && delta > 0 ? 'text-emerald-500' : delta && delta < 0 ? 'text-rose-500' : 'text-gray-500';

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center relative overflow-hidden group">
      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">{title}</h3>
      <div className="relative w-28 h-28 mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle className="text-gray-200" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="50%" cy="50%" />
          <circle
            className={`text-${color}-500 transition-all duration-1000 ease-out`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">
            {value}<span className="text-sm font-medium">{unit}</span>
          </p>
        </div>
      </div>
      {delta !== undefined && (
        <p className={`text-xs font-bold ${deltaColor} flex items-center gap-1`}>
          {arrow} {Math.abs(delta).toFixed(0)}% <span className="text-gray-500 dark:text-gray-400 text-[10px] normal-case">vs sem. passada</span>
        </p>
      )}
    </div>
  );
};

// 3. Gráfico de Pizza (Fatias)
const PieChartCard: React.FC<{ title: string; data: { label: string; value: number; icon: React.ElementType; color: string }[] }> = ({ title, data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativeAngle = 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">{title}</h3>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {data.map((item, index) => {
              const startAngle = cumulativeAngle;
              const endAngle = cumulativeAngle + (item.value / total) * 360;
              cumulativeAngle = endAngle;

              const x1 = 50 + 50 * Math.cos(Math.PI * startAngle / 180);
              const y1 = 50 + 50 * Math.sin(Math.PI * startAngle / 180);
              const x2 = 50 + 50 * Math.cos(Math.PI * endAngle / 180);
              const y2 = 50 + 50 * Math.sin(Math.PI * endAngle / 180);

              const largeArcFlag = item.value / total > 0.5 ? 1 : 0;

              return (
                <path
                  key={index}
                  d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={item.color}
                  className="transition-all duration-500 ease-out hover:opacity-80"
                />
              );
            })}
          </svg>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <Icon className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{item.label}</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{(item.value / total * 100).toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 4. Barras Simples (Vertical ou Horizontal)
const BarChartCard: React.FC<{ title: string; data: { label: string; value: number; color: string }[]; horizontal?: boolean; maxValue?: number }> = ({ title, data, horizontal = false, maxValue }) => {
  const max = maxValue || Math.max(...data.map(d => d.value), 0) * 1.2;
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">{title}</h3>
      <div className={`flex ${horizontal ? 'flex-col gap-3' : 'gap-2 items-end h-40'}`}>
        {data.map((item, index) => {
          const barSize = (item.value / max) * 100;
          return (
            <div key={index} className={`${horizontal ? 'flex items-center gap-3' : 'flex-1 flex flex-col items-center justify-end h-full'}`}>
              {!horizontal && <span className="text-[10px] text-gray-500 rotate-90 origin-bottom-left whitespace-nowrap -mb-10 block">{item.label}</span>}
              <div className={`rounded-md ${item.color} transition-all duration-700 ease-out`} style={{ [horizontal ? 'width' : 'height']: `${barSize}%`, [horizontal ? 'height' : 'width']: horizontal ? '16px' : 'auto' }}></div>
              {horizontal && <span className="text-sm font-bold text-gray-900 dark:text-white">{item.label}</span>}
              {!horizontal && <span className="text-[10px] text-gray-500 mt-2">{item.value}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 5. Badges / Selos
const AchievementBadge: React.FC<{ icon: React.ElementType; name: string; color: string }> = ({ icon: Icon, name, color }) => (
  <div className={`rounded-xl p-3 ${color} shadow-lg shadow-${color}-500/20 text-white flex items-center gap-3 active:scale-95 transition-transform group`}>
    <Icon className="w-7 h-7 text-white" />
    <span className="font-bold text-sm leading-tight">{name}</span>
  </div>
);

// 6. Linha do Tempo (Simplificada)
const TimelineCard: React.FC<{ title: string; activities: { type: string; desc: string; date: string }[] }> = ({ title, activities }) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm relative">
    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">{title}</h3>
    <div className="relative pl-4">
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div> {/* Linha */}
      {activities.map((activity, index) => {
        let IconComponent: React.ElementType = CheckCircle2;
        let iconColor = 'text-gray-500';

        switch (activity.type) {
          case 'post': IconComponent = Newspaper; iconColor = 'text-purple-500'; break;
          case 'coupon_used': IconComponent = Tag; iconColor = 'text-blue-500'; break;
          case 'review': IconComponent = Star; iconColor = 'text-amber-500'; break;
        }

        return (
          <div key={index} className="mb-6 flex items-start gap-4 relative last:mb-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-white dark:border-gray-800 bg-white dark:bg-gray-700 ${iconColor} z-10 -ml-2`}>
              <IconComponent size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{activity.desc}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{activity.date}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL DO DASHBOARD ---
export const MerchantPerformanceDashboardView: React.FC<MerchantPerformanceDashboardViewProps> = ({ onBack }) => {
  const current = MOCK_DASHBOARD_DATA.currentWeek;
  const last = MOCK_DASHBOARD_DATA.lastWeek;

  // Calculos de Delta para Radial Progress
  const calculateDelta = (currentValue: number, lastValue: number) => {
    if (lastValue === 0) return currentValue > 0 ? 100 : 0;
    return ((currentValue - lastValue) / lastValue) * 100;
  };

  const viewsDelta = calculateDelta(current.views, last.views);
  const clicksDelta = calculateDelta(current.clicks, last.clicks);
  const reviewsDelta = calculateDelta(current.reviewsReceived, last.reviewsReceived);
  const ratingDelta = current.averageRating - last.averageRating;
  const couponsUsedDelta = calculateDelta(current.couponsUsed, last.couponsUsed);

  // Dados para Gráfico de Barras Diário
  const dailyBarData = MOCK_DASHBOARD_DATA.dailyPerformance.map(d => ({
    label: d.day,
    value: d.views,
    color: 'bg-blue-500',
  }));

  // Dados para Gráfico de Barras Horário
  const hourlyBarData = MOCK_DASHBOARD_DATA.hourlyPerformance.map(d => ({
    label: d.hour,
    value: d.visits,
    color: 'bg-indigo-500',
  }));

  // Dados para Gráfico de Pizza
  const pieChartData = [
    { label: 'Home', value: MOCK_DASHBOARD_DATA.trafficSources.home, icon: Home, color: 'hsl(220, 80%, 60%)' },
    { label: 'Categorias', value: MOCK_DASHBOARD_DATA.trafficSources.categories, icon: LayoutGrid, color: 'hsl(270, 70%, 50%)' },
    { label: 'Posts', value: MOCK_DASHBOARD_DATA.trafficSources.bairroPosts, icon: Newspaper, color: 'hsl(10, 80%, 60%)' },
    { label: 'Cupons', value: MOCK_DASHBOARD_DATA.trafficSources.coupons, icon: Ticket, color: 'hsl(160, 60%, 45%)' },
    { label: 'Banners', value: MOCK_DASHBOARD_DATA.trafficSources.banners, icon: MapPin, color: 'hsl(40, 90%, 60%)' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-gray-950 font-sans flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div>
          <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Desempenho da Loja</h1>
          <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1">Visão completa e inteligente</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-12 pb-24">
        
        {/* BOAS-VINDAS / FOCO */}
        <section className="text-center bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800/50 shadow-md">
          <img src={MOCK_DASHBOARD_DATA.logoUrl} alt={MOCK_DASHBOARD_DATA.storeName} className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-white dark:border-gray-800 shadow-lg" />
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 leading-tight">Olá, {MOCK_DASHBOARD_DATA.storeName}!</h2>
          <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed font-medium max-w-sm mx-auto">
            Veja como o seu negócio está crescendo no Localizei JPA.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-full text-indigo-700 dark:text-indigo-300 text-xs font-bold">
            <Sparkles size={14} className="fill-current" />
            <span>Seu Ecossistema Local</span>
          </div>
        </section>

        {/* 1. CARTÕES GRANDES (RETANGULARES) */}
        <section>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 ml-1">Seus números da semana</h3>
          <div className="grid grid-cols-2 gap-4">
            <StatCard 
              icon={Eye} 
              title="Pessoas que viram" 
              value={current.views.toLocaleString()} 
              color="blue" 
              bgColor="bg-blue-500"
            />
            <StatCard 
              icon={User} 
              title="Visitas ao perfil" 
              value={current.visits.toLocaleString()} 
              color="emerald" 
              bgColor="bg-emerald-500"
            />
            <StatCard 
              icon={MousePointerClick} 
              title="Cliques na loja" 
              value={current.clicks.toLocaleString()} 
              color="purple" 
              bgColor="bg-purple-500"
            />
            <StatCard 
              icon={Heart} 
              title="Clientes que favoritaram" 
              value={current.favorites.toLocaleString()} 
              color="rose" 
              bgColor="bg-rose-500"
            />
          </div>
        </section>

        {/* 2. CÍRCULOS / MEDIDORES (RADIAL) */}
        <section>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 ml-1">Seu crescimento no bairro</h3>
          <div className="grid grid-cols-2 gap-4">
            <RadialProgressCard 
              title="Visualizações" 
              value={Math.min(100, Math.max(0, 50 + viewsDelta / 2))} // Ajuste para valor de 0-100
              unit="%" 
              delta={viewsDelta} 
              color="blue" 
            />
            <RadialProgressCard 
              title="Cliques na loja" 
              value={Math.min(100, Math.max(0, 50 + clicksDelta / 2))}
              unit="%" 
              delta={clicksDelta} 
              color="purple" 
            />
            <RadialProgressCard 
              title="Cupons usados" 
              value={Math.min(100, Math.max(0, 50 + couponsUsedDelta / 2))}
              unit="%" 
              delta={couponsUsedDelta} 
              color="emerald" 
            />
            <RadialProgressCard 
              title="Nota média" 
              value={MOCK_DASHBOARD_DATA.overallScore * 10} // Converter para 0-100
              unit="p" 
              delta={ratingDelta * 10} // Ajustar delta para escala
              color="amber" 
            />
          </div>
        </section>

        {/* 3. GRÁFICO DE PIZZA (FATIAS) */}
        <section>
          <PieChartCard 
            title="De onde vêm os clientes interessados?" 
            data={pieChartData} 
          />
        </section>

        {/* 4. BARRAS SIMPLES (VERTICAL OU HORIZONTAL) */}
        <section>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 ml-1">Quando sua loja brilha mais</h3>
          <div className="grid grid-cols-1 gap-8">
            <BarChartCard 
              title="Melhores dias da semana" 
              data={dailyBarData} 
              horizontal={true}
              maxValue={Math.max(...MOCK_DASHBOARD_DATA.dailyPerformance.map(d => d.views))}
            />
            <BarChartCard 
              title="Horários de pico de visitas" 
              data={hourlyBarData} 
              horizontal={true}
              maxValue={Math.max(...MOCK_DASHBOARD_DATA.hourlyPerformance.map(d => d.visits))}
            />
          </div>
        </section>
        
        {/* 5. BADGES / SELOS */}
        <section>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 ml-1">Suas conquistas no app</h3>
          <div className="grid grid-cols-2 gap-4">
            {MOCK_DASHBOARD_DATA.achievements.map((ach, index) => (
              <AchievementBadge key={index} icon={ach.icon} name={ach.name} color={ach.color} />
            ))}
             <AchievementBadge icon={CheckCircle2} name="Lojista Verificado" color="bg-blue-600" />
             <AchievementBadge icon={ThumbsUp} name="Recomendada por Vizinhos" color="bg-emerald-600" />
             <AchievementBadge icon={Flame} name="Foco Total no Bairro" color="bg-rose-600" />
          </div>
        </section>

        {/* 6. LINHA DO TEMPO (SIMPLIFICADA) */}
        <section>
          <TimelineCard 
            title="Sua linha do tempo no app" 
            activities={MOCK_DASHBOARD_DATA.recentActivity} 
          />
        </section>

        {/* CTA FINAL */}
        <section className="text-center bg-gray-100 dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-200 dark:border-gray-700 shadow-sm">
            <ArrowRight className="w-8 h-8 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Quer mais clientes?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
                Explore novas formas de aparecer no app e multiplique suas vendas no bairro.
            </p>
            <button 
              onClick={() => { /* Navegar para módulo de anúncios */ }}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mx-auto"
            >
              Impulsionar Loja <ArrowRight size={18} />
            </button>
        </section>

      </main>
    </div>
  );
};
