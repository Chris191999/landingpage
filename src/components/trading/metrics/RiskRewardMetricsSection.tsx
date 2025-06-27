import { PerformanceStats } from "@/types/trade";
import { formatRMultiple } from "@/utils/formatters";
import MetricCard from "./MetricCard";
import { useStreamerMode } from '@/components/layout/StreamerModeProvider';

interface RiskRewardMetricsSectionProps {
  stats: PerformanceStats;
}

const RiskRewardMetricsSection = ({ stats }: RiskRewardMetricsSectionProps) => {
  const { streamerMode } = useStreamerMode();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Risk & Reward Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Avg Win (R)"
          value={formatRMultiple(stats.avgWinR)}
          trend="positive"
        />
        
        <MetricCard
          title="Avg Loss (R)"
          value={formatRMultiple(stats.avgLossR)}
          trend="negative"
        />
        
        <MetricCard
          title="Risk/Reward Ratio"
          value={stats.riskRewardRatio === Infinity ? '∞' : stats.riskRewardRatio.toFixed(2)}
          trend={stats.riskRewardRatio >= 1 ? 'positive' : 'negative'}
        />
        
        <MetricCard
          title="Expectancy"
          value={formatRMultiple(stats.expectancy)}
          trend={stats.expectancy >= 0 ? 'positive' : 'negative'}
        />
      </div>
    </div>
  );
};

export default RiskRewardMetricsSection;
