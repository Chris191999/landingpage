
import { Trade, PerformanceStats } from '@/types/trade';
import { 
  calculateCalmarRatio, 
  calculateSortinoRatio, 
  calculateRiskOfRuin, 
  calculateKellyPercentage, 
  calculateValueAtRisk,
  calculateMAEMFE 
} from '../riskCalculations';
import { analyzeTimePatterns, calculateTradeDurationStats } from '../timeAnalysis';

export const calculateComprehensiveStats = (trades: Trade[]): PerformanceStats => {
  const completedTrades = trades.filter(trade => trade.status === 'Completed' && trade.pnl !== undefined);
  
  if (completedTrades.length === 0) {
    return {
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
  }

  const wins = completedTrades.filter(trade => (trade.pnl || 0) > 0);
  const losses = completedTrades.filter(trade => (trade.pnl || 0) < 0);
  const breakEvens = completedTrades.filter(trade => (trade.pnl || 0) === 0);
  
  const totalPnL = completedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const totalFees = trades.reduce((sum, trade) => sum + (trade.fees || 0), 0);
  const totalWins = wins.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const totalLosses = Math.abs(losses.reduce((sum, trade) => sum + (trade.pnl || 0), 0));
  
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

  // Streak calculations
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

  const winRate = completedTrades.length > 0 ? (wins.length / completedTrades.length) : 0;
  const averageWin = wins.length > 0 ? totalWins / wins.length : 0;
  const averageLoss = losses.length > 0 ? totalLosses / losses.length : 0;
  
  const avgRiskAmount = completedTrades.filter(t => t.risk > 0).length > 0
    ? completedTrades.filter(t => t.risk > 0).reduce((sum, trade) => sum + (trade.risk || 0), 0) / completedTrades.filter(t => t.risk > 0).length
    : 0;
  const riskAmountToUse = avgRiskAmount > 0 ? avgRiskAmount : 100;

  const { avgMAE, avgMFE } = calculateMAEMFE(completedTrades);
  const { avgDuration } = calculateTradeDurationStats(completedTrades);

  return {
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
    calmarRatio: calculateCalmarRatio(totalPnL, maxDrawdown, 1),
    sortinoRatio: calculateSortinoRatio(completedTrades, 0),
    riskOfRuin: calculateRiskOfRuin(winRate, averageWin, averageLoss, riskAmountToUse, 10000),
    kellyPercentage: calculateKellyPercentage(winRate, averageWin, averageLoss),
    valueAtRisk95: calculateValueAtRisk(completedTrades, 0.95),
    valueAtRisk99: calculateValueAtRisk(completedTrades, 0.99),
    averageMAE: avgMAE,
    averageMFE: avgMFE,
    avgTradeDuration: avgDuration
  };
};
