import { TrendingUp, TrendingDown, Calendar, Target, Clock } from "lucide-react";
import { PerformanceStats } from "@/types/trade";
import { AdditionalMetrics } from "@/types/metrics";
import { formatDateSafely } from "@/utils/dateValidation";
import { formatCurrency, formatCurrencyStreamer } from "@/utils/formatters";
import MetricCard from "./MetricCard";
import { useStreamerMode } from '@/components/layout/StreamerModeProvider';

interface DetailedMetricsCardsProps {
  stats: PerformanceStats;
  additionalMetrics: AdditionalMetrics;
}

const DetailedMetricsCards = ({ stats, additionalMetrics }: DetailedMetricsCardsProps) => {
  const { streamerMode } = useStreamerMode();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <MetricCard
        title="Largest Profit"
        value={formatCurrencyStreamer(stats.largestWin, streamerMode, 'pnl')}
        subtitle="Best single trade"
        trend="positive"
        icon={TrendingUp}
      />

      <MetricCard
        title="Largest Loss"
        value={formatCurrencyStreamer(stats.largestLoss, streamerMode, 'pnl')}
        subtitle="Worst single trade"
        trend="negative"
        icon={TrendingDown}
      />

      <MetricCard
        title="Avg Winning Trade"
        value={formatCurrencyStreamer(additionalMetrics.avgWinningTradePnL, streamerMode, 'pnl')}
        subtitle="Average profit per win"
        trend="positive"
        icon={TrendingUp}
      />

      <MetricCard
        title="Avg Losing Trade"
        value={formatCurrencyStreamer(additionalMetrics.avgLosingTradePnL, streamerMode, 'pnl')}
        subtitle="Average loss per trade"
        trend="negative"
        icon={TrendingDown}
      />

      <MetricCard
        title="Most Profitable Day"
        value={formatCurrencyStreamer(additionalMetrics.mostProfitableDay.pnl, streamerMode, 'pnl')}
        subtitle={additionalMetrics.mostProfitableDay.date !== 'N/A' 
          ? formatDateSafely(additionalMetrics.mostProfitableDay.date)
          : 'N/A'
        }
        trend="positive"
        icon={Calendar}
      />

      <MetricCard
        title="Least Profitable Day"
        value={formatCurrencyStreamer(additionalMetrics.leastProfitableDay.pnl, streamerMode, 'pnl')}
        subtitle={additionalMetrics.leastProfitableDay.date !== 'N/A' 
          ? formatDateSafely(additionalMetrics.leastProfitableDay.date)
          : 'N/A'
        }
        trend="negative"
        icon={Calendar}
      />

      <MetricCard
        title="Avg Trades Per Day"
        value={additionalMetrics.avgTradesPerDay.toFixed(1)}
        subtitle="Daily trading frequency"
        trend="neutral"
        icon={Target}
      />

      <MetricCard
        title="Avg Trade Duration"
        value={`${(stats.avgTradeDuration * 60).toFixed(1)}min`}
        subtitle="Minutes per trade"
        trend="neutral"
        icon={Clock}
      />
    </div>
  );
};

export default DetailedMetricsCards;
