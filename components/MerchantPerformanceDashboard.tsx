
import React from 'react';
import {
  ChevronLeft,
  BarChart3,
  Eye, // Ícone para visualizações
  MousePointerClick, // Ícone para cliques
  Gift, // Ícone para cupons resgatados
  PieChart as PieChartIcon, // Novo ícone para o gráfico circular
  CalendarDays, // Novo ícone para as barras
  Sparkles, // Ícone para selo "Loja ativa"
  Award, // Ícone para selo "Boa avaliação"
} from 'lucide-react';

interface MerchantPerformanceDashboardProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

// Componente para um cartão de KPI grande
const KpiCard: React.FC<{
  icon: React.ElementType;
  value: string;
  label: string;
  colorClass: string;
}> = ({ icon: Icon, value, label, colorClass }) => (
  <div className={`flex flex-col items-center p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm transition-colors ${colorClass}`}>
    <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mb-4 shadow-md">
      <Icon className="w-8 h-8 text-gray-700 dark:text-gray-200" />
    </div>
    <p className="text-4xl font-black text-gray-900 dark:text-white leading-tight mb-2">
      {value}
    </p>
    <p className="text-sm font-bold text-gray-700 dark:text-gray-200 text-center leading-snug">
      {label}
    </p>
  </div>
);

// Componente para a comparação semanal
const WeeklyComparisonBlock: React.FC<{ text: string; isPositive: boolean }> = ({ text, isPositive }) => (
  <div className={`p-5 rounded-[2.5rem] border ${
    isPositive 
      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30' 
      : 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800/30'
  } shadow-sm flex items-center gap-4`}>
    {isPositive ? (
      <Eye className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
    ) : (
      <Eye className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
    )}
    <p className={`text-sm font-bold ${
      isPositive 
        ? 'text-emerald-800 dark:text-emerald-200' 
        : 'text-rose-800 dark:text-rose-200'
    } leading-relaxed`}>
      {text}
    </p>
  </div>
);

// NEW: Componente para o Gráfico Circular (Pizza)
const PieChart: React.FC<{
  data: Array<{ label: string; value: number; color: string }>;
  title: string;
}> = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <PieChartIcon className="w-5 h-5 text-[#1E5BFF]" />
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="relative w-full aspect-square max-w-[200px] mx-auto mb-4">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {data.map((slice, index) => {
            const endAngle = startAngle + (slice.value / total) * 360;
            const largeArcFlag = slice.value / total > 0.5 ? 1 : 0; // For slices > 180 degrees

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = 50 + 50 * Math.cos(startRad);
            const y1 = 50 + 50 * Math.sin(startRad);
            const x2 = 50 + 50 * Math.cos(endRad);
            const y2 = 50 + 50 * Math.sin(endRad);

            const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            // Calculate label position slightly outside the slice
            // Adjusted logic to correctly calculate midAngle for label placement
            const currentMidAngle = startAngle + ((slice.value / total) * 360) / 2;
            const labelRadius = 65; // Adjust this value to move labels further out
            const labelX = 50 + labelRadius * Math.cos((currentMidAngle * Math.PI) / 180);
            const labelY = 50 + labelRadius * Math.sin((currentMidAngle * Math.PI) / 180);


            // Calculate percentage label position, slightly inside
            const percentLabelRadius = 35;
            const percentX = 50 + percentLabelRadius * Math.cos((currentMidAngle * Math.PI) / 180);
            const percentY = 50 + percentLabelRadius * Math.sin((currentMidAngle * Math.PI) / 180);

            startAngle = endAngle; // Update startAngle for the next slice


            return (
              <React.Fragment key={index}>
                <path d={pathData} fill={slice.color} />
                 {/* Label */}
                {slice.value / total > 0.05 && ( // Only show labels for reasonably sized slices
                    <text
                        x={labelX}
                        y={labelY}
                        fill={slice.color}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="6" // Smaller font for SVG text
                        fontWeight="bold"
                    >
                        {slice.label}
                    </text>
                )}
                {/* Percentage */}
                {slice.value / total > 0.05 && (
                    <text
                        x={percentX}
                        y={percentY}
                        fill="#fff" // White color for percentage text
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="5"
                        fontWeight="bold"
                    >
                        {Math.round((slice.value / total) * 100)}%
                    </text>
                )}
              </React.Fragment>
            );
          })}
        </svg>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-medium text-gray-700 dark:text-gray-200">
        {data.map((slice, index) => (
          <div key={index} className="flex items-center gap-2">
            <span style={{ backgroundColor: slice.color }} className="w-3 h-3 rounded-full"></span>
            <span>{slice.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// NEW: Componente para Barras Simples (Visitas por Dia)
const SimpleBarChart: React.FC<{
  data: Array<{ day: string; visits: number }>;
  title: string;
}> = ({ data, title }) => {
  const maxVisits = Math.max(...data.map(item => item.visits));
  const scale = 100 / maxVisits; // Scale to 100 for percentage height

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-[#1E5BFF]" />
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="flex justify-around items-end h-32 space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 h-full relative">
            <div
              className="w-full bg-[#1E5BFF] dark:bg-blue-600 rounded-t-lg transition-all duration-500"
              style={{ height: `${item.visits * scale}%` }}
            ></div>
            <span className="text-[10px] font-bold text-gray-700 dark:text-gray-200 mt-2">
              {item.day}
            </span>
             <span className="absolute top-0 text-[10px] font-bold text-gray-900 dark:text-white" style={{ top: `${100 - (item.visits * scale)}%`, transform: 'translateY(-120%)' }}>
                {item.visits}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// NEW: Componente para Selos Visuais (Badges)
const PerformanceBadge: React.FC<{
  icon: React.ElementType;
  text: string;
  colorClass: string;
}> = ({ icon: Icon, text, colorClass }) => (
  <div className={`p-3 rounded-2xl border ${colorClass} shadow-sm flex items-center gap-3`}>
    <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-inner">
      <Icon className={`w-4 h-4 ${colorClass.replace('bg-', 'text-')}`} />
    </div>
    <span className={`text-xs font-bold ${colorClass.replace('bg-', 'text-')}`}>{text}</span>
  </div>
);

export const MerchantPerformanceDashboard: React.FC<MerchantPerformanceDashboardProps> = ({ onBack, onNavigate }) => {
  // Dados simulados existentes
  const mockViews = 1250;
  const mockClicks = 380;
  const mockCouponsRedeemed = 45;
  const mockComparisonPositive = true;
  const mockComparisonText = mockComparisonPositive
    ? "Essa semana sua loja foi mais vista que na semana passada"
    : "Sua loja teve menos visitas que na semana passada";

  // NEW: Mock Data para o Gráfico Circular (Origem das Visualizações)
  const viewsOriginData = [
    { label: 'Home', value: 400, color: '#1E5BFF' }, // Azul
    { label: 'Categorias', value: 300, color: '#8B5CF6' }, // Roxo
    { label: 'Posts Bairro', value: 200, color: '#F59E0B' }, // Âmbar
    { label: 'Cupons', value: 100, color: '#DC2626' }, // Vermelho
  ];

  // NEW: Mock Data para o Gráfico de Barras (Visitas por Dia)
  const weeklyVisitsData = [
    { day: 'Seg', visits: 120 },
    { day: 'Ter', visits: 150 },
    { day: 'Qua', visits: 100 },
    { day: 'Qui', visits: 180 },
    { day: 'Sex', visits: 200 },
    { day: 'Sáb', visits: 250 },
    { day: 'Dom', visits: 130 },
  ];

  // NEW: Mock Data para Selos Visuais (Badges)
  const activeBadge = {
    text: "Loja ativa da semana",
    icon: Sparkles,
    colorClass: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30",
  };
  const ratingBadge = {
    text: "Boa avaliação dos clientes",
    icon: Award,
    colorClass: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800/30",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 pb-24">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#1E5BFF]" /> Desempenho da Minha Loja
        </h1>
      </header>

      <main className="flex-1 p-5 space-y-6">
        {/* Bloco de Comparação Semanal Simples (EXISTENTE) */}
        <WeeklyComparisonBlock text={mockComparisonText} isPositive={mockComparisonPositive} />

        {/* NEW: Seção para Selos Visuais */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PerformanceBadge
            text={activeBadge.text}
            icon={activeBadge.icon}
            colorClass={activeBadge.colorClass}
          />
          <PerformanceBadge
            text={ratingBadge.text}
            icon={ratingBadge.icon}
            colorClass={ratingBadge.colorClass}
          />
        </section>

        {/* Cartões de Métricas (EXISTENTE) */}
        <div className="grid grid-cols-1 gap-4">
          <KpiCard
            icon={Eye}
            value={mockViews.toLocaleString('pt-BR')}
            label="Pessoas viram sua loja"
            colorClass="bg-blue-50 dark:bg-blue-900/10"
          />
          <KpiCard
            icon={MousePointerClick}
            value={mockClicks.toLocaleString('pt-BR')}
            label="Cliques no perfil"
            colorClass="bg-purple-50 dark:bg-purple-900/10"
          />
          <KpiCard
            icon={Gift}
            value={mockCouponsRedeemed.toLocaleString('pt-BR')}
            label="Cupons resgatados"
            colorClass="bg-amber-50 dark:bg-amber-900/10"
          />
        </div>

        {/* NEW: Gráfico Circular (Origem das Visualizações) */}
        <section>
          <PieChart title="De onde vêm suas visitas" data={viewsOriginData} />
        </section>

        {/* NEW: Gráfico de Barras Simples (Visitas por Dia da Semana) */}
        <section>
          <SimpleBarChart title="Visitas por Dia da Semana" data={weeklyVisitsData} />
        </section>
      </main>
    </div>
  );
};
