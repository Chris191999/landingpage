
import jsPDF from 'jspdf';
import { Trade } from '@/types/trade';
import { calculateComprehensiveStats } from './pdf/pdfStats';
import { 
  addTitlePage,
  addPerformanceScore,
  addEnhancedPerformanceInsights,
  addPerformanceMetrics,
  addSystemQualityMetrics,
  addDrawdownAnalysis,
  addRiskManagement,
  addTimeAnalysis,
  addPsychologicalAnalysis,
  addDetailedTradePages,
  addSummaryTable
} from './pdf/pdfContent';

export const generateTradingReportPdf = async (trades: Trade[]) => {
  const pdf = new jsPDF();
  
  // Title Page
  let currentY = addTitlePage(pdf, trades);

  // Calculate comprehensive statistics
  const stats = calculateComprehensiveStats(trades);

  // Add new performance score section
  currentY = addPerformanceScore(pdf, stats, currentY);

  // Add enhanced performance insights
  currentY = addEnhancedPerformanceInsights(pdf, stats, trades, currentY);

  // Add all existing sections
  currentY = addPerformanceMetrics(pdf, stats, currentY);
  currentY = addSystemQualityMetrics(pdf, stats, currentY);
  currentY = addDrawdownAnalysis(pdf, stats, currentY);
  currentY = addRiskManagement(pdf, stats, currentY);
  currentY = addTimeAnalysis(pdf, trades, currentY);
  currentY = addPsychologicalAnalysis(pdf, trades, currentY);

  // Add detailed trade pages with images
  await addDetailedTradePages(pdf, trades);

  // Add summary table
  addSummaryTable(pdf, trades);

  // Save the PDF
  const fileName = `trading-report-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};
