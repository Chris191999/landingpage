
import jsPDF from 'jspdf';
import { Trade } from '@/types/trade';
import { analyzeTimePatterns } from '../../timeAnalysis';
import { addTitle, addText, formatCurrency } from '../pdfHelpers';

export const addTimeAnalysis = (pdf: jsPDF, trades: Trade[], currentY: number) => {
  let y = currentY;
  const timeAnalysis = analyzeTimePatterns(trades);

  if (timeAnalysis.dailyPerformance.length > 0 || timeAnalysis.hourlyPerformance.length > 0) {
    y = addTitle(pdf, 'Time Analysis Summary', y, 16);
    
    if (timeAnalysis.dailyPerformance.length > 0) {
      const bestDay = timeAnalysis.dailyPerformance.reduce((best, current) => 
        current.pnl > best.pnl ? current : best
      );
      const worstDay = timeAnalysis.dailyPerformance.reduce((worst, current) => 
        current.pnl < worst.pnl ? current : worst
      );
      
      y = addText(pdf, `Best Day of Week: ${bestDay.day} (${formatCurrency(bestDay.pnl)})`, y);
      y = addText(pdf, `Worst Day of Week: ${worstDay.day} (${formatCurrency(worstDay.pnl)})`, y);
    }
    
    if (timeAnalysis.hourlyPerformance.length > 0) {
      const bestHour = timeAnalysis.hourlyPerformance.reduce((best, current) => 
        current.pnl > best.pnl ? current : best
      );
      const worstHour = timeAnalysis.hourlyPerformance.reduce((worst, current) => 
        current.pnl < worst.pnl ? current : worst
      );
      
      y = addText(pdf, `Best Hour: ${bestHour.hour}:00 (${formatCurrency(bestHour.pnl)})`, y);
      y = addText(pdf, `Worst Hour: ${worstHour.hour}:00 (${formatCurrency(worstHour.pnl)})`, y);
    }
    y += 15;
  }

  return y;
};

export const addPsychologicalAnalysis = (pdf: jsPDF, trades: Trade[], currentY: number) => {
  let y = currentY;
  
  const emotionMap = new Map<string, { trades: number; totalPnl: number }>();
  const confidenceMap = new Map<number, { trades: number; totalPnl: number }>();
  const mistakeMap = new Map<string, number>();
  
  trades.filter(trade => trade.status === 'Completed').forEach(trade => {
    const pnl = trade.pnl || 0;
    
    if (trade.emotion) {
      const existing = emotionMap.get(trade.emotion) || { trades: 0, totalPnl: 0 };
      emotionMap.set(trade.emotion, {
        trades: existing.trades + 1,
        totalPnl: existing.totalPnl + pnl
      });
    }
    
    if (trade.confidence_rating) {
      const existing = confidenceMap.get(trade.confidence_rating) || { trades: 0, totalPnl: 0 };
      confidenceMap.set(trade.confidence_rating, {
        trades: existing.trades + 1,
        totalPnl: existing.totalPnl + pnl
      });
    }
    
    if (trade.mistake_category && trade.mistake_category !== 'none' && pnl < 0) {
      mistakeMap.set(trade.mistake_category, (mistakeMap.get(trade.mistake_category) || 0) + 1);
    }
  });

  if (emotionMap.size > 0 || confidenceMap.size > 0 || mistakeMap.size > 0) {
    y = addTitle(pdf, 'Psychological Analysis', y, 16);
    
    if (emotionMap.size > 0) {
      y = addText(pdf, 'Performance by Emotion:', y, 20, 12);
      Array.from(emotionMap.entries()).forEach(([emotion, data]) => {
        y = addText(pdf, `${emotion}: ${data.trades} trades, Avg P&L: ${formatCurrency(data.totalPnl / data.trades)}`, y, 30);
      });
      y += 5;
    }
    
    if (mistakeMap.size > 0) {
      y = addText(pdf, 'Common Mistakes:', y, 20, 12);
      Array.from(mistakeMap.entries()).forEach(([mistake, count]) => {
        y = addText(pdf, `${mistake.replace('_', ' ')}: ${count} occurrences`, y, 30);
      });
    }
  }

  return y;
};
