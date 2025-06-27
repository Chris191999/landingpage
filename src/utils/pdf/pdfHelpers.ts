
import jsPDF from 'jspdf';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

export const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`;
};

export const checkPageBreak = (pdf: jsPDF, currentY: number, requiredSpace: number) => {
  const pageHeight = pdf.internal.pageSize.getHeight();
  if (currentY + requiredSpace > pageHeight - 20) {
    pdf.addPage();
    return 20; // Reset Y position
  }
  return currentY;
};

export const addTitle = (pdf: jsPDF, title: string, currentY: number, fontSize = 16) => {
  const newY = checkPageBreak(pdf, currentY, 30);
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'bold');
  pdf.text(title, 20, newY);
  return newY + (fontSize === 16 ? 15 : 10);
};

export const addText = (pdf: jsPDF, text: string, currentY: number, x = 20, fontSize = 10) => {
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'normal');
  pdf.text(text, x, currentY);
  return currentY + 8;
};

export const addImageToPdf = async (
  pdf: jsPDF, 
  imageDataUrl: string, 
  x: number, 
  y: number, 
  maxWidth: number, 
  maxHeight: number
) => {
  try {
    const img = new Image();
    img.src = imageDataUrl;
    
    return new Promise<{ width: number; height: number }>((resolve) => {
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        let width = maxWidth;
        let height = maxHeight;
        
        if (width / height > aspectRatio) {
          width = height * aspectRatio;
        } else {
          height = width / aspectRatio;
        }
        
        pdf.addImage(imageDataUrl, 'PNG', x, y, width, height);
        resolve({ width, height });
      };
    });
  } catch (error) {
    console.error('Error adding image to PDF:', error);
    return { width: 0, height: 0 };
  }
};
