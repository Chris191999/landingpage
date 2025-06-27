
import jsPDF from 'jspdf';
import { PerformanceStats } from '@/types/trade';
import { addTitle, addText, formatCurrency, formatPercentage } from '../pdfHelpers';

export const addSystemQualityMetrics = (pdf: jsPDF, stats: PerformanceStats, currentY: number) => {
  let y = currentY;
  
  y = addTitle(pdf, 'System Quality Metrics', y, 16);
  y = addText(pdf, `Sharpe Ratio: ${stats.sharpeRatio.toFixed(2)}`, y);
  y = addText(pdf, `System Quality Number (SQN): ${stats.systemQualityNumber.toFixed(2)}`, y);
  y = addText(pdf, `Calmar Ratio: ${stats.calmarRatio === Infinity ? '∞' : stats.calmarRatio.toFixed(2)}`, y);
  y = addText(pdf, `Sortino Ratio: ${stats.sortinoRatio === Infinity ? '∞' : stats.sortinoRatio.toFixed(2)}`, y);
  y += 10;

  return y;
};

export const addDrawdownAnalysis = (pdf: jsPDF, stats: PerformanceStats, currentY: number) => {
  let y = currentY;
  
  y = addTitle(pdf, 'Drawdown & Streak Analysis', y, 16);
  y = addText(pdf, `Max Drawdown: ${formatPercentage(stats.maxDrawdown)}`, y);
  y = addText(pdf, `Max Drawdown Amount: ${formatCurrency(stats.maxDrawdownAmount)}`, y);
  y = addText(pdf, `Longest Win Streak: ${stats.longestWinStreak}`, y);
  y = addText(pdf, `Longest Loss Streak: ${stats.longestLossStreak}`, y);
  y += 10;

  return y;
};

export const addRiskManagement = (pdf: jsPDF, stats: PerformanceStats, currentY: number) => {
  let y = currentY;
  
  y = addTitle(pdf, 'Risk Management Metrics', y, 16);
  y = addText(pdf, `Risk of Ruin: ${formatPercentage(stats.riskOfRuin * 100)}`, y);
  y = addText(pdf, `Kelly Percentage: ${formatPercentage(stats.kellyPercentage * 100)}`, y);
  y = addText(pdf, `VaR (95%): ${formatCurrency(stats.valueAtRisk95)}`, y);
  y = addText(pdf, `VaR (99%): ${formatCurrency(stats.valueAtRisk99)}`, y);
  y = addText(pdf, `Average MAE: ${formatCurrency(stats.averageMAE)}`, y);
  y = addText(pdf, `Average MFE: ${formatCurrency(stats.averageMFE)}`, y);
  y = addText(pdf, `Average Trade Duration: ${stats.avgTradeDuration.toFixed(1)} hours`, y);
  y += 15;

  return y;
};
