import { PerformanceStats } from "@/types/trade";
import MetricCard from "./MetricCard";
import { useStreamerMode } from '@/components/layout/StreamerModeProvider';
import { formatCurrencyStreamer } from '@/utils/formatters';

interface SystemQualitySectionProps {
  stats: PerformanceStats;
}

const SystemQualitySection = ({ stats }: SystemQualitySectionProps) => {
  const { streamerMode } = useStreamerMode();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">System Quality Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Sharpe Ratio"
          value={stats.sharpeRatio.toFixed(2)}
          trend={stats.sharpeRatio >= 1 ? 'positive' : stats.sharpeRatio >= 0.5 ? 'neutral' : 'negative'}
        />
        <MetricCard
          title="System Quality Number (SQN)"
          value={stats.systemQualityNumber.toFixed(2)}
          trend={stats.systemQualityNumber >= 1.6 ? 'positive' : stats.systemQualityNumber >= 1 ? 'neutral' : 'negative'}
        />
        <MetricCard
          title="Consistency Score"
          value={stats.sharpeRatio.toFixed(2)}
          trend={stats.sharpeRatio >= 1.5 ? 'positive' : stats.sharpeRatio >= 1 ? 'neutral' : 'negative'}
        />
        <MetricCard
          title="Total Trades"
          value={stats.totalTrades.toString()}
          subtitle={`${stats.winningTrades}W/${stats.losingTrades}L/${stats.breakEvenTrades}BE`}
          trend="neutral"
        />
      </div>
    </div>
  );
};

export default SystemQualitySection;
