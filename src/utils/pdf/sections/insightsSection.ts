
import jsPDF from 'jspdf';
import { Trade, PerformanceStats } from '@/types/trade';
import { addTitle, addText } from '../pdfHelpers';

export const addEnhancedPerformanceInsights = (pdf: jsPDF, stats: PerformanceStats, trades: Trade[], currentY: number) => {
  let y = currentY;
  
  // Generate performance insights
  const insights = {
    profitability: [],
    riskManagement: [],
    consistency: [],
    tradingBehavior: []
  };

  // Profitability Insights
  if (stats.profitFactor >= 2.0) {
    insights.profitability.push(`Outstanding profit factor of ${stats.profitFactor === Infinity ? "∞" : stats.profitFactor.toFixed(2)} demonstrates strong edge`);
  } else if (stats.profitFactor >= 1.5) {
    insights.profitability.push(`Good profit factor of ${stats.profitFactor.toFixed(2)} shows profitable system`);
  } else if (stats.profitFactor >= 1.0) {
    insights.profitability.push(`Marginal profit factor of ${stats.profitFactor.toFixed(2)} - needs improvement`);
  } else {
    insights.profitability.push(`Unprofitable system with PF of ${stats.profitFactor.toFixed(2)} - immediate revision needed`);
  }

  if (stats.expectancy >= 0.3) {
    insights.profitability.push(`Strong expectancy of ${stats.expectancy.toFixed(2)}R indicates each trade adds significant value`);
  } else if (stats.expectancy > 0) {
    insights.profitability.push(`Low expectancy of ${stats.expectancy.toFixed(2)}R - consider tightening entry criteria`);
  } else {
    insights.profitability.push(`Negative expectancy of ${stats.expectancy.toFixed(2)}R - strategy losing money on average`);
  }

  // Risk Management Insights
  if (stats.maxDrawdown <= 10) {
    insights.riskManagement.push(`Excellent drawdown control at ${stats.maxDrawdown.toFixed(1)}% shows disciplined risk management`);
  } else if (stats.maxDrawdown <= 20) {
    insights.riskManagement.push(`Moderate drawdown of ${stats.maxDrawdown.toFixed(1)}% - consider reducing position sizes`);
  } else {
    insights.riskManagement.push(`High drawdown of ${stats.maxDrawdown.toFixed(1)}% indicates poor risk management`);
  }

  const recoveryFactor = stats.maxDrawdownAmount > 0 ? stats.totalPnL / stats.maxDrawdownAmount : Infinity;
  if (recoveryFactor >= 3) {
    insights.riskManagement.push(`Strong recovery factor of ${recoveryFactor === Infinity ? "∞" : recoveryFactor.toFixed(1)} shows profits exceed worst losses`);
  } else if (recoveryFactor >= 1) {
    insights.riskManagement.push(`Recovery factor of ${recoveryFactor.toFixed(1)} could be improved`);
  }

  if (stats.riskRewardRatio >= 2) {
    insights.riskManagement.push(`Excellent risk/reward ratio of ${stats.riskRewardRatio === Infinity ? "∞" : stats.riskRewardRatio.toFixed(1)}:1`);
  } else if (stats.riskRewardRatio >= 1) {
    insights.riskManagement.push(`Risk/reward ratio of ${stats.riskRewardRatio.toFixed(1)}:1 requires high win rate`);
  }

  // Consistency Insights
  if (stats.systemQualityNumber >= 2.5) {
    insights.consistency.push(`Excellent SQN of ${stats.systemQualityNumber.toFixed(1)} indicates highly reliable performance`);
  } else if (stats.systemQualityNumber >= 1.6) {
    insights.consistency.push(`Good SQN of ${stats.systemQualityNumber.toFixed(1)} shows above-average system quality`);
  } else if (stats.systemQualityNumber >= 1.0) {
    insights.consistency.push(`Average SQN of ${stats.systemQualityNumber.toFixed(1)} - work on reducing variability`);
  } else {
    insights.consistency.push(`Poor SQN of ${stats.systemQualityNumber.toFixed(1)} indicates inconsistent performance`);
  }

  if (stats.sharpeRatio >= 1.5) {
    insights.consistency.push(`Strong Sharpe ratio of ${stats.sharpeRatio.toFixed(2)} demonstrates consistent risk-adjusted returns`);
  } else if (stats.sharpeRatio >= 1.0) {
    insights.consistency.push(`Moderate Sharpe ratio of ${stats.sharpeRatio.toFixed(2)} - focus on reducing volatility`);
  }

  // Trading Behavior Insights
  if (stats.winRate >= 70) {
    insights.tradingBehavior.push(`Exceptional win rate of ${stats.winRate.toFixed(1)}% indicates excellent trade selection`);
  } else if (stats.winRate >= 60) {
    insights.tradingBehavior.push(`Strong win rate of ${stats.winRate.toFixed(1)}% shows good trade identification`);
  } else if (stats.winRate >= 50) {
    insights.tradingBehavior.push(`Average win rate of ${stats.winRate.toFixed(1)}% - ensure R/R compensates`);
  } else {
    insights.tradingBehavior.push(`Low win rate of ${stats.winRate.toFixed(1)}% requires excellent risk/reward management`);
  }

  if (stats.longestLossStreak >= 5) {
    insights.tradingBehavior.push(`Long losing streak of ${stats.longestLossStreak} trades suggests need for strategy adjustment`);
  } else if (stats.longestWinStreak >= 5) {
    insights.tradingBehavior.push(`Longest winning streak of ${stats.longestWinStreak} trades shows ability to capitalize on conditions`);
  }

  // Add insights to PDF
  y = addTitle(pdf, 'Enhanced Performance Insights', y, 16);
  
  if (insights.profitability.length > 0) {
    y = addText(pdf, 'Profitability Analysis:', y, 20, 12);
    insights.profitability.forEach(insight => {
      y = addText(pdf, `• ${insight}`, y, 30, 10);
    });
    y += 5;
  }
  
  if (insights.riskManagement.length > 0) {
    y = addText(pdf, 'Risk Management Analysis:', y, 20, 12);
    insights.riskManagement.forEach(insight => {
      y = addText(pdf, `• ${insight}`, y, 30, 10);
    });
    y += 5;
  }
  
  if (insights.consistency.length > 0) {
    y = addText(pdf, 'Consistency & Quality Analysis:', y, 20, 12);
    insights.consistency.forEach(insight => {
      y = addText(pdf, `• ${insight}`, y, 30, 10);
    });
    y += 5;
  }
  
  if (insights.tradingBehavior.length > 0) {
    y = addText(pdf, 'Trading Behavior Analysis:', y, 20, 12);
    insights.tradingBehavior.forEach(insight => {
      y = addText(pdf, `• ${insight}`, y, 30, 10);
    });
    y += 5;
  }
  
  return y;
};
