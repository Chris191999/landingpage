
import { useState, useMemo, useCallback, lazy, Suspense } from "react";
import { Trade } from "@/types/trade";
import { useOptimizedPerformanceStats } from "@/hooks/useOptimizedPerformanceStats";
import KeyMetricsCards from "./metrics/KeyMetricsCards";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import MetricsFilterPanel, { AdvancedFilters } from "./metrics/MetricsFilterPanel";

// Lazy load heavy components
const DetailedMetricsCards = lazy(() => import("./metrics/DetailedMetricsCards"));
const PerformanceCharts = lazy(() => import("./metrics/PerformanceCharts"));
const SymbolPerformance = lazy(() => import("./metrics/SymbolPerformance"));
const RiskRewardMetricsSection = lazy(() => import("./metrics/RiskRewardMetricsSection"));
const DrawdownStreakSection = lazy(() => import("./metrics/DrawdownStreakSection"));
const SystemQualitySection = lazy(() => import("./metrics/SystemQualitySection"));
const EquityCurveChart = lazy(() => import("./metrics/EquityCurveChart"));
const AnalyticsVisualizations = lazy(() => import("./metrics/AnalyticsVisualizations"));

interface OptimizedPerformanceMetricsProps {
  trades: Trade[];
  detailed?: boolean;
}

const OptimizedPerformanceMetrics = ({ trades, detailed = false }: OptimizedPerformanceMetricsProps) => {
  const [filters, setFilters] = useState<AdvancedFilters>({
    dateFrom: "",
    dateTo: "",
    selectedSymbol: "all",
    strategy: "",
    emotion: "",
    confidenceMin: 0,
    confidenceMax: 10,
    minTradeDuration: 0,
    maxTradeDuration: 0,
    minPnL: 0,
    maxPnL: 0
  });
  const [accountBalance, setAccountBalance] = useState(10000);

  const handleClearFilters = useCallback(() => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      selectedSymbol: "all",
      strategy: "",
      emotion: "",
      confidenceMin: 0,
      confidenceMax: 10,
      minTradeDuration: 0,
      maxTradeDuration: 0,
      minPnL: 0,
      maxPnL: 0
    });
  }, []);

  const handleAccountBalanceChange = useCallback((balance: number) => {
    setAccountBalance(balance);
  }, []);

  const { filteredTrades, FilterComponent } = MetricsFilterPanel({
    trades,
    filters,
    onFiltersChange: setFilters,
    onClearFilters: handleClearFilters
  });

  // Use optimized performance calculations
  const { stats, additionalMetrics, chartData, symbolStats } = useOptimizedPerformanceStats(filteredTrades);

  const equityCurveData = useMemo(() => {
    let runningBalance = accountBalance;
    return filteredTrades
      .filter(trade => trade.status === 'Completed')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((trade, index) => {
        runningBalance += (trade.pnl || 0);
        return {
          day: `Day ${index + 1}`,
          balance: runningBalance,
          date: trade.date
        };
      });
  }, [filteredTrades, accountBalance]);

  return (
    <div className="space-y-6">
      <KeyMetricsCards stats={stats} />
      
      {detailed && (
        <Suspense fallback={<LoadingSkeleton variant="metrics" />}>
          <DetailedMetricsCards stats={stats} additionalMetrics={additionalMetrics} />
          <FilterComponent />
        </Suspense>
      )}
      
      <Suspense fallback={<LoadingSkeleton variant="metrics" count={3} />}>
        <RiskRewardMetricsSection stats={stats} />
        <DrawdownStreakSection stats={stats} />
        <SystemQualitySection stats={stats} />
      </Suspense>
      
      <Suspense fallback={<LoadingSkeleton variant="card" />}>
        <EquityCurveChart
          equityCurveData={equityCurveData}
          accountBalance={accountBalance}
          onAccountBalanceChange={handleAccountBalanceChange}
        />
      </Suspense>
      
      {detailed && (
        <Suspense fallback={<LoadingSkeleton variant="card" count={2} />}>
          <PerformanceCharts chartData={chartData} />
          <SymbolPerformance symbolStats={symbolStats} />
          <AnalyticsVisualizations trades={filteredTrades} />
        </Suspense>
      )}
    </div>
  );
};

export default OptimizedPerformanceMetrics;
