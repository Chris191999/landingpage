
import jsPDF from 'jspdf';
import { PerformanceStats } from '@/types/trade';
import { addTitle, addText, formatCurrency, formatPercentage } from '../pdfHelpers';

export const addPerformanceScore = (pdf: jsPDF, stats: PerformanceStats, currentY: number) => {
  let y = currentY;
  
  // Calculate overall performance score (same logic as in OverallPerformanceScore component)
  let score = 0;
  const winRateScore = Math.min(20, (stats.winRate / 70) * 20);
  score += winRateScore;
  
  const profitFactorScore = stats.profitFactor === Infinity ? 20 : Math.min(20, (stats.profitFactor / 2) * 20);
  score += profitFactorScore;
  
  const rrScore = stats.riskRewardRatio === Infinity ? 15 : Math.min(15, (stats.riskRewardRatio / 2) * 15);
  score += rrScore;
  
  const expectancyScore = Math.min(15, Math.max(0, (stats.expectancy / 0.5) * 15));
  score += expectancyScore;
  
  const sqnScore = Math.min(15, (stats.systemQualityNumber / 3) * 15);
  score += sqnScore;
  
  const drawdownScore = Math.min(10, Math.max(0, (1 - stats.maxDrawdown / 20) * 10));
  score += drawdownScore;
  
  const consistencyScore = Math.min(5, (stats.sharpeRatio / 2) * 5);
  score += consistencyScore;
  
  const performanceScore = Math.round(Math.min(100, Math.max(0, score)));
  
  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: "A+", description: "Exceptional" };
    if (score >= 80) return { grade: "A", description: "Excellent" };
    if (score >= 70) return { grade: "B", description: "Good" };
    if (score >= 60) return { grade: "C", description: "Average" };
    if (score >= 50) return { grade: "D", description: "Below Average" };
    return { grade: "F", description: "Poor" };
  };
  
  const scoreGrade = getScoreGrade(performanceScore);
  
  y = addTitle(pdf, 'Overall Performance Score', y, 18);
  y = addText(pdf, `Score: ${performanceScore}/100 (Grade: ${scoreGrade.grade} - ${scoreGrade.description})`, y, 20, 14);
  y = addText(pdf, 'Score Components:', y, 20, 12);
  y = addText(pdf, `• Win Rate: ${winRateScore.toFixed(1)}/20 points`, y, 30, 10);
  y = addText(pdf, `• Profit Factor: ${profitFactorScore.toFixed(1)}/20 points`, y, 30, 10);
  y = addText(pdf, `• Risk/Reward: ${rrScore.toFixed(1)}/15 points`, y, 30, 10);
  y = addText(pdf, `• Expectancy: ${expectancyScore.toFixed(1)}/15 points`, y, 30, 10);
  y = addText(pdf, `• System Quality: ${sqnScore.toFixed(1)}/15 points`, y, 30, 10);
  y = addText(pdf, `• Drawdown Management: ${drawdownScore.toFixed(1)}/10 points`, y, 30, 10);
  y = addText(pdf, `• Consistency: ${consistencyScore.toFixed(1)}/5 points`, y, 30, 10);
  y += 15;
  
  return y;
};

export const addPerformanceMetrics = (pdf: jsPDF, stats: PerformanceStats, currentY: number) => {
  let y = currentY;
  
  // Core Performance Metrics
  y = addTitle(pdf, 'Core Performance Metrics', y, 16);
  y = addText(pdf, `Total P&L: ${formatCurrency(stats.totalPnL)}`, y);
  y = addText(pdf, `Net P&L: ${formatCurrency(stats.netPnL)}`, y);
  y = addText(pdf, `Win Rate: ${formatPercentage(stats.winRate)}`, y);
  y = addText(pdf, `Total Trades: ${stats.totalTrades} (${stats.winningTrades}W/${stats.losingTrades}L/${stats.breakEvenTrades}BE)`, y);
  y = addText(pdf, `Profit Factor: ${stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}`, y);
  y = addText(pdf, `Average Win: ${formatCurrency(stats.averageWin)}`, y);
  y = addText(pdf, `Average Loss: ${formatCurrency(stats.averageLoss)}`, y);
  y = addText(pdf, `Largest Win: ${formatCurrency(stats.largestWin)}`, y);
  y = addText(pdf, `Largest Loss: ${formatCurrency(stats.largestLoss)}`, y);
  y += 10;

  // Risk & Reward Metrics
  y = addTitle(pdf, 'Risk & Reward Metrics', y, 16);
  y = addText(pdf, `Average Win (R): ${stats.avgWinR.toFixed(2)}R`, y);
  y = addText(pdf, `Average Loss (R): ${stats.avgLossR.toFixed(2)}R`, y);
  y = addText(pdf, `Risk/Reward Ratio: ${stats.riskRewardRatio === Infinity ? '∞' : stats.riskRewardRatio.toFixed(2)}`, y);
  y = addText(pdf, `Expectancy: ${stats.expectancy.toFixed(2)}R`, y);
  y = addText(pdf, `Total R: ${stats.totalR.toFixed(2)}R`, y);
  y += 10;

  return y;
};
