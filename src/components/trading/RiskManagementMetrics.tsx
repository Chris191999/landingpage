import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trade } from "@/types/trade";
import { Shield, TrendingDown, AlertTriangle, Target } from "lucide-react";
import { useRiskMetrics } from "@/hooks/useRiskMetrics";
import { useStreamerMode } from '@/components/layout/StreamerModeProvider';
import { formatCurrencyStreamer } from '@/utils/formatters';

interface RiskManagementMetricsProps {
  trades: Trade[];
  accountSize?: number;
  riskPerTrade?: number;
}

const RiskManagementMetrics = (props: RiskManagementMetricsProps) => {
  const metrics = useRiskMetrics(props);
  const { streamerMode } = useStreamerMode();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Risk of Ruin</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            {formatCurrencyStreamer(metrics.riskOfRuin, streamerMode)}
          </div>
          <Badge variant={metrics.riskOfRuin < 0.01 ? "default" : metrics.riskOfRuin < 0.05 ? "secondary" : "destructive"}>
            {metrics.riskOfRuin < 0.01 ? "Very Low" : metrics.riskOfRuin < 0.05 ? "Low" : "High"}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Kelly %</CardTitle>
          <Target className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">
            {formatPercentage(metrics.kellyPercentage)}
          </div>
          <p className="text-xs text-muted-foreground">
            Optimal position size
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">VaR (95%)</CardTitle>
          <TrendingDown className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-500">
            {formatCurrency(metrics.var95)}
          </div>
          <p className="text-xs text-muted-foreground">
            95% confidence loss limit
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">VaR (99%)</CardTitle>
          <Shield className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            {formatCurrency(metrics.var99)}
          </div>
          <p className="text-xs text-muted-foreground">
            99% confidence loss limit
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Calmar Ratio</CardTitle>
          <TrendingDown className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-500">
            {metrics.calmarRatio === Infinity ? '∞' : metrics.calmarRatio.toFixed(2)}
          </div>
          <Badge variant={metrics.calmarRatio >= 3 ? "default" : metrics.calmarRatio >= 1 ? "secondary" : "destructive"}>
            {metrics.calmarRatio >= 3 ? "Excellent" : metrics.calmarRatio >= 1 ? "Good" : "Poor"}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sortino Ratio</CardTitle>
          <TrendingDown className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {metrics.sortinoRatio === Infinity ? '∞' : metrics.sortinoRatio.toFixed(2)}
          </div>
          <Badge variant={metrics.sortinoRatio >= 2 ? "default" : metrics.sortinoRatio >= 1 ? "secondary" : "destructive"}>
            {metrics.sortinoRatio >= 2 ? "Excellent" : metrics.sortinoRatio >= 1 ? "Good" : "Poor"}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg MAE</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-400">
            {formatCurrency(metrics.avgMAE)}
          </div>
          <p className="text-xs text-muted-foreground">
            Average adverse excursion
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg MFE</CardTitle>
          <TrendingDown className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400">
            {formatCurrency(metrics.avgMFE)}
          </div>
          <p className="text-xs text-muted-foreground">
            Average favorable excursion
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskManagementMetrics;
