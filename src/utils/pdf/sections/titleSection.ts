
import jsPDF from 'jspdf';
import { Trade } from '@/types/trade';

export const addTitlePage = (pdf: jsPDF, trades: Trade[]) => {
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Trading Performance Report', 20, 40);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 60);
  pdf.text(`Total Trades: ${trades.length}`, 20, 75);
  
  return 100;
};
