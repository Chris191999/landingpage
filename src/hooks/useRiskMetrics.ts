
import { useMemo } from "react";
import { Trade } from "@/types/trade";
import { 
  calculateRiskOfRuin, 
  calculateKellyPercentage, 
  calculateValueAtRisk,
  calculateCalmarRatio,
  calculateSortinoRatio,
  calculateMAEMFE
} from "@/utils/riskCalculations";

interface RiskMetricsProps {
  trades: Trade[];
  accountSize?: number;
  riskPerTrade?: number;
}

export const useRiskMetrics = ({ 
  trades, 
  accountSize = 10000, 
  riskPerTrade: defaultRiskPerTrade = 100 
}: RiskMetricsProps) => {
  const metrics = useMemo(() => {
    const completedTrades = trades.filter(trade => trade.status === 'Completed');
    
    if (completedTrades.length === 0) {
      return {
        riskOfRuin: 0,
        kellyPercentage: 0,
        var95: 0,
        var99: 0,
        calmarRatio: 0,
        sortinoRatio: 0,
        avgMAE: 0,
        avgMFE: 0
      };
    }
    
    const wins = completedTrades.filter(trade => (trade.pnl || 0) > 0);
    const losses = completedTrades.filter(trade => (trade.pnl || 0) < 0);
    
    const winRate = wins.length / completedTrades.length;
    const avgWin = wins.length > 0 
      ? wins.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / wins.length 
      : 0;
    const avgLoss = losses.length > 0 
      ? Math.abs(losses.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / losses.length)
      : 0;
    
    const totalPnL = completedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    
    let runningPnL = 0;
    let peak = 0;
    let maxDrawdown = 0;
    
    completedTrades.forEach(trade => {
      runningPnL += (trade.pnl || 0);
      if (runningPnL > peak) peak = runningPnL;
      const drawdown = peak - runningPnL;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    });
    
    const maxDrawdownPercent = peak > 0 ? (maxDrawdown / peak) * 100 : 0;
    
    const { avgMAE, avgMFE } = calculateMAEMFE(trades);
    
    const avgRiskAmount = completedTrades.filter(t => t.risk > 0).length > 0
      ? completedTrades.filter(t => t.risk > 0).reduce((sum, trade) => sum + (trade.risk || 0), 0) / completedTrades.filter(t => t.risk > 0).length
      : 0;
    
    const riskAmountToUse = avgRiskAmount > 0 ? avgRiskAmount : defaultRiskPerTrade;

    return {
      riskOfRuin: calculateRiskOfRuin(winRate, avgWin, avgLoss, riskAmountToUse, accountSize),
      kellyPercentage: calculateKellyPercentage(winRate, avgWin, avgLoss),
      var95: calculateValueAtRisk(trades, 0.95),
      var99: calculateValueAtRisk(trades, 0.99),
      calmarRatio: calculateCalmarRatio(totalPnL, maxDrawdownPercent, 1),
      sortinoRatio: calculateSortinoRatio(trades),
      avgMAE,
      avgMFE
    };
  }, [trades, accountSize, defaultRiskPerTrade]);

  return metrics;
};
