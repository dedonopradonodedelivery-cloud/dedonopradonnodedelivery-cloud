
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Dices, DollarSign, RefreshCw, Loader2, Users, PieChart, TrendingUp, Clock, Star, X, Calendar as CalendarIcon, Calculator, Zap, FileText, Download, ShieldCheck, TriangleAlert, Info, CheckCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js'; 
import { supabase } from '../lib/supabaseClient'; 
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '../lib/env'; 

interface SpinWheelAdminDashboardProps {
  onBack: () => void;
}

interface DailyMetric {
  report_date: string;
  total_spins: number;
  total_cost: number;
  average_ticket: number;
}

interface PrizeDistributionItem {
  prize_label: string;
  prize_value: number;
  count: number;
  percentage: number;
}

interface TopUserItem {
  user_id: string;
  user_name: string;
  value: number;
}

interface AnalyticsData {
  daily_metrics: DailyMetric[];
  prize_distribution: PrizeDistributionItem[];
  top_users: TopUserItem[];
  total_spins_period: number;
  total_cost_period: number;
  average_ticket_period: number;
  most_frequent_prize: PrizeDistributionItem | null;
}

interface SimulationResult {
  expected_per_spin: number;
  expected_per_day: number;
  expected_total: number;
}

// NEW: Wheel Status Interface
interface WheelStatus {
  daily_limit: number;
  monthly_limit: number;
  manual_override_active: boolean;
  is_safe_mode_active: boolean;
  safe_mode_reason: string;
  total_spent_today: number;
  total_spent_month: number;
}

type DateRange = 'today' | '7d' | '30d';

// Cliente Supabase com service_role para acessar funções RPC protegidas e Edge Functions
const serviceRoleSupabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

export const SpinWheelAdminDashboard: React.FC<SpinWheelAdminDashboardProps> = ({ onBack }) => {
  const [selectedRange, setSelectedRange] = useState<DateRange>('today');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Simulation states
  const [simulatedSpinsPerDay, setSimulatedSpinsPerDay] = useState(100);
  const [simulatedDays, setSimulatedDays] = useState(30);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [simulationError, setSimulationError] = useState<string | null>(null);

  // Export states
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29);
  const [exportStartDate, setExportStartDate] = useState(thirtyDaysAgo.toISOString().split('T')[0]);
  const [exportEndDate, setExportEndDate] = useState(today.toISOString().split('T')[0]);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // NEW: States for Wheel Status and Limits
  const [wheelStatus, setWheelStatus] = useState<WheelStatus | null>(null);
  const [wheelStatusLoading, setWheelStatusLoading] = useState(false);
  const [wheelStatusError, setWheelStatusError] = useState<string | null>(null);
  const [isUpdatingLimits, setIsUpdatingLimits] = useState(false);
  const [updateLimitsError, setUpdateLimitsError] = useState<string | null>(null);


  useEffect(() => {
    fetchAnalytics(selectedRange);
  }, [selectedRange]);

  // NEW: Fetch Wheel Status on mount and periodically
  useEffect(() => {
    const fetchWheelStatus = async () => {
      setWheelStatusLoading(true);
      setWheelStatusError(null);
      try {
        const { data, error } = await serviceRoleSupabase.rpc('get_wheel_status');
        if (error) throw error;
        const statusData = data[0] as WheelStatus; // RPC returns array of objects
        setWheelStatus(statusData); 
        
        // Update simulation inputs with current limits if not in manual override
        if (!statusData.manual_override_active && statusData.daily_limit && statusData.monthly_limit) {
            // Estimate spins per day if possible from analytics, otherwise default
            const estimatedCostPerSpin = analytics?.average_ticket_period > 0 ? analytics.average_ticket_period : 2.50; // Use a reasonable default
            
            const newSimSpins = estimatedCostPerSpin > 0 ? Math.ceil(statusData.daily_limit / estimatedCostPerSpin) : 100;
            const newSimDays = estimatedCostPerSpin > 0 ? Math.ceil(statusData.monthly_limit / (estimatedCostPerSpin * (analytics?.total_spins_period > 0 ? analytics.total_spins_period : 100))) : 30;

            if (newSimSpins > 0) setSimulatedSpinsPerDay(newSimSpins);
            if (newSimDays > 0) setSimulatedDays(newSimDays);
        }

      } catch (err: any) {
        console.error("Error fetching wheel status:", err);
        setWheelStatusError(err.message || "Erro ao carregar status da roleta.");
      } finally {
        setWheelStatusLoading(false);
      }
    };
    fetchWheelStatus();
    // Refresh status every 30 seconds
    const interval = setInterval(fetchWheelStatus, 30000);
    return () => clearInterval(interval);
  }, [analytics]); // Depend on analytics to potentially refine simulation inputs

  const fetchAnalytics = async (range: DateRange) => {
    setLoading(true);
    setError(null);
    setAnalytics(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    let startDate = new Date(today);
    let endDate = new Date(today);

    if (range === '7d') {
      startDate.setDate(today.getDate() - 6);
    } else if (range === '30d') {
      startDate.setDate(today.getDate() - 29);
    }
    
    // Ensure endDate is end of day for accurate range
    endDate.setHours(23, 59, 59, 999);

    try {
      const { data, error: rpcError } = await serviceRoleSupabase.rpc('get_spin_wheel_analytics', {
        p_start_date: startDate.toISOString().split('T')[0],
        p_end_date: endDate.toISOString().split('T')[0],
      });

      if (rpcError) throw rpcError;
      
      const rawData: any[] = data || [];

      // Consolidate daily data and calculate period totals
      let totalSpins = 0;
      let totalCost = 0;
      let prizeDistribution: PrizeDistributionItem[] = [];
      let topUsers: TopUserItem[] = [];

      const dailyMetrics: DailyMetric[] = rawData.map(row => ({
        report_date: row.report_date,
        total_spins: row.total_spins,
        total_cost: row.total_cost,
        average_ticket: row.average_ticket,
      }));

      // Summing up daily totals for the selected period
      dailyMetrics.forEach(day => {
        totalSpins += day.total_spins;
        totalCost += day.total_cost;
      });

      const averageTicketPeriod = totalSpins > 0 ? totalCost / totalSpins : 0;

      const representativeRow = rawData.find(row => row.prize_distribution && row.top_users) || rawData[0];
      
      if (representativeRow) {
        prizeDistribution = representativeRow.prize_distribution || [];
        topUsers = representativeRow.top_users || [];
      }
      
      let mostFrequentPrize: PrizeDistributionItem | null = null;
      if (prizeDistribution.length > 0) {
        mostFrequentPrize = prizeDistribution.reduce((prev, current) => 
          (prev.count > current.count) ? prev : current
        );
      }

      setAnalytics({
        daily_metrics: dailyMetrics,
        prize_distribution: prizeDistribution,
        top_users: topUsers,
        total_spins_period: totalSpins,
        total_cost_period: totalCost,
        average_ticket_period: averageTicketPeriod,
        most_frequent_prize: mostFrequentPrize,
      });

    } catch (err: any) {
      console.error("Erro ao buscar analytics:", err);
      setError(err.message || "Erro ao carregar dados do dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateCost = async () => {
    setSimulationLoading(true);
    setSimulationError(null);
    setSimulationResult(null);

    try {
      const { data, error: rpcError } = await serviceRoleSupabase.rpc('simulate_wheel_cost', {
        p_spins_per_day: simulatedSpinsPerDay,
        p_days: simulatedDays,
      });

      if (rpcError) throw rpcError;

      // data is expected to be a single JSON object directly
      setSimulationResult(data as SimulationResult);

    } catch (err: any) {
      console.error("Erro na simulação de custo:", err);
      setSimulationError(err.message || "Erro ao executar simulação de custo.");
    } finally {
      setSimulationLoading(false);
    }
  };

  const handleExportCsv = async () => {
    setExportLoading(true);
    setExportError(null);

    try {
      // Invocação direta da Edge Function com a service_role_key no header de Autorização
      const functionUrl = `${SUPABASE_URL}/functions/v1/export-wheel-spins?start_date=${exportStartDate}&end_date=${exportEndDate}`;
      
      const csvResponse = await fetch(functionUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 
        },
      });

      if (!csvResponse.ok) {
        let errorMessage = `Erro ao exportar: ${csvResponse.statusText}`;
        try {
          const errorBody = await csvResponse.json();
          errorMessage = errorBody.error || errorMessage;
        } catch {
          // Fallback if not JSON
        }
        throw new Error(errorMessage);
      }

      const blob = await csvResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `auditoria_roleta_${exportStartDate}_${exportEndDate}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (err: any) {
      console.error("Erro na exportação CSV:", err);
      setExportError(err.message || "Erro ao exportar dados da roleta.");
    } finally {
      setExportLoading(false);
    }
  };

  // NEW: Handle Admin action to toggle manual override
  const handleToggleManualOverride = async () => {
    if (!wheelStatus) return;
    setIsUpdatingLimits(true);
    setUpdateLimitsError(null);
    try {
      const newState = !wheelStatus.manual_override_active;
      await serviceRoleSupabase.rpc('toggle_manual_override_active', { p_new_state: newState });
      
      // Update local state and refetch status
      setWheelStatus(prev => prev ? { ...prev, manual_override_active: newState, is_safe_mode_active: newState ? false : prev.is_safe_mode_active } : null);
      // Re-fetch all status details after update
      // Re-trigger useEffect for wheel status
      const { data, error } = await serviceRoleSupabase.rpc('get_wheel_status');
        if (error) throw error;
        setWheelStatus(data[0] as WheelStatus);

    } catch (err: any) {
      console.error("Error toggling manual override:", err);
      setUpdateLimitsError(err.message || "Erro ao atualizar modo de segurança.");
    } finally {
      setIsUpdatingLimits(false);
    }
  };


  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const getRangeLabel = (range: DateRange) => {
    switch (range) {
      case 'today': return 'Hoje';
      case '7d': return 'Últimos 7 dias';
      case '30d': return 'Últimos 30 dias';
    }
  };

  const mostFrequentPrizeText = useMemo(() => {
    if (!analytics?.most_frequent_prize) return "N/A";
    const prize = analytics.most_frequent_prize;
    return `${prize.prize_label} (${prize.percentage}%)`;
  }, [analytics]);

  const totalPeriodSpins = analytics?.total_spins_period || 0;
  const totalPeriodCost = analytics?.total_cost_period || 0;
  const averageTicketPeriod = analytics?.average_ticket_period || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 font-sans animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Dashboard Roleta</h1>
      </div>

      <div className="p-5 space-y-6">
        
        {/* Date Range Selector */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
          <button 
            onClick={() => setSelectedRange('today')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border ${selectedRange === 'today' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}
          >
            Hoje
          </button>
          <button 
            onClick={() => setSelectedRange('7d')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border ${selectedRange === '7d' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}
          >
            Últimos 7 dias
          </button>
          <button 
            onClick={() => setSelectedRange('30d')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border ${selectedRange === '30d' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}
          >
            Últimos 30 dias
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Carregando dados...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-10 text-center bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800">
            <X className="w-10 h-10 text-red-500 mb-3" />
            <p className="font-bold text-red-700 dark:text-red-300 mb-2">Erro ao carregar</p>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                  <Dices className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Giros Totais</span>
                </div>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{totalPeriodSpins}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{getRangeLabel(selectedRange)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Custo Total</span>
                </div>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{formatCurrency(totalPeriodCost)}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{getRangeLabel(selectedRange)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Ticket Médio</span>
                </div>
                <p className="text-xl font-black text-gray-900 dark:text-white">{formatCurrency(averageTicketPeriod)}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Por giro</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-2">
                  <Star className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Mais Frequente</span>
                </div>
                <p className="text-sm font-black text-gray-900 dark:text-white">{mostFrequentPrizeText}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Neste período</p>
              </div>
            </div>

            {/* Daily Breakdown (Table) */}
            {selectedRange !== 'today' && analytics && analytics.daily_metrics.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  Resumo Diário
                </h3>
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                    <thead>
                      <tr className="text-xs uppercase text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
                        <th scope="col" className="px-4 py-2 rounded-tl-lg">Data</th>
                        <th scope="col" className="px-4 py-2">Giros</th>
                        <th scope="col" className="px-4 py-2 text-right">Custo</th>
                        <th scope="col" className="px-4 py-2 rounded-tr-lg text-right">Ticket Médio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.daily_metrics.map((day) => (
                        <tr key={day.report_date} className="border-b last:border-b-0 border-gray-100 dark:border-gray-700">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{formatDate(day.report_date)}</td>
                          <td className="px-4 py-3">{day.total_spins}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(day.total_cost)}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(day.average_ticket)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Prize Distribution */}
            {analytics && analytics.prize_distribution.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-gray-400" />
                  Distribuição de Prêmios
                </h3>
                <div className="space-y-2">
                  {analytics.prize_distribution.map((prize, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-800 dark:text-gray-200">{prize.prize_label} ({formatCurrency(prize.prize_value)})</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">{prize.count} giros</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{prize.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top 5 Users */}
            {analytics && analytics.top_users.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  Top 5 Ganhadores
                </h3>
                <div className="space-y-2">
                  {analytics.top_users.map((user, index) => (
                    <div key={user.user_id} className="flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-800 dark:text-gray-200">{index + 1}. {user.user_name || user.user_id.substring(0, 8)}</span>
                      <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(user.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- NEW: Wheel Status Section --- */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
                Status da Roleta
              </h3>

              {wheelStatusLoading ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Verificando...</p>
                </div>
              ) : wheelStatusError ? (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center justify-center gap-2">
                  <X className="w-4 h-4" />
                  <span>{wheelStatusError}</span>
                </div>
              ) : wheelStatus ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl flex flex-col items-start ${wheelStatus.is_safe_mode_active ? 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {wheelStatus.is_safe_mode_active ? <TriangleAlert className="w-5 h-5 text-red-600" /> : <CheckCircle className="w-5 h-5 text-green-600" />}
                      <span className="font-bold text-lg text-gray-900 dark:text-white">
                        Status: {wheelStatus.is_safe_mode_active ? 'MODO SEGURO ATIVO' : 'NORMAL'}
                      </span>
                    </div>
                    {wheelStatus.is_safe_mode_active && (
                      <p className="text-sm text-red-700 dark:text-red-300 mb-2">{wheelStatus.safe_mode_reason}</p>
                    )}
                    {wheelStatus.manual_override_active && (
                      <p className="text-xs text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-1.5">
                        <Info className="w-4 h-4" />
                        Sobrecarga manual ativa (ignorando limites automáticos).
                      </p>
                    )}
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <p>Gasto Hoje: {formatCurrency(wheelStatus.total_spent_today)} / {formatCurrency(wheelStatus.daily_limit)}</p>
                      <p>Gasto Mês: {formatCurrency(wheelStatus.total_spent_month)} / {formatCurrency(wheelStatus.monthly_limit)}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleToggleManualOverride}
                    disabled={isUpdatingLimits}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 
                      ${wheelStatus.manual_override_active 
                        ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/20' 
                        : 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/20'
                      }
                      ${isUpdatingLimits ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {isUpdatingLimits ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Atualizando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-5 h-5" />
                        {wheelStatus.manual_override_active ? 'Remover Sobrecarga Manual' : 'Ativar Sobrecarga Manual (Ignorar Limites)'}
                      </>
                    )}
                  </button>
                  {updateLimitsError && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center justify-center gap-2">
                      <X className="w-4 h-4" />
                      <span>{updateLimitsError}</span>
                    </div>
                  )}
                </div>
              ) : null}
            </div>


            {/* --- Simulation Section --- */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-500" />
                Simulação de Custos
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Estime o custo total da roleta para diferentes volumes de giros.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Giros por Dia</label>
                  <input
                    type="number"
                    value={simulatedSpinsPerDay}
                    onChange={(e) => setSimulatedSpinsPerDay(parseInt(e.target.value) || 0)}
                    min="1"
                    className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Número de Dias</label>
                  <input
                    type="number"
                    value={simulatedDays}
                    onChange={(e) => setSimulatedDays(parseInt(e.target.value) || 0)}
                    min="1"
                    className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <button
                onClick={handleSimulateCost}
                disabled={simulationLoading || simulatedSpinsPerDay <= 0 || simulatedDays <= 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {simulationLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Calculando...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Simular Custo
                  </>
                )}
              </button>

              {simulationError && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center justify-center gap-2">
                  <X className="w-4 h-4" />
                  <span>{simulationError}</span>
                </div>
              )}

              {simulationResult && (
                <div className="mt-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Resultados da Simulação</h4>
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between items-center">
                      <span>Custo por Giro</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(simulationResult.expected_per_spin)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Custo por Dia ({simulatedSpinsPerDay} giros)</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(simulationResult.expected_per_day)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="font-bold text-gray-900 dark:text-white">Custo Total ({simulatedDays} dias)</span>
                      <span className="font-black text-2xl text-green-600 dark:text-green-400">{formatCurrency(simulationResult.expected_total)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* --- Auditoria e Exportação --- */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                Auditoria e Exportação
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Exporte todos os registros de giros para contabilidade e análise detalhada.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Data Início</label>
                  <input
                    type="date"
                    value={exportStartDate}
                    onChange={(e) => setExportStartDate(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Data Fim</label>
                  <input
                    type="date"
                    value={exportEndDate}
                    onChange={(e) => setExportEndDate(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                </div>
              </div>

              <button
                onClick={handleExportCsv}
                disabled={exportLoading || !exportStartDate || !exportEndDate}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {exportLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Exportar Roleta (CSV)
                  </>
                )}
              </button>

              {exportError && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center justify-center gap-2">
                  <X className="w-4 h-4" />
                  <span>{exportError}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
