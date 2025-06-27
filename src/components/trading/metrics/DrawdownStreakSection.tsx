import { PerformanceStats } from "@/types/trade";
import { formatCurrency, formatPercentage, formatCurrencyStreamer } from "@/utils/formatters";
import MetricCard from "./MetricCard";
import { useStreamerMode } from '@/components/layout/StreamerModeProvider';

interface DrawdownStreakSectionProps {
  stats: PerformanceStats;
}

const DrawdownStreakSection = ({ stats }: DrawdownStreakSectionProps) => {
  const { streamerMode } = useStreamerMode();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Drawdown & Streak Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Max Drawdown"
          value={streamerMode ? '***' : formatPercentage(stats.maxDrawdown)}
          trend="negative"
        />
        
        <MetricCard
          title="Max Drawdown ($)"
          value={formatCurrencyStreamer(stats.maxDrawdownAmount, streamerMode)}
          trend="negative"
        />
        
        <MetricCard
          title="Longest Win Streak"
          value={stats.longestWinStreak.toString()}
          trend="positive"
        />
        
        <MetricCard
          title="Longest Loss Streak"
          value={stats.longestLossStreak.toString()}
          trend="negative"
        />
      </div>
    </div>
  );
};

export default DrawdownStreakSection;
