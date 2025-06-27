
import { usePerformanceStats } from "@/hooks/usePerformanceStats";
import KeyMetricsCards from "./metrics/KeyMetricsCards";
import DetailedMetricsCards from "./metrics/DetailedMetricsCards";
import PerformanceCharts from "./metrics/PerformanceCharts";
import SymbolPerformance from "./metrics/SymbolPerformance";
import { Trade } from "@/types/trade";
import { useState, useMemo, useCallback } from "react";
import RiskRewardMetricsSection from "./metrics/RiskRewardMetricsSection";
import DrawdownStreakSection from "./metrics/DrawdownStreakSection";
import SystemQualitySection from "./metrics/SystemQualitySection";
import EquityCurveChart from "./metrics/EquityCurveChart";
import AnalyticsVisualizations from "./metrics/AnalyticsVisualizations";

interface PerformanceMetricsProps {
  trades: Trade[];
  detailed?: boolean;
  showFilters?: boolean;
}

const PerformanceMetrics = ({ trades, detailed = false, showFilters = false }: PerformanceMetricsProps) => {
  const [accountBalance, setAccountBalance] = useState(10000);

  const handleAccountBalanceChange = useCallback((balance: number) => {
    setAccountBalance(balance);
  }, []);

  // Use performance calculations directly without additional filtering
  const { stats, additionalMetrics, chartData, symbolStats } = usePerformanceStats(trades);

  const equityCurveData = useMemo(() => {
    let runningBalance = accountBalance;
    return trades
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
  }, [trades, accountBalance]);

  return (
    <div className="space-y-6">
      <KeyMetricsCards stats={stats} />
      {detailed && (
        <DetailedMetricsCards stats={stats} additionalMetrics={additionalMetrics} />
      )}
      <RiskRewardMetricsSection stats={stats} />
      <DrawdownStreakSection stats={stats} />
      <SystemQualitySection stats={stats} />
      <EquityCurveChart
        equityCurveData={equityCurveData}
        accountBalance={accountBalance}
        onAccountBalanceChange={handleAccountBalanceChange}
      />
      {detailed && (
        <>
          <PerformanceCharts chartData={chartData} />
          <SymbolPerformance symbolStats={symbolStats} />
          <AnalyticsVisualizations trades={trades} />
        </>
      )}
    </div>
  );
};

export default PerformanceMetrics;
