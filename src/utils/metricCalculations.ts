
import { Trade } from '@/types/trade';
import { SymbolStats, AdditionalMetrics } from '@/types/metrics';

export const calculateAdditionalMetrics = (trades: Trade[]): AdditionalMetrics => {
  const completedTrades = trades.filter(trade => trade.status === 'Completed');
  
  if (completedTrades.length === 0) {
    return {
      mostProfitableDay: { date: 'N/A', pnl: 0 },
      leastProfitableDay: { date: 'N/A', pnl: 0 },
      avgTradesPerDay: 0,
      avgWinningTradePnL: 0,
      avgLosingTradePnL: 0
    };
  }

  // Calculate daily P&L
  const dailyPnL = new Map<string, number>();
  completedTrades.forEach(trade => {
    const date = trade.date;
    const pnl = trade.pnl || 0;
    dailyPnL.set(date, (dailyPnL.get(date) || 0) + pnl);
  });

  // Find most/least profitable days
  let mostProfitableDay = { date: 'N/A', pnl: 0 };
  let leastProfitableDay = { date: 'N/A', pnl: 0 };

  for (const [date, pnl] of dailyPnL.entries()) {
    if (mostProfitableDay.date === 'N/A' || pnl > mostProfitableDay.pnl) {
      mostProfitableDay = { date, pnl };
    }
    if (leastProfitableDay.date === 'N/A' || pnl < leastProfitableDay.pnl) {
      leastProfitableDay = { date, pnl };
    }
  }

  // Calculate averages
  const winningTrades = completedTrades.filter(trade => (trade.pnl || 0) > 0);
  const losingTrades = completedTrades.filter(trade => (trade.pnl || 0) < 0);
  
  const avgWinningTradePnL = winningTrades.length > 0 
    ? winningTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / winningTrades.length 
    : 0;
    
  const avgLosingTradePnL = losingTrades.length > 0 
    ? losingTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / losingTrades.length 
    : 0;

  const tradingDays = dailyPnL.size;
  const avgTradesPerDay = tradingDays > 0 ? completedTrades.length / tradingDays : 0;

  return {
    mostProfitableDay,
    leastProfitableDay,
    avgTradesPerDay,
    avgWinningTradePnL,
    avgLosingTradePnL
  };
};

export const calculateSymbolStats = (trades: Trade[]): SymbolStats[] => {
  const completedTrades = trades.filter(trade => trade.status === 'Completed');
  const symbolMap = new Map<string, { trades: number; pnl: number; wins: number }>();

  completedTrades.forEach(trade => {
    const symbol = trade.symbol;
    const pnl = trade.pnl || 0;
    const existing = symbolMap.get(symbol) || { trades: 0, pnl: 0, wins: 0 };
    
    symbolMap.set(symbol, {
      trades: existing.trades + 1,
      pnl: existing.pnl + pnl,
      wins: existing.wins + (pnl > 0 ? 1 : 0)
    });
  });

  return Array.from(symbolMap.entries())
    .map(([symbol, stats]) => ({
      symbol,
      trades: stats.trades,
      pnl: stats.pnl,
      wins: stats.wins,
      winRate: (stats.wins / stats.trades) * 100
    }))
    .sort((a, b) => b.pnl - a.pnl);
};
