
import { PerformanceStats } from './trade';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  icon?: React.ComponentType<any>;
}

export interface AdditionalMetrics {
  mostProfitableDay: { date: string; pnl: number };
  leastProfitableDay: { date: string; pnl: number };
  avgTradesPerDay: number;
  avgWinningTradePnL: number;
  avgLosingTradePnL: number;
}

export interface SymbolStats {
  symbol: string;
  trades: number;
  pnl: number;
  wins: number;
  winRate: number;
}

export interface ChartDataPoint {
  date: string;
  pnl: number;
  cumulative: number;
  symbol?: string;
}
