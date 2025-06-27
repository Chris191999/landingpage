
import { useMemo } from "react";
import { Trade, PerformanceStats } from "@/types/trade";
import { 
  calculateCalmarRatio, 
  calculateSortinoRatio, 
  calculateRiskOfRuin, 
  calculateKellyPercentage, 
  calculateValueAtRisk,
  calculateMAEMFE 
} from "@/utils/riskCalculations";

export const usePerformanceStats = (trades: Trade[]) => {
  const { stats, additionalMetrics, chartData, symbolStats } = useMemo(() => {
    if (trades.length === 0) {
      const emptyStats: PerformanceStats = {
        totalTrades: 0, winningTrades: 0, losingTrades: 0, breakEvenTrades: 0,
        winRate: 0, totalPnL: 0, totalFees: 0, netPnL: 0, averageWin: 0,
        averageLoss: 0, profitFactor: 0, largestWin: 0, largestLoss: 0,
        averageRoi: 0, sharpeRatio: 0, totalR: 0, avgWinR: 0, avgLossR: 0,
        riskRewardRatio: 0, expectancy: 0, maxDrawdown: 0, maxDrawdownAmount: 0,
        longestWinStreak: 0, longestLossStreak: 0, systemQualityNumber: 0,
        calmarRatio: 0, sortinoRatio: 0, riskOfRuin: 0, kellyPercentage: 0,
        valueAtRisk95: 0, valueAtRisk99: 0, averageMAE: 0, averageMFE: 0,
        avgTradeDuration: 0
      };
      
      const emptyAdditionalMetrics = {
        mostProfitableDay: { date: 'N/A', pnl: 0 },
        leastProfitableDay: { date: 'N/A', pnl: 0 },
        avgTradesPerDay: 0,
        avgWinningTradePnL: 0,
        avgLosingTradePnL: 0
      };

      const emptySymbolStats = [] as { symbol: string; trades: number; pnl: number; wins: number; winRate: number; }[];

      return { stats: emptyStats, additionalMetrics: emptyAdditionalMetrics, chartData: [], symbolStats: emptySymbolStats };
    }

    const completedTrades = trades.filter(trade => trade.status === 'Completed' && trade.pnl !== undefined);
    
    if (completedTrades.length === 0) {
        const emptyStats: PerformanceStats = {
        totalTrades: trades.length, winningTrades: 0, losingTrades: 0, breakEvenTrades: 0,
        winRate: 0, totalPnL: 0, totalFees: trades.reduce((sum, trade) => sum + (trade.fees || 0), 0), netPnL: -trades.reduce((sum, trade) => sum + (trade.fees || 0), 0), averageWin: 0,
        averageLoss: 0, profitFactor: 0, largestWin: 0, largestLoss: 0,
        averageRoi: 0, sharpeRatio: 0, totalR: 0, avgWinR: 0, avgLossR: 0,
        riskRewardRatio: 0, expectancy: 0, maxDrawdown: 0, maxDrawdownAmount: 0,
        longestWinStreak: 0, longestLossStreak: 0, systemQualityNumber: 0,
        calmarRatio: 0, sortinoRatio: 0, riskOfRuin: 0, kellyPercentage: 0,
        valueAtRisk95: 0, valueAtRisk99: 0, averageMAE: 0, averageMFE: 0,
        avgTradeDuration: 0
      };
       const emptyAdditionalMetrics = {
        mostProfitableDay: { date: 'N/A', pnl: 0 },
        leastProfitableDay: { date: 'N/A', pnl: 0 },
        avgTradesPerDay: 0,
        avgWinningTradePnL: 0,
        avgLosingTradePnL: 0
      };
      const emptySymbolStats = [] as { symbol: string; trades: number; pnl: number; wins: number; winRate: number; }[];
      return { stats: emptyStats, additionalMetrics: emptyAdditionalMetrics, chartData: [], symbolStats: emptySymbolStats };
    }

    const tradesWithR = completedTrades.map(trade => {
      const rMultiple = trade.risk > 0 ? (trade.pnl || 0) / trade.risk : 0;
      return { ...trade, rMultiple };
    });

    const wins = tradesWithR.filter(trade => (trade.pnl || 0) > 0);
    const losses = tradesWithR.filter(trade => (trade.pnl || 0) < 0);
    const breakEvens = tradesWithR.filter(trade => (trade.pnl || 0) === 0);
    
    const totalPnL = completedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const totalFees = trades.reduce((sum, trade) => sum + (trade.fees || 0), 0);
    const totalWins = wins.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const totalLosses = Math.abs(losses.reduce((sum, trade) => sum + (trade.pnl || 0), 0));

    const winRate = completedTrades.length > 0 ? (wins.length / completedTrades.length) : 0;
    const averageWin = wins.length > 0 ? totalWins / wins.length : 0;
    const averageLoss = losses.length > 0 ? totalLosses / losses.length : 0;

    const totalR = tradesWithR.reduce((sum, trade) => sum + trade.rMultiple, 0);
    const avgWinR = wins.length > 0 ? wins.reduce((sum, trade) => sum + trade.rMultiple, 0) / wins.length : 0;
    const avgLossR = losses.length > 0 ? Math.abs(losses.reduce((sum, trade) => sum + trade.rMultiple, 0) / losses.length) : 0;
    
    let runningPnL = 0;
    let peak = 0;
    let maxDrawdown = 0;
    let maxDrawdownAmount = 0;
    
    completedTrades.forEach(trade => {
      runningPnL += (trade.pnl || 0);
      if (runningPnL > peak) {
        peak = runningPnL;
      }
      const drawdown = peak - runningPnL;
      if (drawdown > maxDrawdownAmount) {
        maxDrawdownAmount = drawdown;
        maxDrawdown = peak > 0 ? (drawdown / peak) * 100 : 0;
      }
    });

    let currentWinStreak = 0;
    let currentLossStreak = 0;
    let longestWinStreak = 0;
    let longestLossStreak = 0;

    completedTrades.forEach(trade => {
      if ((trade.pnl || 0) > 0) {
        currentWinStreak++;
        currentLossStreak = 0;
        longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
      } else if ((trade.pnl || 0) < 0) {
        currentLossStreak++;
        currentWinStreak = 0;
        longestLossStreak = Math.max(longestLossStreak, currentLossStreak);
      } else {
        currentWinStreak = 0;
        currentLossStreak = 0;
      }
    });

    const expectancy = completedTrades.length > 0 ? totalR / completedTrades.length : 0;
    const rValues = tradesWithR.map(trade => trade.rMultiple);
    const standardDeviation = rValues.length > 1 ? 
      Math.sqrt(rValues.reduce((sum, r) => sum + Math.pow(r - expectancy, 2), 0) / (rValues.length - 1)) : 0;
    const systemQualityNumber = standardDeviation > 0 ? 
      (expectancy / standardDeviation) * Math.sqrt(completedTrades.length) : 0;

    const sharpeRatio = standardDeviation > 0 ? expectancy / standardDeviation : 0;

    const avgRiskAmount = completedTrades.filter(t => t.risk > 0).length > 0
      ? completedTrades.filter(t => t.risk > 0).reduce((sum, trade) => sum + (trade.risk || 0), 0) / completedTrades.filter(t => t.risk > 0).length
      : 0;
    const riskAmountToUse = avgRiskAmount > 0 ? avgRiskAmount : 100;

    const calmarRatio = calculateCalmarRatio(totalPnL, maxDrawdown, 1);
    const sortinoRatio = calculateSortinoRatio(completedTrades, 0);
    const riskOfRuin = calculateRiskOfRuin(winRate, averageWin, averageLoss, riskAmountToUse, 10000);
    const kellyPercentage = calculateKellyPercentage(winRate, averageWin, averageLoss);
    const valueAtRisk95 = calculateValueAtRisk(completedTrades, 0.95);
    const valueAtRisk99 = calculateValueAtRisk(completedTrades, 0.99);
    const { avgMAE, avgMFE } = calculateMAEMFE(completedTrades);
    
    const avgTradeDuration = completedTrades.filter(t => t.trade_duration_hours).length > 0
      ? completedTrades.filter(t => t.trade_duration_hours).reduce((sum, t) => sum + (t.trade_duration_hours || 0), 0) / completedTrades.filter(t => t.trade_duration_hours).length
      : 0;

    const statsResult: PerformanceStats = {
      totalTrades: trades.length,
      winningTrades: wins.length,
      losingTrades: losses.length,
      breakEvenTrades: breakEvens.length,
      winRate: winRate * 100,
      totalPnL,
      totalFees,
      netPnL: totalPnL - totalFees,
      averageWin,
      averageLoss,
      profitFactor: totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0,
      largestWin: wins.length > 0 ? Math.max(...wins.map(trade => trade.pnl || 0)) : 0,
      largestLoss: losses.length > 0 ? Math.min(...losses.map(trade => trade.pnl || 0)) : 0,
      averageRoi: 0,
      sharpeRatio: Math.abs(sharpeRatio),
      totalR,
      avgWinR,
      avgLossR,
      riskRewardRatio: avgLossR > 0 ? avgWinR / avgLossR : avgWinR > 0 ? Infinity : 0,
      expectancy,
      maxDrawdown,
      maxDrawdownAmount,
      longestWinStreak,
      longestLossStreak,
      systemQualityNumber: Math.abs(systemQualityNumber),
      calmarRatio,
      sortinoRatio,
      riskOfRuin,
      kellyPercentage,
      valueAtRisk95,
      valueAtRisk99,
      averageMAE: avgMAE,
      averageMFE: avgMFE,
      avgTradeDuration
    };

    const dailyPnL = new Map<string, number>();
    const dailyTradeCount = new Map<string, number>();
    
    completedTrades.forEach(trade => {
      const date = trade.date.split('T')[0];
      const pnl = trade.pnl || 0;
      
      dailyPnL.set(date, (dailyPnL.get(date) || 0) + pnl);
      dailyTradeCount.set(date, (dailyTradeCount.get(date) || 0) + 1);
    });

    let mostProfitableDay = { date: 'N/A', pnl: -Infinity };
    let leastProfitableDay = { date: 'N/A', pnl: Infinity };
    
    dailyPnL.forEach((pnl, date) => {
      if (pnl > mostProfitableDay.pnl) mostProfitableDay = { date, pnl };
      if (pnl < leastProfitableDay.pnl) leastProfitableDay = { date, pnl };
    });

    const uniqueDays = dailyTradeCount.size;
    const avgTradesPerDay = uniqueDays > 0 ? completedTrades.length / uniqueDays : 0;

    const winningTradesPnL = completedTrades.filter(trade => (trade.pnl || 0) > 0);
    const losingTradesPnL = completedTrades.filter(trade => (trade.pnl || 0) < 0);
    
    const avgWinningTradePnL = winningTradesPnL.length > 0 
      ? winningTradesPnL.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / winningTradesPnL.length 
      : 0;
    
    const avgLosingTradePnL = losingTradesPnL.length > 0 
      ? losingTradesPnL.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / losingTradesPnL.length 
      : 0;

    const additionalMetricsResult = {
      mostProfitableDay: mostProfitableDay.pnl === -Infinity ? { date: 'N/A', pnl: 0 } : mostProfitableDay,
      leastProfitableDay: leastProfitableDay.pnl === Infinity ? { date: 'N/A', pnl: 0 } : leastProfitableDay,
      avgTradesPerDay,
      avgWinningTradePnL,
      avgLosingTradePnL
    };

    const chartDataResult = trades
      .filter(trade => trade.status === 'Completed')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .reduce((acc, trade, index) => {
        const prevCumulative = index > 0 ? acc[index - 1].cumulative : 0;
        const pnl = trade.pnl || 0;
        acc.push({
          date: trade.date,
          pnl: pnl,
          cumulative: prevCumulative + pnl,
          symbol: trade.symbol,
          fill: pnl >= 0 ? '#22c55e' : '#ef4444'
        });
        return acc;
      }, [] as any[]);

    const symbolMap = new Map<string, { trades: number; pnl: number; wins: number }>();
    
    trades.forEach(trade => {
      if (trade.status === 'Completed') {
        const existing = symbolMap.get(trade.symbol) || { trades: 0, pnl: 0, wins: 0 };
        symbolMap.set(trade.symbol, {
          trades: existing.trades + 1,
          pnl: existing.pnl + (trade.pnl || 0),
          wins: existing.wins + ((trade.pnl || 0) > 0 ? 1 : 0)
        });
      }
    });

    const symbolStatsResult = Array.from(symbolMap.entries()).map(([symbol, data]) => ({
      symbol,
      ...data,
      winRate: data.trades > 0 ? (data.wins / data.trades) * 100 : 0
    }));

    return { stats: statsResult, additionalMetrics: additionalMetricsResult, chartData: chartDataResult, symbolStats: symbolStatsResult };
  }, [trades]);

  return { stats, additionalMetrics, chartData, symbolStats };
};
