import { Trade } from "@/types/trade";

export const calculateRiskOfRuin = (
  winRate: number,
  avgWin: number,
  avgLoss: number,
  riskPerTrade: number,
  accountSize: number
): number => {
  // Conditions where ruin is impossible
  if (avgLoss <= 0 || winRate >= 1 || riskPerTrade <= 0) {
    return 0;
  }
  // Conditions of certain ruin
  if (winRate <= 0 || accountSize <= 0) {
    return 1;
  }

  const p = winRate;
  const q = 1 - p;
  const a = avgWin / avgLoss; // Payoff Ratio

  const advantage = (p * a) - q;

  if (advantage <= 0) {
    return 1; // Certain ruin if there's no positive advantage.
  }

  // This is a more standard and robust formula for Risk of Ruin.
  const base = q / (p * a);
  const capitalUnits = accountSize / riskPerTrade;

  const riskOfRuin = Math.pow(base, capitalUnits);

  return Math.min(1, Math.max(0, riskOfRuin));
};

export const calculateKellyPercentage = (
  winRate: number,
  avgWin: number,
  avgLoss: number
): number => {
  if (avgLoss <= 0) return 0;
  
  const p = winRate;
  const q = 1 - winRate;
  const b = avgWin / avgLoss;
  
  const kelly = (p * b - q) / b;
  return Math.max(0, Math.min(1, kelly)); // Cap between 0 and 100%
};

export const calculateValueAtRisk = (
  trades: Trade[],
  confidenceLevel: number = 0.95
): number => {
  const pnlValues = trades
    .filter(trade => trade.status === 'Completed' && trade.pnl !== undefined)
    .map(trade => trade.pnl!)
    .sort((a, b) => a - b);
  
  if (pnlValues.length === 0) return 0;
  
  const index = Math.floor((1 - confidenceLevel) * pnlValues.length);
  return Math.abs(pnlValues[index] || 0);
};

export const calculateCalmarRatio = (
  totalReturn: number,
  maxDrawdown: number,
  periodYears: number = 1
): number => {
  if (maxDrawdown <= 0) return totalReturn > 0 ? Infinity : 0;
  
  const annualizedReturn = totalReturn / periodYears;
  return annualizedReturn / (maxDrawdown / 100);
};

export const calculateSortinoRatio = (
  trades: Trade[],
  riskFreeRate: number = 0
): number => {
  const returns = trades
    .filter(trade => trade.status === 'Completed' && trade.pnl !== undefined)
    .map(trade => trade.pnl!);
  
  if (returns.length === 0) return 0;
  
  const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const downside = returns.filter(ret => ret < riskFreeRate);
  
  if (downside.length === 0) return avgReturn > riskFreeRate ? Infinity : 0;
  
  const downsideDeviation = Math.sqrt(
    downside.reduce((sum, ret) => sum + Math.pow(ret - riskFreeRate, 2), 0) / downside.length
  );
  
  return downsideDeviation > 0 ? (avgReturn - riskFreeRate) / downsideDeviation : 0;
};

export const calculateMAEMFE = (trades: Trade[]) => {
  const completedTrades = trades.filter(trade => 
    trade.status === 'Completed' && 
    (trade.max_adverse_excursion !== undefined || trade.max_favorable_excursion !== undefined)
  );
  
  const avgMAE = completedTrades.length > 0 
    ? completedTrades.reduce((sum, trade) => sum + (trade.max_adverse_excursion || 0), 0) / completedTrades.length
    : 0;
    
  const avgMFE = completedTrades.length > 0
    ? completedTrades.reduce((sum, trade) => sum + (trade.max_favorable_excursion || 0), 0) / completedTrades.length
    : 0;
    
  return { avgMAE, avgMFE };
};
