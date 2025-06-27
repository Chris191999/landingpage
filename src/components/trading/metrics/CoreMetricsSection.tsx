import { PerformanceStats } from "@/types/trade";
import { formatCurrency, formatPercentage, formatRMultiple } from "@/utils/formatters";
import MetricCard from "./MetricCard";

interface CoreMetricsSectionProps {
  stats: PerformanceStats;
}

const CoreMetricsSection = ({ stats }: CoreMetricsSectionProps) => {
  // Convert hours to minutes for display
  const avgTradeDurationMinutes = (stats.avgTradeDuration || 0) * 60;
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Core Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Win Rate"
          value={formatPercentage(stats.winRate)}
          trend={stats.winRate >= 50 ? 'positive' : 'negative'}
        />
        <MetricCard
          title="Total R"
          value={formatRMultiple(stats.totalR)}
          trend={stats.totalR >= 0 ? 'positive' : 'negative'}
        />
        <MetricCard
          title="Profit Factor"
          value={stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
          trend={stats.profitFactor >= 1 ? 'positive' : 'negative'}
        />
        <MetricCard
          title="Net P&L"
          value={formatCurrency(stats.netPnL)}
          subtitle={`${stats.totalR > 0 ? '+' : ''}${formatRMultiple(stats.totalR)}`}
          trend={stats.netPnL >= 0 ? 'positive' : 'negative'}
        />
        <MetricCard
          title="Avg Trade Duration"
          value={`${avgTradeDurationMinutes.toFixed(1)}min`}
          subtitle="Average holding time"
          trend="neutral"
        />
      </div>
    </div>
  );
};

export default CoreMetricsSection;
