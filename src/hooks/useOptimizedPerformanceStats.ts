
import { useMemo } from "react";
import { Trade, PerformanceStats } from "@/types/trade";

interface OptimizedPerformanceStats {
  stats: PerformanceStats;
  additionalMetrics: any;
  chartData: any[];
  symbolStats: any;
}

export const useOptimizedPerformanceStats = (trades: Trade[]): OptimizedPerformanceStats => {
  const memoizedStats = useMemo(() => {
    if (!trades || trades.length === 0) {
      return {
        stats: getEmptyStats(),
        additionalMetrics: {},
        chartData: [],
        symbolStats: {}
      };
    }

    const completedTrades = trades.filter(trade => 
      trade.status === 'Completed' && 
      typeof trade.pnl === 'number'
    );

    if (completedTrades.length === 0) {
      return {
        stats: getEmptyStats(),
        additionalMetrics: {},
        chartData: [],
        symbolStats: {}
      };
    }

    // Calculate basic stats efficiently
    const wins = completedTrades.filter(trade => (trade.pnl || 0) > 0);
    const losses = completedTrades.filter(trade => (trade.pnl || 0) < 0);
    const breakEvens = completedTrades.filter(trade => (trade.pnl || 0) === 0);
    
    const totalPnL = completedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const totalFees = trades.reduce((sum, trade) => sum + (trade.fees || 0), 0);
    
    const totalWins = wins.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const totalLosses = Math.abs(losses.reduce((sum, trade) => sum + (trade.pnl || 0), 0));
    
    const winRate = completedTrades.length > 0 ? (wins.length / completedTrades.length) * 100 : 0;
    const averageWin = wins.length > 0 ? totalWins / wins.length : 0;
    const averageLoss = losses.length > 0 ? totalLosses / losses.length : 0;
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0;

    // R-multiple calculations
    const tradesWithR = completedTrades.map(trade => {
      const rMultiple = trade.risk > 0 ? (trade.pnl || 0) / trade.risk : 0;
      return { ...trade, rMultiple };
    });
    
    const totalR = tradesWithR.reduce((sum, trade) => sum + trade.rMultiple, 0);
    const avgWinR = wins.length > 0 ? wins.reduce((sum, trade) => {
      const rMultiple = trade.risk > 0 ? (trade.pnl || 0) / trade.risk : 0;
      return sum + rMultiple;
    }, 0) / wins.length : 0;
    const avgLossR = losses.length > 0 ? Math.abs(losses.reduce((sum, trade) => {
      const rMultiple = trade.risk > 0 ? (trade.pnl || 0) / trade.risk : 0;
      return sum + rMultiple;
    }, 0) / losses.length) : 0;

    // Drawdown calculation
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

    // Chart data
    let cumulativePnL = 0;
    const chartData = completedTrades
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(trade => {
        cumulativePnL += (trade.pnl || 0);
        return {
          date: trade.date,
          pnl: trade.pnl || 0,
          cumulative: cumulativePnL,
          symbol: trade.symbol
        };
      });

    // Symbol stats
    const symbolGroups = completedTrades.reduce((acc, trade) => {
      if (!acc[trade.symbol]) {
        acc[trade.symbol] = [];
      }
      acc[trade.symbol].push(trade);
      return acc;
    }, {} as Record<string, Trade[]>);

    const symbolStats = Object.entries(symbolGroups).map(([symbol, symbolTrades]) => {
      const symbolWins = symbolTrades.filter(t => (t.pnl || 0) > 0);
      const symbolPnL = symbolTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
      const symbolWinRate = symbolTrades.length > 0 ? (symbolWins.length / symbolTrades.length) * 100 : 0;
      
      return {
        symbol,
        trades: symbolTrades.length,
        pnl: symbolPnL,
        winRate: symbolWinRate,
        avgPnL: symbolTrades.length > 0 ? symbolPnL / symbolTrades.length : 0
      };
    }).sort((a, b) => b.pnl - a.pnl);

    const stats: PerformanceStats = {
      totalTrades: trades.length,
      winningTrades: wins.length,
      losingTrades: losses.length,
      breakEvenTrades: breakEvens.length,
      winRate,
      totalPnL,
      totalFees,
      netPnL: totalPnL - totalFees,
      averageWin,
      averageLoss,
      profitFactor,
      largestWin: wins.length > 0 ? Math.max(...wins.map(trade => trade.pnl || 0)) : 0,
      largestLoss: losses.length > 0 ? Math.min(...losses.map(trade => trade.pnl || 0)) : 0,
      averageRoi: 0,
      sharpeRatio: 0,
      totalR,
      avgWinR,
      avgLossR,
      riskRewardRatio: avgLossR > 0 ? avgWinR / avgLossR : avgWinR > 0 ? Infinity : 0,
      expectancy: completedTrades.length > 0 ? totalR / completedTrades.length : 0,
      maxDrawdown,
      maxDrawdownAmount,
      longestWinStreak: 0,
      longestLossStreak: 0,
      systemQualityNumber: 0,
      calmarRatio: 0,
      sortinoRatio: 0,
      riskOfRuin: 0,
      kellyPercentage: 0,
      valueAtRisk95: 0,
      valueAtRisk99: 0,
      averageMAE: 0,
      averageMFE: 0,
      avgTradeDuration: 0
    };

    return {
      stats,
      additionalMetrics: {
        totalVolume: completedTrades.reduce((sum, trade) => sum + (trade.quantity * (trade.entry || 0)), 0),
        avgTradeSize: completedTrades.length > 0 ? 
          completedTrades.reduce((sum, trade) => sum + (trade.quantity || 0), 0) / completedTrades.length : 0,
        tradingDays: new Set(completedTrades.map(trade => trade.date.split('T')[0])).size
      },
      chartData,
      symbolStats
    };
  }, [trades]);

  return memoizedStats;
};

function getEmptyStats(): PerformanceStats {
  return {
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    breakEvenTrades: 0,
    winRate: 0,
    totalPnL: 0,
    totalFees: 0,
    netPnL: 0,
    averageWin: 0,
    averageLoss: 0,
    profitFactor: 0,
    largestWin: 0,
    largestLoss: 0,
    averageRoi: 0,
    sharpeRatio: 0,
    totalR: 0,
    avgWinR: 0,
    avgLossR: 0,
    riskRewardRatio: 0,
    expectancy: 0,
    maxDrawdown: 0,
    maxDrawdownAmount: 0,
    longestWinStreak: 0,
    longestLossStreak: 0,
    systemQualityNumber: 0,
    calmarRatio: 0,
    sortinoRatio: 0,
    riskOfRuin: 0,
    kellyPercentage: 0,
    valueAtRisk95: 0,
    valueAtRisk99: 0,
    averageMAE: 0,
    averageMFE: 0,
    avgTradeDuration: 0
  };
}
