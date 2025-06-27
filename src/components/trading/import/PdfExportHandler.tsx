
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { Trade } from '@/types/trade';
import { toast } from 'sonner';
import { usePlanFeatures } from '@/hooks/usePlanFeatures';
import PlanUpgradePrompt from '@/components/common/PlanUpgradePrompt';
import { Card, CardContent } from '@/components/ui/card';

interface PdfExportHandlerProps {
  trades: Trade[];
}

const PdfExportHandler = ({ trades }: PdfExportHandlerProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { data: planFeatures } = usePlanFeatures();

  const hasPdfAccess = planFeatures?.pdf_export_access || false;

  const handleExport = async () => {
    if (!hasPdfAccess) {
      toast.error('PDF export is not available in your current plan');
      return;
    }

    setIsExporting(true);
    
    try {
      // Dynamic import to avoid loading the PDF generation code unless needed
      const { generateTradingReportPdf } = await import('@/utils/pdfGenerator');
      await generateTradingReportPdf(trades);
      toast.success('Trading report exported successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!hasPdfAccess) {
    return (
      <Card className="relative min-h-[200px]">
        <CardContent className="p-6">
          {/* Blurred export content */}
          <div className="filter blur-sm pointer-events-none">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5" />
              <span className="font-medium">Export Trading Report</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Generate a comprehensive PDF report of your trading performance
            </p>
            <Button disabled className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export PDF Report
            </Button>
          </div>
          
          {/* Upgrade prompt overlay - properly positioned */}
          <div className="absolute inset-0 flex items-center justify-center">
            <PlanUpgradePrompt 
              feature="PDF Export"
              requiredPlan="Goated"
              currentPlan={planFeatures?.plan_name}
              className="relative"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5" />
          <span className="font-medium">Export Trading Report</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Generate a comprehensive PDF report of your trading performance including charts, metrics, and trade details.
        </p>
        <Button 
          onClick={handleExport} 
          disabled={isExporting || trades.length === 0}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Generating PDF...' : 'Export PDF Report'}
        </Button>
        {trades.length === 0 && (
          <p className="text-xs text-gray-500 mt-2">
            No trades available for export
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PdfExportHandler;
