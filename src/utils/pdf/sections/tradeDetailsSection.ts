import jsPDF from 'jspdf';
import { Trade } from '@/types/trade';
import { addTitle, addText, formatCurrency, checkPageBreak, addImageToPdf } from '../pdfHelpers';

export const addDetailedTradePages = async (pdf: jsPDF, trades: Trade[]) => {
  const completedTrades = trades.filter(trade => trade.status === 'Completed');
  
  for (const trade of completedTrades) {
    pdf.addPage();
    let currentY = 20;
    
    currentY = addTitle(pdf, `Trade Details - ${trade.symbol}`, currentY, 16);
    
    // Basic Trade Information
    currentY = addText(pdf, `Date: ${trade.date}`, currentY, 20, 11);
    currentY = addText(pdf, `Symbol: ${trade.symbol}`, currentY, 20, 11);
    currentY = addText(pdf, `Direction: ${trade.direction}`, currentY, 20, 11);
    currentY = addText(pdf, `Status: ${trade.status}`, currentY, 20, 11);
    currentY = addText(pdf, `Order Type: ${trade.order_type}`, currentY, 20, 11);
    if (trade.time_of_day) {
      currentY = addText(pdf, `Time: ${trade.time_of_day}`, currentY, 20, 11);
    }
    currentY += 5;
    
    // Price Information
    currentY = addTitle(pdf, 'Price Details', currentY, 14);
    currentY = addText(pdf, `Entry Price: ${formatCurrency(trade.entry)}`, currentY, 20, 11);
    currentY = addText(pdf, `Exit Price: ${trade.exit ? formatCurrency(trade.exit) : 'N/A'}`, currentY, 20, 11);
    currentY = addText(pdf, `P&L: ${trade.pnl ? formatCurrency(trade.pnl) : 'N/A'}`, currentY, 20, 11);
    currentY = addText(pdf, `Risk: ${formatCurrency(trade.risk)}`, currentY, 20, 11);
    currentY = addText(pdf, `Fees: ${formatCurrency(trade.fees || 0)}`, currentY, 20, 11);
    
    if (trade.risk > 0 && trade.pnl !== undefined) {
      const rMultiple = trade.pnl / trade.risk;
      currentY = addText(pdf, `R-Multiple: ${rMultiple.toFixed(2)}R`, currentY, 20, 11);
    }
    
    // Enhanced Trade Data
    if (trade.trade_duration_hours) {
      currentY = addText(pdf, `Duration: ${trade.trade_duration_hours} hours`, currentY, 20, 11);
    }
    if (trade.max_adverse_excursion) {
      currentY = addText(pdf, `MAE: ${formatCurrency(trade.max_adverse_excursion)}`, currentY, 20, 11);
    }
    if (trade.max_favorable_excursion) {
      currentY = addText(pdf, `MFE: ${formatCurrency(trade.max_favorable_excursion)}`, currentY, 20, 11);
    }
    currentY += 5;
    
    // Strategy and Setup Information
    if (trade.setup_type || trade.strategy_name || trade.timeframe) {
      currentY = addTitle(pdf, 'Strategy & Setup', currentY, 14);
      if (trade.setup_type) {
        currentY = addText(pdf, `Setup Type: ${trade.setup_type}`, currentY, 20, 11);
      }
      if (trade.strategy_name) {
        currentY = addText(pdf, `Strategy: ${trade.strategy_name}`, currentY, 20, 11);
      }
      if (trade.timeframe) {
        currentY = addText(pdf, `Timeframe: ${trade.timeframe}`, currentY, 20, 11);
      }
      currentY += 5;
    }
    
    // Psychological Analysis
    if (trade.emotion || trade.confidence_rating || trade.mistake_category) {
      currentY = addTitle(pdf, 'Psychological Analysis', currentY, 14);
      if (trade.emotion) {
        currentY = addText(pdf, `Emotion: ${trade.emotion}`, currentY, 20, 11);
      }
      if (trade.confidence_rating) {
        currentY = addText(pdf, `Confidence: ${trade.confidence_rating}/10`, currentY, 20, 11);
      }
      if (trade.mistake_category && trade.mistake_category !== 'none') {
        currentY = addText(pdf, `Mistake: ${trade.mistake_category.replace('_', ' ')}`, currentY, 20, 11);
      }
      if (trade.rules_followed !== undefined) {
        let rulesText = 'N/A';
        if (trade.rules_followed === 'yes') rulesText = 'Yes';
        else if (trade.rules_followed === 'no') rulesText = 'No';
        else if (trade.rules_followed === 'partial') rulesText = 'Partially';
        currentY = addText(pdf, `Rules Followed: ${rulesText}`, currentY, 20, 11);
      }
      currentY += 5;
    }
    
    // Market Context
    if (trade.market_condition_detailed || trade.economic_events || trade.market_volatility) {
      currentY = addTitle(pdf, 'Market Context', currentY, 14);
      if (trade.market_condition_detailed) {
        currentY = addText(pdf, `Market Condition: ${trade.market_condition_detailed.replace('_', ' ')}`, currentY, 20, 11);
      }
      if (trade.economic_events) {
        currentY = addText(pdf, `Economic Events: ${trade.economic_events}`, currentY, 20, 11);
      }
      if (trade.market_volatility) {
        currentY = addText(pdf, `Volatility: ${trade.market_volatility}`, currentY, 20, 11);
      }
      currentY += 5;
    }
    
    // Trade Images
    if (trade.image_files && trade.image_files.length > 0) {
      currentY = addTitle(pdf, 'Trade Images', currentY, 14);
      
      for (let i = 0; i < trade.image_files.length; i++) {
        const imageUrl = trade.image_files[i];
        
        try {
          // Fetch the image from the public URL and convert it to a Data URL
          const response = await fetch(imageUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
          }
          const blob = await response.blob();
          const imageDataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          
          currentY = checkPageBreak(pdf, currentY, 120);
          
          await addImageToPdf(pdf, imageDataUrl, 20, currentY, 170, 100);
          currentY += 110;
          
          const filename = decodeURIComponent(imageUrl.substring(imageUrl.lastIndexOf('/') + 1));
          currentY = addText(pdf, `Image ${i + 1}: ${filename}`, currentY, 20, 9);
          currentY += 10;

        } catch (error) {
          console.error(`Error processing image ${imageUrl}:`, error);
          currentY = checkPageBreak(pdf, currentY, 20);
          const filename = decodeURIComponent(imageUrl.substring(imageUrl.lastIndexOf('/') + 1));
          currentY = addText(pdf, `Image ${i + 1}: ${filename} (Could not load)`, currentY, 20, 9);
          currentY += 10;
        }
      }
    }

    // Notes and Reflection
    if (trade.notes || trade.post_trade_reflection) {
      currentY = addTitle(pdf, 'Notes & Reflection', currentY, 14);
      
      if (trade.notes) {
        currentY = addText(pdf, 'Trade Notes:', currentY, 20, 11);
        const notes = trade.notes;
        const maxLineLength = 80;
        const lines = notes.match(new RegExp(`.{1,${maxLineLength}}`, 'g')) || [notes];
        lines.forEach(line => {
          currentY = addText(pdf, line, currentY, 30, 10);
        });
        currentY += 5;
      }
      
      if (trade.post_trade_reflection) {
        currentY = addText(pdf, 'Post-Trade Reflection:', currentY, 20, 11);
        const reflection = trade.post_trade_reflection;
        const maxLineLength = 80;
        const lines = reflection.match(new RegExp(`.{1,${maxLineLength}}`, 'g')) || [reflection];
        lines.forEach(line => {
          currentY = addText(pdf, line, currentY, 30, 10);
        });
      }
    }
  }
};

export const addSummaryTable = (pdf: jsPDF, trades: Trade[]) => {
  const completedTrades = trades.filter(trade => trade.status === 'Completed');
  
  pdf.addPage();
  let currentY = 20;
  
  currentY = addTitle(pdf, 'Trade Summary Table', currentY, 16);
  
  // Table headers
  const headers = ['Date', 'Symbol', 'Direction', 'Entry', 'Exit', 'P&L', 'R-Mult'];
  const colWidths = [25, 20, 20, 25, 25, 25, 20];
  let startX = 20;
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  headers.forEach((header, index) => {
    pdf.text(header, startX, currentY);
    startX += colWidths[index];
  });
  currentY += 12;
  
  // Table data
  pdf.setFont('helvetica', 'normal');
  completedTrades.forEach(trade => {
    currentY = checkPageBreak(pdf, currentY, 15);
    
    startX = 20;
    const rMultiple = trade.risk > 0 ? (trade.pnl || 0) / trade.risk : 0;
    
    const rowData = [
      trade.date.split('T')[0],
      trade.symbol,
      trade.direction,
      `$${trade.entry.toFixed(2)}`,
      trade.exit ? `$${trade.exit.toFixed(2)}` : 'N/A',
      formatCurrency(trade.pnl || 0),
      `${rMultiple.toFixed(2)}R`
    ];
    
    rowData.forEach((data, index) => {
      pdf.text(data.toString(), startX, currentY);
      startX += colWidths[index];
    });
    currentY += 10;
  });
};
