import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceStats } from "@/types/trade";
import { formatCurrency, formatPercentage, formatCurrencyStreamer } from "@/utils/formatters";
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, BarChart3 } from "lucide-react";
import { useStreamerMode } from '@/components/layout/StreamerModeProvider';

interface KeyMetricsCardsProps {
  stats: PerformanceStats;
}

const KeyMetricsCards = ({ stats }: KeyMetricsCardsProps) => {
  // Calculate weekly and monthly P&L (approximations)
  const weeklyPnL = stats.netPnL / Math.max(1, Math.ceil(stats.totalTrades / 7));
  const monthlyPnL = stats.netPnL / Math.max(1, Math.ceil(stats.totalTrades / 30));

  const getTrendColor = (value: number) => {
    if (value > 0) return "text-green-500";
    if (value < 0) return "text-red-500";
    return "text-gray-500";
  };

  const getTrendIcon = (value: number) => {
    return value >= 0 ? TrendingUp : TrendingDown;
  };

  const { streamerMode } = useStreamerMode();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Core Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Row 1 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getTrendColor(stats.netPnL)}`}>{formatCurrencyStreamer(stats.netPnL, streamerMode, 'pnl')}</div>
            <p className="text-xs text-muted-foreground">Net profit/loss</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Week P&L</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getTrendColor(weeklyPnL)}`}>{formatCurrencyStreamer(weeklyPnL, streamerMode, 'pnl')}</div>
            <p className="text-xs text-muted-foreground">Average weekly P&L</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly P&L</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getTrendColor(monthlyPnL)}`}>{formatCurrencyStreamer(monthlyPnL, streamerMode, 'pnl')}</div>
            <p className="text-xs text-muted-foreground">Average monthly P&L</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.totalTrades}</div>
            <p className="text-xs text-muted-foreground">{stats.winningTrades}W / {stats.losingTrades}L</p>
          </CardContent>
        </Card>
        {/* Row 2 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getTrendColor(stats.winRate - 50)}`}>{formatPercentage(stats.winRate)}</div>
            <p className="text-xs text-muted-foreground">Winning trades percentage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total R</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getTrendColor(stats.totalR)}`}>{stats.totalR.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Gross R multiple</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getTrendColor(stats.profitFactor - 1)}`}>{stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Gross profit / Gross loss</p>
          </CardContent>
        </Card>
        <div></div> {/* Empty cell for symmetry or future metric */}
      </div>
    </div>
  );
};

export default KeyMetricsCards;
